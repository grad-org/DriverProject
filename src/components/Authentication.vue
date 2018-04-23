<template>
	<div class="authentication">
		<h1>车主认证</h1>
		<mu-raised-button label="退出登录" @click="logout"/>
	</div>
</template>

<script>
	export default {
		data () {
			return {

			}
		},
		methods: {
			logout () {
				this.$store.dispatch('logout');
				this.$router.push({name: 'Login'});
			}
		}
	}
</script>

<style scoped>
	.authentication {
		height: 100px;
	}
</style>
