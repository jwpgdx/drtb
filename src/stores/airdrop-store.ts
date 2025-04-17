import { defineStore } from "pinia";
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  Timestamp,
  doc,
  deleteDoc,
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
          const status: AirdropItem["status"] = now < start ? "scheduled" : "ongoing";
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

    async uploadImageWithBase64(file: File, market: string): Promise<string> {
      if (!file) throw new Error("파일이 없습니다.");
      const functions = getFunctions();
      this.isUploading = true;

      const base64 = await this.fileToBase64(file);
      const uploadAirdropImage = httpsCallable(functions, 'uploadAirdropImage');
      const result = await uploadAirdropImage({ imageBase64: base64, filename: market });
      const data = result.data as any;

      if (!data.success || !data.fileUrl) throw new Error("이미지 업로드 실패");

      this.isUploading = false;
      return data.fileUrl;
    },

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
      const imageUrl = await this.uploadImageWithBase64(payload.imageFile, payload.market);
      await addDoc(collection(firestore, "airdrops"), {
        title: payload.title,
        description: payload.description,
        imageUrl,
        market: payload.market,
        startAt: Timestamp.fromDate(new Date(payload.startAt)),
        endAt: Timestamp.fromDate(new Date(payload.endAt)),
        createdAt: Timestamp.now(),
      });
      await this.fetchAirdrops();
    },

    async updateAirdrop(payload: {
      id: string;
      title: string;
      description: string;
      imageFile?: File;
      market: string;
      startAt: string;
      endAt: string;
    }) {
      const docRef = doc(firestore, "airdrops", payload.id);
      let imageUrl = undefined;

      if (payload.imageFile) {
        imageUrl = await this.uploadImageWithBase64(payload.imageFile, payload.market);
      }

      const updateData: any = {
        title: payload.title,
        description: payload.description,
        market: payload.market,
        startAt: Timestamp.fromDate(new Date(payload.startAt)),
        endAt: Timestamp.fromDate(new Date(payload.endAt)),
      };

      if (imageUrl) updateData.imageUrl = imageUrl;

      await updateDoc(docRef, updateData);
      await this.fetchAirdrops();
    },

    async deleteAirdrop(id: string) {
      try {
        await deleteDoc(doc(firestore, "airdrops", id));
        await this.fetchAirdrops();
      } catch (error) {
        console.error("삭제 실패:", error);
        throw error;
      }
    }
    
  },
});
