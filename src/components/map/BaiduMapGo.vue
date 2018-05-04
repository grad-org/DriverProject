<template>
	<!-- ready是组件加载完之后才能执行的代码 -->
	<baidu-map class="map" :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true"
		:mapStyle="{styleJson: styleJson}">
		<!-- 其中bm-geolocation中的locationIcon属性要加上“:”，否则会报错！ -->
		<bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="false" :autoLocation="false"
			:locationIcon="{url: require('../../svg/location.svg'), size: {width: 18, height: 18}}" 
			@locationSuccess="getLoctionSuccess" @locationError="getLocationError">
		</bm-geolocation>
		<bm-control anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :offset="{width: 54, height: 28}" v-show="seen">
			<!-- <button >缩放至最大</button> -->
			<mu-raised-button label="移动" class="raised-button" @click="startBtn" v-if="!play"/>
			<mu-raised-button label="暂停" class="raised-button" @click="pauseBtn" v-else/>
		</bm-control>
		<!-- 自动定位覆盖物 -->
		<bm-marker :position="autoLocationPoint"
			:icon="{url: require('../../svg/location.svg'), size: {width: 18, height: 18}}" v-if="initLocation">
		</bm-marker>
		<bml-lushu
			@stop = "stopLS"
			:path = "path"
			:icon = "icon"
			:play = "play"
			:autoView = "true"
			:speed = "speed"
			:rotation = "true">
		</bml-lushu>
		<!-- <bm-marker :position="outsetPoint" 
			:icon="{url: require('../../svg/outset.svg'), size: {width: 20, height: 31}}" :offset="{width: 0, height: -14}">
		</bm-marker>
		<bm-marker :position="destinationPoint" 
			:icon="{url: require('../../svg/destination.svg'), size: {width: 20, height: 31}}" :offset="{width: 0, height: -14}">
		</bm-marker> -->
	</baidu-map>
	
</template>


