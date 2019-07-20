<template>
  <div>
    <myHeader />
    <adMain />
    <myFooter />
  </div>
</template>

<script>
import myFooter from '../components/myFooter'
import myHeader from '../components/myHeader'
import adMain from './adMain'
export default {
  name: 'index',
  components: {
    myFooter,
    myHeader,
    adMain
  }
}
</script>

<style>
  /*@import "../css/index.css";*/
</style>
