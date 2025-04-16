import { defineStore } from "pinia";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
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
  status?: "scheduled" | "ongoing" | "ended";
}

export const useAirdropStore = defineStore("airdropStore", {
  state: () => ({
    airdrops: [] as AirdropItem[],
    isUploading: false,
  }),

  getters: {
    ongoingWithScheduled: (state): AirdropItem[] => {
      const now = Date.now();
      return [...state.airdrops]
        .filter((item) => item.endAt.toDate().getTime() >= now)
        .map((item) => {
          const start = item.startAt.toDate().getTime();
          const status = now < start ? "scheduled" : "ongoing";
          return { ...item, status };
        })
        .sort((a, b) => a.startAt.toDate().getTime() - b.startAt.toDate().getTime());
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

    
    // 방법 2: Callable 함수를 사용한 이미지 업로드 (Base64 사용)
    async uploadImageWithBase64(file: File, market: string): Promise<string> {
      if (!file) throw new Error("파일이 없습니다.");
      
      try {
        const functions = getFunctions();
        this.isUploading = true;
        
        // 파일을 Base64로 변환
        const base64 = await this.fileToBase64(file);
        
        // Firebase Functions Callable 함수 호출
        const uploadAirdropImage = httpsCallable(functions, 'uploadAirdropImage');
        const result = await uploadAirdropImage({
          imageBase64: base64,
          filename: market,
        });
        
        // 결과 타입 캐스팅
        const data = result.data as {
          success: boolean;
          fileUrl: string;
          metadata: {
            filename: string;
            contentType: string;
            size: number;
          };
        };
        
        if (data.success && data.fileUrl) {
          return data.fileUrl;
        } else {
          throw new Error('업로드 응답에 파일 URL이 없습니다.');
        }
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        throw new Error(`이미지 업로드에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      } finally {
        this.isUploading = false;
      }
    },
    
    // File 객체를 Base64 문자열로 변환
    fileToBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    },

    async addAirdrop(payload: {
      title: string;
      description: string;
      imageFile: File;
      market: string;
      startAt: string;
      endAt: string;
    }) {
      try {
         const imageUrl = await this.uploadImageWithBase64(payload.imageFile, payload.market);
        
        // Firestore에 데이터 저장
        await addDoc(collection(firestore, "airdrops"), {
          title: payload.title,
          description: payload.description,
          imageUrl: imageUrl,
          market: payload.market,
          startAt: Timestamp.fromDate(new Date(payload.startAt)),
          endAt: Timestamp.fromDate(new Date(payload.endAt)),
          createdAt: Timestamp.now(),
        });

        // 에어드랍 목록 새로고침
        await this.fetchAirdrops();
        
        return { success: true };
      } catch (error) {
        console.error("에어드랍 추가 실패:", error);
        throw error;
      }
    },
  },
});