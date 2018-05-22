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
	// 
	// 
	/**
	 * 仍需解决：
	 * 1. 发送位置给全体乘客，其中的数据carId还需要解决
	 * 2. 取消行程，删除对应行
	 */

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
				List: false,

				activeTab: 'published',	// 默认激活的Tab
				
				publishedTripLists: [],
				publishingTripLists: [],
				timeInterval: null,		// 定时器对象
			}
		},
		sockets: {
			
		},
		created () {
			
		},
		mounted () {
			this.$socket.on('cancelTrip', function (trip) {
				console.log('取消行程订阅：', trip);
			});
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

				_this.sendLocation();	// 开始听单，立刻向用户发送位置
				// 设置定时器
				clearInterval(_this.timeInterval);
				_this.timeInterval = setInterval(function () {
					_this.sendLocation();
					console.log('重复定时器，30秒发送一次！')
				}, 30000)

				// 查询已发布的行程
				_this.$axios.get('/api/trip/search/findPublishedTripByCondition')
				.then((response) => {
					console.log('查询已发布行程返回：', response.data.data)
					_this.publishedTripLists = response.data.data;
					console.log('publishedTripLists', _this.publishedTripLists);
				})
				// 监听实时发布行程
				_this.$socket.on('publishTrip', function (trip) {
					console.log('监听实时发布行程返回：', trip);
					_this.publishingTripLists.push(trip);
				});

			},
			// 停止接单，用于关闭连接
			stopOrder () {
				let _this = this
				_this.order_disabled = false;
				_this.stop_disabled = true;
				_this.List = false;
				this.$socket.off('broadcastCarLocation');
				clearInterval(_this.timeInterval);	// 停止听单，清除定时器
			},
			// 发送位置，让用户可见
			sendLocation () {
				let _this = this;
				let currentLocation = {carId: 1, lng: _this.$store.state.localPoint.point.lng, lat: _this.$store.state.localPoint.point.lat};
				// _this.stompClient.send('/api/hailingService/car/uploadCarLocation', {}, JSON.stringify(currentLocation))
				// this.$socket.join('broadcastTrip');
				// 测试地址
				// this.$socket.emit('broadcastCarLocation', {carId: 1, lng: '110', lat: '23'});
				// 真实地址
				this.$socket.emit('broadcastCarLocation', currentLocation);
			},
			// 接单
			acceptOrder (orderIndex) {
				let _this = this;
				console.log('司机接单，订单是：' + orderIndex)
				// 已发布行程
				if (_this.activeTab == 'published') {
					// 在已发布行程栏，车主受理订单，通知乘客
					_this.$axios.post('/api/hailingService/tripOrder/acceptTripOrder',{
						tripId: _this.publishedTripLists[orderIndex].tripId,
						driverId: _this.$store.state.driverId
					})
					.then((response) => {
						console.log(response);
						if (response.status == 200) {
							_this.stop_disabled = true;
							let tripOrder = response.data;
							this.$socket.emit('acceptTrip', tripOrder);
							window.localStorage.setItem('AcceptedTrip', JSON.stringify(response.data.data))
							_this.$router.push({name: 'Handling'});
						}
					})
					.catch((error) => {
						console.log(error);
						console.log(error.message);
						if (error.status == 400) {
							alert('此订单已被取消！')
							// 接下来应该重新获取数据，重新获取已发布行程
							_this.$axios.get('/api/trip/search/findPublishedTripByCondition')
							.then((response) => {
								console.log(response.data.data)
								_this.publishedTripLists = response.data.data;
								console.log('publishedTripLists', _this.publishedTripLists);
							})
						}
						if (error.status == 500) {
							alert(error.error)
						}
					})
				};
				// 实时行程监听
				if (_this.activeTab == 'publishing') {
					_this.$axios.post('/api/hailingService/tripOrder/acceptTripOrder',{
						tripId: _this.publishingTripLists[orderIndex].tripId,
						driverId: _this.$store.state.driverId
					})
					.then((response) => {
						console.log(response);
						if (response.status == 200) {
							let tripOrder = response.data.data;
							_this.$socket.emit('acceptTrip', tripOrder);
							_this.stop_disabled = true;
							window.localStorage.setItem('AcceptedTrip', JSON.stringify(response.data.data))
							_this.$router.push({name: 'Handling'});
						}
					})
					.catch((error) => {
						console.log(error);
						if (error.status == 400) {
							alert('此订单已被取消！')
							// 接下来应该重新订阅实时行程
							_this.listenOrderSubscription = _this.stompClient.subscribe('/topic/hailingService/trip/publishTrip', function (trip) {
							let body = JSON.parse(trip.body);
							if (body.message == 'publishTrip') {
								_this.publishingTripLists.push(body.data);
							}
						})
						}
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
		}
	}
</script>

<style scoped>
	.mu-list {
		padding: 0;
	}
</style>
