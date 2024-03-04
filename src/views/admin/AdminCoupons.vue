<template>
  <div>
    <LoadingOverLay :active="isLoading" :z-index="1060" />
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openCouponModal(true)">
        建立新的優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in coupons" :key="key">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ $filters.date(item.due_date) }}</td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else class="text-muted">未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-outline-primary btn-sm"
                @click="openCouponModal(false, item)">編輯</button>
              <button type="button" class="btn btn-outline-danger btn-sm"
               @click="openDelCouponModal(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <CouponModal :coupon="tempCoupon"
     :is-new="isNew" ref="couponModal" @update-coupon="updateCoupon" />
    <DeleteModal :item="tempCoupon" ref="deleteModal" @del-item="delCoupon" />
  </div>
</template>

<script>
import { mapActions } from 'pinia';
import toastMessage from '../../stores/toastMessage';

import CouponModal from '../../components/CouponModal.vue';
import DeleteModal from '../../components/DeleteModal.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;
export default {
  components: { CouponModal, DeleteModal },
  props: {
    config: Object,
  },
  data() {
    return {
      coupons: {},
      tempCoupon: {
        title: '',
        is_enabled: 0,
        percent: 100,
        code: '',
      },
      isLoading: false,
      isNew: false,
    };
  },
  methods: {
    ...mapActions(toastMessage, ['pushMessage']),
    openCouponModal(isNew, item) {
      this.isNew = isNew;
      if (this.isNew) {
        this.tempCoupon = {
          due_date: new Date().getTime() / 1000,
        };
      } else {
        this.tempCoupon = { ...item };
      }
      this.$refs.couponModal.openModal();
    },
    openDelCouponModal(item) {
      this.tempCoupon = { ...item };
      const delComponent = this.$refs.deleteModal;
      delComponent.openModal();
    },
    getCoupons() {
      this.isLoading = true;
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/coupons`;
      this.axios.get(url, this.tempProduct)
        .then((res) => {
          this.coupons = res.data.coupons;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'success',
            title: '取得優惠券',
            content: err.response.data.message,
          });
        });
    },
    updateCoupon(tempCoupon) {
      this.isLoading = true;
      let url = `${VITE_URL}/api/${VITE_PATH}/admin/coupon`;
      let http = 'post';
      let data = tempCoupon;
      if (!this.isNew) {
        url = `${VITE_URL}/api/${VITE_PATH}/admin/coupon/${this.tempCoupon.id}`;
        http = 'put';
        data = this.tempCoupon;
      }
      this.axios[http](url, { data })
        .then((res) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'success',
            title: '新增優惠券',
            content: res.data.message,
          });
          this.getCoupons();
          this.$refs.couponModal.hideModal();
        })
        .catch((err) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'danger',
            title: '新增優惠券',
            content: err.response.data.message,
          });
        });
    },
    delCoupon() {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/coupon/${this.tempCoupon.id}`;
      this.isLoading = true;
      this.axios.delete(url)
        .then((res) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'success',
            title: '刪除優惠券',
            content: res.data.message,
          });
          const delComponent = this.$refs.deleteModal;
          delComponent.hideModal();
          this.getCoupons();
        })
        .catch((err) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'danger',
            title: '刪除優惠券',
            content: err.response.data.message,
          });
        });
    },
  },
  mounted() {
    this.getCoupons();
  },
};
</script>
