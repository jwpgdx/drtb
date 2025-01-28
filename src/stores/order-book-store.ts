import { defineStore } from 'pinia';
import { merge } from 'lodash';

export const useOrderBookStore = defineStore('orderBookStore', {
  state: () => ({
    orderbook: {
      market: '',
      timestamp: null,
      total_ask_size: 0,
      total_bid_size: 0,
      orderbook_units: [],
    },
    marketPrice: 0,  // 시장 가격 추가
    errorMessage: '',
  }),
  actions: {
    // 마켓에 대한 호가 정보 조회
    async fetchOrderbook(market: string) {
      try {
        const options = { method: "GET", headers: { accept: "application/json" } };
        const response = await fetch(`https://api.bithumb.com/v1/orderbook?markets=${market}`, options);
        const data = await response.json();

        if (data && data[0]) {
          this.setOrderbook(data[0]);
        }
      } catch (error) {
        console.error(`Error fetching orderbook for market ${market}:`, error);
        this.errorMessage = `Market ${market}의 호가 정보를 가져오는데 실패했습니다.`;
      }
    },

    // 호가 정보 상태에 기본값을 적용한 후 업데이트
    setOrderbook(orderbookData: any) {
      this.orderbook = merge({}, this.orderbook, {
        market: orderbookData.market,
        timestamp: orderbookData.timestamp,
        total_ask_size: orderbookData.total_ask_size,
        total_bid_size: orderbookData.total_bid_size,
        orderbook_units: orderbookData.orderbook_units.map((unit: any) => ({
          ask_price: unit.ask_price,
          bid_price: unit.bid_price,
          ask_size: unit.ask_size,
          bid_size: unit.bid_size,
        })),
      });

      // 가장 최근의 시장 가격을 최신 호가 정보에서 추출하여 설정
      const latestBidPrice = orderbookData.orderbook_units[0]?.bid_price; // 첫 번째 입찰가
      if (latestBidPrice) {
        this.setMarketPrice(latestBidPrice);
      }
    },

    // 시장 가격 설정
    setMarketPrice(price: number) {
      this.marketPrice = price;
    },
  },
  getters: {
    getOrderbook: (state) => state.orderbook,
    getMarketPrice: (state) => state.marketPrice,  // 시장 가격을 가져오는 getter
  },
});
