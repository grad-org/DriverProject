<template>
	<div style="text-align: center; padding: 12px">
		<mu-raised-button label="返回首页" primary @click="goHome"></mu-raised-button>
		&nbsp;&nbsp;&nbsp;
		<mu-raised-button label="乘客上车" primary @click="imformPassenger"></mu-raised-button>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				ls_duration: null,
				ls_distance: null,
				tmp: null,
				btn_disable: true,
			}
		},
		created () {
			this.tmp = this.$store.state.allowInformPassenger;
		},
		mounted () {

		},
		methods: {
			goHome () {
				this.$router.push({name: 'Home'})
				window.localStorage.removeItem('AcceptTrip');
			},
			imformPassenger () {
				let trip = JSON.parse(window.localStorage.getItem('AcceptedTrip'))
				console.log(trip.tripOrderId);
				this.$axios.post('/api/hailingService/tripOrder/pickUpPassenger', {
					tripOrderId: trip.tripOrderId
				}).then ((response) => {
					console.log(response);
					window.localStorage.removeItem('AcceptedTrip');	// 删除接单信息缓存
					window.localStorage.setItem('ProcessingTrip', JSON.stringify(response.data.data));	
					this.$router.push({name: 'CarDriving'});
				}).catch ((error) => {
					console.log(error);
					if (error.status == 404) {
						alert('当前行程订单不存在！')
					}
					if (error.status == 400) {
						alert('乘客已上车')
					}
				})
			}
		},
		computed: {

		}
	}
</script>

<style scoped>
	
</style>