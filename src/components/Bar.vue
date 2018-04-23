
<template>
	<div>
		<mu-drawer :width="width" :zDepth="zDepth" :open="open_drawer" :docked="docked" @close="toggle()">
			<div class="user-info" :style="userBackground">
				<mu-paper class="paper" circle :zDepth="2" >
					<img :src="avater" style="width: 100%; height: 100%"/>
				</mu-paper>
				<mu-list-item title="Frankie" describeText="13432862054" >
					<mu-icon value="info" slot="right" color="#333"/>
				</mu-list-item>
			</div>
			<mu-list>
				<mu-list-item title="行程" rightIcon="keyboard_arrow_right">
					<mu-icon slot="left" value="local_taxi" />
				</mu-list-item>
				<mu-list-item title="钱包">
					<mu-icon slot="left" value="account_balance_wallet" />
				</mu-list-item>
				<mu-list-item title="设置">
					<mu-icon slot="left" value="settings" />
				</mu-list-item>
				<mu-list-item title="客服">
					<mu-icon slot="left" value="live_help"/>
				</mu-list-item>
				<mu-list-item title="退出" @click="logout">
					<mu-icon slot="left" value="close"/>
				</mu-list-item>
			</mu-list>
		</mu-drawer>
		<!-- 顶栏区域 -->
		<mu-appbar ref="barDiv" title="蔚蓝出行(司机端)">
			<mu-icon-button icon="menu" slot="left" @click="toggle(true)"/>
			<mu-flat-button color="#fff" :label="selectedCity" slot="right"/>
			<mu-icon-button icon="notifications" slot="right"></mu-icon-button>
		</mu-appbar>
	</div>
</template>

<script>

	import { Toast } from 'vant'
	import avater from '../assets/image/avater.jpg'

	export default {
		data() {
			return {
				// Drawer
				open_drawer: false,
				docked: true,
				zDepth: 0,
				width: "60%",
				// avater
				avater: avater,
				userBackground: {
					backgroundImage: 'url(' + require('../assets/image/bg.jpg') + ')',
					backgroundRepeat: "no-repeat",
					backgroundSize: "100% auto",
				},
				ls_userinfo: ''
			}
		},
		created () {
			let _this = this;
			let ls_token = window.localStorage.getItem('Token');
			_this.ls_userinfo = JSON.parse(window.localStorage.getItem('UserInfo'))

			// 获取用户信息
			if (_this.ls_userinfo == null || _this.ls_userinfo == undefined || _this.ls_userinfo == '') {
				// 本地没有数据时发起get请求，获取数据
				_this.$axios.get('/api/auth/user')
				.then( (response) => {
					console.log(response);
					if (response.status == 200) {
						_this.$store.dispatch('userId', response.data.data.id);
						// JSON.stringify() 将JSON对象转化成字符串  
						window.localStorage.setItem('UserInfo' ,JSON.stringify(response.data.data));
					}
				})
				.catch ( (error) => {
					console.log(error);
				})
				// 根据用户ID获取用户头像
				_this.$axios.get('/images/user/' + _this.$store.state.userId + '.jpg')
				.then( (response) => {
					// console.log(response)
					if (response.status == 200) {
						this.avater = 'http://forcar.vip:8080/images/user/' + _this.$store.state.userId + '.jpg'
						// _this.avater = 'http://forcar.vip:8080/images/user/2.jpg'
					}
				})
				.catch( (error) => {
					// console.log(error)
					_this.avater = avater
				})
			} else {
				// localstorage已存在本地信息，不需要再发起http请求
				// 本地缓存图片的方法还没实现，暂时头像统一采用默认头像
				_this.nickname = _this.ls_userinfo.nickname;
				_this.username = _this.ls_userinfo.username;
				_this.avater = avater;
			}
		},
		mounted() {
			
		},
		computed: {
			selectedCity () {
				return this.$store.state.currentCity
			}
		},
		methods: {
			toggle(flag) {
				this.open_drawer = !this.open_drawer;
				this.docked = !flag;
			},
			logout() {
				this.open_drawer = false;
				this.$store.dispatch('logout');
				const toast = Toast.loading({
					duration: 0,
					forbidClick: true,
					message: '退出登录…'
				});
					let second = 2;
					const timer = setInterval(() => {
						second--;
						if (second == 1) {
							toast.message = '退出登录…';
						} else {
							clearInterval(timer);
							Toast.clear();
							this.$router.push({name: 'Login'});
						}
				}, 1000);
			},
		}
	}
</script>

<style scoped>
	.user-info {
		width: 100%; 
		height: auto;
		background: #e0e0e0;
	}
	.mu-list {
		/* 默认padding为8px */
		padding: 0;
	}
	.paper {
		display: inline-block;
		height: 60px;
		width: 60px;
		margin: 16px 0 2px 16px;
		text-align: center;
		overflow: hidden;
	}

</style>


