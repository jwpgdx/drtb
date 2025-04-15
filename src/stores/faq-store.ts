import { defineStore } from 'pinia'

interface FaqItem {
    id: number
    question: string
    answer: string
    isOpen: boolean
}

export const useFaqStore = defineStore('faq', {
    state: () => ({
        faqs: [
            // 기존 항목
            {
                id: 1,
                question: '에어드랍은 어떻게 참여하나요?',
                answer: '공식 웹사이트에서 지갑 연결 후 이벤트 페이지에서 참여 가능합니다.',
                isOpen: false
            },
            {
                id: 2,
                question: '에어드랍 자격 조건은 무엇인가요?',
                answer: '특정 토큰 보유 또는 특정 기간 내 거래 이력이 필요할 수 있습니다.',
                isOpen: false
            },

            // 추가된 항목
            {
                id: 3,
                question: '에어드랍 참여 자격을 확인하는 방법은?',
                answer: '프로젝트 공식 스냅샷 날짜 기준으로 지갑 잔고를 확인하며, 공식 홈페이지나 블록체인 탐색기에서 확인 가능합니다.',
                isOpen: false
            },
            {
                id: 4,
                question: '에어드랍 받는데 시간이 얼마나 걸리나요?',
                answer: '이벤트 종료 후 1~4주 이내 분배되며, 프로젝트별로 상이할 수 있습니다.',
                isOpen: false
            },
            {
                id: 5,
                question: '에어드랍 사기 방지 방법은?',
                answer: '공식 채널 링크만 사용하고, 개인 키 절대 요구하지 않는 프로젝트만 참여하세요. 무료 에어드랍이라도 가스비 요구 시 주의가 필요합니다.',
                isOpen: false
            },
            {
                id: 6,
                question: '에어드랍과 일반 구매의 차이는?',
                answer: '에어드랍은 무료로 토큰을 받지만 조건이 있으며, 구매는 직접 투자금으로 토큰을 획득하는 방식입니다.',
                isOpen: false
            },
            {
                id: 7,
                question: '에어드랍 참여에 비용이 들까요?',
                answer: '대부분 무료지만, 트랜잭션 서명을 요구하는 경우 가스비가 발생할 수 있습니다. 과도한 비용 요구 시 사기 가능성을 의심해보세요.',
                isOpen: false
            },
            {
                id: 8,
                question: '받은 에어드랍은 어디에서 확인하나요?',
                answer: '연결된 지갑 주소를 블록체인 탐색기에 입력해 토큰 잔고를 확인하거나, 프로젝트의 클레임 페이지에서 수령 가능합니다.',
                isOpen: false
            }
        ] as FaqItem[],
    }),
    actions: {
        toggleFaq(id: number) {
            this.faqs = this.faqs.map(faq => {
                if (faq.id === id) {
                    return { ...faq, isOpen: !faq.isOpen }
                }
                return { ...faq, isOpen: false }
            }) as FaqItem[]
        }
    }
})