<script>
	// http://api.map.baidu.com/library/LuShu/1.2/src/LuShu_min.js
	// http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js
	import MapStyle from './js/map-style.js'
	import SockJS from '../../../static/utils/sockjs.js'
	import Stomp from 'stompjs'
	import {BmlLushu} from 'vue-baidu-map'

	export default {
		components: {
			BmlLushu
		},
		data () {
			return {
				center: null,
				zoom: 12,
				styleJson: null,

				map: null,	// 指定map对象
				BMap: null,	// 指定BMap对象
				initLocation: false,
				ls_outset: null,
				ls_acceptedtrip: null,

				seen: false,
				// 用于创建连接
				stompClient: Stomp.over(new SockJS('http://online-ride-hailing.herokuapp.com/orh')),

				// 路书
				play: false,
				path: [],
				speed: 5,	// 覆盖物移动速度，单位米/秒 
				icon: {
					url: require('../../assets/image/car.png'),
					size: {width: 52, height: 26},
					opts: {anchor: {width: 27, height:13}}
				}
			}
		},
		created () {
			// this.center = this.$store.state.currentCity
			this.styleJson = MapStyle.style();
			this.ls_acceptedtrip = JSON.parse(window.localStorage.getItem('AcceptedTrip'));
			let token = window.localStorage.getItem('Token')
			this.stompClient.connect(
				// headers
				{'Auth-Token': token},
				function connectCallback (frame) {
					console.log('连接成功')
				},
				function errorCallback (error) {
					console.log('连接失败', error);
				}
			)
		},
		mounted () {
		},
		methods: {
			handler ({BMap, map}) {
				console.log(BMap)
				let _this = this;	// 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
				let _map = map;
				_this.map = map;	// 创建map对象，然后赋给map属性，以方便在别的方法使用，下同
				_this.BMap = BMap;

				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r) {
					_this.center = {lng: parseFloat(r.longitude), lat: parseFloat(r.latitude)};		// 设置center属性值
					_this.autoLocationPoint = {lng: parseFloat(r.longitude), lat: parseFloat(r.latitude)};		// 自定义覆盖物
					const timer = setTimeout(function() {
						_this.centerIconPoint = {lng: parseFloat(r.longitude), lat: parseFloat(r.latitude)};		// 地图中心覆盖物
					}, 500);
					_this.initLocation = true;

					// 获取位置后，推送司机位置给乘客
					// _this.stompClient.send('/api/queue/hailingService/car/uploadCarLocation/' + _this.ls_acceptedtrip)

					// 从司机的位置，前往起点
					let myLocation1 = new BMap.Point(parseFloat(r.longitude), parseFloat(r.latitude));
					let passengerLocation1 = new BMap.Point(_this.ls_acceptedtrip.departureLocation.lng, _this.ls_acceptedtrip.departureLocation.lat);
					//三种驾车策略：最少时间，最短距离，避开高速，而采用的默认策略是：最少时间
					var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME, BMAP_DRIVING_POLICY_LEAST_DISTANCE, BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];
					// 检索完成后的回调函数
					var searchComplete = function (results) {
						console.log('驾车路线返回', results)
						if (transit.getStatus() == BMAP_STATUS_SUCCESS) {
							let plan = results.getPlan(0);
							let arrPois = [];
							console.log('里程：', plan.getDistance(false), '米')	
							console.log('用时：', plan.getDuration(false), '秒')	
							// 里程信息
							let distance = (plan.getDistance(false)/1000).toFixed(1);	// false返回数值，单位米；true返回字符串
							let duration = (plan.getDuration(false)/60).toFixed(0);		// false返回数值，单位秒；true返回字符串
							_this.$store.dispatch('allowInformPassenger', true);
							_this.speed = plan.getDuration(false);
							// _this.speed = plan.getDistance(false)/plan.getDuration(false);	// 实际速度，speed单位：米/秒
							console.log(_this.speed)
							_this.path = results.getPlan(0).getRoute(0).getPath()
							// 按钮可见
							_this.seen = true;
							// 
							// for (let j = 0; j < plan.getNumRoutes(); j++) {
							// 	let route = plan.getRoute(j);
							// 	arrPois = arrPois.concat(route.getPath());
							// }
							// map.addOverlay(new BMap.Polyline(arrPois, {storkeColor: '#111'}));
							// map.setViewport(arrPois);
							// 路书
							// var lushu = new BMapLib.LuShu(map, arrPois, {
							// 	defaultContext: '',	// "从天安门到百度大厦"
							// 	autoView: true,		// 是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
							// 	icon: new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/car.png', new BMap.Size(52,26),{anchor : new BMap.Size(27, 13)}),
							// 	speed: 4500,
							// 	enableRotation: true,	// 是否设置marker随着道路的走向进行旋转
							// 	landmarkPois: []
							// })

						}
					}
					var transit = new BMap.DrivingRoute(
						map,
						{
							renderOptions: {map: map},	// 结果呈现设置，当前地图实例
							onSearchComplete: searchComplete,	// 检索完成后的回调函数。参数result
						}
					);
					transit.setPolicy(routePolicy[0]);	// 设置线路搜索策略，时间最少
					transit.search(myLocation1,passengerLocation1);


				}, {enableHighAccuracy: true})
			},
			// 路书，移动和暂停
			startBtn () {
				this.startLS();
			},
			pauseBtn () {
				this.stopLS();
			},
			startLS () {
				this.play = true;
			},
			stopLS () {
				this.play = false;
			},
			getLoctionSuccess (result) {
				console.log('result');
				_this.initLocation = false;
			},
			getLocationError () {
				alert("获取位置失败，请重试！")
			},
			closeSubscribe () {
				if (true) {

				}
			},
			closeConnect () {
				this.stompClient.disconnect();
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
	.raised-button {
		width: 50%
	}
</style>