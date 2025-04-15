import { defineStore } from "pinia";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/firebase";

export interface AirdropItem {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  market: string;
  startAt: Timestamp;
  endAt: Timestamp;
  createdAt: Timestamp;
  status?: "scheduled" | "ongoing" | "urgent" | "ended";
}

export const useAirdropStore = defineStore("airdropStore", {
  state: () => ({
    airdrops: [] as AirdropItem[],
  }),

  getters: {
    ongoingWithScheduled: (state): AirdropItem[] => {
      const now = Date.now();
      const oneDayMs = 1000 * 60 * 60 * 24;

      return [...state.airdrops]
        .filter((item) => item.endAt.toDate().getTime() >= now)
        .map((item) => {
          const start = item.startAt.toDate().getTime();
          const end = item.endAt.toDate().getTime();
          let status: AirdropItem["status"] = "ongoing";

          if (now < start) status = "scheduled";
          else if (end - now <= oneDayMs) status = "urgent";

          return { ...item, status };
        })
        .sort((a, b) => {
          const priority = { scheduled: 0, urgent: 1, ongoing: 2 };
          return priority[a.status!] - priority[b.status!];
        });
    },

    ended: (state): AirdropItem[] => {
      const now = Date.now();
      return state.airdrops
        .filter((item) => item.endAt.toDate().getTime() < now)
        .map((item) => ({ ...item, status: "ended" }));
    },
  },

  actions: {
    async fetchAirdrops() {
      const snapshot = await getDocs(collection(firestore, "airdrops"));
      this.airdrops = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AirdropItem[];
    },

    async addAirdrop(payload: {
      title: string;
      description: string;
      imageUrl: string;
      market: string;
      startAt: string;
      endAt: string;
    }) {
      await addDoc(collection(firestore, "airdrops"), {
        ...payload,
        startAt: Timestamp.fromDate(new Date(payload.startAt)),
        endAt: Timestamp.fromDate(new Date(payload.endAt)),
        createdAt: Timestamp.now(),
      });

      await this.fetchAirdrops();
    },

    async uploadImage(file: File): Promise<string> {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://drtb.web.app/api/uploadImage", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("이미지 업로드 실패");
      }

      const { url } = await res.json();
      return url;
    },
  },
});
