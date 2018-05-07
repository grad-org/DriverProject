<template>
	<div>
		<mu-appbar ref="barDiv" title="行车中" style="text-align: center">
		</mu-appbar>
		<baidu-map-driving ref="mapDiv" :style="{height: mapHeight}"></baidu-map-driving>
		<driving-selector ref="selectDiv"></driving-selector>
	</div>
</template>

<script>

	import BaiduMapDriving from '../map/BaiduMapDriving'
	import DrivingSelector from '../selector/DrivingSelector'

	export default {
		components: {
			BaiduMapDriving, DrivingSelector
		},
		data () {
			return {
				// 组件高度控制
				fullHeight: document.documentElement.clientHeight,
				barHeight: '',
				selectHeight: '',
				mapHeight: '',
			}
		},
		created () {

		},
		mounted () {
			this.initHeight();
			this.setMapHeight();
		},
		methods: {
			goHome () {
				this.$router.push({name: 'Home'})
			},
			initHeight () {
				let _this = this
				window.onresize = function () {
					return ( ()=> {
						// 浏览器内容可视高度
						window.fullHeight = document.documentElement.clientHeight
						_this.fullHeight = window.fullHeight
						_this.selectHeight = _this.$refs.selectDiv.$el.clientHeight
						// console.log('触发onresize事件，此时地图高度为：' + this.fullHeight)
						_this.mapHeight = (_this.fullHeight - _this.barHeight - _this.selectHeight) + 'px'
					}) ()
				}
			},
			setMapHeight () {
				this.$nextTick (() => {
					this.barHeight = this.$refs.barDiv.$el.clientHeight;
					this.selectHeight = this.$refs.selectDiv.$el.clientHeight;
					// 页面加载后，对地图高度进行设置
					let h = this.fullHeight - this.barHeight - this.selectHeight;
					// console.log('地图高度：' +h)
					this.mapHeight = h + 'px';
				})
			},
		},
		computed: {

		},
		watch: {
			// 如果 fullHeight 发生改变，这个函数就会运行
			fullHeight (val) {
				if(!this.timer) {
					this.fullHeight = val
					this.timer = true
					let that = this
					setTimeout(function () {
						that.timer = false
					}, 1000)
				}
			}
		}
	}
</script>

<style scoped>

</style>