<template>
  <div>
    <RadioGroup v-model="state" default-value="done">
      <div class="flex items-center gap-6">
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="done" value="done" />
          <Label for="done">체결 완료</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="wait" value="wait" />
          <Label for="wait">미채결</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="cancel" value="cancel" />
          <Label for="cancel">주문 취소</Label>
        </div>
      </div>
    </RadioGroup>
    <div class="flex justify-end">
      <div class="basis-1/4">
        <Select v-model="order_by" default-value="desc">
          <SelectTrigger>
            <SelectValue placeholder="정렬 방식" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="desc">내림차순</SelectItem>
              <SelectItem value="asc">오름차순</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div v-if="orderErrorMessage">
      <ErrorState image="auth" :content="orderErrorMessage"> </ErrorState>
    </div>

    <div v-else>
      <!-- 주문 리스트 loading -->
      <div v-if="isLoading">
        <div class="flex items-center gap-2 justify-center p-8">
          <LoaderCircle class="animate-spin h-5 w-5" />
          <p class="text-lg text-zinc-700">주문 목록 가져오는 중</p>
        </div>
      </div>

      <!-- 주문 리스트 -->
      <div v-else class="flex flex-col gap-2 mt-4">
        <ErrorState
          v-if="orderList.length === 0"
          image="content"
          title="주문 내역이 없습니다"
          content="아직 진행 중인 주문이나 완료된 주문이 없습니다"
        >
        </ErrorState>

        <div v-else>
          <div v-for="order in orderList" :key="order.uuid">
            <order-list-item :order="order">
              <Button v-if="state === 'wait'" @click="cancelOrder(order.uuid)">
                주문22취소
              </Button>
            </order-list-item>
          </div>
        </div>
      </div>

      <!-- 더보기 버튼 -->
      <div v-if="!isLastPage && orderList.length > 0" class="text-center">
        <button
          @click="fetchMore"
          class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
        >
          더보기
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useOrderListStore } from "@/stores/order-list-store";
import { useOrderChanceStore } from "@/stores/order-chance-store";
import { ref, onMounted, computed, watch } from "vue";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "vue3-toastify";
import { h } from "vue";
import { useRoute } from "vue-router";
import { LoaderCircle } from "lucide-vue-next";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderListItem from "@/components/order/OrderListItem.vue";
import ErrorState from "@/components/ErrorState.vue";

const orderListStore = useOrderListStore();
const orderChanceStore = useOrderChanceStore();

const orderList = computed(() => orderListStore.orderList);
const isLastPage = computed(() => orderListStore.isLastPage);
const orderErrorMessage = computed(() => orderListStore.orderErrorMessage);
const isLoading = computed(() => orderListStore.isLoading);

const state = ref("done");
const order_by = ref("desc");
const limit = ref(100);

const route = useRoute();
const marketParam = computed(() => route.params.market as string);

const fetchOrders = () => {
  orderListStore.fetchOrderList({
    market: marketParam.value,
    uuids: [],
    state: state.value,
    page: 1,
    limit: limit.value,
    order_by: order_by.value,
  });
};

const fetchMore = () => {
  orderListStore.fetchMore({
    market: marketParam.value,
    uuids: [],
    state: state.value,
    page: 1,
    limit: limit.value,
    order_by: order_by.value,
  });
};

onMounted(() => {
  fetchOrders();
});

watch([state, order_by], () => {
  fetchOrders();
});


const handleFetchOrderChance = () => {
  orderChanceStore.fetchOrderChance(marketParam.value);
};

const cancelOrder = async (uuid: string) => {
  
  try {
    console.log('cancelOrder', uuid)
    const result = await orderListStore.cancelOrder(uuid);
    if (result) {
      toast(`주문 ${uuid}이(가) 취소되었습니다.`);
      fetchOrders();
      handleFetchOrderChance();
    }
  } catch (error) {
    toast(`주문 ${uuid} 취소에 실패했습니다.`);
  }
};
</script>
