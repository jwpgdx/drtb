<template>
  <div>
    <RadioGroup v-model="state" default-value="done">
      <div class="grid grid-cols-4 items-center gap-4 h-10">
        <Label class="text-left">주문 상태</Label>
        <div class="flex items-center justify-end w-full col-span-3 gap-6">
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

    <div class="flex flex-col gap-2">
    <div v-for="order in orderList" :key="order.uuid">
      <order-list-item :order="order">
        <Button v-if="state === 'wait'" @click="cancelOrder(order.uuid)">주문취소</Button>
      </order-list-item>
    </div>
  </div>
    <div v-if="orderErrorMessage">
      <p>에러: {{ orderErrorMessage }}</p>
    </div>

    <!-- 더보기 버튼 -->
    <div v-if="!isLastPage">
      <button
        @click="fetchMore"
        class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
      >
        더보기
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useOrderListStore } from "@/stores/order-list-store";
import { ref, defineProps, onMounted, computed, watch } from "vue";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import { h } from 'vue'


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderListItem from "@/components/OrderListItem.vue";

const props = defineProps({
  market: {
    type: String,
    required: true,
  },
});

const orderListStore = useOrderListStore();
const orderList = computed(() => orderListStore.orderList);
const isLastPage = computed(() => orderListStore.isLastPage);
const orderErrorMessage = computed(() => orderListStore.orderErrorMessage);
const page = computed(() => orderListStore.page);

const state = ref("done"); // 'wait', 'done', 'cancel'
const order_by = ref("desc"); // 'desc', 'asc'
const limit = ref(100); // 'desc', 'asc'

const fetchOrders = () => {
  orderListStore.fetchOrderList({
    market: props.market,
    uuids: [],
    state: state.value, // 현재 state 값과 동기화
    page: 1,
    limit: limit.value,
    order_by: order_by.value,
  });
};

const fetchMore = () => {
  orderListStore.fetchMore({
    market: props.market,
    uuids: [],
    state: state.value, // 현재 state 값과 동기화
    page: 1,
    limit: limit.value,
    order_by: order_by.value,
  });
};


// 컴포넌트가 마운트될 때 초기 데이터 로드
onMounted(() => {
  fetchOrders();
});

// state와 order_by 값이 바뀔 때 fetchOrders 호출
watch([state, order_by], () => {
  fetchOrders();
});
const { toast } = useToast()

const cancelOrder = async (uuid: string) => {
  try {
    const result = await orderListStore.cancelOrder(uuid);
    if (result) {
      // 주문 취소 성공 시 Toast 표시
      toast({
        title: "주문 취소 성공",
        description: `주문 ${uuid}이(가) 취소되었습니다.`,
        variant: "success",
        action: h(
          ToastAction,
          {
            altText: "닫기",
          },
          {
            default: () => "닫기",
          }
        ),
      });
      fetchOrders(); // 주문 취소 후 새로고침
    }
  } catch (error) {
    // 주문 취소 실패 시 Toast 표시
    toast({
      title: "주문 취소 실패",
      description: `주문 ${uuid} 취소에 실패했습니다.`,
      variant: "destructive",
      action: h(
        ToastAction,
        {
          altText: "다시 시도",
        },
        {
          default: () => "다시 시도",
        }
      ),
    });
  }
};
</script>
