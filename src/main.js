
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
import VueSocketio from 'vue-socket.io'
import Vant from 'vant'
import 'vant/lib/vant-css/index.css'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$serverUrl = 'http://forcar.vip:8080'
Vue.use(MuseUI)
Vue.use(BaiduMap, {
	ak: 'AgWMKM9B5sGxq6pgPsuymZp8ZrwqYtj7'
})
if (store.state.token != null) {
	Vue.use(VueSocketio, 'http://forcar.vip:8081?token='+ store.state.token + '&role=role_driver')
}
Vue.use(Vant)

new Vue({
	el: '#app',
	router,
	store,
	http,
	render: h => h(App),
	template: '<App/>'
})
