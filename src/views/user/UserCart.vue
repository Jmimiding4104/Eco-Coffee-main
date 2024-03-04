<template>
  <LoadingOverLay :active="isLoading" :z-index="1060"></LoadingOverLay>
  <div class="container">
    <div class="mt-4">
        <!-- 如購物車內有產品則顯示，沒有的話則顯示購物車目前無商品-->
      <!-- <div v-if="cart.carts && cart.carts.length > 0"> -->
        <div class="text-end">
        <button class="btn btn-outline-danger" type="button" @click="delAllCarts">
          清空購物車
        </button>
      </div>
    <table class="table align-middle">
      <thead>
        <tr>
          <th></th>
          <th>品名</th>
          <th style="width: 110px">數量</th>
          <th>單價</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="cart.carts">
          <tr v-for="item in cart.carts" :key="item.id">
            <td>
              <button type="button" class="btn btn-outline-danger btn-sm"
               @click="delCartItem(item.id)"
               :disabled="loadingStatus.loadingItem === item.id"
               >
                <i class="fas fa-spinner fa-pulse"
                v-if="loadingStatus.loadingItem === item.id"></i>
                x
              </button>
            </td>
            <td>
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">已套用優惠券</div>
              </td>
              <td>
                  <div class="input-group input-group-sm">
                    <!-- @blur="updateCart(item) 是用來觸發編輯購物車的事件，
                    使用 blur 事件監聽，當焦點離開該元素時才會觸發事件，
                    為的是避免使用者在短時間大量觸發事件，影響整體效能 -->
                  <input type="number" class="form-control" min="1"
                  v-model.number="item.qty" @blur="updateCart(item)"
                  :disabled="loadingStatus.loadingItem === item.id" />
                  <span class="input-group-text" id="basic-addon2">
                   {{item.product.unit }}
                  </span>
                </div>
              </td>
              <td class="text-end">
                <small v-if="cart.final_total !== cart.total" class="text-success">折扣價：</small>
                {{ $filters.currency(item.final_total) }}
              </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
            <td colspan="3" class="text-end">總計</td>
            <td class="text-end">{{ $filters.currency(cart.total) }}</td>
          </tr>
          <tr v-if="cart.final_total !== cart.total">
            <td colspan="3" class="text-end text-success">折扣價</td>
            <td class="text-end text-success">
              {{ $filters.currency(cart.final_total) }}
            </td>
          </tr>
      </tfoot>
    </table>
    <div class="input-group mb-3 input-group-sm">
        <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼" />
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
            套用優惠碼
          </button>
        </div>
      </div>

      <!-- </div> -->
      <!-- <div v-else class="text-center text-danger">
            <p>購物車目前無商品</p>
      </div> -->
      <!-- 表單填寫 -->
    <div class="my-5 row justify-content-center">
      <VeeForm ref="form" class="col-md-6" v-slot="{ errors }" @submit="createOrder">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <VeeField id="email" name="email" type="email"
          class="form-control" :class="{ 'is-invalid': errors['email'] }"
            placeholder="請輸入 Email" rules="email|required" v-model="form.user.email" />
          <ErrorMessage name="email" class="invalid-feedback" />
        </div>
        <div class="mb-3">
          <label for="name" class="form-label">收件人姓名</label>
          <VeeField id="name" name="姓名" type="text"
           class="form-control" :class="{ 'is-invalid': errors['姓名'] }"
            placeholder="請輸入姓名" rules="required" v-model="form.user.name" />
          <ErrorMessage name="姓名" class="invalid-feedback" />
        </div>
        <div class="mb-3">
          <label for="tel" class="form-label">收件人電話</label>
          <VeeField id="tel" name="電話" type="tel"
           class="form-control" :class="{ 'is-invalid': errors['電話'] }"
            placeholder="請輸入電話" rules="required|min:8|max:10" v-model="form.user.tel" />
          <ErrorMessage name="電話" class="invalid-feedback" />
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">收件人地址</label>
          <VeeField id="address" name="地址" type="text"
           class="form-control" :class="{ 'is-invalid': errors['地址'] }"
            placeholder="請輸入地址" rules="required" v-model="form.user.address" />
          <ErrorMessage name="地址" class="invalid-feedback" />
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea name="" id="message" class="form-control"
           cols="30" rows="10" v-model="form.message"></textarea>
        </div>
        <div class="text-end">
          <button type="submit" class="btn btn-danger">送出訂單</button>
        </div>
      </VeeForm>
    </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'pinia';

