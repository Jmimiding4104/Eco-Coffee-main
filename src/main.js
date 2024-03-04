import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
// 引入 Ckeditor5-vue 用於製作貼文頁面
// 需先在終端機中輸入 npm i --save @ckeditor/ckeditor5-vue @ckeditor/ckeditor5-build-classic
import CKEditor from '@ckeditor/ckeditor5-vue';
import './assets/all.scss';
// 引入 vee-validate
// 需先在終端機執行 1. npm install vee-validate
// 2. npm install @vee-validate/rules  3. npm install @vee-validate/i18n
// 引入 VeeValidate 元件跟功能
import {
  Form, Field, ErrorMessage, defineRule, configure,
} from 'vee-validate';
// 引入 VeeValidate 的驗證規則
import * as AllRules from '@vee-validate/rules';
// 引入 VeeValidate 的 i18n 功能
import { localize, setLocale } from '@vee-validate/i18n';
// 引入 VeeValidate 的繁體中文語系檔
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

// 引入 filters.js 的 data 及 currency 方式
import { date, currency } from './methods/filters';

import App from './App.vue';
import router from './router';

// 將所有 vee-validate 的規則載入
Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});
// 將當前 VeeValidate 的語系設定為繁體中文
configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true, // 當輸入任何內容直接進行驗證
});
// 設定預設語系
setLocale('zh_TW');

const app = createApp(App);

// 可以在全局（app.config.globalProperties）
// 去定義 $filters，並放入 date 跟 currency 兩個方法。
app.config.globalProperties.$filters = {
  date,
  currency,
};

app.use(createPinia());
app.use(router);
app.use(VueAxios, axios);
app.use(CKEditor);

app.component('LoadingOverLay', Loading);
// 掛載 Global 的 VeeValidate 元件
app.component('VeeForm', Form);
app.component('VeeField', Field);
app.component('ErrorMessage', ErrorMessage);

app.mount('#app');
