<template>
	<div>
		<span><svg :fill="starColor1" viewBox="0 0 32 32" class="van-rate__item" style="width: 20px;"><path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path></svg></span>
		<span><svg :fill="starColor2" viewBox="0 0 32 32" class="van-rate__item" style="width: 20px;"><path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path></svg></span>
		<span><svg :fill="starColor3" viewBox="0 0 32 32" class="van-rate__item" style="width: 20px;"><path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path></svg></span>
		<span><svg :fill="starColor4" viewBox="0 0 32 32" class="van-rate__item" style="width: 20px;"><path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path></svg></span>
		<span><svg :fill="starColor5" viewBox="0 0 32 32" class="van-rate__item" style="width: 20px;"><path d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z"></path></svg></span>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				score: 5,		// 评分
				content: null,	// 评价
				starColor1: '#ffd21e',
				starColor2: '#ffd21e',
				starColor3: '#ffd21e',
				starColor4: '#ffd21e',
				starColor5: '#ffd21e',
			}
		},
		created () {
			let ls_trip = JSON.parse(window.localStorage.getItem('HistoryTripDetail'));
			this.score = ls_trip.driverRatingScore;
			switch (this.score) {
				case 0:
					this.starColor1 = '#c7c7c7';
					this.starColor2 = '#c7c7c7';
					this.starColor3 = '#c7c7c7';
					this.starColor4 = '#c7c7c7';
					this.starColor5 = '#c7c7c7';
					break;
				case 1:
					this.starColor1 = '#ffd21e';
					this.starColor2 = '#c7c7c7';
					this.starColor3 = '#c7c7c7';
					this.starColor4 = '#c7c7c7';
					this.starColor5 = '#c7c7c7';
					break;
				case 2:
					this.starColor1 = '#ffd21e';
					this.starColor2 = '#ffd21e';
					this.starColor3 = '#c7c7c7';
					this.starColor4 = '#c7c7c7';
					this.starColor5 = '#c7c7c7';
					break;
				case 3:
					this.starColor1 = '#ffd21e';
					this.starColor2 = '#ffd21e';
					this.starColor3 = '#ffd21e';
					this.starColor4 = '#c7c7c7';
					this.starColor5 = '#c7c7c7';
					break;
				case 4:
					this.starColor1 = '#ffd21e';
					this.starColor2 = '#ffd21e';
					this.starColor3 = '#ffd21e';
					this.starColor4 = '#ffd21e';
					this.starColor5 = '#c7c7c7';
					break;
				case 5:
					this.starColor1 = '#ffd21e';
					this.starColor2 = '#ffd21e';
					this.starColor3 = '#ffd21e';
					this.starColor4 = '#ffd21e';
					this.starColor5 = '#ffd21e';
					break;
				default:
					break;
			}
		},
		mounted () {

		},
		methods: {

		}
	}
</script>

<style scoped>
	
</style>