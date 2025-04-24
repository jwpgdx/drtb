import { defineStore } from "pinia";
import {
    getFirestore,
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    startAfter,
    where,
    Timestamp,
    QueryConstraint,
    doc,
    getDoc,
} from "firebase/firestore";
import { useAuthStore } from "@/stores/auth-store";
import { getFunctions, httpsCallable } from "firebase/functions";
import axios from "axios";

export const useHistoryStore = defineStore("historyStore", {
    state: () => ({
        orderHistory: [],
        lastVisible: null,
        loading: false,
        hasMore: true,
        selectedSide: 'all' as 'all' | 'bid' | 'ask' | 'cancel',
        selectedDateRange: {
            from: null as Timestamp | null,
            to: null as Timestamp | null,
        },
        selectedOrderDetail: null,
        isDetailLoading: false,
        orderDetailError: null,
    }),

    actions: {
        setSideFilter(side: 'all' | 'bid' | 'ask' | 'cancel') {
            this.selectedSide = side;
            this.initOrderHistory();
        },

        setDateFilter(from: Date | null, to: Date | null) {
            this.selectedDateRange.from = from ? Timestamp.fromDate(from) : null;
            this.selectedDateRange.to = to ? Timestamp.fromDate(to) : null;
            this.initOrderHistory();
        },

        async initOrderHistory() {
            this.orderHistory = [];
            this.lastVisible = null;
            this.hasMore = true;
            await this.fetchMoreOrderHistory();
        },

        async fetchMoreOrderHistory() {
            const authStore = useAuthStore();
            const uid = authStore.user.uid;

            if (!uid || this.loading || !this.hasMore) return;

            this.loading = true;

            try {
                const db = getFirestore();
                const ordersRef = collection(db, `users/${uid}/orders`);
                const filters: QueryConstraint[] = [orderBy("timestamp", "desc")];

                if (this.selectedSide !== 'all') {
                    filters.push(where("side", "==", this.selectedSide));
                }

                if (this.selectedDateRange.from) {
                    filters.push(where("timestamp", ">=", this.selectedDateRange.from));
                }

                if (this.selectedDateRange.to) {
                    filters.push(where("timestamp", "<=", this.selectedDateRange.to));
                }

                if (this.lastVisible) {
                    filters.push(startAfter(this.lastVisible));
                }

                filters.push(limit(10));

                const q = query(ordersRef, ...filters);
                const querySnapshot = await getDocs(q);

                const newOrders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                if (querySnapshot.docs.length < 10) {
                    this.hasMore = false;
                }

                this.lastVisible = querySnapshot.docs.at(-1);
                this.orderHistory.push(...newOrders);
            } catch (error) {
                console.error("[ERROR] 주문 이력 로딩 실패:", error);
            } finally {
                this.loading = false;
            }
        },

        async fetchOrderDetailByUUID(uuid: string) {
            this.selectedOrderDetail = null;
            this.isDetailLoading = true;
            this.orderDetailError = null;

            try {
                const functions = getFunctions();
                const createAuthHeader = httpsCallable<
                    { queryString: string },
                    { authorization: string }
                >(functions, 'createAuthHeaderFromDb');

                const queryString = `uuid=${uuid}`;
                const authResult = await createAuthHeader({ queryString });

                const config = {
                    headers: {
                        Authorization: authResult.data.authorization,
                    },
                };

                const response = await axios.get(`https://api.bithumb.com/v1/order?${queryString}`, config);
                this.selectedOrderDetail = response.data;
            } catch (error) {
                console.error("[ERROR] 주문 상세 조회 실패:", error);
                this.orderDetailError = "주문 정보를 불러오지 못했습니다.";
            } finally {
                this.isDetailLoading = false;
            }
        },
    },
});
