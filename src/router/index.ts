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
    meta: { requiresAuth: false } 
  },
  { 
    path: "/dashboard", 
    name: "Dashboard", 
    component: DashboardPage, 
    meta: { requiresAuth: true } 
  },
  { 
    path: "/dashboard/apikey", 
    name: "Apikey", 
    component: ApiKeyPage, 
    meta: { requiresAuth: true } 
  },
  { 
    path: "/dashboard/assets", 
    name: "Assets", 
    component: AssetsPage, 
    meta: { requiresAuth: true } 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 전역 네비게이션 가드
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next(`/login?redirect=${to.fullPath}`);
  } else {
    next();
  }
});

export default router;
