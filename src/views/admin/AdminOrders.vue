<template>
  <div class="container">
    <LoadingOverLay :active="isLoading" :z-index="1060" />
    <table class="table mt-4">
    <thead>
      <tr>
        <th>購買時間</th>
        <th>Email</th>
        <th>購買款項</th>
        <th>應付金額</th>
        <th>是否付款</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <!-- 先撰寫編輯功能，編輯功能預期的是管理員能夠從後台修改訂單的完成狀態（is_paid 屬性）
，         先將訂單頁模板寫好 -->
      <template v-for="item in orders" :key="item.id">
        <tr v-if="orders.length" :class="{ 'text-secondary': !item.is_paid }">
          <!-- 將 orders 中的 create_at 用 filter.js 檔 取出做為購買時間欄位內容-->
          <td>{{ $filters.date(item.create_at) }}</td>
          <td><span v-text="item.user.email" v-if="item.user"></span></td>
          <td>
            <ul class="list-unstyled">
              <li v-for="product in item.products" :key="product.id">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-end">{{ item.total }}</td>
          <td>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                :id="`paidSwitch${item.id}`"
                v-model="item.is_paid"
                @change="updatePaid(item)"
              />
              <label class="form-check-label" :for="`paidSwitch${item.id}`">
                <span v-if="item.is_paid">已付款</span>
                <span v-else>未付款</span>
              </label>
            </div>
          </td>
          <td>
            <!-- 下方檢視按鈕的 openModal 函式是用來開啟訂單細節的 modal
                 開啟的 modal 預期會寫入最下方的 OrderModal 元件，
                 這邊先對 OrderModal 元件設定 ref="orderModal" 用於抓取該元件
                 :order="tempOrder" 將父元件的訂單資訊內容傳入子元件
                 @update-paid="updatePaid" 則是用於監聽子元件的 update-paid 函式  -->
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm"
               type="button" @click="openModal(item)">
                檢視
              </button>
              <button class="btn btn-outline-danger btn-sm"
               type="button" @click="openDelOrderModal(item)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <OrderModal ref="orderModal" :order="tempOrder" @update-paid="updatePaid" />
  <DeleteModal ref="deleteModal" :item="tempOrder" @del-item="delOrder" />
  <PaginationComponent :pagination="pagination" @emitPages="getOrders" />
  </div>
</template>

<script>
import { mapActions } from 'pinia';
import toastMessage from '../../stores/toastMessage';

import OrderModal from '../../components/OrderModal.vue';
import DeleteModal from '../../components/DeleteModal.vue';
import PaginationComponent from '../../components/PaginationComponent.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;
export default {
  data() {
    return {
      isLoading: false,
      orders: {},
      tempOrder: {},
      pagination: {},
      currentPage: 1,
      isNew: false,
    };
  },
  components: {
    OrderModal,
    DeleteModal,
    PaginationComponent,
  },
  methods: {
    ...mapActions(toastMessage, ['pushMessage']),
    getOrders(currentPage = 1) {
      this.currentPage = currentPage;
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/orders?page=${currentPage}`;
      this.isLoading = true;
      this.axios.get(url, this.tempProduct)
        .then((res) => {
          this.orders = res.data.orders;
          this.pagination = res.data.pagination;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'danger',
            title: '錯誤訊息',
            content: err.response.data.message,
          });
        });
    },
    // 當點擊檢視按鈕觸發 openModal 函式後，將當前訂單資訊重新賦值給 tempOrder
    // 然後宣告一個 orderComponent 變數用於抓取子元件 orderModal
    // 並調用 openModal 函式開啟 modal
    openModal(item) {
      this.tempOrder = { ...item };
      this.isNew = false;
      const orderComponent = this.$refs.orderModal;
      orderComponent.openModal();
    },
    // updatePaid 函式在串接編輯 API 成功後
    // 同樣會宣告一個 orderComponent 變數並調用 hideModal 函式關閉 modal
    // 最後再執行一次 getOrders 函式重新取得訂單資料並更新畫面
    updatePaid(item) {
      this.isLoading = true;
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/order/${item.id}`;
      const paid = {
        is_paid: item.is_paid,
      };
      this.axios.put(url, { data: paid })
        .then((res) => {
          this.isLoading = false;
          const orderComponent = this.$refs.orderModal;
          orderComponent.hideModal();
          this.pushMessage({
            style: 'success',
            title: '更新付款狀態',
            content: res.data.message,
          });
          this.getOrders(this.currentPage); // 重新取得訂單資料更新畫面
        })
        .catch((err) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'danger',
            title: '錯誤訊息',
            content: err.response.data.message,
          });
        });
    },
    openDelOrderModal(item) {
      this.tempOrder = { ...item };
      const delComponent = this.$refs.deleteModal;
      delComponent.openModal();
    },
    delOrder() {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/order/${this.tempOrder.id}`;
      this.isLoading = true;
      this.axios.delete(url)
        .then(() => {
          this.isLoading = false;
          const delComponent = this.$refs.deleteModal;
          delComponent.hideModal();
          this.getOrders(this.currentPage);
        })
        .catch((err) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'danger',
            title: '錯誤訊息',
            content: err.response.data.message,
          });
        });
    },
  },
  mounted() {
    this.getOrders();
  },
};
</script>
