<template>
    <div>
        <AdminNavbar></AdminNavbar>
        <ToastModal></ToastModal>
        <RouterView v-if="checkSuccess"></RouterView>
    </div>
</template>

<script>
import { mapActions } from 'pinia';
import toastMessage from '../stores/toastMessage';
import AdminNavbar from '../components/AdminNavbar.vue';
import ToastModal from '../components/ToastModal.vue';

const { VITE_URL } = import.meta.env;
export default {
  data() {
    return {
      checkSuccess: false,
    };
  },
  components: {
    AdminNavbar,
    ToastModal,
  },
  methods: {
    ...mapActions(toastMessage, ['pushMessage']),
    checkLogin() {
      const url = `${VITE_URL}/api/user/check`;
      this.axios.post(url)
        .then((res) => {
          this.pushMessage({
            style: 'success',
            title: '登入成功',
            content: res.data.message,
          });
          this.checkSuccess = true;
        })
        .catch((err) => {
          this.pushMessage({
            style: 'danger',
            title: '錯誤訊息',
            content: err.response.data.message,
          });
          // 登入失敗就踢回去 login 頁面
          this.$router.push('/login');
        });
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1',
    );
    this.axios.defaults.headers.common.Authorization = token;
    this.checkLogin();
  },
};
</script>
