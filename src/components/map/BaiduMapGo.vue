<template>
	<!-- ready是组件加载完之后才能执行的代码 -->
	<baidu-map class="map" :center="center" :zoom="zoom" @ready="handler" :scroll-wheel-zoom="true"
		:mapStyle="{styleJson: styleJson}">
		<!-- 其中bm-geolocation中的locationIcon属性要加上“:”，否则会报错！ -->
		<bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="false" :autoLocation="false"
			:locationIcon="{url: require('../../svg/location.svg'), size: {width: 18, height: 18}}" 
			@locationSuccess="getLoctionSuccess" @locationError="getLocationError">
		</bm-geolocation>
		<bm-control anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :offset="{width: 54, height: 28}" v-show="btn_seen">
			<mu-raised-button label="移动" class="raised-button" @click="startBtn" v-if="!play"/>
			<mu-raised-button label="暂停" class="raised-button" @click="pauseBtn" v-else/>
		</bm-control>
		<!-- 自动定位覆盖物 -->
		<bm-marker :position="autoLocationPoint"
			:icon="{url: require('../../svg/location.svg'), size: {width: 18, height: 18}}" v-if="initLocation">
		</bm-marker>
		<!-- 通知控件 -->
		<bm-control style="width: 100%" anchor="BMAP_ANCHOR_TOP_LEFT" :offset="{width: 0, height: 0}"  v-show="seen">
			<van-notice-bar  mode="closeable" :scrollable="true"  background="rgba(0,0,0, 0.4)" color="#fff">
				<!-- 调试用：上赛季半决赛上恒大以两回合5-3的总比分淘汰富力。 -->
				{{noticeContent}}
				<!-- <span style="color: #fff">{{noticeContent}}</span> -->
			</van-notice-bar>
		</bm-control>
		<bml-lushu
			@stop = "stopLS"
			:path = "path"
			:icon = "icon"
			:play = "play"
			:autoView = "true"
			:speed = "197"
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
	import { NoticeBar } from 'vant'
	import { Toast } from 'vant'

	export default {
		components: {
			BmlLushu,
			[NoticeBar.name]: NoticeBar
		},
		data () {
			return {
				center: null,
				zoom: 12,
				styleJson: null,
				seen: false,			// 通知控件
				noticeContent: null,	// 通知内容
				timer: null,			// 定时器

				map: null,	// 指定map对象
				BMap: null,	// 指定BMap对象
				initLocation: false,
				ls_outset: null,
				ls_acceptedtrip: null,

				btn_seen: false,
				// 用于创建连接
				stompClient: Stomp.over(new SockJS('http://online-ride-hailing.herokuapp.com/orh')),

				// 路书
				play: false,
				// speed: null,
				path: [],
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
		},
		mounted () {

		},
		destroyed () {
			clearTimeout(this.timer);	// 清除定时器
		},
		methods: {
			handler ({BMap, map}) {
				console.log(BMap)
				let _this = this;	// 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
				let token = window.localStorage.getItem('Token')
				let _map = map;
				_this.map = map;	// 创建map对象，然后赋给map属性，以方便在别的方法使用，下同
				_this.BMap = BMap;

				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r) {
					_this.center = {lng: parseFloat(r.longitude), lat: parseFloat(r.latitude)};		// 设置center属性值
					_this.autoLocationPoint = {lng: parseFloat(r.longitude), lat: parseFloat(r.latitude)};		// 自定义覆盖物
					_this.initLocation = true;
					_this.$store.dispatch('localPoint', {title: null, address: null, point: r.point})

					// 获取位置后，推送司机位置给指定乘客
					_this.stompClient.connect(
						// headers
						{'Auth-Token': token},
						function connectCallback (frame) {
							console.log('连接成功');
							Toast('连接成功！')
							_this.sendLocation();
						},
						function errorCallback (error) {
							console.log('连接失败', error);
							Toast('连接失败！请重新刷新页面！')
						}
					)

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
							// _this.speed = plan.getDuration(false);
							// _this.speed = plan.getDistance(false)/plan.getDuration(false);	// 实时速度，speed单位：米/秒
							// console.log('speed：', _this.speed)
							_this.seen = true;		// 通知控件可看
							_this.noticeContent = '到达起点位置大约需要' + plan.getDuration(true) + '，约' + plan.getDistance(true) + '。请您耐心等待！';
							_this.path = results.getPlan(0).getRoute(0).getPath();
							// 按钮可见
							_this.btn_seen = true;
							_this.timer = setTimeout(() => {
								_this.seen = false;
							}, 10000);
							// 
							// for (let j = 0; j < plan.getNumRoutes(); j++) {
							// 	let route = plan.getRoute(j);
							// 	arrPois = arrPois.concat(route.getPath());
							// }
							// map.addOverlay(new BMap.Polyline(arrPois, {storkeColor: 'red', strokeOpacity: 0.5, strokeStyle: 'dashed'}));
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
						map,	// 表示检索区域，类型可为地图实例
						{
							renderOptions: {map: map},	// 结果呈现设置，当前地图实例
							policy: routePolicy[0],		// 驾车策略，时间最少
							onSearchComplete: searchComplete,	// 检索完成后的回调函数。参数result
							onMarkersSet: function(routes) {
								map.removeOverlay(routes[0].marker); //删除起点
								map.removeOverlay(routes[1].marker);//删除终点
							}
						}
					);
					// transit.setPolicy(routePolicy[0]);	// 设置线路搜索策略，时间最少
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
			// 发送位置，让用户可见
			sendLocation () {
				let currentLocation = {carId: this.ls_acceptedtrip.carId, lng: this.$store.state.localPoint.point.lng, lat: this.$store.state.localPoint.point.lat};
				this.stompClient.send('/api/queue/hailingService/car/uploadCarLocation/' + this.ls_acceptedtrip.passengerUsername, {},
					JSON.stringify(currentLocation))
			},
			// 定位回调
			getLoctionSuccess (result) {
				console.log(result);
				this.initLocation = false;	// 使用定位控件之后，将进入页面自动定位的图标隐藏
				this.$store.dispatch('localPoint', {title: null, address: null, point: {lng: result.point.lng, lat: result.point.lat}})
				console.log(this.$store.state.localPoint);
				this.sendLocation();
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


<style scoped>
	/* 地图容器必须设置宽和高属性 */
	.map {
		width: 100%;
		height: 300px;
	}
	.raised-button {
		width: 50%
	}
</style>