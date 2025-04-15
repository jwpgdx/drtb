import { defineStore } from 'pinia'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  Timestamp
} from 'firebase/firestore'

import { firestore } from '@/firebase'
import { useAuthStore } from './auth-store'

export const useQuestionStore = defineStore('questionStore', {
  state: () => ({
    questions: [] as any[],
  }),
  actions: {
    async submitQuestion(content: string) {
      const auth = useAuthStore()
      if (!auth.user) throw new Error('로그인이 필요합니다')

      await addDoc(collection(firestore, 'questions'), {
        userId: auth.user.uid,
        content,
        createdAt: Timestamp.now(),
        response: null,
        respondedAt: null,
      })
    },

    async fetchMyQuestions() {
      const auth = useAuthStore()
      if (!auth.user) return

      const q = query(collection(firestore, 'questions'), where('userId', '==', auth.user.uid))
      const snapshot = await getDocs(q)
      this.questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    },

    async respondToQuestion(questionId: string, response: string) {
      const ref = doc(firestore, 'questions', questionId)
      await updateDoc(ref, {
        response,
        respondedAt: Timestamp.now(),
      })
      await this.fetchMyQuestions()
    },
  },
})
