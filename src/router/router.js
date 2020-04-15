/**
 * 整个app的路由设置
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/index',
    component: require('../views/index'),
    children: [
      {
        path: 'QuantMA',
        component: require('../views/QuantMA')
      },
      {
        path: 'songList',
        component: require('../views/songList')
      },
      {
        path: 'PoolResLog',
        component: require('../views/PoolResLog')
      },
      {
        path: 'SamePoolCheck',
        component: require('../views/SamePoolCheck')
      }
    ]
  }, {
    name: 'playerDetail',
    path: '/playerDetail/:id',
    component: require('../views/playerDetail')
  }, {
    path: '/playListDetail/:id',
    name: 'playListDetail',
    component: require('../views/playListDetail')
  }, {
    path: '*', redirect: '/index/QuantMA'
  }]
})

export default router
