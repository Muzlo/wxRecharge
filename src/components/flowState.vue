<template>
<div>
  <navbar :title="title"></navbar>
  <div class="flowState">
    <div class="flowState-top">
      <div class="flowState-top-left">
        <h5>剩余流量</h5>
        <h2>{{(totalFlow - usedFlow) | substrFn}}MB</h2>
        <h4>已用 {{usedFlow | substrFn}} MB | 总量 {{totalFlow | substrFn}} MB</h4>
      </div>

      <div class="flowState-top-right">
          <div class="circle-bar">
              <div class="circle-bar-left"></div>
              <div class="circle-bar-right"></div>
              <!-- 遮罩层，显示百分比 -->
              <div class="mask">
                  <span class="percent">{{a | substrFn}}%</span>
                  <i>剩余</i>
              </div>
          </div>
      </div>

    </div>

    <div class="flowState-content">
      <p class="title">流量明细</p>
      <ul class="flowDetaile">
        <li v-for="item of flowList">
          <div class="wrap">
            <div class="clearfix">
              <p class="packageTitle pull-left">{{item.packageName}} </p>
              <p class="isActive pull-right">{{isActiveFn(item)}}</p>
            </div>

            <p class="loadBar">
              <span :style="[{'width':+(item.pakegdata-item.pakegdataUsed)/item.pakegdata*100+'%'}]"></span>
            </p>
            <p class="packageInfo clearfix">
              <span class="pull-left">有效期至：{{item.endDate | timeFilterFn}}</span>
              <span class="pull-right">总量：{{item.pakegdata}} MB | 剩余：{{(item.pakegdata-item.pakegdataUsed) | numFilter }} MB</span>
            </p>
          </div>

          <div class="overdue" v-if="!item.isEffective"></div>

        </li>
      </ul>
    </div>

    <div class="flowState-bottom">
        <div class="flowState-bottom-left text-c"><router-link tag='div' :to="{name:'billRecord',params:{cardNum: cardNum }}"><i></i>充值记录</router-link></div>
        <div class="flowState-bottom-right text-c"><router-link tag='div' :to="{path:'/home'}" ><i></i>选择套餐</router-link></div>
    </div>


  </div>
 <!--  {{cardNum}} -->
</div>
</template>

