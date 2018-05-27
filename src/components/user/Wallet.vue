<template>
	<div>
		<mu-appbar ref="barDiv" title="我的钱包" style="position: fixed; top: 0">
			<mu-icon-button icon="arrow_back" slot="left" @click="goBack"/>
		</mu-appbar>
		<div :style="listStyle" >
			<div class="block_title">
				提现设置
			</div>
			<van-cell-group>
				<van-cell title="支付宝提现账号" :value="bindTips" icon="alipay" is-link @click="openBindDialog"/>
			</van-cell-group>
			<div class="block_title">
				账号钱包
			</div>
			<van-cell-group>
				<van-cell title="账号余额" :value="balance + ' 元'" icon="balance-pay" is-link @click="openWithdrawDialog"/>
			</van-cell-group>
		</div>
		<!-- 提现对话框 -->
		<mu-dialog :open="withdrawDialog3" title="提现金额" @close="closeWithdrawDialog3">
			<mu-text-field v-model="withdrawAmount" :hintText="'最低不能超过'+ balance + '元'" :fullWidth="true"/><br/>
			<mu-flat-button slot="actions" @click="closeWithdrawDialog3" primary label="取消"/>
			<mu-flat-button slot="actions" primary @click="withdraw" label="确定"/>
		</mu-dialog>
		<!-- 绑定支付宝 -->
		<mu-dialog :open="bindDialog1" title="支付宝账号：" @close="closebindDialog1">
			<mu-text-field v-model="alipayAccount" hintText="请输入支付宝账号..." :fullWidth="true"/><br/>
			<mu-flat-button slot="actions" @click="closebindDialog1" primary label="取消"/>
			<mu-flat-button slot="actions" primary @click="bindAlipayAccount" label="绑定"/>
		</mu-dialog>
		<!-- 查看绑定的支付宝账号 -->
		<mu-dialog :open="bindDialog2" title="支付宝账号：" @close="closebindDialog2">
			{{alipayAccount}}
			<mu-flat-button slot="actions" @click="untieAlipayAccount" primary label="去解绑"/>
			<mu-flat-button slot="actions" primary @click="closebindDialog2" label="确定"/>
		</mu-dialog>
	</div>
</template>

