
<template>
	<div>
		<van-nav-bar ref="NavBar" title="认证资料填写" left-text="返回" right-text="申请" left-arrow fixed @click-left="goBack" @click-right="uploadAuthInfo" />
		<div :style="FixedTop">
			<!-- 车主信息相关 -->
			<div class="block_title">
				车主信息
			</div>
			<van-cell-group>
				<van-field v-model="realName" label="真实姓名" type="textarea" :placeholder="realNamePlaceholder" maxlength="12" rows="1" autosize @blur="checkRealNameBlur" @focus="checkRealNameFocus"/>
				<van-field v-model="IDNumber" label="身份证号码" type="textarea" :placeholder="IDNumberPlaceholder" maxlength="18" rows="1" autosize @blur="checkIDNumberBlur" @focus="checkIDNumberFocus"/>
			</van-cell-group>
			<!-- 驾驶证相关 -->
			<div class="block_title">
				驾驶证资料
			</div>
			<van-cell-group>
				<div class="van-cell van-cell__title van-hairline" @click="setInitialLicenseDate">
					<div class="van-cell__title">
						<span class="van-cell__text">领证日期</span>
					</div>
					<div class="van-cell__value" :style="initialLicenseDateStyle">{{initialLicenseDate}}</div>
				</div>
				<div style="padding: 0 15px" class="van-cell-group imageDiv">
					<div>
						<mu-paper class="paper" :zDepth="1">
							<img :src="driverLicensePicture" class="img-class" />
							<div class="maskClass" v-if="unUploadDriverLicensePicture">
								<van-icon name="photograph" width="30px" class="iconClass"/>
							</div>
							<van-uploader class="uploader-class" :after-read="uploadedDriverLicensePicture" accept="image/gif, image/jpeg, image/png" multiple></van-uploader>
						</mu-paper>
						<div class="upload-picture-tips" @click="deleteDriverLicensePicture">
							{{driverLicensePictureTips}}
						</div>
					</div>
				</div>
			</van-cell-group>
			<!-- 车辆信息相关 -->
			<div class="block_title">
				车辆信息
			</div>
			<van-cell-group>
				<van-field v-model="carOwner" label="所有人" type="textarea" :placeholder="carOwnerPlaceholder" maxlength="12" rows="1" autosize @blur="checkCarOwnerBlur" @focus="checkCarOwnerFocus"/>
				<van-field v-model="carPlateNo" label="车牌号" type="textarea" :placeholder="carPlateNoPlaceholder" maxlength="12" rows="1" autosize @blur="checkCarPlateNoBlur" @focus="checkCarPlateNoFocus"/>
				<div class="van-cell van-cell__title van-hairline" @click="setCarRegisterDate">
					<div class="van-cell__title">
						<span class="van-cell__text">注册日期</span>
					</div>
					<div class="van-cell__value" :style="carRegisterDateStyle">{{carRegisterDate}}</div>
				</div>
				<div class="van-cell van-cell__title van-hairline" @click="setCarBrandInfo">
					<div class="van-cell__title">
						<span class="van-cell__text">品牌系列</span>
					</div>
					<div class="van-cell__value" :style="carBrandInfoStyle">{{carInfoTips}}</div>
				</div>
				<div style="padding: 0 15px" class="van-cell-group imageDiv">
					<div>
						<mu-paper class="paper" :zDepth="1">
							<img :src="vehicleLicensePicture" class="img-class" />
							<div class="maskClass" v-if="unUploadVehicleLicensePicture">
								<van-icon name="photograph" width="30px" class="iconClass"/>
							</div>
							<van-uploader class="uploader-class" :after-read="uploadedVehicleLicensePicture" accept="image/gif, image/jpeg, image/png" multiple></van-uploader>
						</mu-paper>
						<div class="upload-picture-tips" @click="deleteVehicleLicensePicture">
							{{vehicleLicensePictureTips}}
						</div>
					</div>
				</div>
			</van-cell-group>
			<!-- <van-loading type="spinner" color="black" /> -->
			<!-- 初次领证选择器 -->
			<mu-bottom-sheet :open="bottomSheet1" @close="closeBottomSheet1">
				<!-- <van-picker :columns="initialLicenseDateColumns" show-toolbar @cancel="closeBottomSheet1" @confirm="onConfirmInitialLicenseDate" /> -->
				<van-datetime-picker v-model="currentDate" type="date" :min-date="driverLicenseMinDate" :maxDate="maxDate" @cancel="closeBottomSheet1" @confirm="onConfirmInitialLicenseDate"/>
			</mu-bottom-sheet>
			<!-- 车辆注册日期选择器 -->
			<mu-bottom-sheet :open="bottomSheet2" @close="closeBottomSheet2">
				<van-datetime-picker v-model="currentDate" type="date" :min-date="carRegisterMinDate" :maxDate="maxDate" @cancel="closeBottomSheet2" @confirm="onConfirmCarRegisterDate"/>
			</mu-bottom-sheet>
			<!-- 车辆品牌选择器 -->
			<mu-bottom-sheet :open="bottomSheet3" @close="closeBottomSheet3">
				<van-picker :columns="carBrandInfoColumns" show-toolbar @cancel="closeBottomSheet3" @change="onChange" @confirm="onConfirmCarBrandInfo" />
			</mu-bottom-sheet>
			
		</div>
		
	</div>
