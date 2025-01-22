import { defineStore } from 'pinia';

interface Market {
  market: string;
  korean_name: string;
  english_name: string;
  market_warning: string;
  isVisible: boolean;
  trade_price: number | null; // 추가된 속성
  prev_closing_price: number | null; // 추가된 속성
  change: string; // 추가된 속성
  priceChangePercent: number | null; // 추가된 속성
}

export const useMarketStore = defineStore('marketStore', {
  state: () => ({
    markets: [] as Market[], // 시장 가격 리스트
    errorMessage: '' as string, // 오류 메시지 상태 추가
  }),
  actions: {
    async fetchMarkets() {
      try {
        const options = { method: "GET", headers: { accept: "application/json" } };
        const response = await fetch(
          "https://api.bithumb.com/v1/market/all?isDetails=false",
          options
        );
        const data = await response.json();
        
        // data가 바로 시장 데이터 배열이라면
        if (Array.isArray(data)) {
          
          this.markets = data.filter((market: any) => !market.market.startsWith('BTC-')).map((market: any) => ({
            market: market.market,
            korean_name: market.korean_name,
            english_name: market.english_name,
            market_warning: market.market_warning,
            isVisible: false, // 처음에는 모두 보이게 설정
            trade_price: null,
            prev_closing_price: null,
            change: 'EVEN',
            priceChangePercent: null, // 추가된 속성
          }));
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error("Error fetching markets:", error);
        this.errorMessage = "Markets 정보를 가져오는데 실패했습니다.";
      }
    },

    updateVisibility(market: string, isVisible: boolean) {
      const targetMarket = this.markets.find((item) => item.market === market);
      if (targetMarket) {
        targetMarket.isVisible = isVisible;

        // 가시성이 true일 때 가격 데이터를 가져옵니다.
        if (isVisible) {
          this.fetchPrice([market]); // 필요한 경우, 개별 마켓 가격 데이터를 요청
        }
      } else {
        console.warn(`Market ${market} not found.`);
      }
    },

    async fetchPrice(markets: string[]) {
      try {
        const marketCodes = markets.join(','); // 배열을 쉼표로 구분된 문자열로 변환
        const response = await fetch(`https://api.bithumb.com/v1/ticker?markets=${marketCodes}`);
        const data = await response.json();

        if (data) {
          this.setPrice(data);
        }
      } catch (error) {
        console.error(`Error fetching price for ${markets}:`, error);
      }
    },

    setPrice(marketData: any[]) {
      marketData.forEach(data => {
        const marketIndex = this.markets.findIndex(item => item.market === data.market);

        if (marketIndex !== -1) {
          const market = this.markets[marketIndex];

          // 데이터 업데이트
          market.trade_price = data.trade_price;
          market.prev_closing_price = data.prev_closing_price;
          market.change = data.change;

          // 퍼센트 변화 계산
          if (market.trade_price !== null && market.prev_closing_price !== null) {
            const changePercent =
              ((market.trade_price - market.prev_closing_price) / market.prev_closing_price) * 100;
            market.priceChangePercent = parseFloat(changePercent.toFixed(2)); // 소수점 두 자리까지
          } else {
            market.priceChangePercent = null; // 데이터가 없으면 null
          }
        } else {
          console.warn(`Market ${data.market} not found in state`);
        }
      });
    },
  },
});
