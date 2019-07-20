import Vue from 'vue'
import Router from 'vue-router'
import Map from '../pages/blogMap'
import Index from '../pages/index'
import About from '../pages/about'
import Detail from '../pages/detail'
import Comments from '../pages/comments'
import Home from '../components/left'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: Home
        },
        {
          path: '/home/:id',
          name: 'list',
          component: Home
        },
        {
          path: '/about',
          name: 'about',
          component: About,
        },
        {
          path: '/detail/:id',
          name: 'detail',
          component: Detail
        },
        {
          path: '/comments',
          name: 'comments',
          component: Comments
        }
      ]
    },
    {
      path: '/map',
      name: 'map',
      component: Map
    }
  ]
})
