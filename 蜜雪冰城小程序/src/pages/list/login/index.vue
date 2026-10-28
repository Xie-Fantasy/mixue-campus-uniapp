<template>
  <view class="page">
    <image class="logo" src="../../../static/images/me-avatar.png"></image>
    <view class="logo-title">蜜雪冰城</view>
    <view class="intro">登录账号，立享更多优惠福利</view>

    <view class="form-container">
      <view class="form-item">
        <view class="label">手机号</view>
        <input
          class="input"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
          v-model="formData.mobile"
        />
        <view class="error" v-if="errors.mobile">{{ errors.mobile }}</view>
      </view>

      <view class="form-item">
        <view class="label">密码</view>
        <input
          class="input"
          type="password"
          placeholder="请输入密码"
          v-model="formData.password"
        />
        <view class="error" v-if="errors.password">{{ errors.password }}</view>
      </view>
    </view>

    <button class="login-btn" @tap="login">登录</button>
    <view class="register-link" @tap="goToRegister">没有账号？去注册</view>
    <view @tap="goToBack" class="cancel">取消</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {mobile: '', password: ''},
      errors: {mobile: '', password: ''}
    };
  },
  methods: {
    validate() {
      let isValid = true;
      this.errors = {mobile: '', password: ''};

      if (!this.formData.mobile) {
        this.errors.mobile = '请输入手机号';
        isValid = false;
      } else if (!/^1\d{10}$/.test(this.formData.mobile)) {
        this.errors.mobile = '请输入正确的手机号';
        isValid = false;
      }

      if (!this.formData.password) {
        this.errors.password = '请输入密码';
        isValid = false;
      }

      return isValid;
    },

    login() {
      if (!this.validate()) return;

      try {
        const accounts = uni.getStorageSync('accounts') || '[]';
        const accountsArray = JSON.parse(accounts);

        const account = accountsArray.find(acc => acc.mobile === this.formData.mobile && acc.password === this.formData.password);

        if (account) {
          const userInfo = {desensitiveMobile: account.username, mobile: account.mobile};

          uni.setStorageSync("userInfo", JSON.stringify(userInfo));
          uni.setStorageSync("isLogin", "true");

          uni.showToast({title: "登录成功", icon: "success"});

          setTimeout(() => {
            uni.switchTab({url: '/pages/list/mine/index'});
          }, 1500);
        } else {
          uni.showToast({title: "用户名或密码错误", icon: "none"});
        }
      } catch (e) {
        console.error('登录失败:', e);
        uni.showToast({title: "登录失败，请重试", icon: "none"});
      }
    },

    goToRegister() { uni.navigateTo({url: '/pages/list/register/index'}); },

    goToBack() { uni.navigateBack(); }
  }
};
</script>

<style scoped>
.page {
  padding-top: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.logo {
  width: 150rpx;
  height: 150rpx;
  border-radius: 75rpx;
  overflow: hidden;
  margin-bottom: 22rpx;
}

.logo-title {
  margin-bottom: 60rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.intro {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 60rpx;
  text-align: center;
}

.form-container {
  width: 90%;
  margin-bottom: 40rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  font-size: 28rpx;
  margin-bottom: 10rpx;
  color: #333;
}

.input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.error {
  font-size: 24rpx;
  color: #d2252c;
  margin-top: 8rpx;
}

.login-btn {
  width: 590rpx;
  height: 85rpx;
  background-color: #d2252c;
  color: white;
  border-radius: 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30rpx;
  font-size: 30rpx;
}

.login-btn:active {
  opacity: 0.6;
}

.register-link {
  font-size: 28rpx;
  color: #d2252c;
  margin-bottom: 30rpx;
  text-decoration: underline;
}

.cancel {
  color: #aaaaaa;
  font-size: 28rpx;
  cursor: pointer;
}
</style>
