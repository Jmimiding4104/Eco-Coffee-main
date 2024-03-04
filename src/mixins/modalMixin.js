// 訂單頁編輯 / 刪除功能
// 由於編輯與刪除操作都是透過 modal 視窗執行的，
// 所以可以先把相關的 modal 功能獨立成一支檔案方便重用
// 用於管理 modal 的開關功能，需要用到 modal 的區塊就能直接引入該檔案使用
import Modal from 'bootstrap/js/dist/modal';

export default {
  methods: {
    openModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal, {
      keyboard: false,
      backdrop: 'static',
    });
  },
};
