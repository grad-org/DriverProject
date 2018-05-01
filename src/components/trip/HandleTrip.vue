<template>
	<div style="text-align: center">
		<h1>司机接受订单</h1>
		<mu-raised-button label="返回首页" primary @click="goHome"></mu-raised-button>
	</div>
</template>

<script>
	export default {
		data () {
			return {

			}
		},
		created () {
			let ls_acceptedtrip = window.localStorage.getItem('AcceptedTrip');
			if (ls_acceptedtrip == null) {
				this.$router.push({name: 'Home'})
			}
		},
		mounted () {
			
		},
		methods: {
			goHome () {
				this.$router.push({name: 'Home'})
			}
		},
		computed: {

		}
	}
</script>

<style scoped>
	
</style>