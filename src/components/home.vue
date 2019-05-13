<template>
<div>
  <navbar :title=mainTitle ></navbar>
  <div class="home">
    <div class="title"></div>
    <div class="select-wrapper">
      <v-select label="text" placeholder="搜索国家或地区" :options="countryList" @input="setSelected"></v-select>
    </div>
    <div class="home-wrapper">
      <div class="inputcomponent">
        <input type="number" class="cardNumber" disabled="true" :placeholder=placeholder v-model.number="cardNum">
      </div>
      <div class="buttoncomponent">
        <input type="button" :disabled="!checkUp" class="cardBtn" :class="{ 'on': checkUp }" :value=choosePackage @click="linkToRechargeFn()">
      </div>
    </div>
  </div>
</div>

</template>

<script>
import Qs from 'qs';
import navbar from './navbar.vue';
export default {
  name: 'home',
  data () {
    return {
      mainTitle: '国外套餐',
      placeholder:'输入设备号',
      cardNum:"",
      choosePackage:'选择套餐',
      countryCode: -1,
      companyInfo:{},
      rechargeList:{},
      countryList: []
    }
  },
  components:{
  },
  created(){

      this.cardNum=sessionStorage.getItem("deviceNumber");
      this.$store.commit('companyInfoFn',{});
      this.$store.commit('rechargeListFn',{});

      let data={}
      this.axios({
        method: 'post',
        url: window.globalLink+'backCountry.do',
        data: Qs.stringify(data)
      }).then(response => {
        this.countryList=(response.data.countryList);
      }).catch(error => {
        this.$toast.center('网络异常');
      })

  },
  computed:{
    checkUp(){
      return this.cardNum.length!=0 ? true : false
    }
  },
  methods:{
    setSelected(value) {
       this.countryCode=value.id
    },
    linkToRechargeFn(){
      var _this=this;

      let data = {
        "deviceNumber": this.cardNum,
        "country": this.countryCode
      }

      if(this.cardNum.length*this.countryCode<=0){
        this.$toast.center('输入信息不完整');
        return false;
      }
      _this.$loading("加载中");
      _this.axios({
        method: 'post',
        url: window.globalLink+'checkCardRecharge.do',
        data: Qs.stringify(data)
      }).then(response => {
          _this.closeLoading();
          if(response.data.errcode==-1){
            _this.$toast.center(response.data.errmsg);
          }else{
            _this.$router.push({
              name:'packageList',
              params:{
                cardNum:this.cardNum,
                countryCode:this.countryCode
              }
            })

            sessionStorage.setItem("cardNum",_this.cardNum);
            sessionStorage.setItem("countryCode",_this.countryCode);
            _this.$store.commit('companyInfoFn',response.data.msg.infos);
            _this.$store.commit('rechargeListFn',response.data.msg.rechargeList);
            _this.$store.commit('cardNumberFn',_this.cardNum);
            _this.$store.commit('countryCodeFn',_this.countryCode);


          }
      }).catch(error => {
          _this.$toast.center('网络异常');
          _this.closeLoading();
      })
    },
    closeLoading(){
        this.$loading.close();
    },



  },
  directives: {

  },
  components:{
    navbar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  .select-wrapper
    font-size:14px;
    padding:0 .9rem;
  .title
    background:#fff;
    padding:15px;
    font-size:16px;
    color:#535353;
    text-align:center;
    margin-bottom:.4rem;
  .home-wrapper
    padding:0 .9rem;
    .cardNumber
        -webkit-appearance: none;
        border-radius:0;
        width:100%;
        border:1px solid #c8c8c8;
        font-size: 14px;
        padding: 10px 6px;
        outline:none;
        text-align:left;
        text-indent:10px;
    .cardBtn
      -webkit-appearance: none;
      border-radius:4px;
      width:100%;
      border:1px solid #bbb;
      font-size: 16px;
      padding: 10px 6px;
      outline:none;
      text-align:center;
      margin-top:.54rem;
      background:#b0b0b0;
      color:#fff;
    .cardBtn.on
      background:#ff565c;

</style>
