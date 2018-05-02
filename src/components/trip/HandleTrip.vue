<template>
	<div style="text-align: center">
		<h1>司机接受订单</h1>
		<mu-raised-button label="返回首页" primary @click="goHome"></mu-raised-button>
	</div>
</template>

<script>

	// import SockJS from '../../../static/utils/sockjs.js'
	// import Stomp from 'stompjs'

	export default {
		data () {
			return {
				// 订单信息
				ls_acceptedtrip: null,
				// 建立连接用
				// stompClient: Stomp.over(new SockJS('http://forcar.vip:8080/orh')),
			}
		},
		created () {
			this.ls_acceptedtrip = window.localStorage.getItem('AcceptedTrip');
			if (this.ls_acceptedtrip == null) {
				this.$router.push({name: 'Home'})
			}
		},
		mounted () {
			
		},
		methods: {
			goHome () {
				this.$router.push({name: 'Home'})
				window.localStorage.removeItem('AcceptTrip');
			},
			// 发送位置到对应乘客，后续需要完成的是，隔N秒发送一次位置
			// sendLocation () {
			// 	let _this = this;
			// 	let token = window.localStorage.getItem('Token')
			// 	// 创建连接
			// 	_this.stompClient.connect(
			// 		// headers
			// 		{'Auth-Token': token},
			// 		// 连接成功的回调函数
			// 		function connectCallback (frame) {
			// 			_this.stompClient.send('/api/queue/hailingService/car/uploadCarLocation/')
			// 		},
			// 		// 连接失败的回调函数
			// 		function errorCallback (error) {
			// 			console.log(error);
			// 			console.log('失败回调',error);
			// 		}
			// 	)
			// },
		},
		computed: {

		}
	}
</script>

<style scoped>
	
</style>