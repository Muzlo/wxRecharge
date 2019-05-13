<template>
<div>
  <navbar :title=mainTitle ></navbar>
  <div class="home">
    <div class="title"></div>
<!--     <div class="select-wrapper">
      <v-select label="text" placeholder="搜索国家或地区" :options="countryList" @input="setSelected"></v-select>
    </div> -->
    <div class="home-wrapper">
      <div class="inputcomponent">
        <input type="number" class="cardNumber" disabled="true" :placeholder=placeholder v-model.number="cardNum">
      </div>

      <div class="buttoncomponent">
        <input type="button" :disabled="!checkUp" class="cardBtn" :class="{ 'on': checkUp }" :value=myPackage @click="myPackageFn()">
      </div>
    </div>
  </div>
</div>

</template>

<script>
import Qs from 'qs';
import navbar from './navbar.vue';
export default {
  name: 'myPackage',
  data () {
    return {
      mainTitle: '套餐状态查询',
      placeholder:'输入设备号',
      cardNum:"",
      countryCode: -1,
      myPackage:'查询套餐状态',
      countryList: []
    }
  },
  components:{
  },
  created(){
    this.cardNum=sessionStorage.getItem("cardNumber");

  },
  computed:{
    checkUp(){
      return this.cardNum.length!=0 ? true : false
    }
  },
  methods:{
    // setSelected(value) {
    //    this.countryCode=value.id
    // },
    myPackageFn(){
      var _this=this;
      let data = {
        "deviceNo": this.cardNum
      }
      _this.$loading("加载中");
      _this.axios({
        method: 'post',
        url: window.globalLink+'deviceSearchDetail.do',
        data: Qs.stringify(data)
      }).then(response => {
          _this.closeLoading();
          if( response.data.errcode==0 ){
            if(response.data.bodyRetInfo.length==0){
              _this.$toast.center("未查询到套餐")
              return false;
            }
            _this.$store.commit('packageListFn',response.data.bodyRetInfo);

              this.$router.push({
                name:'flowState',
                params:{
                  cardNum:this.cardNum,
                  totalData:response.data.totalData,
                  totalUsedData:response.data.totalUsedData
                }
              })
          }else{
            _this.$toast.center(response.data.bodyRetInfo);
          }

      }).catch(error => {
          _this.$toast.center('网络异常');
          _this.closeLoading();
      })

    },
    closeLoading(){
        this.$loading.close();
    }

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
