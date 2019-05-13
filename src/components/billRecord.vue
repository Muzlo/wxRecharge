<template>
<div>
  <navbar :title="title"></navbar>
  <div class="billRecord">
    <ul>
      <li v-for="item in billRecordList">
        <div class="left">
          <span class="ball"></span>
        </div>
        <div class="right">
          <p class="p1">{{item.chargeTime}}</p>
          <p class="p2">套餐：{{item.packName}}</p>
          <p class="p3">金额：{{item.packPrice}}元</p>
        </div>
      </li>
    </ul>

  </div>
</div>
</template>

<script>
import navbar from './navbar.vue';
import Qs from 'qs';
export default {
  name: 'billRecord',
  data () {
    return {
      billRecordList:[],
      title:"充值记录",
      deviceNumber:""
    }
  },
  created(){
    var _this=this;
    this.deviceNumber=sessionStorage.getItem("deviceNumber");
    this.$store.commit('cardNumberFn',this.deviceNumber);
    var data={
      deviceNo:this.deviceNumber
    };
    _this.axios({
      method: 'post',
      url: window.globalLink+'deviceChargeSearch.do',
      data: Qs.stringify(data)
    }).then(response => {
        _this.closeLoading();
        if(response.data.errcode==0){
          _this.billRecordList=response.data.errmsg;
        }else{
          _this.$toast.center(response.data.errmsg);
        }


    }).catch(error => {
        _this.$toast.center('网络异常');
        _this.closeLoading();
    })


  },
  computed:{

  },
  methods:{
    closeLoading(){
        this.$loading.close();
    }
  },
  components:{
    navbar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
html,body
  min-height:100%;
  background:#f3f3f3;
  .bar
    background-color:#4d8dff;
    font-size:16px;
    padding:15px;
    color:#fff;
    position: relative;
    .back
      width:100px;
      position:absolute;
      left:0;
      top: 0;
      bottom:0;
      background:url(../../static/img/back.png) no-repeat 10px center;
      background-size:30%;

  .billRecord
    font-size:14px;
    padding:15px 15px 0 0;
    li
      display:flex;
      overflow: hidden;
      .right
        flex:1;
        background:#fff;
        border:1px solid #ccc;
        padding:8px;
        box-shadow:0 0 4px #ccc;
        border-radius:4px;
        margin-bottom:15px;
        position:relative;
        &:after
          content:'';
          position:absolute;
          top: 10px;
          left:-10px;
          width:0;
          height:0;
          border-style:solid;
          border-width:10px 10px 10px 0;
          border-color:transparent #ccc transparent transparent;
          z-index: 11;
        &:before
          content: '';
          position: absolute;
          top: 12px;
          left: -8px;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 8px 8px 8px 0;
          border-color: transparent #fff transparent transparent;
          z-index: 12;

        .p1
          font-size:14px;
          color:#333;
          font-weight:700;
        .p2,.p3
          font-size:12px;
          color:#666;
        .p2
          margin:7px 0;
      .left
        flex:0 0 60px;
        width:60px;
        text-align:center;
        position:relative;
        &:after
          content: "";
          width: 1px;
          height: 60%;
          background: #e6e9e7;
          position: absolute;
          left: 50%;
          top: 40px;
        &:before
          content: "";
          width: 1px;
          height: 15%;
          background: #e6e9e7;
          position: absolute;
          left: 50%;
          top: 0px;
        .ball
          width:30px;
          height:30px;
          margin-top:10px;
          border-radius:15px;
          background:#e6e9e7 url(../../static/img/flow.png) no-repeat center;
          background-size:70%;
          display:inline-block;
  .billRecord
    li:last-child
      .left
        &:after
          content: "";
          width: 1px;
          height: 36%;
          background: #e6e9e7;
          position: absolute;
          left: 50%;
          top: 40px;

</style>
