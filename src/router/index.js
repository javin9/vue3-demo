import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/reactivedemo',
    name: 'reactivedemo',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/reactivedemo.vue')
  },
  {
    path: '/refdemo',
    name: 'refdemo',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/refdemo.vue')
  },
  {
    path: '/toref',
    name: 'toref',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/toref.vue')
  },
  // to-refs
  {
    path: '/to-refs',
    name: 'to-refs',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/to-refs.vue')
  },
  {
    path: '/escope',
    component: () => import('../views/effectScope.vue')
  },
  {
    path: '/expose',
    component: () => import('../views/expose-p.vue')
  },
  {
    path: '/pinia-pagea',
    component: () => import('../views/pinia/a.vue')
  },
  {
    path: '/pinia-pageb',
    component: () => import('../views/pinia/b.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
