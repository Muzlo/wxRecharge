<template>
<div>
  <navbar :title="title"></navbar>
  <div class="packageDetails">
        <div class="packageDetails-top">
            <div class="packageDetails-top-left"></div>
            <div class="packageDetails-top-right">
              <h2>{{this.$route.params.package_name}}</h2>
              <h3>
                <span class="span1" v-if="this.$route.params.orignprice-this.$route.params.presentprice">原价:￥{{this.$route.params.orignprice}}</span>
                <span class="span2">现价:<i>￥</i><em>{{this.$route.params.presentprice}}</em></span></h3>
              <h4>套餐总流量：{{this.$route.params.totalFlow}}（MB）</h4>
              <h4>套餐有效期：{{this.$route.params.totalDay}}（天）</h4>
            </div>
        </div>
        <div class="packageDetails-content">
          <p class="strong">温馨提示</p>
          <div class="html" v-html="detail">
          </div>
        </div>
        <div class="buttoncomponent">
          <input type="button" class="cardBtn" value="办 理" @click="rechargeFn()">
        </div>
  </div>

</div>
</template>

<script>
import Qs from 'qs';
import navbar from './navbar.vue';
export default {
  name: 'recommendPackageDetails',
  data () {
    return {
      title:"套餐详细",
      detail:"",
      cardNum:"",
      countryCode:"",
      id:"",
      openid:"",
      packageName:""
    }
  },
  created(){
    this.packageName=this.$route.params.package_name;
    this.detail=this.$route.params.detail;
    this.cardNum=this.$route.params.cardNum;
    this.id=this.$route.params.WxPackId;
    this.countryCode=this.$route.params.countryName;
    this.openid=localStorage.getItem('openid');
    if(!this.detail){
      this.$router.go(-1)
    }

  },
  components:{
    navbar
  },
  computed:{

  },
  methods:{
        rechargeFn(){
          var data={
            deviceNo :this.cardNum,
            wxPackId:this.id,
            openId : this.openid,
            country :this.countryCode,
            packageName:this.packageName,
            custTotalDataCat:0,
            custTotalData:0
          }
          var _this=this;
          _this.axios({
            method: 'post',
            url: window.globalLink+'confirmCharge.do',
            data: Qs.stringify(data)
          }).then(response => {
            _this.closeLoading();
            if(response.data.errcode==0){
              _this.wxPay(response.data)
            }else{
              _this.$toast.center(response.data.errmsg);
            }

          }).catch(error => {
              _this.$toast.center('网络异常');
              _this.closeLoading();
          })

        },
        closeLoading(){
            this.$loading.close();
        },
        wxPay(data){
          WeixinJSBridge.invoke('getBrandWCPayRequest', {
            "appId" : data.appId,
            "timeStamp" : data.timeStamp,
            "nonceStr" : data.nonceStr,
            "package" : data.package,
            "signType" : "MD5",
            "paySign" : data.paySign
          },function(res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              if (typeof WeixinJSBridge == "undefined") {
                alert("支付成功!");
              } else {
                alert("支付成功!");
                WeixinJSBridge.invoke('closeWindow', {},
                    function(res) {
                    });
              }
            } else {
              alert(res.err_msg);
            }
          })
        }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
html,body
  min-height:100%;
  background:#ededed;
  .packageDetails
    font-size:.28rem;
    .packageDetails-top
      padding:15px;
      background:#fff;
      align-items: center;
      display:flex;
      .packageDetails-top-left
        flex:0 0 80px;
        width:80px;
        height:40px;
        margin-right:15px;
        background:url(../../static/img/air.png) no-repeat center;
        background-size:98%;
      .packageDetails-top-right
        flex:1;
        h2
          font-size:16px;
          margin-bottom:10px;
        h3
          font-size:14px;
          .span1
            margin-right:15px;
            color:#999;
            text-decoration: line-through;
          .span2
            em,i
              color:#f00;
              font-style:normal;
            em
              font-size:22px;
              font-weight:700;
        h4
          font-size:14px;
          padding: 10px 0 0;

    .packageDetails-content
      margin-top:15px;
      padding:15px;
      background:#fff;
      line-height:24px;
      .strong
        font-weight:700;
        border-bottom:1px solid #eee;
        padding-bottom:10px;
        margin-bottom:15px;
      .html
        padding-bottom:100px;
    .buttoncomponent
      padding:.25rem;
      position:fixed;
      bottom:0;
      left: 0;
      right:0;
      background:#eee;
      .cardBtn
        -webkit-appearance: none;
        border-radius:4px;
        width:100%;
        border:1px solid #bbb;
        font-size: 18px;
        padding: 8px 6px;
        outline:none;
        text-align:center;
        background:#4d8dff;
        color:#fff;
</style>
