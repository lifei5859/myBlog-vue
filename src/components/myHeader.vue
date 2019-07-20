<template>
  <header class="header">
    <Menu class="header-menu" mode="horizontal" theme="light" :active-name="$route.name">
      <Row>
        <Col :lg="6" :md="9" :sm="11" :xs="18" style="minWidth: 230px">
          <h2 class="logo">我的个人博客 | 技术博客</h2>
        </Col>
        <Col :lg="13" :md="10" :sm="13" :xs="0">
          <Menu-item
            v-for="(item, index) in list"
            :name="item.name"
            :key="index"
            class="header-menu-item"
          >
            <router-link class="header-link" tag="span" :to="item.type">{{item.title}}</router-link>
          </Menu-item>
        </Col>
        <Col :lg="0" :md="0" :sm="0" :xs="6">
          <Dropdown trigger="click" style="margin-left: -40px">
            <a href="javascript:void(0)" class="showButton" @click="showMenu">
              <Button icon="ios-menu" />
            </a>
            <DropdownMenu slot="list" class="dropdown-menu" placement="bottom-end">
              <DropdownItem v-for="(item, index) in list" :key="index">
                <router-link class="header-link" tag="span" :to="item.type">{{ item.title }}</router-link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Col>
        <Col :lg="5" :md="5" :sm="24" :xs="24" class="padding">
          <Input
            class="search_text"
            search
            placeholder="请输入关键字"
            @on-enter="searchBar"
            v-model="values"
            @input="search(queryBlog, 500)"
            style="width: 200px"
          />
        </Col>
      </Row>
    </Menu>
  </header>
</template>

<script>
import {
  Menu,
  MenuItem,
  Dropdown,
  MenuGroup,
  DropdownItem,
  ButtonGroup,
  DropdownMenu,
  Option,
  Icon,
  Input,
  Select,
  Row,
  Col,
  Button
} from "iview";
import axios from "axios";
export default {
  name: "myHeader",
  data() {
    return {
      value: "",
      list: [
        { title: "首页", name: 'home', type: "/" },
        { title: "地图", name: 'map', type: "/map" },
        { title: "关于", name: 'about', type: "/about" },
        { title: "留言", name: 'comments', type: "/comments" }
      ],
      timer: null,
      values: "",
      articleList: [],
      num: 0
    };
  },
  methods: {
    showMenu() {
      console.log("o jb k");
    },
    queryBlog(val) {
      if (val) {
        let url = `/queryBlogByKeyword?K=${val}`;
        axios(url)
          .then(data => {
            console.log(data);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    search(fun, time) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        fun(this.values);
      }, time);
    },
    searchBar() {
      console.log("sssss");
    }
  },
  created () {
    console.log(this.$route)
  }
};
</script>

<style scoped>
@import "../css/base.css";
.logo {
  display: inline-block;
  float: left;
}
.showButton {
  z-index: 10000;
}
</style>

