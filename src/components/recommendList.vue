<template>
<div>
  <navbar :title="title" ></navbar>
  <div class="select-wrapper">
    <v-select label="text" placeholder="搜索国家或地区" :options="options" @input="setSelected"></v-select>
  </div>

  <div class="recharge">
    <ul class="rechargeList">
      <li v-for="item in rechargeList">
        <h2 class="title text-c hot">
          <span class="span-left"></span>
          {{item.areaName}}
          <span class="span-right"></span>
        </h2>
        <ul class="list clearfix normal">
          <li v-for="i in item.list" class="list-li pull-left" @click="toRecommendPackageDetails(i)">
            <div class="setMeal-wrapper">
              <div class="setMeal">
                <h3 class="text-c" v-if="i.packageName">{{i.packageName}}</h3>
                <p class="price-wrapper text-c">
                  <span class="newPrice" v-if="i.presentPrice"><em>￥</em>{{i.presentPrice}}<em>元/天</em></span>
                </p>
                <span class="oldPrice" v-if="i.originalPrice-i.presentPrice>0">￥{{i.originalPrice}}</span>
                <i class="preferential" v-if="i.originalPrice-i.presentPrice>0">立减{{(i.originalPrice-i.presentPrice) |numFilter }}元</i>
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
  name: 'recommendList',
  data () {
    return {
      "title":'热区推荐',
      "rechargeList":[],
      "rechargeListCopy":[],
      "showList":[],
      "options":[],
      "index":"-1"
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
    setSelected(value) {
      var _this=this;
      for( let item in _this.options){
        if( _this.options[item] == value){
          _this.index=item;
          break;
        }
      }

      _this.showList.length=0;
      _this.showList=_this.rechargeListCopy[_this.index]
      _this.rechargeList.length=0;
      _this.rechargeList.push(_this.showList);
    },
    toRecommendPackageDetails(i){
      this.$router.push({
          name:'recommendPackageDetails',
          params:{
             package_name:i.packageName,
             detail:i.packagesDetails,
             cardNum:sessionStorage.getItem("deviceNumber"),
             presentprice:i.presentPrice,
             orignprice:i.originalPrice,
             WxPackId:i.WxPackId,
             countryName:i.countryName,
             totalDay:i.totalDay,
             totalFlow:i.totalFlow
          }
        })
    },

    closeLoading(){
        this.$loading.close();
    },
    classify(data){
      let list = [];
      data.map(ele => {

          if (list.length <= 0) {
              list.push({
                  areaName: ele.areaName,
                  list: [{countryName: ele.countryName,originalPrice:ele.originalPrice,packageName:ele.packageName,packagesDetails:ele.packagesDetails,packagesRemarks:ele.packagesRemarks,presentPrice:ele.presentPrice,WxPackId:ele.WxPackId,totalDay:ele.totalDay,totalFlow:ele.totalFlow}]
              })
              return
          }

          let child = list.find(item => {
              return item.areaName ==ele.areaName
          })

          if (child) {
              child.list.push({countryName: ele.countryName,originalPrice:ele.originalPrice,packageName:ele.packageName,packagesDetails:ele.packagesDetails,packagesRemarks:ele.packagesRemarks,presentPrice:ele.presentPrice,WxPackId:ele.WxPackId,totalDay:ele.totalDay,totalFlow:ele.totalFlow})
          } else {
              list.push({
                  areaName: ele.areaName,
                  list: [{countryName: ele.countryName,originalPrice:ele.originalPrice,packageName:ele.packageName,packagesDetails:ele.packagesDetails,packagesRemarks:ele.packagesRemarks,presentPrice:ele.presentPrice,WxPackId:ele.WxPackId,totalDay:ele.totalDay,totalFlow:ele.totalFlow}]
              })
          }
      })

      return list
    },
    obj2key(obj, keys){
      var n = keys.length,
          key = [];
          while(n--){
            key.push(obj[keys[n]]);
          }
          return key.join('|');
    },
    uniqeByKeys(array,keys){
      var arr = [];
      var hash = {};
      for (var i = 0, j = array.length; i < j; i++) {
        var k = this.obj2key(array[i], keys);
        if (!(k in hash)) {
          hash[k] = true;
          arr.push(array[i]);
        }
      }
      return arr ;
    }



  },
  created(){
      var _this=this;
      _this.$loading("加载中");
      var data={};
      _this.axios({
        method: 'post',
        url: window.globalLink+'hotPack.do',
        data: Qs.stringify(data)
      }).then(response => {
          _this.closeLoading();
          setTimeout(function (){

            var arr=response.data.packgList;
            _this.rechargeList=_this.uniqeByKeys(arr, ['WxPackId', 'areaName']);
            _this.rechargeList=_this.classify(_this.rechargeList);

            _this.rechargeListCopy=_this.uniqeByKeys(arr, ['WxPackId', 'areaName']);
            _this.rechargeListCopy=_this.classify(_this.rechargeListCopy);


            for(let item in _this.rechargeList){
              _this.options.push(_this.rechargeList[item].areaName)
            }



          })


      }).catch(error => {
          _this.$toast.center('网络异常');
          _this.closeLoading();
      })

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
  .select-wrapper
    font-size:14px;
    padding:0 .34rem;
    margin-top:.5rem;
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
