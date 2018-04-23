
import Vue from 'vue'
import axios from 'axios'
import http from './http.js'
import router from './router.js'
import store from './store.js'

import App from './App'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-light.css'
import BaiduMap from 'vue-baidu-map'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(MuseUI)
Vue.use(BaiduMap, {
	ak: '8yg5IA7svz9uCGoocOMDt6PSApHhQTF7'
})

new Vue({
	el: '#app',
	router,
	store,
	http,
	render: h => h(App),
	template: '<App/>'
})
