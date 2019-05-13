<template>

  <div class="bar" >
    <span class="back" @click="back()"></span>
    <p class="text-c">{{title}}</p>
  </div>

</template>

<script>

export default {
  name: 'navbar',
  props:["title"],
  data () {
    return {
    }
  },
  created(){


  },
  computed:{

  },
  methods:{
    back(){
      /*this.$router.push({
        path:'/'
      })*/
      this.$router.go(-1)
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  .bar
    background-color:#4d8dff;
    font-size:16px;
    padding:15px;
    color:#fff;
    position: relative;
    height:45px;
    .back
      width:100px;
      position:absolute;
      left:0;
      top: 0;
      bottom:0;
      background:url(../../static/img/back.png) no-repeat 10px center;
      background-size:30%;
</style>
