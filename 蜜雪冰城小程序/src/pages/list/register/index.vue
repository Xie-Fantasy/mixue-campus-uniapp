<template>
  <view class="page">
    <image class="logo" src="../../../static/images/me-avatar.png"></image>
    <view class="logo-title">蜜雪冰城</view>
    <view class="intro">注册成为会员，立享更多优惠福利</view>

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
        <view class="label">用户名</view>
        <input
          class="input"
          type="text"
          placeholder="请输入用户名"
          v-model="formData.username"
        />
        <view class="error" v-if="errors.username">{{ errors.username }}</view>
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

      <view class="form-item">
        <view class="label">确认密码</view>
        <input
          class="input"
          type="password"
          placeholder="请再次输入密码"
          v-model="formData.confirmPassword"
        />
        <view class="error" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</view>
      </view>
    </view>

    <button class="register-btn" @tap="register">注册</button>
    <view class="login-link" @tap="goToLogin">已有账号？去登录</view>
    <view @tap="goToBack" class="cancel">取消</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {mobile: '', username: '', password: '', confirmPassword: ''},
      errors: {mobile: '', username: '', password: '', confirmPassword: ''}
    };
  },
  methods: {
    validate() {
      let isValid = true;
      this.errors = {mobile: '', username: '', password: '', confirmPassword: ''};

      if (!this.formData.mobile) {
        this.errors.mobile = '请输入手机号';
        isValid = false;
      } else if (!/^1\d{10}$/.test(this.formData.mobile)) {
        this.errors.mobile = '请输入正确的手机号';
        isValid = false;
      }

      if (!this.formData.username) {
        this.errors.username = '请输入用户名';
        isValid = false;
      } else if (this.formData.username.length < 2) {
        this.errors.username = '用户名至少需要2个字符';
        isValid = false;
      }

      if (!this.formData.password) {
        this.errors.password = '请输入密码';
        isValid = false;
      } else if (this.formData.password.length < 6) {
        this.errors.password = '密码至少需要6个字符';
        isValid = false;
      }

      if (!this.formData.confirmPassword) {
        this.errors.confirmPassword = '请确认密码';
        isValid = false;
      } else if (this.formData.confirmPassword !== this.formData.password) {
        this.errors.confirmPassword = '两次输入的密码不一致';
        isValid = false;
      }

      return isValid;
    },

    register() {
      if (!this.validate()) return;

      try {
        const accounts = uni.getStorageSync('accounts') || '[]';
        const accountsArray = JSON.parse(accounts);

        const existingAccount = accountsArray.find(account => account.username === this.formData.username || account.mobile === this.formData.mobile);

        if (existingAccount) {
          if (existingAccount.username === this.formData.username) {
            this.errors.username = '该用户名已被注册';
          }
          if (existingAccount.mobile === this.formData.mobile) {
            this.errors.mobile = '该手机号已被注册';
          }
          return;
        }

        const newAccount = {mobile: this.formData.mobile, username: this.formData.username, password: this.formData.password, registerTime: new Date().toISOString()};

        accountsArray.push(newAccount);
        uni.setStorageSync('accounts', JSON.stringify(accountsArray));

        uni.showToast({title: '注册成功', icon: 'success'});

        setTimeout(() => {
          uni.navigateTo({url: '/pages/list/login/index'});
        }, 1500);
      } catch (e) {
        console.error('注册失败:', e);
        uni.showToast({title: '注册失败，请重试', icon: 'none'});
      }
    },

    goToLogin() { uni.navigateTo({url: '/pages/list/login/index'}); },

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

.register-btn {
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

.register-btn:active {
  opacity: 0.6;
}

.login-link {
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