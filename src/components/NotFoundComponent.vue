<template>
	<div style="height: 300px; ">
		<h1>Page Not Found，404！</h1>
		<mu-raised-button label="返回首页" class="demo-raised-button" @click="goHome"/>
	</div>
</template>

<script>
	export default {
		data () {
			return {

			}
		},
		methods: {
			goHome () {
				this.$router.push({name: 'Home'})
			}
		}
	}
</script>

<style scoped>
	* {
		text-align: center;
	}
</style>


