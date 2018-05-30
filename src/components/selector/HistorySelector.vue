<template>
		<div ref="selectorDiv" class="container">
			<mu-row gutter style="text-align: center; align-items:center">
				<!-- 其中width指百分百 -->
				<mu-col width="40" tablet="33" desktop="33">
					<span>乘客</span>
					<span>{{passengerNickname}}</span>
				</mu-col>
				<mu-col width="20" tablet="34" desktop="33">
					<mu-paper class="paper" circle :zDepth="1" >
						<img :src="avater" style="width: 100%; height: 100%"/>
					</mu-paper>
				</mu-col>
				<mu-col width="40" tablet="33" desktop="33">
					<span>联系方式</span>
					<span>{{passengerUsername}}</span>
				</mu-col>
			</mu-row>
			<!-- <mu-divider shallowInset />
			<mu-row gutter style="text-align: center; align-items:center">
				<mu-col width="33" tablet="33" desktop="33">
					<mu-flat-button label="打电话" class="flat-button"/>
				</mu-col>
				<mu-col width="34" tablet="34" desktop="33">
					<mu-flat-button label="发消息" class="flat-button"/>
				</mu-col>
				<mu-col width="33" tablet="33" desktop="33">
					<mu-flat-button label="联系客服" class="flat-button"/>
				</mu-col>
			</mu-row> -->
			<mu-divider shallowInset />
			<div style="padding: 18px 0 15px 0; text-align: center; font-size: 16px;">
				<span style="display: inline-block; font-size: 36px; font-weight: bold">{{totalCost}}</span>元
				<div>
					<span class="span1" @click="openbottomSheet1">车费明细 ＞</span>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<span class="span1" @click="openBottomSheet2">计费规则 ＞</span>
				</div>
			</div>
			<div style="text-align: center">
				<mu-raised-button label="评价本次服务" class="raised-button" :backgroundColor="backgroundColor" :rippleOpacity="rippleOpacity" @click="evaluateTrip"  v-if="notEvalute"/>
				<mu-raised-button label="查看本次服务评价" class="raised-button" :backgroundColor="backgroundColor" :rippleOpacity="rippleOpacity" @click="watchEvaluate" v-else/>
			</div>
			<!-- 车费详情 -->
			<mu-bottom-sheet :open="bottomSheet1" @close="closebottomSheet1">
				<div style="background: #fff; padding: 16px"  @click="closebottomSheet1">
					<span class="span-rule">本次车费明细</span>
					<span class="span-rule-header">行程信息：</span>
					ーーー总里程：{{tripMileage}} 公里<br>
					ーーー总时长：{{tripDuration}} 分钟
					<hr>
					<span class="span-rule-header">费用信息：</span>
					ーーー里程费：{{tripMileageCost}} 元<br>
					ーーー时长费：{{tripDurationCost}} 元
					<hr>
					<span class="span-rule-header">实际支付：</span>
					ーーー支付方式：支付宝<br>
					ーーー支付费用：{{totalCost}} 元（含起步价元）
				</div>
			</mu-bottom-sheet>
			<!-- 计费规则 -->
			<mu-bottom-sheet :open="bottomSheet2" @close="closeBottomSheet2">
				<div style="background: #fff; padding: 16px"  @click="closeBottomSheet2">
					<span class="span-rule">计费规则</span>
					<span class="span-rule-header">起步范围：</span>
					ーーー起步价：{{initialPrice}} 元<br>
					ーーー起步里程：{{initialMileage}} 公里
					<hr>
					<span class="span-rule-header">超出起步范围，按照计价规则收取：</span>
					ーーー总费用 = 起步价 + 里程费 + 时长费<br>
					ーーー里程费：{{unitPricePerKilometer}} 元/公里<br>
					ーーー时长费：{{unitPricePerMinute}} 元/分钟
					<hr>
					<span class="span-rule-header">关于本次行程：</span>
					ーーー总里程：{{tripMileage}} 公里<br>
					ーーー总时长：{{tripDuration}} 分钟
				</div>
			</mu-bottom-sheet>
			<!-- 查看服务评价 -->
			<mu-bottom-sheet :open="bottomSheet3" @close="closeBottomSheet3">
				<div style="padding: 16px 0;"  @click="closeBottomSheet3">
					<span class="span-rule">服务评价</span>
					<div class="block_title" style="padding: 10px 15px; font-weight: bold">
						对乘客评价：
					</div>
					<div class="van-cell van-cell__title van-hairline" >
						<div class="van-cell__title">
							<span class="van-cell__text">评分：</span>
						</div>
						<div class="van-cell__value" style="text-align: left;">
							<passenger-score style="margin-top: 3px"></passenger-score>
						</div>
					</div>
					<div class="van-cell van-cell__title van-hairline" >
						<div class="van-cell__title">
							<span class="van-cell__text">{{passengerRatingContent}}</span>
						</div>
					</div>
					<!-- 乘客对你的评价 -->
					<div class="block_title" style="padding: 10px 15px; font-weight: bold">
						对您的评价：
					</div>
					<div v-if="notEvalutePassenger">
						<div class="van-cell van-cell__title van-hairline" >
							<div class="van-cell__title">乘客还未进行评价！</div>
						</div>
					</div>
					<!-- 当乘客对您有了评价才能看到 -->
					<div v-else>
						<div class="van-cell van-cell__title van-hairline" >
							<div class="van-cell__title">
								<span class="van-cell__text">评分：</span>
							</div>
							<div class="van-cell__value" style="text-align: left;">
								<driver-score style="margin-top: 3px"></driver-score>
							</div>
						</div>
						<div class="van-cell van-cell__title van-hairline" >
							<div class="van-cell__title">
								<span class="van-cell__text">{{driverRatingContent}}</span>
							</div>
						</div>
					</div>
				</div>
			</mu-bottom-sheet>
		</div>
