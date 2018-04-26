<template>
	<!-- ready是组件加载完之后才能执行的代码 -->
	<baidu-map class="map" :center="center" :zoom="zoom" @ready="handler" @load="loadding" :scroll-wheel-zoom="true"
		:mapStyle="{styleJson: styleJson}">
		<!-- 其中bm-geolocation中的locationIcon属性要加上“:”，否则会报错！ -->
		<bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="false" :autoLocation="true"
			:locationIcon="{url: require('../../svg/location.svg'), size: {width: 18, height: 18}}" 
			@locationSuccess="getLoctionSuccess" @locationError="getLocationError">
		</bm-geolocation>
		<bm-marker :position="enableSelectPoint"
			:icon="{url: require('../../svg/enableselect.svg'), size: {width: 14, height: 14}}">
		</bm-marker>
		<!-- 自动定位覆盖物 -->
		<bm-marker :position="autoLocationPoint"
			:icon="{url: require('../../svg/location.svg'), size: {width: 18, height: 18}}" v-if="initLocation">
		</bm-marker>
	</baidu-map>
</template>

<script>

	import MapStyle from './js/map-style.js'

	export default {
		data () {
			return {
				center: null,
				zoom: 15,
				styleJson: null,
				enableSelectPoint: {lng: 110.307236, lat: 21.157355},
				active: false,
				selectAddress: '广东海洋大学',

				// 调试用，海大餐厅 => 湖光镇派出所
				outsetPoint: {lng: 110.308994, lat: 21.15026},
				destinationPoint: {lng: 110.318268, lat: 21.12831},

				autoLocationPoint: {lng: 0, lat: 0},
				initLocation: false,
			}
		},
		created () {
			this.center = this.$store.state.currentCity
			this.styleJson = MapStyle.style();
		},
		mounted () {

		},
		methods: {
			handler ({BMap, map}) {
				let _this = this;	// 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
				var geolocation = new BMap.Geolocation();
				geolocation.getCurrentPosition(function(r){
					console.log(r);
					_this.center = {lng: r.longitude, lat: r.latitude};		// 设置center属性值
					_this.autoLocationPoint = {lng: r.longitude, lat: r.latitude};		// 自定义覆盖物
					_this.initLocation = true;	
					console.log('center:', _this.center)	// 如果这里直接使用this是不行的
				},{enableHighAccuracy: true})
			},
			loadding () {
				// console.log("load组件加载时执行的抽象方法")
			},
			getLoctionSuccess (data) {
				let _this = this;	// 指向vue实例
				console.log(data);
				this.zoom = 15;
				_this.initLocation = true;
				this.$store.dispatch('city', data.addressComponent.city)
				var geocoder = new BMap.Geocoder();
				geocoder.getLocation(new BMap.Point(data.point.lng, data.point.lat), function(rs) {
					var lbs_point = '';
					var address = '';
					if (rs.surroundingPois.length > 0) {
						lbs_point = rs.surroundingPois[0].point.lng+","+rs.surroundingPois[0].point.lat;
						address =  rs.surroundingPois[0].title;
					} else {
						lbs_point = rs.point.lng+","+rs.point.lat;
						address = rs.address;
					}
					console.log(rs.surroundingPois[0])
					let srp = rs.surroundingPois[0]
					_this.$store.dispatch('localPoint', {title: srp.title, address: srp.address, point: srp.point})
				})
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