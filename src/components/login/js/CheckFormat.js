
/** 
 * 常用的正则表达式参考:
 * https://www.cnblogs.com/Akeke/p/6649589.html
 * http://www.techug.com/post/20-good-regex.html
*/
var temp_pwd = ''

const checkFormat = {

	// 检查昵称
	checkNickname (nickname) {
		let errorText = '';
		// 大写似乎不行 /^[\U4E00-\U9FFF\w]{3,16}$/;
		let reg = /^[\u4e00-\u9fa5a-zA-Z0-9_]{3,12}$/;
		if(nickname == '' || nickname == null || nickname == undefined){
			errorText = '请输入昵称！';
		} else if (!reg.test(nickname)) {
			errorText = '长度在3~12之间，仅含汉字、字母、数字和下划线！';
		} else {
			errorText = '';
		}
		return errorText;
	},

	// 检查用户名
	checkUsername (username) {
		let errorText = '';
		let reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
		if(username == '' || username == null || username == undefined){
			errorText = '请填入手机号码！';
		} else if (!reg.test(username)) {
			errorText = '请输入正确的手机号码！';
		} else {
			errorText = '';
		}
		return errorText;
	},

	// 检查密码
	checkPassword (password) {
		let errorText = '';
		// 这个包含特殊字符：/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ])./
		let reg = /^[a-zA-Z]\w{5,11}$/;
		if(password == '' || password == null || password == undefined){
			errorText = '请输入密码！';
			temp_pwd = '';
		} else if (!reg.test(password)) {
			errorText = '以字母开头，长度在6~12之间，仅含字母、数字和下划线！';
			temp_pwd = password;
		} else {
			errorText = '';
			temp_pwd = password;
		}
		return errorText;
	},

	// 确认密码
	passwordVerify (password_verify) {
		let errorText = '';
		let reg = /^[a-zA-Z]\w{5,11}$/;
		// 没有设置密码
		if (temp_pwd == '' || temp_pwd == null || temp_pwd == undefined) {
			this.checkPassword(password_verify)
			errorText = ''
		} else if (!reg.test(temp_pwd)) {	// 密码不符合规则
			errorText =''
		} else {	// 密码符合规则后，才对“确认密码”进行验证
			if (temp_pwd !== password_verify) {
				errorText = '两次密码输入不一致！'
			} else {
				errorText =''
			}
		}
		return errorText
	},

	// 注册校验
	registerVerify (nickname, username, password, password_verify) {
		let t_n = this.checkNickname(nickname);
		let t_u = this.checkUsername(username);
		let t_p = this.checkPassword(password);
		let t_v = this.passwordVerify(password_verify)
		return {
			errorText_nickname: t_n,
			errorText_username: t_u,
			errorText_password: t_p,
			errorText_password_verify: t_v,
		}
	}
				// this.errorText_username =  checkFormat.checkUsername(this.value_username)
				// this.errorText_nickname = checkFormat.checkNickname(this.value_nickname)
				// // 判断password是否符合格式，并返回password的errorText
				// let temp_p = checkFormat.checkPassword(this.value_password)
				// if (temp_p == '' || temp_p == null || temp_p == undefined) {
				// 	// 当第一次输入密码无误后，才对 “确认密码” 进行判断
				// 	// 判断是两次输入是否一致，并返回password_verify的errorText
				// 	let temp_p_v  = checkFormat.passwordVerify(this.value_password_verify)
				// 	if (temp_p_v == '' || temp_p_v == null || temp_p_v == undefined) {
				// 		console.log("信息正确，提交注册")
				// 		// let that = this;
				// 		// this.$axios.post("/auth/register",
				// 		// 	{
				// 		// 		username: this.value_username,
				// 		// 		password: this.value_password,
				// 		// 		nickname: this.value_nickname
				// 		// 	},
				// 		// 	{
				// 		// 		headers: {'Content-Type': 'application/json'}
				// 		// 	}
				// 		// )
				// 		// .then(function (response) {
				// 		// 	console.log(response);
				// 		// })
				// 		// .catch(function (error) {
				// 		// 	console.log(error)
				// 		// })	//axios结束
				// 	} else {
				// 		this.errorText_password_verify = temp_p_v
				// 	}
				// } else {
				// 	// 当第一次输入密码不符合格式，就“确认密码”置空和去除错误提示
				// 	this.errorText_password = temp_p
				// 	this.value_password_verify = ''
				// }
}

export default checkFormat