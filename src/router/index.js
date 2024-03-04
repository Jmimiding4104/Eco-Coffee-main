import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: '登入頁',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/admin',
    name: '後台頁面',
    component: () => import('../views/AdminDashboard.vue'),
    children: [
      {
        path: 'products',
        component: () => import('../views/admin/AdminProducts.vue'),
      },
      {
        path: 'orders',
        component: () => import('../views/admin/AdminOrders.vue'),
      },
      {
        path: 'coupons',
        component: () => import('../views/admin/AdminCoupons.vue'),
      },
      {
        path: 'article',
        component: () => import('../views/admin/AdminArticle.vue'),
      },
    ],
  },
  // User Pages
  {
    path: '/',
    component: () => import('../views/UserView.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/user/UserHome.vue'),
      },
      {
        path: 'articles',
        component: () => import('../views/user/UserArticles.vue'),
      },
      {
        path: 'article/:articleId',
        component: () => import('../views/user/UserArticle.vue'),
      },
      {
        path: 'cart',
        component: () => import('../views/user/UserCart.vue'),
      },
      {
        path: 'checkout/:orderId',
        component: () => import('../views/user/UserCheckout.vue'),
      },
      {
        path: 'product/:productId',
        component: () => import('../views/user/UserProduct.vue'),
      },
      {
        path: 'products',
        component: () => import('../views/user/UserProducts.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFind.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 可以使滑鼠移動到連結上，就會呈現 active 效果
  linkActiveClass: 'active',
  // 當使用者一進入 newpage 頁面，畫面就會滾動到最上方
  // scrollBehavior(to, from, savedPosition) {
  //   console.log(to, from, savedPosition);
  //   if (to.fullPath.match('newpage')) {
  //     return {
  //       top: 0,
  //     };
  //   }
  //   // 預設情況下就不做滾動
  //   return {};
  // },
});

export default router;
