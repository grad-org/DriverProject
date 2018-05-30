<template>
	<div>
		<mu-appbar ref="barDiv" title="我的行程" style="position: fixed; top: 0; text-align: center;">
			<mu-icon-button icon="arrow_back" slot="left" @click="goBack"/>
			<mu-flat-button slot="right" style="width: 48px" disabled/>
		</mu-appbar>
		<div :style="listStyle" >	
			<van-pull-refresh v-model="isLoading" pulling-text="下拉即可刷新..." loosing-text="释放即可刷新..." loading-text="加载中..." @refresh="onRefresh">
				<!-- 无行程，或者获取失败 -->
				<div style="padding: 16px; font-size: 16px; text-align: center" v-if="!hasTrip" >
					<div v-show="notTripTips">
						<p style="height: 400px">您暂无行程，可下拉刷新！</p>
					</div>
					<div v-show="serviceError">
						<p style="height: 400px">内部网络服务出错，可尝试下拉刷新！</p>
					</div>
				</div>
				<!-- 有行程 -->
				<div style=" font-size: 16px; padding: 8px 8px 8px 8px;" v-else >
					<div v-for="(tripList, index) in tripLists" :key="index">
						<van-cell-group :border="false" class="block1">
							<van-cell :title="tripList.departureTime.slice(0, 4) + '年' + tripList.departureTime.slice(5, 7) + '月' + tripList.departureTime.slice(8, 10) + '日 ' + tripList.departureTime.slice(11, 16)" :value="orderStatus(index)" :center="true" :is-link="true" @click="itemClick(index, tripList.tripOrderId)" style="font-size: 15px; font-weight: bold"/>
							<van-cell :title="'出发地：'+ tripList.departure" icon="location" :center="true" :border="false" style="color: #757575"/>
							<van-cell :title="'目的地：'+ tripList.destination" icon="location" :center="true" :border="false" style="color: #757575" />
						</van-cell-group>
						<div style="height: 8px"></div>
					</div>
				</div>
			</van-pull-refresh>
		</div>
	</div>
</template>

