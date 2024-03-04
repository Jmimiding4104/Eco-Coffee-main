<template>
  <LoadingOverLay :active="isLoading" :z-index="1060"/>
    <div class="container">
      <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <RouterLink to="/cart">購物車</RouterLink>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ product.title }}
        </li>
      </ol>
    </nav>
    <div class="row justify-content-center">
      <article class="col-8">
        <h2>{{ product.title }}</h2>
        <div>{{ product.content }}</div>
        <div>{{ product.description }}</div>
        <img :src="product.imageUrl" class="img-fluid mb-3" :alt="product.title">
      </article>
      <div class="col-4">
        <div class="h5" v-if="!product.price">{{ product.origin_price }} 元</div>
        <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
        <div class="h5" v-if="product.price">現在只要 {{ product.price }} 元</div>
        <hr>
        <a class="btn btn-dark w-100 py-2"
         @click.prevent="addToCart(product.id)">加入購物車</a>
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
      isLoading: false,
      product: {},
      id: '',
    };
  },
  methods: {
    ...mapActions(toastMessage, ['pushMessage']),
    ...mapActions(cartStore, ['addToCart']),
    getProduct() {
      const url = `${VITE_URL}/api/${VITE_PATH}/product/${this.id}`;
      this.isLoading = true;
      this.axios.get(url)
        .then((res) => {
          this.product = res.data.product;
          this.isLoading = false;
        });
    },
  },
  created() {
    this.id = this.$route.params.productId; // 從路由取得產品 id
    this.getProduct();
  },
};
</script>
