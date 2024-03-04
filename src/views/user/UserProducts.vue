<template>
  <LoadingOverLay :active="isLoading" :z-index="1060"></LoadingOverLay>
  <div class="container">
    <h1>使用者產品列表頁面</h1>
        <div class="row">
          <div class="col-lg-2 col-md-3 mb-2">
            <ul class="list-group">
              <li class="list-group-item active" aria-current="true">
                <router-link class="py-2 d-block text-muted"
                to="/products">全部商品</router-link>
              </li>
              <li v-for="item in categories" :key="item" class="list-group-item">
                <router-link class="py-2 d-block text-muted"
                :to="`/products?category=${item}`">{{ item }}
                </router-link>
              </li>
            </ul>
          </div>
          <div class="row row-cols-3 my-4 g-4 col-lg-10 col-md-9">
            <div class="col" v-for="product in products" :key="product.id">
              <div class="card" >
                <img href="#" class="card-img-top object-fit-cover"
                :src="product.imageUrl" alt="" height="275">
                <div class="card-body">
                  <h6 class="card-title">
                    <router-link :to="`/product/${product.id}`">
                      {{ product.title }}
                    </router-link>
                    <td>
                      <div class="h5" v-if="!product.price">
                        {{ item.origin_price }} 元
                      </div>
                      <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
                      <div class="h5" v-if="product.price">
                        現在只要 {{ product.price }} 元
                      </div>
                  </td>
                  </h6>
                  <button class="btn btn-outline-primary w-100"
                  @click.prevent="addToCart(product.id)">加入購物車</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <PaginationComponent :pagination="pagination" @emitPages="getProducts">
          </PaginationComponent> -->
      </div>
</template>
<script>
import { mapActions } from 'pinia';

import cartStore from '../../stores/cartStore';
import toastMessage from '../../stores/toastMessage';
// import PaginationComponent from '../../components/PaginationComponent.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  data() {
    return {
      // 處理 loading 載入效果
      status: {
        loadingItem: '',
      },
      isLoading: false,
      products: [],
      categories: ['赫根山 Mount Hagen', '生態綠 OKOGREEN', '畢嘉士', '微笑人咖啡 Laughing Man Coffee'],
      product: {},
      cart: {},
    };
  },
  methods: {
    ...mapActions(toastMessage, ['pushMessage']),
    ...mapActions(cartStore, ['addToCart']),
    getProducts() {
      const { category = '' } = this.$route.query;
      const getProductsUrl = `${VITE_URL}/api/${VITE_PATH}/products?category=${category}`;
      this.isLoading = true;
      this.axios.get(getProductsUrl)
        .then((res) => {
          // 將資料存起來
          this.products = res.data.products;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.pushMessage({
            style: 'danger',
            title: '取得產品資訊失敗',
            content: err.response.data.message,
          });
        });
    },
    getProduct(id) {
      this.$router.push(`product/${id}`);
    },
  },
  watch: {
    // 當路由發生變化，會重新取得一次值
    '$route.query': {
      handler() {
        this.getProducts();
      },
      deep: true,
    },
  },
  created() {
    this.getProducts();
  },
};
</script>
