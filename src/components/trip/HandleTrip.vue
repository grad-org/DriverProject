<template>
	<div>
		<mu-appbar ref="barDiv" :title="passengerLocationTitle" style="text-align: center" />
		<baidu-map-go ref="mapDiv" :style="{height: mapHeight}"></baidu-map-go>
		<go-selector ref="selectDiv"></go-selector>
	</div>
</template>

<script>

	import BaiduMapGo from '../map/BaiduMapGo'
	import GoSelector from '../selector/GoSelector'

	export default {
		components: {
			BaiduMapGo, GoSelector
		},
		data () {
			return {
				passengerLocationTitle: '前往接乘客...',

				// 首页组件高度控制
				fullHeight: document.documentElement.clientHeight,
				barHeight: '',
				selectHeight: '',
				mapHeight: ''
			}
		},
		created () {
			let ls_acceptedtrip = JSON.parse(window.localStorage.getItem('AcceptedTrip'));
			if (ls_acceptedtrip == null) {
				this.$router.push({name: 'Home'});
			} else if (ls_acceptedtrip.departure == '当前位置') {
				// 这种情况是，乘客发布行程时，起点无法识别具体一个位置名称
				this.passengerLocationTitle = '前往起点接乘客...'
			}
			else {
				this.passengerLocationTitle = '前往' + ls_acceptedtrip.departure + '...';
			};
			this.initHeight();
			this.setMapHeight();
		},
		mounted () {
			
		},
		methods: {
			initHeight () {
				let _this = this
				window.onresize = function () {
					return ( ()=> {
						// 浏览器内容可视高度
						window.fullHeight = document.documentElement.clientHeight;
						_this.fullHeight = window.fullHeight;
						_this.selectHeight = _this.$refs.selectDiv.$el.clientHeight;
						_this.mapHeight = (_this.fullHeight - _this.barHeight - _this.selectHeight) + 'px';
					}) ()
				}
			},
			setMapHeight () {
				this.$nextTick(() => {
					this.barHeight = this.$refs.barDiv.$el.clientHeight;
					this.selectHeight = this.$refs.selectDiv.$el.clientHeight;
					// 页面加载后，对地图高度进行设置
					let h = this.fullHeight - this.barHeight - this.selectHeight;
					// console.log('地图高度：' +h);
					this.mapHeight = h + 'px';
				})
			},
		},
		computed: {

		},
		watch: {
			// 如果 fullHeight 发生改变，这个函数就会运行
			fullHeight (val) {
				let _this = this
				if(!_this.timer) {
					_this.fullHeight = val
					_this.timer = true
					setTimeout(function () {
						_this.timer = false
					}, 1000)
				}
				// console.log("触发watch的fullHeight")
			}
		}
	}
</script>

<style scoped>
	
</style>