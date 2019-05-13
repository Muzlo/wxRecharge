// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import fontSize from './common/js/font'
Vue.use(fontSize)
import './common/stylus/reset.css'
Vue.config.productionTip = false
import fastclick from 'fastclick'
//fastclick.attach(document.body) 加了下拉选择不到
import axios from "axios"

window.globalLink="http://bigdata.sh-fancy.cn/oversea/";


axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.axios=axios;
import 'vue2-toast/lib/toast.css';
import Toast from 'vue2-toast';
Vue.use(Toast);

//vue-select 选择下拉搜索
import vSelect from 'vue-select'
Vue.component('v-select', vSelect)
import 'vue-select/dist/vue-select.css';

import Vuex from 'vuex'
Vue.use(Vuex)
//vuex
var store = new Vuex.Store({//store对象  存储请求的数据
    state:{
        cardNumber:"",
        countryCode:"",
        companyInfo:{},
        rechargeList:{},
        packageList:[]
    },
    mutations: {
      cardNumberFn (state,num) {
        // 变更cardNumber
        state.cardNumber=num;
      },
      countryCodeFn (state,countryCode) {
        // 变更国家编号
        state.countryCode=countryCode;
      },
      companyInfoFn (state,obj) {
        // 变更companyInfo
        state.companyInfo=obj;
      },
      rechargeListFn (state,obj) {
        // 变更rechargeList
        state.rechargeList=obj;
      },
      packageListFn (state,obj) {
        // 变更packageList
        state.packageList=obj;
      }
    }
})

// axios.defaults.baseURL = '/api'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