import cartStore from '../../stores/cartStore';
import toastMessage from '../../stores/toastMessage';

const { VITE_URL, VITE_PATH } = import.meta.env;
export default {
  data() {
    return {
      products: [],
      product: {},
      status: {
        loadingItem: '',
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
      isLoading: false,
      coupon_code: '',
    };
  },
  methods: {
    ...mapActions(toastMessage, ['pushMessage']),
    ...mapActions(cartStore, ['getCart', 'addToCart']),
    updateCart(data) {
      this.isLoading = true;
      const url = `${VITE_URL}/api/${VITE_PATH}/cart/${data.id}`;
      const cart = {
        product_id: data.product_id,
        qty: data.qty,
      };
      this.axios.put(url, { data: cart })
        .then((res) => {
          this.pushMessage({
            style: 'success',
            title: '更新購物車',
            content: res.data.message,
          });
          this.isLoading = false;
          this.getCart(); // 重新渲染購物車列表
        })
        .catch((err) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'danger',
            title: '更新購物車',
            content: err.response.data.message,
          });
        });
    },
    delCartItem(id) {
      this.status.loadingItem = id;
      const url = `${VITE_URL}/api/${VITE_PATH}/cart/${id}`;
      this.isLoading = true;
      this.axios.delete(url)
        .then((res) => {
          this.pushMessage({
            style: 'success',
            title: '移除購物車品項',
            content: res.data.message,
          });
          this.status.loadingItem = '';
          this.isLoading = false;
          this.getCart();
        })
        .catch((err) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'danger',
            title: '移除購物車品項',
            content: err.response.data.message,
          });
        });
    },
    delAllCarts() {
      this.isLoading = true;
      const url = `${VITE_URL}/api/${VITE_PATH}/carts`;
      this.axios.delete(url)
        .then((res) => {
          this.pushMessage({
            style: 'success',
            title: '清除購物車',
            content: res.data.message,
          });
          this.getCart();
          this.isLoading = false;
        }).catch((err) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'danger',
            title: '清除購物車',
            content: err.response.data.message,
          });
        });
    },
    addCouponCode() {
      const url = `${VITE_URL}/api/${VITE_PATH}/coupon`;
      const coupon = {
        code: this.coupon_code,
      };
      this.isLoading = true;
      this.axios.post(url, { data: coupon })
        .then((res) => {
          this.pushMessage({
            style: 'success',
            title: '加入優惠券',
            content: res.data.message,
          });
          this.getCart();
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'danger',
            title: '加入優惠券',
            content: err.response.data.message,
          });
        });
    },
    createOrder() {
      // 檢查購物車是否為空
      if (this.cart.carts && this.cart.carts.length === 0) {
        // 如果購物車為空，顯示通知訊息
        alert('購物車為空');
        // 不執行後續的 API 請求
        return;
      }
      this.isLoading = true;
      // 先將表單資料儲存到 order 變數再代入 API 串接
      const url = `${VITE_URL}/api/${VITE_PATH}/order`;
      const order = this.form;
      this.axios.post(url, { data: order })
        .then((res) => {
          // 建立訂單成功後，再把頁面導向到結帳頁
          this.$router.push(`/checkout/${res.data.orderId}`);
          this.$refs.form.resetForm();
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'danger',
            title: '建立訂單',
            content: err.response.data.message,
          });
        });
    },
  },
  mounted() {
    this.getCart();
  },
};
</script>