<script>

	import { Toast } from 'vant'

	export default {
		data () {
			return {
				openDialog: false,	// 测试对话框
				bindDialog1: false,	// 绑定支付宝对话框
				bindDialog2: false,	// 查看支付宝对话框（已绑定）
				withdrawDialog3: false,	// 提现对话框
				bindTips: '立即绑定',	// 绑定账号提示
				balance: 0,		// 账号余额
				withdrawAmount: null,	// 提现金额
				listStyle: {
					marginTop: '',	// 用于判断Bar高度
				},
				// 车主钱包信息
				driverBalanceId: null,	// 钱包账号ID
				alipayAccount: null,	// 绑定的支付宝账号
			}
		},
		computed: {

		},
		created () {
			// 查询车主绑定账号driverBalance
			this.$axios.get('/api/driver/' + this.$store.state.driverId).then(
				(response) => {
					console.log('查询车主资料返回：', response);
					if (response.status == 200) {
						let driverBalance = response.data.data.driverBalance;
						this.driverBalanceId = driverBalance.driverBalanceId;
						if (driverBalance.alipayAccount == '' || driverBalance.alipayAccount == undefined || driverBalance.alipayAccount == null ) {
							this.bindTips = '立即绑定';
						} else {
							this.bindTips = '已绑定';
							this.alipayAccount = driverBalance.alipayAccount;
						}
						// 查询余额
						this.$axios.get('/api/driverBalance/' + this.driverBalanceId)
						.then((response) => {
							console.log('查询账号余额返回数据：', response);
							if (response.status == 200) {
								let balance = response.data.data;
								if (balance.balance == null) {
									this.balance = 0;
								} else {
									this.balance = balance.balance;
								}
							}
						}).catch((error) => {
							console.log('查询账号余额失败返回：', error);
							if (error.status == 500) {
								alert(error.message);
							}
						});
					}
				}
			).catch((error) => {
				console.log('查询车主资料失败返回：', error);
			});
		},
		mounted () {
			this.listStyle.marginTop = this.$refs.barDiv.$el.clientHeight + 'px';
		},
		methods: {
			goBack () {
				// this.$router.go(-1);
				this.$router.push({name: 'Home'});
			},
			// 打开提现对话框
			openWithdrawDialog () {
				if (this.alipayAccount == null ) {
					Toast('提现功能，需绑定支付宝账号！');
				} else {
					if (this.balance <= 0) {
						Toast('余额不足，不能进行提现！')
					} else {
						this.withdrawDialog3 = true;
					}
				}

			},
			// 打开绑定对话框
			openBindDialog () {
				if (this.alipayAccount != null) {
					// 不空，说明已绑定账号
					this.bindDialog2 = true;
				} else {
					// 空
					this.bindDialog1 = true;
				}
			},
			// 关闭绑定对话框
			closebindDialog1 () {
				this.bindDialog1 = false;
			},
			// 关闭查看绑定对话框
			closebindDialog2 () {
				this.bindDialog2 = false;
			},
			// 关闭提现对话框
			closeWithdrawDialog3 () {
				this.withdrawDialog3 = false;
			},
			// 绑定支付宝账号
			bindAlipayAccount () {
				this.$axios.post('/api/driverBalance/bindAlipayAccount', {
					driverBalanceId: this.driverBalanceId,
					alipayAccount: this.alipayAccount
				}).then((response) => {
					this.bindDialog1 = false;
					console.log('绑定支付宝账号返回：', response);
					if (response.status == 200) {
						this.alipayAccount = response.data.data.alipayAccount;
						this.bindTips = '已绑定'
						Toast('绑定成功！');
					}
				}).catch((error) => {
					this.bindDialog1 = false;
					Toast('绑定失败！');
					console.log('绑定支付宝失败返回：', error);
				})
			},
			// 解绑支付宝账号
			untieAlipayAccount () {
				this.bindDialog2 = false;
				// Toast('解绑功能未实现！');
				this.$axios.post('/api/driverBalance/bindAlipayAccount', {
					driverBalanceId: this.driverBalanceId,
					alipayAccount: null
				}).then((response) => {
					console.log('解绑支付宝账号返回：', response);
					if (response.status == 200) {
						Toast('解绑成功！');
						this.alipayAccount = response.data.data.alipayAccount;
						this.bindTips = '立即绑定';
					}
				}).catch((error) => {
					Toast('绑定失败！');
					console.log('解绑支付宝失败返回：', error);
				})
			},
			// 提现
			withdraw () {
				this.$axios.post('/api/payment/alipay/withdraw', {
					driverBalanceId: this.driverBalanceId,
					amountOfWithdrawal: this.withdrawAmount
				}).then((response) => {
					console.log('提现返回数据：', response);
					if (response.status == 200) {
						this.closeWithdrawDialog3();
						let res = response.data.data;
						const toast = Toast.loading({
								duration: 0,
								forbidClick: true,
								message: '提现成功…'
							});
							let second = 2;
							const timer = setInterval(() => {
								second--;
								if (second == 1) {
									toast.message = '正在刷新…';
								} else {
									clearInterval(timer);
									this.balance = res.balance;
									Toast.clear();
								}
							}, 1000);
					}
				}).catch((error) => {
					console.log('提现请求失败返回：', error);
					Toast('提现失败！')
					if (error.status == 500) {
						alert(error.message + '，(' + error.status + ')');
					}
				})
			},
			// 关闭提示框
			closeDialog () {
				this.openDialog = false;
			}
		}
	}
</script>

<style scoped>
	@import './css/vant-style.css';
</style>