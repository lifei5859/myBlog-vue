// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

// import './css/base.css'
Vue.use(iView);
Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.prototype.$eventBus = new Vue()
new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app');

