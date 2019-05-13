<template>
<div>
  <navbar :title="title"></navbar>
  <div class="packageDetails">
        <div class="packageDetails-top">
            <div class="packageDetails-top-left"></div>
            <div class="packageDetails-top-right">
              <h2>{{this.$route.params.package_name}}</h2>
              <h3><span class="span1" v-if="this.$route.params.orignprice-this.$route.params.presentprice>0">原价:￥{{this.$route.params.orignprice}}</span><span class="span2">现价:<i>￥</i><em>{{this.$route.params.presentprice}}</em></span></h3>
            </div>
        </div>

        <div class="custnormal">
            <div class="card-info-wrapper">
              <p class="p clearfix"><span class="pull-left">充值卡号</span><span class="pull-right">{{cardNum}}</span></p>
              <p class="p clearfix">
                <span class="pull-left">请选择天数</span>
                <span class="pull-right">
                  <div class="select-wrapper">
                    <select class="cardDays" v-model="days">
                      <option v-for="item in daysFn" :value="item">{{item}}天</option>
                    </select>
                  </div>
                </span>
              </p>
              <p class="p clearfix">
                <span class="pull-left">套餐费用</span>
                <span class="pull-right">{{unitPrice*days*10/10}} 元 /{{days}} 天</span>
              </p>
            </div>
          </div>

        <div class="packageDetails-content">
          <p class="strong">温馨提示</p>
          <div class="html" v-html="detail"></div>
        </div>

        <div class="buttoncomponent">
          <input type="button" class="cardBtn" value="办 理" @click="rechargeFn()">
        </div>
  </div>
</div>

</template>

<script>
import navbar from './navbar.vue';
import Qs from 'qs';
export default {
  name: 'custnormal',
  data () {
    return {
      title:'自定义时长套餐',
      placeholder:'输入天数',
      cardNum:'',
      days:1,
      btnTitle:'确 定',
      id:"",
      name:"",
      unitPrice:"",
      detail:"",
      countryCode:"",
      openid:"",
      packageName:""
    }
  },
  created(){
    this.packageName=this.$route.params.package_name;
    this.openid=localStorage.getItem('openid');
    this.countryCode=this.$route.params.countryCode;
    this.cardNum=this.$route.params.cardNum || this.$store.state.cardNumber;
    this.id=this.$route.params.id;
    this.unitPrice=this.$route.params.presentprice;
    this.detail=this.$route.params.detail
    if(!this.detail){
      this.$router.go(-1)
    }
  },
  computed:{
    checkUp(){
      return this.days > 0 ? true : false
    },
    daysFn(){
      let arrDay=[];
      for(let i=1;i<31;i++){
        arrDay.push(i);
      }
      return arrDay;
    }
  },
  components:{
    navbar
  },
  methods:{
        rechargeFn(){
          var data={
            deviceNo :this.cardNum,
            country :this.countryCode,
            wxPackId:this.id,
            openId : this.openid,
            custTotalDataCat:2,
            custTotalData:this.days,
            packageName:this.packageName
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
    .custnormal
      margin-top:15px;
      .card-info-wrapper
        padding:.45rem;
        background:#fff;
        .p
          font-size:14px;
          height:40px;
          line-height:40px;
          border-bottom:1px solid #eee;
          color:#444;
          padding:0 4px;
          .select-wrapper
            width: 50px;
            height: 30px;
            line-height:30px;
            margin-top:5px;
            position: relative;
            border-radius: 0px;
            &:after
              content: "";
              width: 16px;
              height: 16px;
              background: url(../assets/youla.png) no-repeat center;
              background-size: contain;
              position: absolute;
              right: 0px;
              top: 8px;
              pointer-events: none;
            .cardDays
              background:#fff;
              border:0px;
              border-radius:0;
              outline: none;
              width: 100%;
              height: 30px;
              line-height:30px;
              appearance: none;
              font-size:14px;
              color:#444;
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
