<template>
  <div id="app">

    <router-view  class="child-view"></router-view>

  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {

    }
  },
  watch:{
    $route(to, from) {

    }
  }
}
</script>

<style>
*{box-sizing:border-box;}
html,body{background:#fbfbfb;height:100%;}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
