<template>
    <div>
        <nav class="navbar navbar-expand-lg bg-light">
            <div class="container-fluid">
                <RouterLink to="/admin" class="navbar-brand">Navbar</RouterLink>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <div class="navbar-nav me-auto mb-2 mb-lg-0">
                            <RouterLink to="/admin/products"
                             class="nav-item nav-link">產品</RouterLink>
                            <RouterLink to="/admin/orders"
                             class="nav-item nav-link">訂單</RouterLink>
                            <RouterLink to="/admin/coupons"
                             class="nav-item nav-link">優惠券</RouterLink>
                            <RouterLink to="/admin/article"
                             class="nav-item nav-link">貼文</RouterLink>
                             <router-link to="/"
                             class="nav-item nav-link">前台頁面</router-link>
                             <a href="#" @click.prevent="logOut" class="nav-item nav-link">登出</a>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import { mapActions } from 'pinia';
import toastMessage from '../stores/toastMessage';

const { VITE_URL } = import.meta.env;
export default {
  methods: {
    ...mapActions(toastMessage, ['pushMessage']),
    logOut() {
      const url = `${VITE_URL}/logout`;
      this.axios.post(url)
        .then((res) => {
          this.pushMessage({
            style: 'success',
            title: '已登出',
            content: res.data.message,
          });
          document.cookie = 'myToken=;expires=;path=/';
          this.$router.push('/');
        })
        .catch((err) => {
          this.pushMessage({
            style: 'danger',
            title: '登出狀態',
            content: err.response.data.message,
          });
        });
    },
  },
};
</script>
