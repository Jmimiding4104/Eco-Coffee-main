import { defineStore } from 'pinia';
import axios from 'axios';

const { VITE_URL, VITE_PATH } = import.meta.env;
export default defineStore('cartStore', {
  state: () => ({
    carts: [],
    cart: {},
    final_total: 0,
    total: 0,
  }),
  actions: {
    getCart() {
      const url = `${VITE_URL}/api/${VITE_PATH}/cart`;
      axios.get(url)
        .then((res) => {
          this.cart = res.data.data;
          this.carts = res.data.data.carts;
          this.final_total = res.data.data.final_total;
          this.total = res.data.data.total;
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    },
    addToCart(id) {
      const order = {
        product_id: id,
        qty: 1,
      };
      const url = `${VITE_URL}/api/${VITE_PATH}/cart`;
      axios.post(url, { data: order })
        .then((res) => {
          console.log(res);
          // this.$router.push('/cart');
          this.getCart();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
});
