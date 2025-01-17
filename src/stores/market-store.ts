import { defineStore } from 'pinia';

interface Market {
  market: string;
  korean_name: string;
  english_name: string;
  market_warning: string;
  isVisible: boolean;  // isVisible 속성 추가
}

export const useMarketStore = defineStore('marketStore', {
  state: () => ({
    markets: [] as Market[], // 시장 가격 리스트
    errorMessage: '' as string, // 오류 메시지 상태 추가
  }),
  actions: {
    async fetchMarkets() {
      console.log ('fetchMarkets!!!')
      try {
        const options = { method: "GET", headers: { accept: "application/json" } };
        const response = await fetch(
          "https://api.bithumb.com/v1/market/all?isDetails=false",
          options
        );
        const data = await response.json();
        
        // data가 바로 시장 데이터 배열이라면
        if (Array.isArray(data)) {
          this.markets = data.map((market: any) => ({
            market: market.market,
            korean_name: market.korean_name,
            english_name: market.english_name,
            market_warning: market.market_warning,
            isVisible: false, // 처음에는 모두 보이게 설정
            trade_price: null,
            prev_closing_price: null,
            change: 'EVEN',
          }));
          console.log ('data!!!', this.markets[0])
        } else {
          console.log ('Error!!!')
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
        console.log(`Market ${market} visibility updated: ${isVisible}`);

        // 가시성이 true일 때 가격 데이터를 가져옵니다.
        if (isVisible) {
          this.fetchPrice([market]); // 필요한 경우, 개별 마켓 가격 데이터를 요청
        }
      } else {
        console.warn(`Market ${market} not found.`);
      }
    },

    
    async fetchPrice(markets) {
      console.log ('가격정보 시스템 가동')
      try {
        // markets가 문자열이면 쉼표로 나누어 배열로 변환
        if (typeof markets === 'string') {
          markets = markets.split(',');  // 쉼표로 구분된 문자열을 배열로 변환
        }
    
        // API 요청 URL 형식 맞추기 (여러 마켓을 요청)
        const marketCodes = markets.join(',');  // 배열을 쉼표로 구분된 문자열로 변환
        const response = await fetch(`https://api.bithumb.com/v1/ticker?markets=${marketCodes}`);
        const data = await response.json();
        console.log ('가격정보', data)

        if (data) {
          this.setPrice(data);
        }
      } catch (error) {
        console.error(`Error fetching price for ${markets}:`, error);
      }
    },
    

    setPrice(marketData) {
      console.log('셋프라잍', marketData);
    
      // marketData가 배열이므로 각 항목을 반복해서 처리
      marketData.forEach(data => {
        // markets 배열에서 해당 market을 찾아서 데이터 업데이트
        const marketIndex = this.markets.findIndex(item => item.market === data.market);
        
        if (marketIndex !== -1) {
          // 마켓을 찾으면 해당 항목을 업데이트
          this.markets[marketIndex].trade_price = data.trade_price;
          this.markets[marketIndex].prev_closing_price = data.prev_closing_price;
          this.markets[marketIndex].change = data.change;
        } else {
          console.warn(`Market ${data.market} not found in state`);
        }
      });
    },

    // 화면에 보이는 마켓만 추가 (isVisible 제외)
    addMarket(item: MarketItem) {
      const existingMarket = this.visibleMarkets.find(m => m.market === item.market);
      if (!existingMarket) {
        this.visibleMarkets.push(item); // 이미 있으면 추가 안함
      }
    },

    // 화면에서 사라진 마켓 제거
    removeMarket(market: string) {
      this.visibleMarkets = this.visibleMarkets.filter(item => item.market !== market);
    },

  },
});