</template>

<script>

	import CheckFormat from './js/CheckFormat.js'
	import CarBrands from './js/CarBrands.js'
	import { Toast } from 'vant'

	export default {
		data() {
			return {
				// 置顶值
				FixedTop: {
					marginTop: ''
				},
				// 认证信息
				realName: null,		// 真实姓名
				IDNumber: null,		// 身份证号码
				initialLicenseDate: '请选择初次领证日期',	// 初次领取驾驶证日期
				initialLicenseDate2: null,				// 初次领取驾驶证日期，用于传输
				driverLicensePicture: null,				 // 驾驶证图片
				carOwner: null,		// 车辆所有人
				carPlateNo: null,	// 车辆号
				carRegisterDate: '请选择车辆注册日期',	// 车辆注册日期
				carRegisterDate2: null,				// 车辆注册日期，用于传输
				carBrand: null,		// 车辆品牌
				carSeries: null,		// 品牌系列
				carColor: null,		// c车身颜色
				vehicleLicensePicture: null,		// 行驶证图片
				unUploadDriverLicensePicture: true,		
				unUploadVehicleLicensePicture: true,
				
				carInfoTips: '请选择车辆品牌信息',	// 车辆信息提示，包括品牌、系列、颜色
				
				driverLicensePictureTips: '请上传清晰的驾驶证图片',
				vehicleLicensePictureTips: '请上传清晰的行驶证图片',
				
				// 日期选择器默认设置
				currentDate: new Date(),	// 当前日期
				driverLicenseMinDate: new Date(1949, 9, 26),		//最小时间，默认设为1949年10月26日
				carRegisterMinDate: new Date(2003, 0, 1),		//最小时间，默认设为2003年1月1日，一般汽车报废年限不超过15年
				maxDate: new Date(),		// 最大时间，默认设为今天
				
				// bottomsheet
				bottomSheet1: false,	// 初次领取驾驶证日期，时间选择器
				bottomSheet2: false,	// 车辆注册日期，时间选择器
				bottomSheet3: false,	// 车辆品牌系列颜色，选择器
				// 提示信息
				realNamePlaceholder: '必须与本人身份证一致',			// 真实姓名提示信息
				IDNumberPlaceholder: '请填写本人的身份证号码',			 // 身份证提示信息
				carOwnerPlaceholder: '请填写真实有效的车辆所有人姓名',		// 车辆所有人提示信息
				carPlateNoPlaceholder: '请填写车牌号码',			   // 车辆所号提示信息
				carBrandInfoColumns: [],							 // 车辆品牌信息数据
				brands_data: null,
				// 初次领取驾驶证日期提示信息
				initialLicenseDateStyle: {
					opacity: 0.9,
					filter:'alpha(opacity=70)',
					color: '#666',
					backgroundColor: 'transparent'
				},
				// 车辆注册日期提示信息
				carRegisterDateStyle: {
					opacity: 0.9,
					filter:'alpha(opacity=70)',
					color: '#666',
					backgroundColor: 'transparent'
				},
				// 车辆信息提示信息
				carBrandInfoStyle: {
					opacity: 0.9,
					filter:'alpha(opacity=70)',
					color: '#666',
					backgroundColor: 'transparent'
				},
			}
		},
		created () {
			this.brands_data = CarBrands.brands();
			let brands = Object.keys(this.brands_data);
			let series = Object.keys(this.brands_data['奔驰']);
			let tt = this.brands_data['奔驰'];
			let ttt = tt['S级'];
			let colors = Object.values(ttt);
			let data1 = [
				{
					values: brands,
					className: 'column1',
					defaultIndex: 0
				},
				{
					values: series,
					className: 'column2',
					defaultIndex: 0
				},
				{
					values: colors,
					className: 'column3',
					defaultIndex: 0
				}
			];
			this.carBrandInfoColumns = data1;

			let ls_userinfo = JSON.parse(window.localStorage.getItem('UserInfo'));
			let driverId1 = ls_userinfo.driverId;
			if (driverId1 == '' || driverId1 == undefined || driverId1 == null) {
				// 从来没用认证过
			} else {
				this.$axios.get('/api/driver/' + ls_userinfo.driverId).then(
					(response) => {
						console.log('获取车主资料返回数据：', response);
						let data2 = response.data.data;
						console.log(data2);
						let status = response.data.data.driverStatus;	// 获取当前认证车主的状态
						console.log('车主当前状态：', status);
						// 车主信息
						this.realName = data2.drivingLicense.driverName;
						this.IDNumber = data2.drivingLicense.identification;
						// 驾驶证资料
						let tmp_date = data2.drivingLicense.issueDate;
						this.initialLicenseDateStyle = {color: '#000'};
						this.initialLicenseDate = tmp_date.slice(0, 4) + '年' + tmp_date.slice(5, 7) + '月' + tmp_date.slice(8, 10) + '日';
						this.initialLicenseDate2 = tmp_date;
						this.driverLicensePictureTips = '请重新上传清晰的驾驶证图片';
						this.driverLicensePicture = this.$serverUrl + '/images/drivingLicense/' +  data2.driverId+ '.jpg';
						// 车辆信息
						this.carOwner = data2.vehicleLicense.owner;
						this.carPlateNo = data2.car.plateNo;
						let tmp_date2 = data2.vehicleLicense.registerDate;
						this.carRegisterDateStyle = {color: '#000'};
						this.carRegisterDate = tmp_date2.slice(0, 4) + '年' + tmp_date2.slice(5, 7) + '月' + tmp_date2.slice(8, 10) + '日';
						this.carRegisterDate2 = tmp_date2;
						this.carBrandInfoStyle = {color: '#000'};
						this.carBrand = data2.car.brand;
						this.carSeries = data2.car.series;
						this.carColor = data2.car.color;
						this.carInfoTips = data2.car.brand + data2.car.series + ' • ' + data2.car.color;
						this.vehicleLicensePictureTips = '请重新上传清晰的行驶证图片';
						this.vehicleLicensePicture = this.$serverUrl + '/images/vehicleLicense/' +  data2.driverId+ '.jpg';
					}
				).catch((error) => {
						console.log('获取车主资料错误返回：', error);
						alert('获取信息错误，请重新刷新');
				});
			}
		},
		mounted() {
			this.FixedTop.marginTop = this.$refs.NavBar.$el.clientHeight + 'px';
		},
		methods: {
			// 返回
			goBack () {
				this.$router.push({name: 'Home'});
			},
			// 离开真实姓名输入框，进行格式验证
			checkRealNameBlur () {
				let obj = CheckFormat.checkRealName(this.realName);
				this.realName = obj.realName;
				this.realNamePlaceholder = obj.realNamePlaceholder;
			},

			// 上传认证资料
			uploadAuthInfo () {
				let ls_userinfo = JSON.parse(window.localStorage.getItem('UserInfo'));
				let tmp_d_id = ls_userinfo.driverId;
				let tmp_u_id = this.$store.state.userId;
				let tmp_r_n = this.realName;
				let tmp_id_n = this.IDNumber;
				let tmp_init_d = this.initialLicenseDate2;
				let tmp_d_p = this.driverLicensePicture;
				let tmp_o = this.carOwner;
				let tmp_c_p = this.carPlateNo;
				let tmp_r_d = this.carRegisterDate2;
				let tmp_c_b = this.carBrand;
				let tmp_c_s = this.carSeries;
				let tmp_c_c = this.carColor;
				let tmp_v_p = this.vehicleLicensePicture;
				
				if ( tmp_u_id == null || tmp_r_n == null || tmp_id_n == null || tmp_init_d == '请选择初次领证日期' || tmp_d_p == null || tmp_o == null || tmp_c_p == null || tmp_r_d == '请选择车辆注册日期' || tmp_c_b == null || tmp_c_s == null || tmp_c_c == null || tmp_v_p == null) {
					Toast('请保证信息完整！');
				} else {
					const toast = Toast.loading({
						duration: 0,	// 持续展示 toast
						forbidClick: true,	// 禁用背景点击
						loadingType: 'spinner',
						message: '上传中...'
					});
					if (ls_userinfo.driverId == null ){
						// 第一次认证，没有driverId
						this.$axios.post('/api/driver/certifyDriver',
						{
							userId: tmp_u_id,
							drivingLicense: {
								driverName: tmp_r_n,
								identification: tmp_id_n,
								issueDate: tmp_init_d,
								drivingLicenseImage: tmp_d_p
							},
							vehicleLicense: {
								owner: tmp_o,
								registerDate: tmp_r_d,
								vehicleLicenseImage: tmp_v_p
							},
							car: {
								plateNo: tmp_c_p,
								brand: tmp_c_b,
								series: tmp_c_s,
								color: tmp_c_c
							}
						}).then((response) => {
							console.log('申请车主认证返回：', response);
							if (response.status == 200) {
								// 提交申请成功，重新获取用户信息
								this.$axios.get('/api/auth/user')
								.then( (response) => {
									console.log('获取用户信息返回数据：', response);
									if (response.status == 200) {
										window.localStorage.setItem('UserInfo' ,JSON.stringify(response.data.data));
										this.$store.dispatch('driverId', response.data.data.driverId);
										this.$router.push({name: 'Home'});
									}
								})
								.catch ( (error) => {
									console.log(error);
								});
								Toast.clear();
							}
						}).catch((error) => {
							console.log(error);
							Toast.clear();
							if (error.status == 500) {
								alert(error.message)
							}
							
						})
					} else {
						// 不是第一次认证，有driverId
						this.$axios.post('/api/driver/certifyDriver',
						{
							driverId: tmp_d_id,
							drivingLicense: {
								driverName: tmp_r_n,
								identification: tmp_id_n,
								issueDate: tmp_init_d,
								drivingLicenseImage: tmp_d_p
							},
							vehicleLicense: {
								owner: tmp_o,
								registerDate: tmp_r_d,
								vehicleLicenseImage: tmp_v_p
							},
							car: {
								plateNo: tmp_c_p,
								brand: tmp_c_b,
								series: tmp_c_s,
								color: tmp_c_c
							}
						}).then((response) => {
							console.log('申请车主认证返回：', response);
							if (response.status == 200) {
								// 提交申请成功，重新获取用户信息
								this.$axios.get('/api/auth/user')
								.then( (response) => {
									console.log('获取用户信息返回数据：', response);
									if (response.status == 200) {
										window.localStorage.setItem('UserInfo' ,JSON.stringify(response.data.data));
										this.$router.push({name: 'Home'});
									}
								})
								.catch ( (error) => {
									console.log(error);
								});
								Toast.clear();
							}
						}).catch((error) => {
							console.log(error);
							Toast.clear();
							if (error.status == 500) {
								alert(error.message)
							}
							if (error.status == 400) {
								console.log('错误信息：', error.message);
								alert('请确保已上传驾驶证和行驶证！')
							}
						})
					}	// else结束，有driverId的情况
				}
				
			},
			// 离开车辆所有人输入框，进行格式验证
			checkCarOwnerBlur () {
				let obj = CheckFormat.checkCarOwner(this.carOwner);
				this.carOwner = obj.carOwner;
				this.carOwnerPlaceholder = obj.carOwnerPlaceholder;
			},
			// 离开车牌号输入框，进行格式验证
			checkCarPlateNoBlur () {
				let obj = CheckFormat.checkCarPlateNo(this.carPlateNo);
				this.carPlateNo = obj.carPlateNo;
				this.carPlateNoPlaceholder = obj.carPlateNoPlaceholder;
			},
			// 离开身份证号码输入框，进行格式验证
			checkIDNumberBlur () {
				let obj = CheckFormat.checkIdentificationNumber(this.IDNumber);
				this.IDNumber = obj.IDNumber;
				this.IDNumberPlaceholder = obj.IDNumberPlaceholder;
			},
			// 聚焦真实姓名输入框
			checkRealNameFocus () {
				if (this.realName == null || this.realName == undefined || this.realName == '') {
					this.realNamePlaceholder = '必须与本人身份证一致';
				}
			},
			// 聚焦车辆所有人输入框
			checkCarOwnerFocus () {
				if (this.carOwner == null || this.carOwner == undefined || this.carOwner == '') {
					this.carOwnerPlaceholder = '请填写真实有效的车辆所有人姓名';
				}
			},
			// 聚焦车牌号输入框
			checkCarPlateNoFocus () {
				if (this.carPlateNo == null || this.carPlateNo == undefined || this.carPlateNo == '') {
					this.carPlateNoPlaceholder = '请填写车牌号码';
				}
			},
			// 聚焦身份证号码输入框
			checkIDNumberFocus () {
				if (this.IDNumber == null || this.IDNumber == undefined || this.IDNumber == '') {
					this.IDNumberPlaceholder = '请填写本人的身份证号码';
				}
			},
			// 上传驾驶证后，在页面读取
			uploadedDriverLicensePicture (file) {
				this.driverLicensePicture = file.content;
				this.unUploadDriverLicensePicture = false;	// 已上传图片，把遮罩层去掉
				this.driverLicensePictureTips = '驾驶证已上传，点击这里可删除！';
			},
			// 上传行驶证后，在页面读取
			uploadedVehicleLicensePicture (file) {
				this.vehicleLicensePicture = file.content;
				this.unUploadVehicleLicensePicture = false;	// 已上传图片，把遮罩层去掉
				this.vehicleLicensePictureTips = '行驶证已上传，点击这里可删除！';
			},
			deleteDriverLicensePicture () {
				this.driverLicensePicture = null;
				this.unUploadDriverLicensePicture = true;
				this.driverLicensePictureTips = '请上传清晰的驾驶证图片';
			},
			deleteVehicleLicensePicture () {
				this.vehicleLicensePicture = null;
				this.unUploadVehicleLicensePicture = true;
				this.vehicleLicensePictureTips = '请上传清晰的行驶证图片';
			},
			// 打开BottomSheet1
			setInitialLicenseDate () {
				this.bottomSheet1 = true;
			},
			// 打开BottomSheet2
			setCarRegisterDate () {
				this.bottomSheet2 = true;
			},
			// 打开BottomSheet3
			setCarBrandInfo () {
				this.bottomSheet3 = true;
			},
			closeBottomSheet1 () {
				this.bottomSheet1 = false;
			},
			closeBottomSheet2 () {
				this.bottomSheet2 = false;
			},
			closeBottomSheet3 () {
				this.bottomSheet3 = false;
			},
			onConfirmInitialLicenseDate (val) {
				this.initialLicenseDateStyle = {color: '#000'};
				this.initialLicenseDate = val.getFullYear() + '年' + (val.getMonth()+1) + '月' + val.getDate() + '日 ';
				let date = new Date(val).toISOString().slice(0, 10);
				this.initialLicenseDate2 = date + ' 00:00:00';
				this.bottomSheet1 = false;
			},
			onConfirmCarRegisterDate (val) {
				this.carRegisterDateStyle = {color: '#000'};
				this.carRegisterDate = val.getFullYear() + '年' + (val.getMonth()+1) + '月' + val.getDate() + '日 ';
				let date = new Date(val).toISOString().slice(0, 10);
				this.carRegisterDate2 = date + ' 00:00:00';
				this.bottomSheet2 = false;
			},
			onChange (picker, values) {
				let data1 = this.brands_data;
				let data2 = this.carBrandInfoColumns;
				console.log('data2', data2[0])
				// for (var key in data2) {
				// 	console.log('data2', data2[key])
				// }
				// console.log('picker：', picker);
				console.log('values：', values);
				// console.log('data1：',data1);
				console.log('当前值：',values);
				console.log('当前品牌：',values[0]);
				console.log('当前系列：',values[1]);
				console.log('当前颜色：',values[2]);
				console.log('测试：', Object.keys(data1[values[0]]));
				let aaa = Object.keys(data1[values[0]])
				console.log('测试2：', aaa[0]);
				picker.setColumnValues(1, Object.keys(data1[values[0]]));
				picker.setColumnValues(2, );
			},
			onConfirmCarBrandInfo (picker, values) {
				console.log('选择车辆信息，未完善！');
				this.carBrandInfoStyle = {color: '#000'};
				this.carBrand = '宝马';
				this.carSeries = 'S级';
				this.carColor = '白色';
				this.carInfoTips = '宝马S级•白色'
				this.bottomSheet3 = false;
			}
		}
	}
</script>

<style scoped>
	@import './css/vant-style.css';
	span {
		display: block
	}
	.imageDiv {
		background: #fff;
	}
	.paper {
		/* display: inline-block; */
		display: block;
		height: 72px;
		width: 72px;
		margin: 12px 0 12px 0;
		text-align: center;
		overflow: hidden;
		position: relative;
		float: left;
	}
	.img-class {
		width: 100%;
		height: 100%;
		z-index: 1
	}
	.maskClass {
		background: rgba(0,0,0,0.15);
		z-index: 2;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0
	}
	.iconClass {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 27px;
		font-size: 20px;
		color: rgba(255,255,255,0.8)
	}
	.uploader-class {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 3
	}
	.upload-picture-tips {
		height: 98px;
		line-height: 98px;
		margin-left: 92px;
		font-size: 14px; color:
		rgba(102, 102, 102, 1);
	}
</style>


