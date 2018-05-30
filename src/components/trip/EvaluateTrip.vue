<template>
	<div>
		<mu-appbar ref="barDiv" title="评价服务" style="text-align: center;">
			<mu-icon-button icon="arrow_back" slot="left" @click="goBack"/>
			<mu-flat-button slot="right" style="width: 48px" disabled/>
		</mu-appbar>
		<div>
			<div class="block_title">
				服务评分
			</div>
			<van-cell-group>
				<div class="van-rate">
					<span @click="star1"><svg :fill="starColor1" viewBox="0 0 32 32" class="van-rate__item" style="width: 24px;"><path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path></svg></span>
					<span @click="star2"><svg :fill="starColor2" viewBox="0 0 32 32" class="van-rate__item" style="width: 24px;"><path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path></svg></span>
					<span @click="star3"><svg :fill="starColor3" viewBox="0 0 32 32" class="van-rate__item" style="width: 24px;"><path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path></svg></span>
					<span @click="star4"><svg :fill="starColor4" viewBox="0 0 32 32" class="van-rate__item" style="width: 24px;"><path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path></svg></span>
					<span @click="star5"><svg :fill="starColor5" viewBox="0 0 32 32" class="van-rate__item" style="width: 24px;"><path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path></svg></span>
				</div>
			</van-cell-group>
			<div class="block_title">
				评价内容
			</div>
			<van-cell-group>
				<van-field
					v-model="content"
					type="textarea"
					placeholder="例如乘客比较耐心，容易沟通。"
					row="6"
				/>
			</van-cell-group>
			<div class="block_title">
			</div>
			<div style="float: right; margin-right: 15px">
				<mu-raised-button label="确定" class="raised-button" primary @click="submitEvaluate"/>
				<!-- <van-button size="normal" style="background: #2196f3; color: #fff">&nbsp;&nbsp;确定&nbsp;&nbsp;</van-button> -->
			</div>
		</div>
	</div>
</template>

<script>

	// import RateActive from '../../svg/rateActive.svg'
	import { Toast } from 'vant';

	export default {
		data () {
			return {
				score: 3,		// 评分
				content: null,	// 评价
				starColor1: '#ffd21e',
				starColor2: '#ffd21e',
				starColor3: '#ffd21e',
				starColor4: '#c7c7c7',
				starColor5: '#c7c7c7',
			}
		},
		computed: {

		},
		created () {

		},
		mounted () {
			
		},
		methods: {
			goBack () {
				this.$router.go(-1);
				// this.$router.push({name: 'TripDetail'});
			},
			submitEvaluate () {
				let ls = JSON.parse(window.localStorage.getItem('HistoryTripDetail'));
				let serviceRatingId = ls.serviceRatingId;
				let tripOrderId = ls.tripOrderId;
				// console.log(serviceRatingId);
				// console.log(this.score);
				// console.log(this.content);
				this.$axios.post('/api/serviceRating/ratePassenger', {
					serviceRatingId: serviceRatingId,
					passengerRatingScore: this.score,
					passengerRatingContent: this.content
				}).then((response) => {
					console.log('评价返回数据：', response);
					if (response.status == 200) {
						Toast('评价成功！');
						// 更新获取行程信息
						this.$axios.get('/api/tripOrder/' + tripOrderId).then((response) => {
							console.log('获取行程信息返回：', response);
							if (response.status == 200) {
								let data = response.data.data;
								window.localStorage.setItem('HistoryTripDetail', JSON.stringify(data));
								this.$router.go(-1);
							}
						}).catch((error) => {
							console.log('获取行程信息失败：', error);
							this.$router.go(-1);
						})
						
					}
				}).catch((error) => {
					console.log('评价失败返回', error);
					Toast('评价失败！');
				})
			},
			star1 () {
				console.log('1星');
				this.score = 1;
				console.log('评价：', this.score);
				this.starColor1 = '#ffd21e';
				this.starColor2 = '#c7c7c7';
				this.starColor3 = '#c7c7c7';
				this.starColor4 = '#c7c7c7';
				this.starColor5 = '#c7c7c7';
			},
			star2 () {
				console.log('2星');
				this.score = 2;
				console.log('评价：', this.score);
				this.starColor1 = '#ffd21e';
				this.starColor2 = '#ffd21e';
				this.starColor3 = '#c7c7c7';
				this.starColor4 = '#c7c7c7';
				this.starColor5 = '#c7c7c7';
			},
			star3 () {
				console.log('3星');
				this.score = 3;
				console.log('评价：', this.score);
				this.starColor1 = '#ffd21e';
				this.starColor2 = '#ffd21e';
				this.starColor3 = '#ffd21e';
				this.starColor4 = '#c7c7c7';
				this.starColor5 = '#c7c7c7';
			},
			star4 () {
				console.log('4星');
				this.score = 4;
				console.log('评价：', this.score);
				this.starColor1 = '#ffd21e';
				this.starColor2 = '#ffd21e';
				this.starColor3 = '#ffd21e';
				this.starColor4 = '#ffd21e';
				this.starColor5 = '#c7c7c7';
			},
			star5 () {
				console.log('5星');
				this.score = 5;
				console.log('评价：', this.score);
				this.starColor1 = '#ffd21e';
				this.starColor2 = '#ffd21e';
				this.starColor3 = '#ffd21e';
				this.starColor4 = '#ffd21e';
				this.starColor5 = '#ffd21e';
			},
		}
	}
</script>

<style scoped>
	@import '../user/css/vant-style.css';
	.van-rate {
		margin-left: 15px;
		height: 45px;
		line-height: 56px;
	}
	.van-rate__item {
		padding: 0 2px;
		display: inline-block;
		box-sizing: content-box;
	}
	.raised-button {
		margin: 12px 0;
	}
</style>