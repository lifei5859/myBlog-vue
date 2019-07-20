<template>
  <Menu mode="horizontal" :theme="theme1" active-name="1">
    <h2 class="logo"> 我的个人博客 | 技术博客 </h2>
    <MenuItem v-for="(item, index) in list" :key="index" :name="index" >
      {{ item.name }}
    </MenuItem>
    <div class="search_bar" style="height: 100%">
      <Input class="search_text" search placeholder="请输入关键字" style="width: 200px"/>
    </div>
  </Menu>

</template>
<script>
import { Menu, MenuItem, MenuGroup, Icon, Input } from 'iview'
export default {
  props: ['list'],
  components: {
    Menu,
    MenuItem,
    MenuGroup,
    Icon,
    Input
  },
  data () {
    return {
      theme1: 'light'
    }
  }
}
</script>

<style scoped>
  .logo {
    display: inline-block;
    float: left;
  }
</style>
