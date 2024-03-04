<template>
    <div class="container mt-5">
      <LoadingOverLay :active="isLoading" :z-index="1060"></LoadingOverLay>
      <ToastModal />
            <div class="row justify-content-center">
              <h1 class="h3 mb-3 font-weight-normal">
                請先登入
              </h1>
              <div>
                <form id="form" class="form-signin" @submit.prevent="logIn">
                  <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="username"
                      placeholder="name@example.com" v-model="user.username" required autofocus>
                    <label for="username">Email address</label>
                  </div>
                  <div class="form-floating">
                    <input type="password" class="form-control" id="password"
                      placeholder="Password" v-model="user.password" required>
                    <label for="password">Password</label>
                  </div>
                  <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
                    登入
                  </button>
                </form>
              </div>
            </div>
    </div>
  </template>

  <style lang="scss">
      html,
      body {
      height: 100%;
      text-align: center;
      }

      body {
      display: flex;
      align-items: center;
      justify-content: center;
      }

      .form-signin {
      width: 100%;
      max-width: 330px;
      padding: 15px;
      margin: auto;
      }
  </style>

<script>
import { mapActions } from 'pinia';
import toastMessage from '../stores/toastMessage';
import ToastModal from '../components/ToastModal.vue';

const { VITE_URL } = import.meta.env;
export default {
  data() {
    return {
      isLoading: false,
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    ...mapActions(toastMessage, ['pushMessage']),
    logIn() {
      const apiUrl = `${VITE_URL}/admin/signin`;
      this.isLoading = true;
      this.axios.post(apiUrl, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `myToken=${token}; expires=${new Date(expired)}; path=/`;
          this.isLoading = false;
          // 登入完之後就可以做轉址、切換到 admin 的產品列表頁面
          this.$router.push('/admin/products');
        })
        .catch((err) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'danger',
            title: '登入失敗',
            content: err.response.data.message,
          });
        });
    },
  },
  components: { ToastModal },
};
</script>