<script>
	/**
	 * 订单状态未完全判断完，如已取消等
	 */
	import { PullRefresh } from 'vant'
	import { List } from 'vant';
	import { Cell, CellGroup } from 'vant';

	export default {
		components: {
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup
		},
		data () {
			return {
				hasTrip: false,	// 判断是否有行程
				listStyle: {
					marginTop: '',	// 用于判断Bar高度
				},
				
				// 无行程，上拉刷新
				isLoading: true,	// 刷新操作完成后，将isLoading设置为false，表示加载完成
				notTripTips: true,	// 没有历史行程的提示
				serviceError: false,	// 内部服务出错的提示
				// vant list
				tripLists: [],
				loading: false,
				finished: true,
				userinfo: null
			}
		},
		created () {
			let _this = this;
			this.userinfo = JSON.parse(window.localStorage.getItem('UserInfo'));
			// 根据乘客id查询历史行程
			_this.$axios.get('/api/tripOrder/search/findAllByDriver?driverId=' + this.userinfo.driverId)
			.then((response) => {
				console.log('查看某乘客的全部历史行程返回数据：', response.data);
				let data = response.data.data;
				_this.tripLists = response.data.data;
				// console.log(_this.tripLists.length)
				if (data.length == 0) {
					// console.log('执行这里？')
					_this.hasTrip = false;
					_this.notTripTips = true;
					_this.serviceError = false;
				} else {
					// console.log('还是这里？')
					_this.hasTrip = true;
					_this.tripLists = response.data.data;
				}
			})
			.catch((error) => {
				console.log(error);
				_this.hasTrip = false;
				if (error.status == 404) {
					_this.notTripTips = true;
					_this.serviceError = false;
				};
				if (error.status == 500) {
					_this.notTripTips = false;
					_this.serviceError = true;
				}
			})
		},
		mounted () {
			this.listStyle.marginTop = this.$refs.barDiv.$el.clientHeight + 'px';
		},
		methods: {
			goBack () {
				// this.$router.go(-1);
				this.$router.push({name: 'Home'});
			},
			itemClick (index, tripOrderId) {
				console.log('点击某项行程，获得其信息：', this.tripLists[index]);
				// 读取订单状态
				let status = this.tripLists[index].orderStatus;		
				if (status == 'PROCESSING') {	// 已通知乘客上车，在行车中：PROCESSING
					// 进入车辆行驶页面
					window.localStorage.setItem('ProcessingTrip', JSON.stringify(this.tripLists[index]));
					this.$router.push({name: 'CarDriving'})
				} else if (status == 'ACCEPTED') {		// 已受理：ACCEPTED
					// alert('已受理，仍需处理');
					// window.localStorage.removeItem('TripDetail')
					// window.localStorage.setItem('T1', JSON.stringify(this.tripLists[index]));
					// this.$router.push({name: 'Progressing'});
				} else if (status == 'PROCESSING_COMPLETED') {		// 订单完成，但乘客未支付车费：PROCESSING_COMPLETED
					// alert('乘客未支付本次行程费用，仍需处理');
				} else {
					// 订单完成，且支付完成：PAYMENT_COMPLETED
					window.localStorage.setItem('HistoryTripDetail', JSON.stringify(this.tripLists[index]));
					this.$router.push({path: '/trip/history/detail', name: 'TripDetail', params: {tripOrderId: tripOrderId}});
					// this.$axios.get('/api/tripOrder/' + tripOrderId).then((response) => {
					// 	console.log('根据行程订单id查询行程明细返回数据：', response)
					// 	if (response.status == 200) {
					// 		window.localStorage.setItem('HistoryTripDetail', JSON.stringify(response.data.data))
					// 		this.$router.push({path: '/trip/history/detail', name: 'TripDetail', params: {tripOrderId: tripOrderId}})
					// 	}
					// }).catch((error) => {
					// 	console.log(error)
					// })
				}
			},
			orderStatus (index) {
				let ts = this.tripLists[index].orderStatus;
				if (ts == 'PAYMENT_COMPLETED') {
					// 订单完成，且支付完成
					return '已完成'
				};
				if (ts == 'PROCESSING') {
					// 订单未完成，行车过程中
					return '进行中'
				};
				if (ts == 'PROCESSING_COMPLETED') {
					// 订单完成，但未支付车费
					return '未支付'
				};
				if (ts == 'CLOSED') {
					// 订单已关闭
					return '已关闭'
				};
				if (ts == 'PAID') {
					// 已支付
					return '已完成'
				};
				if (ts == 'ACCEPTED') {
					// 被受理
					return '已受理'
				};
			},
					// 下拉刷新
			onRefresh() {
				let _this = this;
				setTimeout(() => {
					this.$toast('刷新成功');
					this.isLoading = false;
					_this.$axios.get('/api/tripOrder/search/findAllByDriver?driverId=' + this.userinfo.driverId)
					.then((response) => {
						console.log(response.data.data);
						let data = response.data.data;
						if (data.length == 0) {
							_this.hasTrip = false;
							_this.notTripTips = true;
							_this.serviceError = false;
						} else {
							_this.tripLists = response.data.data;
							_this.hasTrip = true;
						}
					})
					.catch((error) => {
						console.log(error);
						_this.hasTrip = false;
						if (error.status == 404) {
							_this.notTripTips = true;
							_this.serviceError = false;
						};
						if (error.status == 500) {
							_this.notTripTips = false;
							_this.serviceError = true;
						}
					})
				}, 500);
			},
			// 上拉加载
			onLoad() {
				setTimeout(() => {
					// for (let i = 0; i < 10; i++) {
					// 	this.tripLists.push(this.list.length + 1);
					// }
					// this.loading = false;
					// if (this.tripLists.length >= this.tripLists) {
					// 	this.finished = true;
					// }
					this.finished = true
				}, 500);
			},
		},
		computed: {

		}
	}
</script>

<style scoped>
	.block1 {
		background: #eee;
		-webkit-box-shadow: #e0e0e0 0px 0px 4px 4px;
		-moz-box-shadow: #e0e0e0 0px 0px 4px 4px;
		box-shadow: #e0e0e0 0px 0px 4px 4px;
	}
</style>
