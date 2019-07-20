<template>
    <div>
      <h2 class="map-header">我的个人博客's SiteMap</h2>
        <main class="map-wrapper">
          <div class="map-nav">
            <router-link to="/home">个人博客</router-link> » <a href="#">站点地图</a>
          </div>
          <dl class="map-items-wrapper">
            <dt class="map-items-title">
              <h3>最新文章</h3>
            </dt>
            <dd v-for="item in article"><a @click="addId(item.id, item.link)">{{item.articleTitle}}</a></dd>
          </dl>
          <dl class="map-items-wrapper">
            <dd class="categories">
              <p>分类目录</p>
              <dl>
                <dd><a href="#">C/C++</a></dd>
                <dd><a href="#">CSS/DIV</a></dd>
              </dl>
            </dd>
            <dd class="categories">
              <p>页面</p>
              <dl>
                <dd><a href="#">归档</a></dd>
                <dd><a href="#">房思琪的初恋乐园txt电子书下载</a></dd>
              </dl>
            </dd>
          </dl>
          <div class="footer-nav">
            查看首页博客: <a href="#">查看个人博客</a>
          </div>
        </main>
      <footer class="map-footer">
        <p><a href="#">Baidu-SiteMap</a>    Latest Update: 2019-02-14 10:37:05</p><br>
        <p>Powered by<a href="#"> Baidu SiteMap Generator </a>   © 2008-2015 柳城</p>
      </footer>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'blogMap',
  data () {
    return {
      article: []
    }
  },
  methods: {
    addId (id, link) {
      console.log('addId()')
      this.$eventBus.$emit('addId', id)
      this.$router.push(link)
    },
    getBlogAll () {
      let url = `/queryArt?page=0&pageSize=0`
      axios.get(url).then(data => {
        console.log(data)
        if (data.data.msg === '成功') {
          let values = data.data.data
          let arr = []
          values.forEach(item => {
            let temp = {}
            temp.articleTitle = item.title
            temp.articleContent = item.content.replace(/<[^>]+>/g, '').substring(0, 235)+ '...'
            temp.tags = item.tags.split(',')
            temp.view = item.views
            temp.ctime = moment(item.ctime).format().split('T')[0]
            temp.link = {
              name: 'detail',
              params: {
                id: item.id
              }
            }
            arr.push(temp)
          })
          this.article = arr
          console.log(this.article)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    this.getBlogAll()
  }
}
</script>

<style scoped>
  @import "../css/map.css";
</style>
