import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store.js'

import NotFoundComponent from '@/components/NotFoundComponent'
import Home from '@/components/Home'
import Login from '@/components/login/Login'
import LoginNext from '@/components/login/LoginNext'
import Register from '@/components/login/Register'
import Authentication from '@/components/Authentication'
import HandleTrip from '@/components/trip/HandleTrip'
import CarDriving from '@/components/trip/CarDriving'

Vue.use(VueRouter)

const router = new VueRouter({
	routes: [
		{
			path: '*',
			component: NotFoundComponent
		},
		{
			path: '/',
			name: 'Home',
			meta: {
				requireAuth: true,
				requireAuthDriver: true
			},
			component: Home
		},
		{
			path: '/authentication',
			name: 'Authentication',
			meta: {
				requireAuth: true
			},
			component: Authentication
		},
		{
			path: '/login',
			name: 'Login',
			component: Login
		},
		{
			path: '/login/2',
			name: 'LoginNext',
			component: LoginNext
		},
		{
			path: '/register',
			name: 'Register',
			component: Register
		},
		{
			path: '/trip/handling',
			name: 'Handling',
			meta: {
				requireAuth: true,
				requireAuthDriver: true
			},
			component: HandleTrip
		},
		{
			path: '/trip/car/driving',
			name: 'CarDriving',
			meta: {
				requireAuth: true,
				requireAuthDriver: true
			},
			component: CarDriving
		},
	],
	mode: 'history'
})

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('Token')) {
	let ls_userinfo = JSON.parse(window.localStorage.getItem('UserInfo'))
	store.dispatch('login', window.localStorage.getItem('Token'));
	store.dispatch('userId', ls_userinfo.userId);
	store.dispatch('driverId', ls_userinfo.driverId);
}

if (window.localStorage.getItem('CurrentCity') == '' || window.localStorage.getItem('CurrentCity') == null || window.localStorage.getItem('CurrentCity') == undefined) {
	store.dispatch('city', '广州市')
} else {
	store.dispatch('city', window.localStorage.getItem('CurrentCity'))
}

router.beforeEach((to, from, next) => {
	if (to.matched.some(r => r.meta.requireAuth)) {		// 判断该路由是否需要登录权限
		if (store.state.token) {	// 判断token是否存在
			if (to.matched.some(r => r.meta.requireAuthDriver)) {		// 判断该路由是否需要车主认证权限
				if (store.state.driverId) {		// 判断driverId是否存在
					next();
				}
				else {
					next({
						path: '/authentication',
						query: {redirect: to.fullPath}
					})
				}
			} else {
				next();
			}
		} else {
			next({
				path: '/login',
				query: {redirect: to.fullPath}	 // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
		}
	} else {
		next();
	}
})

export default router;
