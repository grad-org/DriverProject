<template>
		<div ref="selectorDiv" class="container">
			<mu-row gutter style="text-align: center; align-items:center">
				<!-- 其中width指百分百 -->
				<mu-col width="40" tablet="33" desktop="33">
					<span>{{carPlateNo}}</span>
					<span>{{carColor}}{{carBrand}}{{carSeries}}</span>
				</mu-col>
				<mu-col width="20" tablet="34" desktop="33">
					<mu-paper class="paper" circle :zDepth="1" >
						<img :src="avater" style="width: 100%; height: 100%"/>
					</mu-paper>
				</mu-col>
				<mu-col width="40" tablet="33" desktop="33">
					<span>{{driverName}}</span>
					<span>{{driverEvaluate}}</span>
				</mu-col>
			</mu-row>
			<mu-divider shallowInset />
			<mu-row gutter style="text-align: center; align-items:center">
				<!-- 其中width指百分百 -->
				<mu-col width="33" tablet="33" desktop="33">
					<mu-flat-button label="打电话" class="flat-button"/>
				</mu-col>
				<mu-col width="34" tablet="34" desktop="33">
					<mu-flat-button label="发消息" class="flat-button"/>
				</mu-col>
				<mu-col width="33" tablet="33" desktop="33">
					<mu-flat-button label="取消订单" class="flat-button" @click="cancelOrder"/>
				</mu-col>
			</mu-row>
		</div>
</template>

<script>

	/**
	 * 仍需解决问题：车主头像，现阶段是采用本地头像
	 * 高度不固定div，内容垂直居中：https://zhidao.baidu.com/question/717236354301077285.html
	 */

	import { Toast } from 'vant'
	import avater from '../../assets/image/avater.jpg'

	export default {
		data () {
			return {
				disable: false,
				selectorHeight: '',

				// 车信息
				carBrand: null,		// 品牌
				carSeries: null,	// 系列
				carColor: null,		// 车身颜色
				carPlateNo: null,	// 车牌号码

				// 车主信息
				avater: avater,		// 头像
				driverName: null,	// 车主名字
				driverEvaluate: '评分：4.0'	// 车主评分
			}
		},
		created () {
			let _this = this;
			let ls_tripinfo = JSON.parse(window.localStorage.getItem('T1')) ;

			// 获取车主相关
			// _this.$axios.get('/api/driver/2')
			// .then((response) => {
			// 	console.log(response);
			// 	// 车辆信息
			// 	_this.carBrand = response.data.data.carDTO.brand;
			// 	_this.carSeries = response.data.data.carDTO.series;
			// 	_this.carColor = response.data.data.carDTO.color + ' • ';
			// 	_this.carPlateNo = response.data.data.carDTO.plateNo;
			// 	// 车主信息
			// 	_this.driverName = response.data.data.drivingLicenseDTO.driverName.substr(0,1) + '师傅';
			// 	window.localStorage.setItem('DriverInfo', JSON.stringify(response.data.data))
			// })
			// .catch((error) => {
			// 	_this.carBrand = '品牌未知?';
			// 	_this.carSeries = '';
			// 	_this.carColor = '颜色? ';
			// 	_this.carPlateNo = '车牌未知';
			// 	console.log(error);
			// })

			// 从订单数据里获取车辆品牌、司机信息
			if (ls_tripinfo.brand == null) {
				_this.carBrand = '品牌未知?';
			} else {
				_this.carBrand = ls_tripinfo.brand;
			}
			// 品牌系列
			if (ls_tripinfo.series == null) {
				_this.carSeries = '';
			} else {
				_this.carSeries = ls_tripinfo.series;
			}
			// 车身颜色
			if (ls_tripinfo.color == null) {
				_this.carColor = '颜色? ';
			} else {
				_this.carColor = ls_tripinfo.color;
			}
			// 车牌号码
			if (ls_tripinfo.plateNo == null) {
				_this.carPlateNo = '车牌未知!';
			} else {
				_this.carPlateNo = ls_tripinfo.plateNo;
			}
			// 司机Username
			if (ls_tripinfo.driverName == null) {
				_this.driverName = '司机师傅';
			} else {
				_this.driverName = ls_tripinfo.driverName;
			}
			
		},
		mounted () {
			
		},
		methods: {
			cancelOrder () {
				console.log('取消订单，暂无实现！');
				this.$router.push({name: 'Home'});
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
