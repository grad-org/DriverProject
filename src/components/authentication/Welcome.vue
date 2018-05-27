<template>
	<div>
		<mu-appbar ref="barDiv" title="成为快车车主" style="text-align: center; padding-left: -72px">
			<mu-icon-button icon="arrow_back" slot="left" @click="goBack"/>
			<mu-flat-button slot="right" style="width: 48px" disabled/> 
		</mu-appbar>
		<div ref="mainDiv" class="mainClass" :style="{height: mainHeight}" >
		<!-- <div ref="mainDiv" :style="{height: mainHeight}" :style="fullBackground"> -->
			<!-- {{fullHeight}}、{{barHeight}}、{{mainHeight}} -->
			<div class="btn-div-class">
				<button class="btn-class" @click="goApply">立即成为车主</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				// 高度控制
				fullHeight: document.documentElement.clientHeight,
				barHeight: null,
				mainHeight: null,
				// fullBackground: 'backgroundImage: url(' + require('../../assets/image/bg.jpg') + ')',
				// fullBackground: {
				// 	backgroundImage: 'url(' + require('../assets/image/bg.jpg') + ')',
				// 	backgroundRepeat: 'no-repeat',
				// 	backgroundSize: "100% auto",
				// },
			}
		},
		computed: {

		},
		created () {
			// console.log('22222',this.fullHeight);
			this.initHeight();
			this.setMainHeight();
		},
		mounted () {
			
		},
		methods: {
			// 返回
			goBack () {
				this.$store.dispatch('logout');
				this.$router.push({name: 'Login'});
			},
			goApply () {
				this.$router.push({name: 'Authentication'});
			},
			initHeight () {
				let _this = this;
				window.onresize = function () {
					return (() => {
						window.fullHeight = document.documentElement.clientHeight;
						_this.fullHeight = window.fullHeight;
						_this.barHeight = _this.$refs.barDiv.$el.clientHeight;
						_this.mainHeight = (_this.fullHeight - _this.barHeight) + 'px';
					}) ()
				}
			},
			setMainHeight () {
				this.$nextTick(() => {
					this.barHeight = this.$refs.barDiv.$el.clientHeight;
					this.mainHeight = (this.fullHeight - this.barHeight) + 'px';
				})
			}
		},
		watch: {
			fullHeight (val) {
				let _this = this;
				console.log(!_this.timer);
				if (!_this.timer) {
					_this.fullHeight = val;
					_this.timer = true;
					setTimeout(function () {
						_this.timer  = false;
					}, 400)
				}
			}
		}
	}
</script>

<style scoped>
	.mainClass {
		background-image: url(../../assets/image/welcome4.jpg);
		/* background-image: url(../../assets/image/welcome2.png); */
		background-repeat: no-repeat;
		/* background-position: left center; */
		/* 为了让Button基于Main区域相对定位 */
		background-size: cover;
		background-position: center bottom;
		position: relative;
	}
	.btn-div-class {
		width: 100%;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 30px;
		text-align: center;
	}
	.btn-class {
		width: auto;
		padding: 12px 28px;
		border-radius: 50px;
		font-size: 14px;
		background: #fff;
		color: #000;
		box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
		-webkit-box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
		-moz-box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
	}
</style>