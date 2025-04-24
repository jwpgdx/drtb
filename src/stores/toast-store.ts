// stores/toast-store.ts
import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: '',
    type: 'success' as 'success' | 'error' | 'info' | 'warning',
  }),
  actions: {
    set(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') {
      this.message = message;
      this.type = type;
    },
    clear() {
      this.message = '';
    },
  },
});
