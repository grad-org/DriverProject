<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
	import SocketIO from '../static/utils/socket.io.js'
	export default {
		name: 'App',
		sockets: {
			connect: function () {
				console.log('WebSocket连接成功了，ID是：', this.$socket.id);
			}
		}
	}
</script>

<style>

</style>
