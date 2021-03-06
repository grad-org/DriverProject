
export default {
	style: function () {
		// 自定义主题，顺序：背景、水系、国道、陆地、边界线、建筑物、人造区域、铁路、地铁
		var styleJson = [
			{
				"featureType": "background",
				"elementType": "all",
				"stylers": {
						"color": "#eef1f5ff",
						// "weight": "0.1",
						"visibility": "on"
				}
			},
			{
				"featureType": "water",
				"elementType": "geometry.fill",
				"stylers": {
						"color": "#c2def4ff",
				}
			},
			{
				"featureType": "green",
				"elementType": "geometry.fill",
				"stylers": {
						"color": "#dcefe8ff",
						"visibility": "on"
				}
			},
			// {
			// 	"featureType": "highway",
			// 	"elementType": "geometry.stroke",
			// 	"stylers": {
			// 			"color": "#ffd966ff",
			// 			"weight": "0.2",
			// 			"visibility": "on"
			// 	}
			// },
			// {
			// 	"featureType": "highway",
			// 	"elementType": "geometry.fill",
			// 	"stylers": {
			// 			"color": "#fff2ccff",
			// 			"weight": "1.3",
			// 			"visibility": "on"
			// 	}
			// },
			{
				"featureType": "boundary",
				"elementType": "all",
				"stylers": {
						"hue": "#c05965",
						"weight": "0.1",
						"visibility": "on"
				}
			},
			{
				"featureType": "building",
				"elementType": "all",
				"stylers": {
						"visibility": "off"
				}
			},
			{
				"featureType": "manmade",
				"elementType": "all",
				"stylers": {
						"visibility": "off"
				}
			},
			// {
			// 	"featureType": "railway",
			// 	"elementType": "all",
			// 	"stylers": {
			// 			"weight": "0.3",
			// 			"visibility": "on"
			// 	}
			// },
			{
				"featureType": "subway",
				"elementType": "all",
				"stylers": {
						"weight": "0.1",
						"visibility": "on"
				}
			}
		];
		return styleJson
	}
}