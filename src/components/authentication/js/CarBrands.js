const carBrands = {
	brands () {
		var brands_data = {
			'宝马': {
				'1系': ['白色', '黑色', '褐色', ],
				'3系': ['棕色', '褐色', '红色'],
				'5系': ['黑色', '白色', '橙色'],
			},
			'奔驰': {
				'S级': ['白色', '红色'],
				'GLA级': ['黑色', '白色']
			},
			'奥迪': {
				'Q3': ['黄色']
			}
		};
		return brands_data;
	}
}

export default carBrands