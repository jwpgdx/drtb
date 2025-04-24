import { defineStore } from 'pinia'
import {
    ChartCandlestick,
    Coins,
    Wallet,
    ScrollText,
    Settings,
    MessageCircleQuestion,
} from 'lucide-vue-next'

export const useHeaderStore = defineStore('headerStore', {
    state: () => ({
        menuItems: [
            { value: 'Orders', label: '거래소', icon: ChartCandlestick },
            { value: 'Airdrop', label: '에어드랍', icon: Coins },
            { value: 'Assets', label: '자산', icon: Wallet },
            { value: 'History', label: '거래내역', icon: ScrollText },
            { value: 'Dashboard', label: '대시보드', icon: Settings },
            { value: 'Support', label: '고객센터', icon: MessageCircleQuestion },
        ],
    }),
})
