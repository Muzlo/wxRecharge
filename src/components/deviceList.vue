<template>
<div>
  <navbar :title=mainTitle ></navbar>
  <div class="deviceList">
    <ul>
      <li>
        <div @click="myPackageFn(deviceNumber)">
          <p class="p1 clearfix"><span class="pull-left">设备号</span><span class="pull-right">{{deviceNumber}}</span></p>
          <p class="p2 clearfix"><span class="pull-left">网卡号</span><span class="pull-right">{{cardNumber}}</span></p>
        </div>
        <p class="p3 clearfix">
          <span class="pull-right span1" @click="unBindFn(deviceNumber)">点击解绑</span>
          <span class="pull-right span2" @click="myPackageFn(deviceNumber)">查看详情</span>
        </p>
      </li>
    </ul>

  </div>
</div>

</template>

<script>
import Qs from 'qs';
import navbar from './navbar.vue';
export default {
  name: 'deviceList',
  data () {
    return {
      mainTitle: '我的设备',
      cardNumber:"",
      deviceNumber:""
    }
  },
  components:{
  },
  created(){
    this.cardNumber=sessionStorage.getItem("cardNumber");
    this.deviceNumber=sessionStorage.getItem("deviceNumber");
  },
  computed:{

  },
  methods:{
    unBindFn(i){
      var _this=this;
      var r=confirm("确定解绑？");
      if (r==true){
          let data = {
            "deviceNo": i,
            "openid":localStorage.getItem('openid')
          }
          _this.$loading("加载中");
          _this.axios({
            method: 'post',
            url: window.globalLink+'cancelWxBind.do',
            data: Qs.stringify(data)
          }).then(response => {
              _this.closeLoading();
              _this.$toast.center(response.data.errmsg);
              //跳转到扫描页
              window.location.href="http://bigdata.sh-fancy.cn/oversea/deviceScan.do"


          }).catch(error => {
              _this.$toast.center('网络异常');
              _this.closeLoading();
          })
      }else{
          alert("您选择了取消!");
      }


    },
    myPackageFn(i){
      var _this=this;
      let data = {
        "deviceNo": i
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
            sessionStorage.setItem("totalFlow",response.data.totalData);
            sessionStorage.setItem("usedFlow",response.data.totalUsedData);
            this.$router.push({
              name:'flowState',
              params:{
                cardNum:this.cardNumber,
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
.deviceList
  font-size:.24rem;
  color:#666;
  padding:15px;
  li
    padding:10px 15px;
    background:#fff;
    border-radius:10px;
    box-shadow: 0 3px 8px #ddd;
    margin-bottom:15px;
    p
      line-height:30px;
    .p2
      padding-bottom:8px;
      border-bottom:1px dashed #f1f1f1;
    .p3
      margin-top:15px;
      span
        font-size:12px;
        background:#23cd23;
        line-height:34px;
        padding:2px 10px;
        border-radius:4px;
        color:#fff;
      .span2
        margin-right:15px;
        background:#f13e3e;
</style>
