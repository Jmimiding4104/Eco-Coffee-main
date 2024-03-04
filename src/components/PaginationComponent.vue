<template>
    <nav aria-label="Page navigation example">
            <ul class="pagination">
              <li class="page-item" :class="{'disabled' : pagination.current_page === 1}">
                <a href="#" class="page-link"
                  @click.prevent="updatePage(pagination.current_page - 1)"
                  aria-label="Previous">
                   <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li v-for="page in pagination.total_pages" :key="page" class="page-item"
                :class="{'active':page === pagination.current_page}">
                <span class="page-link" v-if="page === pagination.current_page">{{
                  page
                }}</span>
                  <a class="page-link" v-else href="#" @click.prevent="updatePage(page)">
                    {{ page }}
                  </a>
              </li>
              <li class="page-item"
              :class="{'disabled':pagination.current_page === pagination.total_pages}">
                  <a href="#" class="page-link"
                  @click.prevent="updatePage(pagination.current_page + 1)"
                   aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
              </li>
            </ul>
          </nav>
</template>

<script>
export default {
  // :pagination="{ 頁碼資訊 }"
  props: ['pagination'],
  // @emitPages="更新頁面事件"
  methods: {
    updatePage(page) {
      this.$emit('emitPages', page);
    },
  },
};
</script>
