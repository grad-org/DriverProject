
const checkFormat = {

	// 检查昵称格式
	checkNickname (nickname) {
		// let nickname = nickname;
		let tmp_nickname = null;
		let tmp_nickname_placeholder = null;
		// 长度在3~12之间，仅含汉字、字母、数字和下划线！
		let reg_nickname = /^[\u4e00-\u9fa5a-zA-Z0-9_]{3,12}$/;
		if (nickname == null || nickname == undefined || nickname == '') {
			// 输入框为空
			tmp_nickname = '',
			tmp_nickname_placeholder = '起个有个性的名字吧 ^_^'
		}
		else if (!reg_nickname.test(nickname)) {
			// 输入框不符合正则表达式
			tmp_nickname = '';
			tmp_nickname_placeholder = '长度至少为3，且不含特殊符号！'
		} else {
			// 正常情况
			tmp_nickname = nickname;
			tmp_nickname_placeholder = '起个有个性的名字吧 ^_^'
		};
		return {
			'nickname': tmp_nickname,
			'nicknamePlaceholder': tmp_nickname_placeholder
		}
	},

	// 检查真实名字
	checkRealName (realName) {
		let tmp_realname = null;
		let tmp_realname_placeholder = null;
		// 汉字
		let reg_realname = /^[\u4e00-\u9fa5]{0,}$/;
		if (realName == null || realName == undefined || realName == '') {
			// 为空
			tmp_realname = null;
			tmp_realname_placeholder = '请输入您的真实姓名';
		} else if (!reg_realname.test(realName)) {
			// 不符合格式要求
			tmp_realname = null;
			tmp_realname_placeholder = '仅含中文';
		} else {
			// 正确
			tmp_realname = realName;
			tmp_realname_placeholder = '必须与身份证号码一致'
		};
		return {
			'realName': tmp_realname,
			'realNamePlaceholder': tmp_realname_placeholder
		}
	},

	// 检查身份证
	checkIdentificationNumber (idNumber) {
		let tmp_idnumber = null;
		let tmp_idnumber_placeholder = null;
		// 15位或18位，参考：http://www.jb51.net/article/109384.htm
		let reg_idnumber = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
		if (idNumber == '' || idNumber == null || idNumber == undefined) {
			tmp_idnumber = null;
			tmp_idnumber_placeholder = '请填写本人的身份证号码';
		} else if (!reg_idnumber.test(idNumber)) {
			// // 不符合格式要求
			tmp_idnumber = null;
			tmp_idnumber_placeholder = '请填写有效的身份证号码'
		} else {
			// 正确
			tmp_idnumber = idNumber;
			tmp_idnumber_placeholder = '请填写本人的身份证号码'
		};
		return {
			'IDNumber': tmp_idnumber,
			'IDNumberPlaceholder': tmp_idnumber_placeholder
		}
	},

	// 检查车辆所有人
	checkCarOwner (carOwner) {
		let tmp_carowner = null;
		let tmp_carowner_placeholder = null;
		// 汉字
		let reg_carowner = /^[\u4e00-\u9fa5]{0,}$/;
		if (carOwner == null || carOwner == undefined || carOwner == '') {
			// 为空
			tmp_carowner = null;
			tmp_carowner_placeholder = '请填写真实有效的车辆所有人姓名';
		} else if (!reg_carowner.test(carOwner)) {
			// 不符合格式要求
			tmp_carowner = null;
			tmp_carowner_placeholder = '仅含中文';
		} else {
			// 正确
			tmp_carowner = carOwner;
			tmp_carowner_placeholder = '请填写真实有效的车辆所有人姓名'
		};
		return {
			'carOwner': tmp_carowner,
			'carOwnerPlaceholder': tmp_carowner_placeholder
		}
	},

	// 检查车辆车牌号码
	checkCarPlateNo (carPlateNo) {
		let tmp_plateno = null;
		let tmp_plateno_placeholder = null;
		// 车牌号码，参考：https://www.cnblogs.com/jacktang/p/5609931.html
		let reg_carplateno = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
		if (carPlateNo == null || carPlateNo == undefined || carPlateNo == '') {
			// 为空
			tmp_plateno = null;
			tmp_plateno_placeholder = '请填写车辆车牌号码';
		} else if (!reg_carplateno.test(carPlateNo)) {
			// 不符合格式要求
			tmp_plateno = null;
			tmp_plateno_placeholder = '请输入正确的车牌号码';
		} else {
			// 正确
			tmp_plateno = carPlateNo;
			tmp_plateno_placeholder = '请填写车牌号码'
		};
		return {
			'carPlateNo': tmp_plateno,
			'carPlateNoPlaceholder': tmp_plateno_placeholder
		}
	},
}

export default checkFormat