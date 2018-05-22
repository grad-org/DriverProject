<template>
		<div ref="selectorDiv" class="container">
			<div style="padding: 18px 0 15px 0; text-align: center; font-size: 14px;">
				<img :src="carIcon" width="84px"/>
				<div style="margin-top: 6px">
					<span class="span1">{{fareTips}}</span>
				</div>
			</div>
			<mu-divider/>
			<div style="text-align: center; padding: 12px">
				<mu-raised-button label="返回首页" primary @click="goHome"></mu-raised-button>
				&nbsp;&nbsp;&nbsp;
				<mu-raised-button label="乘客到达" primary @click="arriveDestination"></mu-raised-button>
			</div>
		</div>
</template>

<script>

	/**
	 * 仍需解决问题：车主头像，现阶段是采用本地头像
	 * 高度不固定div，内容垂直居中：https://zhidao.baidu.com/question/717236354301077285.html
	 */

	import { Toast } from 'vant'
	import avater from '../../assets/image/avater.jpg'
	import car from '../../svg/car.svg'

	export default {
		data () {
			return {
				carIcon: car,
				ls_processingtrip: null,

				fareTips: '车费计算中...',
			}
		},
		created () {
			if (typeof window.localStorage.getItem('ProcessingTrip') === 'string') {
				this.ls_processingtrip = JSON.parse(window.localStorage.getItem('ProcessingTrip'));
				// 如果已完成
				if (this.ls_processingtrip.orderStatus == 'PROCESSING_COMPLETED') {
					const toast1 = Toast.loading({
						duration: 0,
						forbidClick: true,
						message: '订单已完成'
					});
					let second = 3;
					const time1 = setInterval(() => {
						second--;
						console.log(second);
						if (second) {
							toast1.message = '返回首页...';
						} else {
							clearInterval(time1);
							Toast.clear();
							this.$router.push({name: 'Home'});
							window.localStorage.removeItem('ProcessingTrip')
						}
					}, 1000);
				}
			} else if (window.localStorage.getItem('ProcessingTrip') == null) {
				// 当没有这个字段时，返回首页
				Toast('出现错误！')
				this.$router.push({name: 'Home'})
			} else {
				this.ls_processingtrip = window.localStorage.getItem('ProcessingTrip');
			}
		},
		mounted () {
			
		},
		methods: {
			goHome () {
				this.$router.push({name: 'Home'});
			},
			arriveDestination () {
				let _this = this;
				let ls_distance = window.localStorage.getItem('TripDistance');
				let ls_duratioin = window.localStorage.getItem('TripDuration');
				_this.$axios.post('/api/hailingService/tripOrder/confirmArrival', {
					tripOrderId: _this.ls_processingtrip.tripOrderId,
					lengthOfMileage: ls_distance,
					lengthOfTime: ls_duratioin
				}).then((response) => {
					// 确认到达后，订单状态从：PROCESSING 变为 PROCESSING_COMPLETE
					console.log(response);
					if (response.status == 200) {
						let tripOrder = response.data.data;
						window.localStorage.setItem('ProcessingTrip', JSON.stringify(tripOrder));	// 迟点刷新页面会根据 ProcessingTrip 的 OrderStatus 进行判断是否进行页面的跳转
						_this.$socket.emit('confirmArrival', tripOrder);
						_this.fareTips = '乘客应支付车费' + response.data.data.totalCost + '元 >'
						const toast2 = Toast.loading({
							duration: 0,
							forbidClick: true,
							message: '已到达'
						});
						let second = 3;
						const time2 = setInterval(() => {
							second--;
							console.log(second);
							if (second) {
								toast2.message = '已到达';
							} else {
								clearInterval(time2);
								Toast.clear();
								// _this.$router.push({name: 'Home'})
							}
						}, 1000);
					}
				}).catch((error) => {
					console.log(error);
					if (error.status == 404) {
						alert(error.message);
						// _this.$router.push({name: 'Home'})
					};
					if (error.status == 400) {
						alert(error.message);
						// _this.$router.push({name: 'Home'})
					}
				})
			}
		}
	}
</script>

<style scoped>
	.container{
		/* display: flex; */
		flex-wrap: wrap;
		margin: 0 auto;
	}
	.flat-button {
		margin: 0;
	}
	.raised-button {
		margin: 6px 0 12px 0;
		width: 72%;
	}
	.mu-divider {
		margin: 0 
	}
	.call {
		background: #4a4d5b;
		color: #fff;
		width: 100%;
		height: 56px;
		text-align: center;
		line-height: 56px;
		font-size: 15px;
		font-weight: bold;
	}
	.paper {
		display: inline-block;
		height: 50px;
		height: 50px;
		width: 50px;
		margin: 8px 0 3px 0;
		text-align: center;
		overflow: hidden;
	}
	span {
		display: block;
		padding: 2px;
	}
	.span1 {
		display: inline-block;
		font-size: 14px;
		color: #757575
	}
</style>
