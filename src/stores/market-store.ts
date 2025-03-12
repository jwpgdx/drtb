import { defineStore } from 'pinia';
import { merge } from "lodash";

export const useMarketStore = defineStore('marketStore', {
  state: () => ({
    markets: [], 
    errorMessage: '',
    orderMarket: {
      market: '',
      korean_name: '',
      english_name: '',
      market_warning: '',
      isVisible: false,
      trade_price: 0, // 기본값 설정
      prev_closing_price: 0, // 기본값 설정
      change: 'EVEN',
      priceChangePercent: 0,
    },
  }),
  actions: {
    // * 마켓 목록 가져오기
    async fetchMarkets() {
      try {
        const options = { method: "GET", headers: { accept: "application/json" } };
        const response = await fetch(
          "https://api.bithumb.com/v1/market/all?isDetails=false",
          options
        );
        const data = await response.json();
        this.markets = data.filter((market: any) => !market.market.startsWith('BTC-')).map((market: any) => ({
          market: market.market,
          korean_name: market.korean_name,
          english_name: market.english_name,
          market_warning: market.market_warning,
          isVisible: false,
          trade_price: null,
          prev_closing_price: null,
          change: 'EVEN',
          priceChangePercent: null, // 추가된 속성
        }));

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

    // ! 개별
    async setOrderMarket(market: string): Promise<void> {
      try {
        const selectedMarket = this.markets.find((item) => item.market === market);
        if (selectedMarket) {
          this.orderMarket = merge({}, this.orderMarket, selectedMarket); // merge로 기존 값을 업데이트
        } else {
          console.warn(`Market ${market} not found.`);
        }
      } catch (error) {
        console.error('Error in setOrderMarket:', error);
      }
    },



    // 가격 업데이트 (orderMarket에 대해서만)
    async fetchPriceForOrderMarket() {
      if (this.orderMarket && this.orderMarket.market) {
        try {
          const marketCodes = this.orderMarket.market; // orderMarket에 설정된 마켓 코드
          const response = await fetch(`https://api.bithumb.com/v1/ticker?markets=${marketCodes}`);
          const data = await response.json();

          if (data) {
            this.setPriceForOrderMarket(data);
          }
        } catch (error) {
          console.error(`Error fetching price for order market ${this.orderMarket.market}:`, error);
        }
      }
    },

    // orderMarket 가격 업데이트
    setPriceForOrderMarket(data: any) {
      const marketData = data[0]
      if (this.orderMarket && this.orderMarket.market === marketData.market) {

        // 데이터 업데이트
        this.orderMarket.trade_price = marketData.trade_price;
        this.orderMarket.prev_closing_price = marketData.prev_closing_price;
        this.orderMarket.change = marketData.change;

        // 퍼센트 변화 계산
        if (this.orderMarket.trade_price !== null && this.orderMarket.prev_closing_price !== null) {
          const changePercent =
            ((this.orderMarket.trade_price - this.orderMarket.prev_closing_price) / this.orderMarket.prev_closing_price) * 100;
          this.orderMarket.priceChangePercent = parseFloat(changePercent.toFixed(2));
        } else {
          this.orderMarket.priceChangePercent = null;
        }
      }
    },



  },
  getters: {

  },
});
