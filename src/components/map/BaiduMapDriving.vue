<template>
	<!-- ready是组件加载完之后才能执行的代码 -->
	<baidu-map class="map" :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true"
		:mapStyle="{styleJson: styleJson}">
		<!-- 其中bm-geolocation中的locationIcon属性要加上“:”，否则会报错！ -->
		<bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="false" :autoLocation="false"
			:locationIcon="{url: require('../../svg/location.svg'), size: {width: 18, height: 18}}" 
			@locationSuccess="getLoctionSuccess" @locationError="getLocationError">
		</bm-geolocation>
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
				zoom: 12,
				styleJson: null,
				outsetPoint: {lng: 0, lat: 0},
				destinationPoint: {lng: 0, lat: 0},

				map: null,	// 指定map对象
				BMap: null,	// 指定BMap对象
				ls_outset: null,
			}
		},
		created () {
			// this.center = this.$store.state.currentCity
			this.styleJson = MapStyle.style();
			this.ls_outset = JSON.parse(window.localStorage.getItem('Outset'))
			this.ls_destination = JSON.parse(window.localStorage.getItem('Destination'))
			this.center = this.ls_outset.point;
			this.outsetPoint = this.ls_outset.point;
			this.destinationPoint = this.ls_destination.point;
		},
		mounted () {
			
		},
		methods: {
			handler ({BMap, map}) {
				let _this = this;	// 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
				let _map = map;
				_this.map = map;	// 创建map对象，然后赋给map属性，以方便在别的方法使用，下同
				_this.BMap = BMap;

				// 驾车线路类：http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference.html#a7b16
				let outset1 = new BMap.Point(_this.outsetPoint.lng, _this.outsetPoint.lat);
				let destination1 = new BMap.Point(_this.destinationPoint.lng, _this.destinationPoint.lat);
				//三种驾车策略：最少时间，最短距离，避开高速，而采用的默认策略是：最少时间
				var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME, BMAP_DRIVING_POLICY_LEAST_DISTANCE, BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];
				// 检索完成后的回调函数
				var searchComplete = function (results) {
					console.log('驾车路线返回', results)
					let plan = results.getPlan(0);
					console.log('里程：', plan.getDistance(false), '米')	// false返回数值，单位米；true返回字符串
					console.log('用时：', plan.getDuration(false), '秒')	// false返回数值，单位秒；true返回字符串
					let distance = (plan.getDistance(false)/1000).toFixed(1);
					let duration = (plan.getDuration(false)/60).toFixed(0);
					window.localStorage.setItem('TripDistance', distance);
					window.localStorage.setItem('TripDuration', duration);
					_this.$axios.get('/api/fare/predictFare?lengthOfMileage=' + distance + '&lengthOfTime=' + duration)
					.then((response) => {
						// console.log(response)
						// window.localStorage.setItem('TripPredictFare', JSON.stringify(response.data.data.totalCost));
						let d1 = response.data.data;
						_this.$store.dispatch('predictFare', {fareRuleId: d1.fareRuleDTO.fareRuleId, mileage: d1.lengthOfMileage, duration: d1.lengthOfTime, totalCost: d1.totalCost})
					})
					.catch((error) => {
						console.log(error)
						if (error.status == 400) {
							_this.tripFare = false;
						}
					})
				};

				var polylineComplete = function (routes) {
					
				};
				var transit = new BMap.DrivingRoute(
					map,	// 表示检索区域，类型可为地图实例
					{
						renderOptions: {map: map},	// 结果呈现设置，当前地图实例
						policy: routePolicy[0],		// 驾车策略，时间最少
						onSearchComplete: searchComplete,	// 检索完成后的回调函数。参数result
						// onPolylinesSet: polylineComplete,	// 折线添加完成后的回调函数。参数： routes: Array
						onMarkersSet:function(routes) {
							map.removeOverlay(routes[0].marker);	//删除起点
							map.removeOverlay(routes[1].marker);	//删除终点
						}
					}
				);
				transit.search(outset1,destination1);
			},
			getLoctionSuccess (result) {
				console.log('result');
			},
			getLocationError () {
				alert("获取位置失败，请重试！")
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