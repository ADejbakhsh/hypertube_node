import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Layout from '../../src/components/layouts/layout.vue'

Vue.use(VueRouter)
Vue.component("layout", Layout)


const router = new VueRouter({
	mode: 'history',
  routes: [
  {
    path: '/',
    name: 'home',
    component: Home,
		meta: {layout: "layout"}
  },
	{
		path: '/film-info',
		name: 'film-info',
		component: () => import('../views/Film-info.vue'),
		meta: {layout: "layout"}
	},
	{
		path: '/film-list',
		name: 'film-list',
		component: () => import('../views/Film-list.vue'),
		meta: {layout: "layout"}
	},
	{
		path: '/download/',
		name: 'film-download',
		component: () => import('../views/Film-download.vue'),
		meta: {layout: "layout"}
	},
	{
		path: '/download/',
		name: 'film-download-seconde',
		component: () => import('../views/Film-download.vue'),
		meta: {layout: "layout"}
	},
	{
		path: '/film-player/',
		name: 'player-film',
		component: () => import('../views/Film-play.vue'),
		meta: {layout: "layout"}
	},
]
})


export default router
