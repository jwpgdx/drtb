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

    <!-- 주문 리스트 loading -->
    <div v-if="isLoading">
      <div class="flex items-center gap-2 justify-center p-8">
        <LoaderCircle class="animate-spin h-5 w-5" />
        <p class="text-lg text-gray-700">
          주문 목록 가져오는 중
        </p>
      </div>
    </div>

    <!-- 주문 리스트 -->
    <div v-else class="flex flex-col gap-2 mt-4">
      <div
        v-if="orderList.length === 0"
        class="flex flex-col items-center justify-center bg-white p-8 rounded-3xl"
      >
        <img
          src="https://i.pinimg.com/736x/d1/d5/83/d1d5831eebf5b143a37517fe18e49c60.jpg"
          alt="404 이미지"
          class="w-80 h-auto"
        />
        <div class="text-center">
          <p class="text-lg font-semibold text-gray-700 mt-4">
            주문 내역이 없습니다.
          </p>
        </div>
      </div>

      <div v-else>
        <div v-for="order in orderList" :key="order.uuid">
          <order-list-item :order="order">
            <Button v-if="state === 'wait'" @click="cancelOrder(order.uuid)">
              주문취소
            </Button>
          </order-list-item>
        </div>
      </div>
    </div>

    <div v-if="orderErrorMessage">
      <p class="text-red-500">에러: {{ orderErrorMessage }}</p>
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
</template>

<script lang="ts" setup>
import { useOrderListStore } from "@/stores/order-list-store";
import { ref, onMounted, computed, watch } from "vue";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/toast/use-toast";
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

const orderListStore = useOrderListStore();
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

const { toast } = useToast();

const cancelOrder = async (uuid: string) => {
  try {
    const result = await orderListStore.cancelOrder(uuid);
    if (result) {
      toast({
        title: "주문 취소 성공",
        description: `주문 ${uuid}이(가) 취소되었습니다.`,
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
      fetchOrders();
    }
  } catch (error) {
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
