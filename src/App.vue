<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  created() {
    console.log('asdasd')
  }
}
</script>

<style>
  @import "./css/base.css";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
