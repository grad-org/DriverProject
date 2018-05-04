<template>
	<div >
		<bar></bar>
		<baidu-map></baidu-map>
		<div style="text-align: center; margin: 16px 16px">
			<mu-raised-button label="开放接单" :disabled="order_disabled" @click="getTrip"/>
			&nbsp;&nbsp;&nbsp;
			<mu-raised-button label="停止接单" :disabled="stop_disabled" @click="stopOrder"/>
		</div>
		<div v-if="!List"></div>
		<div v-else>
			<mu-tabs :value="activeTab" @change="handleTabChange">
				<mu-tab value="published" title="已发布行程"/>
				<mu-tab value="publishing" title="实时发布行程"/>
			</mu-tabs>
			 <div v-if="activeTab === 'published'">
				<mu-list v-for="(publishedTripList, index) in publishedTripLists"  @itemClick="acceptOrder(index)" :key="index">
					<mu-list-item 
						:title="publishedTripList.departure + ' → ' + publishedTripList.destination" 
						:describeText="'乘客：' + publishedTripList.passengerNickname + '，出行时间：' + publishedTripList.departureTime" >
						<mu-avatar icon="assignment" backgroundColor="blue" slot="leftAvatar" />
						<mu-badge content="即时" primary slot="right" v-if="judgeTripType(index)"/>
						<mu-badge content="预约" secondary slot="right" v-else/>
					</mu-list-item>
				</mu-list>
			</div>
			<div v-if="activeTab === 'publishing'">
				<mu-list v-for="(publishingTripList, index) in publishingTripLists"  @itemClick="acceptOrder(index)" :key="index">
					<mu-list-item
						:title="publishingTripList.departure + ' → ' + publishingTripList.destination" 
						:describeText="'乘客：' + publishingTripList.passengerNickname + '，出行时间：' + publishingTripList.departureTime" >
						<mu-avatar icon="assignment" backgroundColor="blue" slot="leftAvatar" />
						<mu-badge content="即时" primary slot="right" v-if="judgeNowTripType(index)"/>
						<mu-badge content="预约" secondary slot="right" v-else/>
					</mu-list-item>
				</mu-list>
			</div>
		</div>
	</div>
</template>


<script>

	// Nginx 从 1.3 版开始正式支持 WebSocket 代理。如果你的 web 应用使用了代理服务器 Nginx，那么你还需要为 Nginx 做一些配置，使得它开启 WebSocket 代理功能。
	// 参考地址：https://www.cnblogs.com/jingmoxukong/p/7755643.html

	import Bar from './Bar'
	import BaiduMap from './map/BaiduMap'
	import SockJS from '../../static/utils/sockjs.js'
	import Stomp from 'stompjs'

	export default {
		components: {
			Bar, BaiduMap
		},
		data () {
			return {
				order_disabled: false,
				stop_disabled: true,
				List: false,
				stompClient: null,
				// stompClient: Stomp.over(new SockJS('')),
				listenOrderSubscription: null,

				activeTab: 'published',	// 默认激活的Tab
				
				publishedTripLists: null,
				publishingTripLists: null,
				timeInterval: null,		// 定时器对象
			}
		},
		created () {
			this.publishingTripLists = [];
		},
		mounted () {

		},
		methods: {
			// 用于订阅乘客发布的行程
			getTrip () {
				// 变量
				let _this = this
				let token = window.localStorage.getItem('Token');

				// 设置按钮可见不可见
				_this.order_disabled = true;
				_this.stop_disabled = false;
				_this.List = true;

				let socket = new SockJS('http://online-ride-hailing.herokuapp.com/orh');
				_this.stompClient = Stomp.over(socket);

				// 创建连接
				_this.stompClient.connect(
					// headers
					{
						'Auth-Token': token,
					},
					// 连接成功的回调函数
					function connectCallback (frame) {
						console.log('有执行这里？');
						// 查询已发布的行程
						_this.$axios.get('/api/trip/search/findPublishedTripByCondition')
						.then((response) => {
							console.log(response.data.data)
							_this.publishedTripLists = response.data.data;
						})
						// 需要将订阅的对象传给一个变量，否则取消订阅时会找不到订阅id
						_this.listenOrderSubscription = _this.stompClient.subscribe('/topic/hailingService/trip/publishTrip', function (trip) {
							_this.publishingTripLists.push(JSON.parse(trip.body));
						})
						_this.sendLocation();	// 开始听单，立刻向用户发送位置
						// 设置定时器
						clearInterval(_this.timeInterval);
						_this.timeInterval = setInterval(function () {
							_this.sendLocation();
							console.log('重复定时器，30秒发送一次！')
						}, 30000)
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
					console.log('司机接单，取消订阅')
				}
			},
			// 停止接单，用于关闭连接
			stopOrder () {
				let _this = this
				_this.order_disabled = false;
				_this.stop_disabled = true;
				_this.List = false;
				_this.stompClient.disconnect()
				// 停止听单，清除定时器
				clearInterval(_this.timeInterval)
			},
			// 发送位置，让用户可见
			sendLocation () {
				let _this = this;
				let currentLocation = {carId: 1, lng: _this.$store.state.localPoint.point.lng, lat: _this.$store.state.localPoint.point.lat};
				_this.stompClient.send('/api/hailingService/car/uploadCarLocation', {}, JSON.stringify(currentLocation))
			},
			// 接单
			acceptOrder (orderIndex) {
				let _this = this;
				console.log('司机接单，订单是：' + orderIndex)
				if (_this.activeTab == 'published') {
					// 车主受理订单，通知乘客
					_this.$axios.post('/api/hailingService/tripOrder/acceptTripOrder',{
						tripId: _this.publishedTripLists[orderIndex].tripId,
						driverId: _this.$store.state.driverId
					})
					.then((response) => {
						console.log(response);
						console.log('接单返回数据');
						if (response.status == 200) {
							_this.stop_disabled = true;
							window.localStorage.setItem('AcceptedTrip', JSON.stringify(response.data.data))
							_this.$router.push({name: 'Handling'});
						}
					})
					.catch((error) => {
						console.log(error);
						if (error.status == '400') {
							alert('此订单已被受理！')
						}
						// 接下来应该刷新一下数据，重新获取已发布行程
					})
				};
				if (_this.activeTab == 'publishing') {
					_this.$axios.post('/api/hailingService/tripOrder/acceptTripOrder',{
						tripId: _this.publishingTripLists[orderIndex].tripId,
						driverId: _this.$store.state.driverId
					})
					.then((response) => {
						console.log(response);
						
					})
					.catch((error) => {
						console.log(error);
					})
				}
				
			},
			// 判断已发布订单类型
			judgeTripType (val) {
				let tt = this.publishedTripLists[val].tripType;
				let rt = 'REAL_TIME';
				let re = 'RESERVED';
				if ( tt == rt) {
					return true
				}
				if ( tt == re) {
					return false
				}
			},
			// 判断实时订单内容
			judgeNowTripType (val) {
				let tt = this.publishingTripLists[val].tripType;
				let rt = 'REAL_TIME';
				let re = 'RESERVED';
				if ( tt == rt) {
					return true
				}
				if ( tt == re) {
					return false
				}
			},
			handleTabChange (val) {
				this.activeTab = val;
			}
		},
		destroyed () {
			this.closeSubscribe();		// 车主接受某个订单后取消订阅
			this.stopOrder()	// 断开连接
		}
	}
</script>

<style scoped>
	.mu-list {
		padding: 0;
	}
</style>
