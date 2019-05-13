<template>
  <div class="wrap">
    <div class="index">
      <div class="title">境外服务</div>
      <div class="lists">
        <div class="list">
          <div class="listInfo">
            <router-link tag="div" to="/home">
              <p><img src="../../static/img/package.png" /></p>
              <p>国外套餐</p>
            </router-link>
          </div>
        </div>
        <div class="list">
          <div class="listInfo">
            <router-link tag="div" to="/recommendList">
              <p><img src="../../static/img/recommend.png" /></p>
              <p>热区推荐</p>
            </router-link>
          </div>
        </div>
        <div class="list">
          <div class="listInfo">
            <router-link tag="div" to="/deviceList">
              <p><img src="../../static/img/lock.png" /></p>
              <p>设备列表</p>
            </router-link>
          </div>
        </div>
        <div class="list">
          <div class="listInfo">
            <router-link tag="div" to="/homeRecharge">
              <p><img src="../../static/img/state.png" /></p>
              <p>国内套餐</p>
            </router-link>
          </div>
        </div>
        <div class="list">
          <div class="listInfo" @click="serviceFn">
            <p><img src="../../static/img/service.png" /></p>
            <p>一键服务</p>
          </div>
        </div>
        <div class="list">
          <div class="listInfo" @click="IntegralExchangeFn">
            <p><img src="../../static/img/IntegralExchange.png" /></p>
            <p>积分兑换</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Qs from 'qs';
export default {
  name: 'index',
  data () {
    return {
    }
  },
  components:{
  },
  created(){
    this.directRightUrl();
  },
  computed:{

  },
  methods:{
      directRightUrl() {
        let paths = window.location.href.split('#');
        paths[1] = paths[1] || '/';
        if (paths[0].charAt(paths[0].length - 1) !== '?') {
          paths[0] =paths[0] +'?'
        }

        if (paths[1].charAt(0) === '!') {
           paths[1] = paths[1].substr(1)
        }
        let url = `${paths[0]}#${paths[1]}`
        if (window.location.href !== url) {
          window.location.href = url
        }
      },
      serviceFn(){
        let data={
          imsi:sessionStorage.getItem("cardImsi")
        }
        this.axios({
          method: 'post',
          url: window.globalLink+"callService.do",
          data: Qs.stringify(data)
        }).then(response => {
          this.$toast.center(response.data.errmsg);
        }).catch(error => {
          this.$toast.center('网络异常');
        })
      },
      IntegralExchangeFn(){
        alert("积分兑换暂未开放")
      }
  },
  directives: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">

.wrap
  padding:15px;
  font-size:14px;
  color:#333;
  .index
    background:#fff;
    border-radius:8px;
    .title
      color:#aaa;
      padding:15px;
      border-bottom:1px solid #f7f7f7;
    .lists
      display:flex;
      flex-wrap: wrap
      .list
        padding:30px 15px;
        align-items: center;
        display: flex;
        justify-content: center;
        width: calc(100%/3);
        border-right:1px solid #f7f7f7;
        border-bottom:1px solid #f7f7f7;
        .listInfo
          p
            text-align:center;
            margin-bottom:10px;
            img
              width:38%;
</style>