<script>
import navbar from './navbar.vue';
export default {
  name: 'flowState',
  data () {
    return {
      cardNum:"",
      title:"我的套餐",
      totalFlow:-1,
      usedFlow:-1,
      flowList:[]
    }
  },
  filters: {
    numFilter(value) {
      let tempVal = parseFloat(value).toFixed(3)
      let realVal = tempVal.substring(0,  tempVal.length - 1)
      return realVal
    }
  },
  mounted(){
    this.Fn();
  },
  computed:{
    a(){
      return ((this.totalFlow - this.usedFlow)/this.totalFlow*100)
    },
    isActiveFn(data){
      if(data.isActive){
          return "已激活"
      }else{
          return '未激活';
      }
    }

  },
  components:{
    navbar
  },
  methods:{

    Fn(){
         //封装了css3函数，主要是懒得重复书写代码，既然写了css3函数，顺便写个css吧，统一样式，好看一些
        Element.prototype.css = function(property,value){

            if ( value ) {
                //CSS中像background-color这样的属性，‘-’在JavaScript中不兼容，需要设置成驼峰格式
                var index = property.indexOf('-');
                if( index != -1 ) {
                    var char = property.charAt(index+1).toUpperCase();
                    property.replace(/(-*){1}/,char);
                }
                this.style[property] = value;
            }else{
                //getPropertyValue()方法参数类似background-color写法，所以不要转驼峰格式
                return window.getComputedStyle(this).getPropertyValue(property);
            }
        }
        //封装一个css3函数，用来快速设置css3属性
        Element.prototype.css3 = function(property,value){
            if( value ){
                property = capitalize(property.toLowerCase());
                this.style['webkit'+property] = value;
                this.style['Moz'+property] = value;
                this.style['ms'+property] = value;
                this.style['O'+property] = value;
                this.style[property.toLowerCase()] = value;
            }else{
                return window.getComputedStyle(this).getPropertyValue(
                        ('webkit'+property)||('Moz'+property)||('ms'+property)||('O'+property)||property);
                        //老实说，我不知道为什么要把不带浏览器标记的放在最后，既然都这么用，我也这么做吧。不过这样对现代浏览器来说可能并不好，判断次数变多了
            }

            //首字母大写
            function capitalize(word){
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
        }
        var circleBar    = document.getElementsByClassName('circle-bar')[0];
        var percent      = parseInt(circleBar.getElementsByClassName('percent')[0].firstChild.nodeValue);
        var color        = circleBar.css('background-color');
        var left_circle  = circleBar.getElementsByClassName('circle-bar-left')[0];
        var right_circle = circleBar.getElementsByClassName('circle-bar-right')[0];

        if( percent <= 50 ) {
            var rotate = 'rotate('+(percent*3.6)+'deg)';
            right_circle.css3('transform',rotate);
        }else {
            var rotate = 'rotate('+((percent-50)*3.6)+'deg)';
            right_circle.css ('background-color',color);//背景色设置为进度条的颜色
            right_circle.css3('transform','rotate(0deg)');//右侧不旋转
            left_circle.css3 ('transform',rotate);//左侧旋转
        }
    },
    closeLoading(){
        this.$loading.close();
    }

  },
  created(){
    // sessionStorage.setItem("totalFlow",this.$route.params.totalData || sessionStorage.getItem("totalFlow"));
    // sessionStorage.setItem("usedFlow",this.$route.params.totalUsedData ||sessionStorage.getItem("usedFlow") );
    this.totalFlow=this.$route.params.totalData || sessionStorage.getItem("totalFlow");
    this.usedFlow=this.$route.params.totalUsedData || sessionStorage.getItem("usedFlow");
    this.cardNum=this.$route.params.cardNum || sessionStorage.getItem("cardNum");
    this.$store.commit('cardNumberFn',this.cardNum);
    sessionStorage.setItem("cardNum",this.cardNum);
    this.flowList=this.$store.state.packageList;
    if(this.flowList.length==0){
      this.$router.go(-1)
    }

  },
  filters: {
    substrFn: function (value) {
      return Math.floor(value * 100) / 100
    },
    timeFilterFn:function (val){
        var str="";
        str=val.substr(0,4)+"-"+val.substr(4,2)+"-"+val.substr(6,2);
        return str;
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
html,body
  min-height:100%;
  background:#ededed;
  .flowState
    font-size:.28rem;
    .flowState-top
      padding:20px 15px;
      background:linear-gradient(to top,#77c6ff, #3080d0);
      display:flex;
      align-items: center;
      .flowState-top-left
        flex:1
        h5,h4,h2
          color:#f2f2f2;
        h2
          font-size:34px;
          margin:18px 0;
          color:#fff;
      .flowState-top-right
        flex:0 0 110px;
        width:110px;
        text-align:right;
        .circle-bar
          font-size:104px;
          width: 1em;
          height: 1em;
          position: relative;
          background-color: #09fee4;
          .circle-bar-left,.circle-bar-right
            width: 1em; height: 1em; background-color: #e0f3fe;
          .circle-bar-right
            clip:rect(0,auto,auto,.5em);
          .circle-bar-left
            clip:rect(0,.5em,auto,0);
          .mask
            width: 0.84em;
            height: 0.84em;
            background-color: #fff;
            text-align: center;
            line-height: 0.2em;
            color:rgba(0,0,0,0.5);
            i
              font-style: normal;
              font-size: 13px;
              height: 0.84em;
              line-height: 3em;
              display: block;
          .mask :first-child
            font-size: 24px;
            height: 0.84em;
            line-height: 0em;
            display: block;
        .circle-bar *
          position: absolute;
          top:0;
          right:0;
          bottom:0;
          left:0;
          margin:auto;
        .circle-bar, .circle-bar > *
          border-radius: 50%;
    .flowState-content,.flowState-bottom
      margin-top:15px;
      background:#fff;
      .title
        padding:20px 15px;
        font-size:16px;
        color:#333;
      .flowDetaile
        li
          border-top:1px solid #4a9ae1;
          position:relative;
          .wrap
            padding:15px;
            font-size:14px;
            color:#333;
            .packageTitle
              margin-top:5px;
              margin-bottom:20px;
            .loadBar
              width:100%;
              height:10px;
              border-radius:10px;
              background:#fff;
              margin-bottom:20px;
              position:relative;
              border:1px solid #3080d0;
              span
                position:absolute;
                left:1px;
                top: 1px;
                bottom:1px;
                z-index:9;
                background:#3080d0;
                border-radius:10px;
            .packageInfo
              font-size:12px;
          .overdue
            position:absolute;
            transform: translate(-50%,-50%);
            left:50%;
            top: 50%;
            background:url('../../static/img/overdue.png') no-repeat;
            width:80px;
            height:80px;
            z-index:10;
            background-size:contain;
    .flowState-bottom
      display:flex;
      padding:15px;
      .flowState-bottom-left,.flowState-bottom-right
        flex:1;
        color:#333;
        height:20px;
        line-height:20px;
        i
          width:16px;
          height:16px;
          display:inline-block;
          margin-right:4px;
          vertical-align: top;
      .flowState-bottom-left
        border-right:1px solid #ddd;
        i
          background:url("../../static/img/rechargeLog.png") no-repeat;
          background-size:contain;
      .flowState-bottom-right
        i
          background:url("../../static/img/alidnsgtm.png") no-repeat;
          background-size:contain;




</style>