</template>

<script>

	/**
	 * 仍需解决问题：车主头像，现阶段是采用本地头像
	 * 高度不固定div，内容垂直居中：https://zhidao.baidu.com/question/717236354301077285.html
	 */

	import { Toast } from 'vant'
	import avater from '../../assets/image/avater.jpg'
	import DriverScore from './part/DriverScore'
	import PassengerScore from './part/PassengerScore'

	export default {
		components: {
			DriverScore, PassengerScore
		},
		data () {
			return {
				bottomSheet1: false,	// 车费详情BottomSheet
				bottomSheet2: false,	// 计费规则BottomSheet
				bottomSheet3: false,	// 服务评价BottomSheet
				disable: false,
				selectorHeight: '',

				notEvalute: true,			// 是否已评价，默认否
				notEvalutePassenger: true,			// 您是否对乘客进行评价

				backgroundColor: '#4a4d5b',	// 按钮波纹效果的颜色
				rippleOpacity: 0.1,			// 按钮波纹效果的透明度

				// 订单详情
				totalCost: null,	// 总车费


				// 乘客信息
				avater: null,		// 乘客头像
				passengerNickname: null,	// 乘客昵称
				passengerUsername: null,	// 乘客电话（用户名）
				passengerEvaluate: '评分：4.0',	// 乘客评分

				// 车费计费规则
				setupTime: null,		// 规则设定时间
				initialPrice: null,		// 起步价
				initialMileage: null,	// 起步里程
				unitPricePerKilometer: null,	// 里程费
				unitPricePerMinute: null,		// 时长费
				tripMileage: null,	// 行程的里程
				tripDuration: null,	// 行程的时长
				tripMileageCost: null,	// 行程的里程费
				tripDurationCost: null,	// 行程的时长费

				// 评价内容
				driverRatingScore: null,	// 您对乘客的评分
				driverRatingContent: null,	// 您对乘客的评价内容
				passengerRatingScore: null,	// 乘客对您的评分
				passengerRatingContent: null,	// 乘客对您的评价内容
			}
		},
		computed: {
			farePrediction () {
				let store1 = this.$store.state.predictFare;
				if (store1 == null) {
					return '车费预估中...';
				} else {
					return '车费预估：' + store1.totalCost + '元';
				}
			}
		},
		created () {
			let _this = this;
			let ls_tripdetail = JSON.parse(window.localStorage.getItem('HistoryTripDetail'));

			// 评价、查看服务
			let ls_evaluate = ls_tripdetail.isPassengerRated;
			console.log(ls_evaluate)
			if (ls_evaluate == false) {
				_this.notEvalute = true;
			} else if (ls_evaluate == true) {
				_this.notEvalute = false;
				// 再判断乘客是否对你已评价
				if (ls_tripdetail.isPassengerRated == false) {
					_this.notEvalutePassenger = true;
				} else if (ls_tripdetail.isPassengerRated == true) {
					// 显示评价
					_this.notEvalutePassenger = false;
				} else {

				}
			} else {
				
			}
			this.passengerRatingContent = ls_tripdetail.passengerRatingContent;
			
			// 乘客信息
			_this.passengerNickname = ls_tripdetail.passengerNickname;
			_this.passengerUsername = ls_tripdetail.passengerUsername;
			_this.avater = this.$serverUrl + '/images/user/' + this.$store.state.userId + '.jpg';
			
			// 车费明细
			_this.totalCost = ls_tripdetail.totalCost;
			_this.tripMileage = ls_tripdetail.lengthOfMileage;
			_this.tripDuration = ls_tripdetail.lengthOfTime;
			_this.tripMileageCost = ls_tripdetail.mileageCost;
			_this.tripDurationCost = ls_tripdetail.timeCost;

			// 关于车费明细、计费规则
			_this.$axios.get('/api/fare/' + ls_tripdetail.tripOrderId)
			.then((response) => {
				console.log('根据tripOrderId查看车费明细返回：', response);
				let fareRuleDTO = response.data.data.fareRuleDTO;
				_this.initialPrice = fareRuleDTO.initialPrice;
				_this.initialMileage = fareRuleDTO.initialMileage;
				_this.setupTime = fareRuleDTO.selectTime;
				_this.unitPricePerKilometer = fareRuleDTO.unitPricePerKilometer;
				_this.unitPricePerMinute = fareRuleDTO.unitPricePerMinute;
			})
			.catch((error) => {
				console.log(error);
			});

			// 根据行程id获取信息
			_this.$axios.get('/api/tripOrder/' + ls_tripdetail.tripOrderId).then((response) => {
				console.log('根据行程订单id查询行程明细返回数据：', response);
				if (response.status == 200) {
					window.localStorage.setItem('HistoryTripDetail', JSON.stringify(response.data.data));
					// notEvalutePassenger: true,			// 车主是否对你进行评价
					// driverRatingContent: '',		// 车主获得的评价
					let data = response.data.data;
					if (data.isDriverRated == false) {
						_this.notEvalutePassenger = true;
					} else if (data.isDriverRated == true) {
						_this.notEvalutePassenger = false;
						_this.driverRatingContent = data.driverRatingContent;
					}
				}
			}).catch((error) => {
				console.log(error)
			})
		},
		mounted () {
			
		},
		methods: {
			evaluateTrip () {
				console.log('去评价');
				this.$router.push({name: 'EvaluateTrip'});
			},
			watchEvaluate () {
				console.log('查看评价');
				this.bottomSheet3 = true;	// 打开评价弹出框
			},
			openbottomSheet1 () {
				this.bottomSheet1 = true;
			},
			openBottomSheet2 () {
				this.bottomSheet2 = true;
			},
			closebottomSheet1 () {
				this.bottomSheet1 = false;
			},
			closeBottomSheet2 () {
				this.bottomSheet2 = false;
			},
			closeBottomSheet3 () {
				this.bottomSheet3 = false;
			}
		}
	}
</script>

<style scoped>
	@import './css/costRule.css';
	.container{
		/* display: flex; */
		flex-wrap: wrap;
		margin: 0 auto;
		background: #fff
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
