<template>
<div>
  <navbar :title="title" ></navbar>
  <div class="swiper">
   <img :src="companyInfo.imgURL" width="100%" height="100%" alt=""/>
   <p>{{companyInfo.country}}</p>
  </div>
  <div class="recharge">
    <ul class="rechargeList">
      <li v-for="item in rechargeList" v-if="item.list.length">
        <h2 class="title text-c" :class="item.type">
          <span class="span-left"></span>
          {{item.title}}
          <span class="span-right"></span>
        </h2>
        <ul class="list clearfix" :class="item.type">
          <li v-for="i in item.list" class="list-li pull-left" @click="selected(item.type,i)" :key="i.package_id">
            <div class="setMeal-wrapper">
              <div class="setMeal">
                <h3 class="text-c" v-if="i.package_name">{{i.package_name}}</h3>
                <p class="price-wrapper text-c">
                  <span class="newPrice" v-if="i.presentprice"><em>￥</em>{{i.presentprice}}<em>元/天</em></span>
                  <span class="newPrice" v-if="i.oneDayPrice"><em>￥</em>{{i.oneDayPrice}}<em>元/天</em></span>
                </p>
                <span class="oldPrice" v-if="i.orignprice-i.presentprice>0">￥{{i.orignprice}}</span>
                <i class="preferential" v-if="i.orignprice-i.presentprice>0">立减{{(i.orignprice-i.presentprice)|numFilter}}元</i>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>

</div>
</template>

