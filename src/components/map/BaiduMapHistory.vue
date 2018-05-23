<template>
	<!-- ready是组件加载完之后才能执行的代码 -->
	<baidu-map class="map" :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true"
		:mapStyle="{styleJson: styleJson}">
		<bm-marker :position="outsetPoint" 
			:icon="{url: require('../../svg/outset.svg'), size: {width: 20, height: 31}}" :offset="{width: 0, height: -14}">
		</bm-marker>
		<bm-marker :position="destinationPoint" 
			:icon="{url: require('../../svg/destination.svg'), size: {width: 20, height: 31}}" :offset="{width: 0, height: -14}">
		</bm-marker>
	</baidu-map>
	
</template>

<script>

	import MapStyle from './js/map-style.js'

	export default {
		data () {
			return {
				center: null,
				zoom: 10,
				styleJson: null,
				outsetPoint: {lng: 0, lat: 0},
				destinationPoint: {lng: 0, lat: 0},

				map: null,	// 指定map对象
				BMap: null,	// 指定BMap对象
			}
		},
		created () {
			
		},
		mounted () {
			
		},
		methods: {
			handler ({BMap, map}) {
				let _this = this;	// 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
				_this.styleJson = MapStyle.style();
				let ls_tripdetail = JSON.parse(window.localStorage.getItem('HistoryTripDetail'))
				_this.center = ls_tripdetail.departureLocation;
				_this.outsetPoint = ls_tripdetail.departureLocation;
				_this.destinationPoint = ls_tripdetail.destinationLocation;
			}
		}
	}
</script>


<style>
	/* 地图容器必须设置宽和高属性 */
	.map {
		width: 100%;
		height: 300px;
	}
</style>