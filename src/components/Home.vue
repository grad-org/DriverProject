<template>
	<div >
		<bar></bar>
		<baidu-map></baidu-map>
		<div style="text-align: center; margin: 16px 16px">
			<mu-raised-button label="开放接单" :disabled="order_disabled" @click="goOrder"/>
			&nbsp;&nbsp;&nbsp;
			<mu-raised-button label="停止接单" :disabled="stop_disabled" @click="stopOrder"/>
			&nbsp;&nbsp;&nbsp;
			<mu-raised-button label="发送位置" :disabled="sendLocation_disabled" @click="sendLocation"/>
		</div>
		<div v-if="!List"></div>
		<div v-else>
			<mu-list v-for="(tripList, index) in tripLists"  @itemClick="acceptOrder(index)" :key="index">
				<mu-list-item 
					:title="tripList.departure + ' → ' + tripList.destination" 
					:describeText="'乘客：' + tripList.passengerNickname + '，出车时间：' + tripList.departureTime">
					<mu-avatar icon="assignment" backgroundColor="blue" slot="leftAvatar" />
					<mu-badge content="即时" primary slot="right" v-if="judgeTripType(index)"/>
					<mu-badge content="预约" secondary slot="right" v-else/>
				</mu-list-item>
			</mu-list>
		</div>
	</div>
</template>


<script>

	// Nginx 从 1.3 版开始正式支持 WebSocket 代理。如果你的 web 应用使用了代理服务器 Nginx，那么你还需要为 Nginx 做一些配置，使得它开启 WebSocket 代理功能。
	// 参考地址：https://www.cnblogs.com/jingmoxukong/p/7755643.html

	import Bar from './Bar'
	import BaiduMap from './map/BaiduMap'

	export default {
		components: {
			Bar, BaiduMap
		},
		data () {
			return {
				order_disabled: false,
				stop_disabled: true,
				sendLocation_disabled: true,
				List: false,
				stompClient: null,
				listenOrderSubscription: null,
				
				tripLists: null,
			}
		},
		created () {
			
		},
		mounted () {
			this.$nextTick( () => {
				
			})
		},
		methods: {
			// 用于订阅乘客发布的行程
			goOrder () {
				// 变量
				let _this = this
				let token = window.localStorage.getItem('token');

				// 设置按钮可见不可见
				_this.order_disabled = true;
				_this.stop_disabled = false;
				_this.sendLocation_disabled = false;
				_this.List = true;

				// 建立连接对象（还没发起连接）
				let socket = new SockJS('http://forcar.vip:8080/orh');
				_this.stompClient = Stomp.over(socket);

				// 创建连接
				_this.stompClient.connect(
					// headers
					{'Auth-Token': token},
					// 连接成功的回调函数
					function connectCallback (frame) {
						// 查询已发布的行程
						_this.$axios.get('/api/trip/search/findPublishedTripByCondition')
						.then((response) => {
							console.log(response.data.data);
							_this.tripLists = response.data.data;
							console.log('tripLists', _this.tripLists)
						})
						// 需要将订阅的对象传给一个变量，否则取消订阅时会找不到订阅id
						_this.listenOrderSubscription = _this.stompClient.subscribe('/topic/hailingService/trip/publishTrip', function (trip) {
							console.log(trip.body)
						})
					},
					// 连接失败的回调函数
					function errorCallback (error) {
						console.log(error);
						console.log('失败回调',error);
					}
				)
			},
			// 司机接单，取消订阅
			closeSubscribe () {
				let _this = this
				if (_this.listenOrderSubscription != null) {
					_this.listenOrderSubscription.unsubscribe();
				}
			},
			// 停止接单，用于关闭连接
			stopOrder () {
				let _this = this
				_this.order_disabled = false;
				_this.stop_disabled = true;
				_this.sendLocation_disabled = true;
				_this.List = false;
				_this.stompClient.disconnect()
			},
			// 发送位置，让用户可见
			sendLocation () {
				let _this = this;
				let currentLocation = {carId: 1, lng: _this.$store.state.localPoint.point.lng, lat: _this.$store.state.localPoint.point.lat};
				console.log(currentLocation)
				_this.stompClient.send('/api/hailingService/car/uploadCarLocation', {}, JSON.stringify(currentLocation))
			},
			// 接单
			acceptOrder (orderIndex) {
				console.log('司机接单，订单是：' + orderIndex)
				
			},
			// 判断订单类型
			judgeTripType (val) {
				let tt = this.tripLists[val].tripType;
				let rt = 'REAL_TIME';
				let re = 'RESERVED';
				// equal(tripList.tripType) == 'REAL_TIME'
				if ( tt == rt) {
					return true
				}
				if ( tt == re) {
					return false
				}
			}
		}
	}
</script>

<style scoped>
	
</style>
