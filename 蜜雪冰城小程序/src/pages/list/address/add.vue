<template>
  <view class="container">
    <view class="form">
      <view class="form-item">
        <view class="label">收货人</view>
        <input class="input" v-model="addressData.name" placeholder="请输入收货人姓名" />
      </view>

      <view class="form-item">
        <view class="label">手机号码</view>
        <input class="input" v-model="addressData.phone" type="number" maxlength="11" placeholder="请输入手机号码" />
      </view>

      <view class="form-item">
        <view class="label">收货地址</view>
        <textarea class="textarea" v-model="addressData.address" placeholder="请输入详细地址" />
      </view>

      <view class="form-item switch-item">
        <view class="label">设为默认地址</view>
        <switch color="#e60012" :checked="addressData.isDefault" @change="onSwitchChange" />
      </view>
    </view>

    <view class="submit-btn" @tap="saveAddress">保存</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      addressData: {
        id: '',
        name: '',
        phone: '',
        address: '',
        isDefault: false
      }
    };
  },
  methods: {
    // 默认地址开关变化
    onSwitchChange(e) {
      this.addressData.isDefault = e.detail.value;
    },

    // 保存地址
    saveAddress() {
      // 表单验证
      if (!this.addressData.name.trim()) {
        uni.showToast({
          title: '请输入收货人姓名',
          icon: 'none'
        });
        return;
      }

      if (!this.addressData.phone.trim()) {
        uni.showToast({
          title: '请输入手机号码',
          icon: 'none'
        });
        return;
      }

      if (!/^1\d{10}$/.test(this.addressData.phone)) {
        uni.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        });
        return;
      }

      if (!this.addressData.address.trim()) {
        uni.showToast({
          title: '请输入详细地址',
          icon: 'none'
        });
        return;
      }

      // 获取现有地址列表
      try {
        const addressListStr = uni.getStorageSync('addressList');
        let addressList = [];

        if (addressListStr) {
          addressList = JSON.parse(addressListStr);
        }

        // 生成新的地址ID
        this.addressData.id = Date.now().toString();

        // 如果设为默认地址，需要将其他地址设为非默认
        if (this.addressData.isDefault) {
          addressList.forEach(item => {
            item.isDefault = false;
          });
        }

        // 将新地址添加到列表
        addressList.push(this.addressData);

        // 保存到本地存储
        uni.setStorageSync('addressList', JSON.stringify(addressList));

        // 如果是默认地址或者只有这一个地址，自动选中
        if (this.addressData.isDefault || addressList.length === 1) {
          uni.setStorageSync('selectedAddressId', this.addressData.id);
        }

        // 提示保存成功
        uni.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500
        });

        // 延迟返回上一页
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);

      } catch (error) {
        console.error('保存地址失败:', error);
        uni.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 20rpx;
}

.form {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 0 30rpx;
  margin-bottom: 40rpx;
}

.form-item {
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  font-size: 28rpx;
}

.textarea {
  width: 100%;
  height: 160rpx;
  font-size: 28rpx;
  line-height: 1.5;
}

.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    margin-bottom: 0;
  }
}

.submit-btn {
  width: 100%;
  height: 90rpx;
  background-color: #e60012;
  color: #fff;
  border-radius: 45rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  font-weight: bold;
}
</style>