<script>
import navbar from './navbar.vue';
import Qs from 'qs';
export default {
  name: 'packageList',
  data () {
    return {
      cardNum:"",//卡号
      countryCode:"",//国家
      title:'套餐列表',
      rechargeList:{},
      companyInfo:{}
    }
  },
  filters: {
    numFilter(value) {
      let tempVal = parseFloat(value).toFixed(3)
      let realVal = tempVal.substring(0,  tempVal.length - 1)
      return realVal
    }
  },
  methods:{
    selected(type,i) {
      if(type ==="custnormal"){  //"自定义时长套餐"
        this.cardNum=this.$route.params.cardNum || this.$store.state.cardNumber;
        this.$router.push({
          name:'custnormal',
          params:{
             package_name:i.package_name,
             id:i.id,
             detail:i.detail,
             cardNum:this.cardNum || sessionStorage.getItem("cardNum"),
             countryCode:this.countryCode || sessionStorage.getItem("countryCode"),
             presentprice:i.presentprice,
             orignprice:i.orignprice
          }
        })
      }else if(type ==="custflow"){  //"自定义流量套餐"
        this.cardNum=this.$route.params.cardNum;
        this.$router.push({
          name:'custflow',
          params:{
             package_name:i.package_name,
             id:i.id,
             detail:i.detail,
             cardNum:this.cardNum || sessionStorage.getItem("cardNum"),
             countryCode:this.countryCode || sessionStorage.getItem("countryCode"),
             presentprice:i.presentprice,
             orignprice:i.orignprice
          }
        })
      }else{ //普通套餐
        this.$router.push({
          name:'packageDetails',
          params:{
             package_name:i.package_name,
             id:i.id,
             detail:i.detail,
             cardNum:this.cardNum || sessionStorage.getItem("cardNum"),
             countryCode:this.countryCode || sessionStorage.getItem("countryCode"),
             presentprice:i.presentprice,
             orignprice:i.orignprice,
             totalDay:i.totalDay,
             totalFlow:i.totalFlow
          }
        })
      }
    },
    closeLoading(){
        this.$loading.close();
    }
  },
  created(){
      var _this=this;


      if(this.$store.state.rechargeList.length){
        _this.rechargeList=_this.$store.state.rechargeList;
        _this.companyInfo=_this.$store.state.companyInfo;
        _this.cardNum=_this.$store.state.cardNumber;
        _this.countryCode=_this.$store.state.countryCode;
      }else{
        _this.$loading("加载中");
        let data = {
          "deviceNumber": sessionStorage.getItem("cardNum"),
          "country": sessionStorage.getItem("countryCode")
        }
        _this.axios({
          method: 'post',
          url: window.globalLink+'checkCardRecharge.do',
          data: Qs.stringify(data)
        }).then(response => {
            _this.closeLoading();
            _this.companyInfo=response.data.msg.infos;
            _this.rechargeList=response.data.msg.rechargeList;

            _this.$store.commit('companyInfoFn',response.data.msg.infos);
            _this.$store.commit('rechargeListFn',response.data.msg.rechargeList);


        }).catch(error => {
            _this.$toast.center('网络异常');
            _this.closeLoading();
        })
      }



  },
  components:{
    navbar
  },
  computed:{

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  .swiper
    height:0;
    overflow:hidden;
    padding-bottom:4.02rem;
    position:relative;
    img
      position:absolute;
      left:0;
      width:100%;
      bottom:0;
      z-index:1;
    p
      font-size:22px;
      text-align:right;
      letter-spacing:0px;
      position:absolute;
      z-index:2;
      bottom:20px;
      right:20px;
      left: 20px;
      color:#fff;
      font-family: Helvetica;
  .recharge
    font-size:14px;
    padding:0 .34rem .34rem;
    .title
      font-size:16px;
      color:#7d7f7e;
      margin-top:.5rem;
      span
        display: inline-block;
        width:25px;
        height:10px;
      .span-left
        background:url(../assets/normal_l.png) no-repeat 0 2px;
        background-size: contain;
      .span-right
        background:url(../assets/normal_r.png) no-repeat 0 2px;
        background-size: contain;
    .title.hot
      span
        width: 16px;
        height: 20px;
      .span-left,.span-right
        background-image:url(../assets/hot.png);
        background-position:0 2px;
        background-repeat: no-repeat;
        background-size: contain;
    .list
      .list-li
        color:#fff;
        width:50%;
        margin:11px 0;
        .setMeal-wrapper
          padding:24px 12px 24px;
          border-radius:6px;
          position:relative;
          box-shadow: 0px 2px 2px #d2d2d2;
          .setMeal
            h3
              font-weight:200;
              font-size:.24rem;
              color:#0e0e0e;
              margin-bottom:8px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              padding-bottom: 8px;
            .price-wrapper
              .newPrice
                padding:4px 8px;
                color:#fff;
                font-size:.32rem;
                font-weight:700;
                em
                  font-size:14px;
                  font-style:normal;
                  font-weight:700;
            .oldPrice
                text-decoration: line-through;
                font-size:12px;
                color:#333;
                position:absolute;
                left: 0;
                bottom:22px;
                font-style:normal;
                padding:2px;
            .preferential
              position:absolute;
              left: 0;
              bottom:8px;
              font-size:10px;
              font-style:normal;
              background:#f5692e;
              padding:2px;
      .list-li:nth-child(2n+1)
        .setMeal-wrapper
          margin-right:0.16rem;
      .list-li:nth-child(2n)
        .setMeal-wrapper
          margin-left:0.16rem;
    .list.hot
      .list-li
        .setMeal-wrapper
          background:linear-gradient(to bottom, #ffe22a , #ff5c01);
          .newPrice
            color:#d96736;
          .preferential
            background:#ff6298;
    .list.normal,.list.flow,.list.custnormal,.list.custflow
      .list-li
        .setMeal-wrapper
          background:linear-gradient(to bottom, #87e3fd , #0bc2f4);
          .newPrice
            color:#6d92c0;


@media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2)
  .recharge .list .list-li .setMeal-wrapper .setMeal h3
    position:relative;
    &:after
      content:"";
      position:absolute;
      width:100%;
      height:1px;
      background:#eee;
      bottom:4px;
      left:0;
      border-top:1px solid #000;
      -webkit-transform: scaleY(0.6);
      opacity:0.4;

@media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3)
  .recharge .list .list-li .setMeal-wrapper .setMeal h3
    position:relative;
    &:after
      content:"";
      position:absolute;
      width:100%;
      height:1px;
      background:#eee;
      bottom:4px;
      left:0;
      border-top:1px solid #000;
      -webkit-transform: scaleY(0.4);
      opacity:0.4;

</style>
