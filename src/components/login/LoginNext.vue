<template>
	<div>
		<span @click="goHome"><logo id="logo" height="48px" ></logo></span>
		<div id="container">
			<mu-col width="100%" tablet="100" desktop="100">
				<label id="title">欢迎</label><br>
				<label id="info">{{info}}</label>
			</mu-col>
			<mu-col>
				<mu-text-field label="输入密码" type="password" labelFloat v-model="value_password" :errorText="errorText_password" :fullWidth="fullWidth" @focus="onFocusPassword"/>
			</mu-col>
			<mu-col style="margin: 24px 0">
				<label id="btn_left">忘记了密码？</label>
				<mu-raised-button label="完成" @click="haveDone"/>
			</mu-col>
		</div>
		<mu-dialog :open="dialog" title="错误提示">
			{{errorTips}}
			<mu-flat-button label="确定" slot="actions" primary @click="closeDialog"/>
		</mu-dialog>
	</div>
</template>

<script>

	import Logo from '../../assets/Logo'
	import { Toast } from 'vant'
	import checkFormat from './js/CheckFormat.js'

	export default {
		name: 'LoginNext',
		components: {
			Logo
		},
		data () {
			return {
				fullWidth: true,
				value_password: '',
				errorText_password: '',
				info: '',
				dialog: false,
				errorTips: '',
				ls_userinfo: ''
			}
		},
		created () {
			// console.log('读取LoginNext的token：'+ this.$store.state.token)
			// console.log(this.$route.path)
		},
		mounted (){
			// 当直接在地址栏输入 /login/2 时，重定向返回登录
			if (this.$route.params.username == '' || this.$route.params.username == null || this.$route.params.username == undefined ) {
				this.info = '请先选择账号！'
				const toast = Toast.loading({
					mask: true,
					duration: 0,	// 持续展示 toast
					forbidClick: true,	// 禁用背景点击
					message: '出现错误…'
				});
				let second = 1;
				const timer = setInterval(() => {
					second--;
					if (second == 0) {
						clearInterval(timer);
						Toast.clear();
						let redirect = decodeURIComponent(this.$route.query.redirect || '/login');
						this.$router.push({path: redirect})
					}
				}, 1000);
			} else {
				this.info = "使用账号 " + this.$route.params.username + " 登录"
			}
		},
		methods: {
			goHome () {
				this.$router.push({name: 'Home'});
			},
			haveDone () {
				let _this = this;
				_this.errorText_password = checkFormat.checkPassword(_this.value_password)
				if (_this.errorText_password == '') {
					_this.$axios.post("/api/auth/login", {
						// username: "d1", 
						// password: "d1"
						// username: "admin", 
						// password: "admin"
						username: _this.$route.params.username,
						password: _this.value_password
					})
					.then( (response) => {
						if (response.status == 200) {
							_this.$store.dispatch('login', response.data.data.token)

							// 判断是否为已认证车主
							_this.$axios.get('/api/auth/user')
							.then( (response) => {
								console.log(response);
								if (response.status == 200) {
									_this.$store.dispatch('userId', response.data.data.userId);
									_this.$store.dispatch('driverId', response.data.data.driverId);
									// JSON.stringify() 将JSON对象转化成字符串  
									window.localStorage.setItem('UserId' ,response.data.data.userId);
									window.localStorage.setItem('UserInfo' ,JSON.stringify(response.data.data));
									_this.ls_userinfo = response.data.data;
									if (_this.ls_userinfo.driverId == '' || _this.ls_userinfo.driverId == null || _this.ls_userinfo.driverId == undefined) {
										// 未认证，前往认证车主页面
										console.log('未认证车主');
										const toast = Toast.loading({
											duration: 0,
											forbidClick: true,
											message: '未通过车主认证！'
										});
										let second = 2;
										const timer = setInterval(() => {
											second--;
											if (second == 1) {
												toast.message = '前往认证…';
											} else {
												clearInterval(timer);
												Toast.clear();
												_this.$router.push({name: 'Authentication'})
											}
										}, 1000);
									} else {
										// 通过验证，前往首页
										const toast = Toast.loading({
											duration: 0,
											forbidClick: true,
											message: '登录成功…'
										});
										let second = 2;
										const timer = setInterval(() => {
											second--;
											if (second == 1) {
												toast.message = '前往首页…';
											} else {
												clearInterval(timer);
												Toast.clear();
												_this.$router.push({name: 'Home'})
											}
										}, 1000);
									}
								}
							})
							.catch ( (error) => {
								console.log(error);
							})
							// 结束
								


						}
					})
					.catch((error) => {
						console.log(error);
						if (error.status == 401) {
							_this.errorTips = '密码错误，请重新输入！';
							_this.dialog = true;
						}
						if (error.status == 500) {
							_this.errorTips = '服务器内部错误（' + error.status +'）';
							_this.dialog = true;
						}
					})
				} else {
					_this.errorText_password = checkFormat.checkPassword(_this.value_password)
				}
				
			},
			onFocusPassword () {
				this.errorText_password = ''
			},
			closeDialog () {
				this.dialog = false
			}
		}
	}
</script>

<style scoped>
	@import url(./css/login.css);
</style>
