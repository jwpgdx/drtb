// router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/HomePage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import OrderPage from "@/pages/OrderPage.vue";
import DashboardPage from "@/pages/dashboard/index.vue";
import ApiKeyPage from "@/pages/dashboard/apikey.vue";
import AssetsPage from "@/pages/AssetsPage.vue";

import { useAuthStore } from "@/stores/auth-store";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/login", name: "Login", component: LoginPage },
  {
    path: "/order/:market",
    name: "Order",
    component: OrderPage,
    /*
        beforeEnter: (to, from, next) => {
          const authStore = useAuthStore();
          if (!authStore.isAuthenticated) {
            // 로그인되지 않으면 로그인 페이지로 이동, 현재 페이지 URL을 `redirect` 파라미터로 전달
            next(`/login?redirect=${to.fullPath}`);
          } else {
            next();
          }
        },
        */
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        // 로그인되지 않으면 로그인 페이지로 이동, 현재 페이지 URL을 `redirect` 파라미터로 전달
        next(`/login?redirect=${to.fullPath}`);
      } else {
        next();
      }
    },
  },
  {
    path: "/dashboard/apikey",
    name: "Apikey",
    component: ApiKeyPage,
  },
  {
    path: "/dashboard/assets",
    name: "Assets",
    component: AssetsPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});



export default router;
