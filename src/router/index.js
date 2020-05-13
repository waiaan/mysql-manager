import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Connect',
    component: () => import(/* webpackChunkName: "connectdatabase" */ '../pages/ConnectDatabase.vue')
  },
  {
    path: '/view',
    name: 'View',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "viewdatabase" */ '../pages/ViewDatabase.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
