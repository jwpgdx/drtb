import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/HomePage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import OrderPage from "@/pages/OrderPage.vue";
import OrdersPage from "@/pages/OrdersPage.vue";
import DashboardPage from "@/pages/dashboard/index.vue";
import ApikeyPage from "@/pages/ApikeyPage.vue";
import ApikeyRegisterPage from "@/pages/ApikeyRegisterPage.vue";
import QuestionPage from "@/pages/QuestionPage.vue";
import QuestionAdminPage from "@/pages/QuestionAdminPage.vue";

import HistoryPage from "@/pages/HistoryPage.vue";


import AssetsPage from "@/pages/AssetsPage.vue";
import AirdropPage from "@/pages/AirdropPage.vue";
import AirdropFormPage from '@/pages/AirdropFormPage.vue';
import AirdropDetailPage from '@/pages/AirdropDetailPage.vue';


import SupportPage from "@/pages/SupportPage.vue";

import { useAuthStore } from "@/stores/auth-store";
import { toast } from "vue3-toastify";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: {
      requiresAuth: false,
      layout: {
        showBack: false,
        showLogo: true,
        showMargin: true,
      },
    }
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: {
      requiresAuth: false,
      layout: {
        showBack: true,
        showLogo: false,
        showMargin: false,
      },
    }

  },
  {
    path: "/order",
    name: "Orders",
    component: OrdersPage,
    meta: {
      requiresAuth: false,
      layout: {
        showBack: false,
        showLogo: true,
        showMargin: true,
      },
    }
  },
  {
    path: "/order/:market",
    name: "Order",
    component: OrderPage,
    meta: {
      requiresAuth: false,
      layout: {
        showBack: true,
        showLogo: false,
        showMargin: true,
      },
    }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
    meta: {
      requiresAuth: true,
      layout: {
        showBack: false,
        showLogo: true,
        showMargin: true,
      },
    }
  },
  {
    path: "/history",
    name: "History",
    component: HistoryPage,
    meta: {
      requiresAuth: true,
      layout: {
        showBack: false,
        showLogo: true,
        showMargin: true,
      },
    }
  },
  {
    path: "/apikey",
    name: "Apikey",
    component: ApikeyPage,
    meta: {
      requiresAuth: true,
      layout: {
        showBack: false,
        showLogo: true,
        showMargin: true,
      },
    }
  },
  {
    path: "/apikey/register",
    name: "ApikeyRegister",
    component: ApikeyRegisterPage,
    meta: {
      requiresAuth: true,
      layout: {
        showBack: true,
        showLogo: false,
        showMargin: false,
      },
    }
  },
  {
    path: "/assets",
    name: "Assets",
    component: AssetsPage,
    meta: {
      requiresAuth: true,
      layout: {
        showBack: true,
        showLogo: false,
        showMargin: true,
      },

    }
  },
  {
    path: "/airdrop",
    name: "Airdrop",
    component: AirdropPage,
    meta: {
      requiresAuth: false,
      layout: {
        showBack: false,
        showLogo: true,
        showMargin: true,
      },
    }
  },
  {
    path: '/airdrop/:id',
    name: 'AirdropDetail',
    component: AirdropDetailPage,
    meta: {
      requiresAuth: false,
      layout: {
        showBack: true,
        showLogo: false,
        showMargin: true,
      },
    }
  },


  {
    path: "/airdrop/add",
    name: 'AirdropAdd',
    component: AirdropFormPage,
    meta: {
      requiresAuth: true,
      layout: {
        showBack: true,
        showLogo: false,
        showMargin: true,
      },
    }
  },
  {
    path: '/airdrop/edit/:id',
    name: 'AirdropEdit',
    component: AirdropFormPage,
    props: true,
    meta: {
      requiresAuth: true,
      layout: {
        showBack: true,
        showLogo: false,
        showMargin: true,
      },
    }
  },
  {
    path: "/support",
    name: "Support",
    component: SupportPage,
    meta: {
      requiresAuth: false,
      layout: {
        showBack: false,
        showLogo: true,
        showMargin: true,
      }
    },
  },
  {
    path: "/support/question",
    name: "Question",
    component: QuestionPage,
    meta: {
      requiresAuth: true,
      layout: {
        showBack: true,
        showLogo: false,
        showMargin: true,
      }
    },
  },
  {
    path: "/support/question/admin",
    name: "QuestionAdmin",
    component: QuestionAdminPage,
    meta: {
      requiresAuth: true,
      layout: {
        showBack: true,
        showLogo: false,
        showMargin: true,
      }
    },
  }
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
    toast("로그인이 필요한 서비스입니다.");
  } else {
    next();
  }
});

export default router;
