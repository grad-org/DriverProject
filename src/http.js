
import Vue from 'vue'
import axios from 'axios'
import router from './router.js'
import store from './store.js'

// axios 配置
axios.defaults.timeout = 2500	// 覆写库的超时默认值，现在在超时前，所有请求都会等待 2.5 秒
axios.defaults.baseURL = 'http://forcar.vip:8080'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

// http request 请求拦截器
axios.interceptors.request.use(
	// 在发送请求之前做些什么
	config => {
		// 判断是否存在token，如果存在的话，则每个http header都加上token
		if (store.state.token) {
			config.headers.Authorization = `Bearer ${store.state.token}`;
		}
		return config;
	},
	// 对请求错误做些什么
	error => {
		return Promise.reject(error);
	}
)

// http response 响应拦截器
axios.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if (error.response) {
			switch (error.response.status) {
				case 401: 
			}
		}
		return Promise.reject(error.response.data)
		// return Promise.reject(error.response)
	}
)

export default axios;