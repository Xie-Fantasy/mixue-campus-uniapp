<template>
  <view class="container">
    <view class="form-container">
      <view class="form-item">
        <text class="form-label">收货人</text>
        <input
          class="form-input"
          type="text"
          placeholder="请输入收货人姓名"
          v-model="addressData.name"
        />
      </view>

      <view class="form-item">
        <text class="form-label">手机号码</text>
        <input
          class="form-input"
          type="number"
          maxlength="11"
          placeholder="请输入手机号码"
          v-model="addressData.phone"
        />
      </view>

      <view class="form-item">
        <text class="form-label">收货地址</text>
        <textarea
          class="form-textarea"
          placeholder="请输入详细地址"
          v-model="addressData.address"
        />
      </view>

      <view class="form-item switch-item">
        <text class="form-label">设为默认地址</text>
        <switch
          :checked="addressData.isDefault"
          color="#e60012"
          @change="handleDefaultChange"
        />
      </view>
    </view>

    <view class="save-btn" @tap="saveAddress">
      <text>保存</text>
    </view>
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
      },
      isEdit: false
    }
  },
  onLoad(options) {
    // 判断是否是编辑模式
    if (options && options.id) {
      this.isEdit = true;
      // 加载地址数据
      this.loadAddressData(options.id);
    } else {
      // 新增模式，设置默认值
      this.initNewAddress();
    }
  },
  methods: {
    // 加载已有地址数据
    loadAddressData(id) {
      try {
        const addressListStr = uni.getStorageSync('addressList');
        if (addressListStr) {
          const addressList = JSON.parse(addressListStr);
          const currentAddress = addressList.find(item => item.id === id);

          if (currentAddress) {
            this.addressData = { ...currentAddress };
          } else {
            this.isEdit = false;
            this.initNewAddress();
            uni.showToast({
              title: '地址不存在，已切换为新增模式',
              icon: 'none'
            });
          }
        }
      } catch (error) {
        console.error('加载地址数据失败:', error);
        uni.showToast({
          title: '加载地址失败',
          icon: 'none'
        });
      }
    },

    // 初始化新地址数据
    initNewAddress() {
      this.addressData = {
        id: this.generateId(),
        name: '',
        phone: '',
        address: '',
        isDefault: false
      };
    },

    // 生成唯一ID
    generateId() {
      return Date.now().toString();
    },

    // 处理默认地址切换
    handleDefaultChange(e) {
      this.addressData.isDefault = e.detail.value;
    },

    // 保存地址
    saveAddress() {
      // 表单验证
      if (!this.validateForm()) {
        return;
      }

      try {
        // 获取现有地址列表
        let addressList = [];
        const addressListStr = uni.getStorageSync('addressList');

        if (addressListStr) {
          addressList = JSON.parse(addressListStr);
        }

        // 如果设置为默认地址，需要将其他地址的默认状态取消
        if (this.addressData.isDefault) {
          addressList.forEach(item => {
            if (item.id !== this.addressData.id) {
              item.isDefault = false;
            }
          });
        }

        if (this.isEdit) {
          // 编辑模式：更新现有地址
          const index = addressList.findIndex(item => item.id === this.addressData.id);
          if (index !== -1) {
            addressList[index] = { ...this.addressData };
          }
        } else {
          // 新增模式：添加新地址

          // 如果是第一个地址，自动设为默认
          if (addressList.length === 0) {
            this.addressData.isDefault = true;
          }

          // 添加到地址列表
          addressList.push({ ...this.addressData });
        }

        // 保存到本地存储
        uni.setStorageSync('addressList', JSON.stringify(addressList));

        // 如果是默认地址，更新选中的地址ID
        if (this.addressData.isDefault) {
          uni.setStorageSync('selectedAddressId', this.addressData.id);
        }

        // 显示保存成功提示
        uni.showToast({
          title: this.isEdit ? '更新成功' : '添加成功',
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
          title: '保存失败',
          icon: 'none'
        });
      }
    },

    // 表单验证
    validateForm() {
      if (!this.addressData.name.trim()) {
        uni.showToast({
          title: '请输入收货人姓名',
          icon: 'none'
        });
        return false;
      }

      if (!this.addressData.phone.trim()) {
        uni.showToast({
          title: '请输入手机号码',
          icon: 'none'
        });
        return false;
      }

      // 手机号格式验证
      if (!/^1\d{10}$/.test(this.addressData.phone)) {
        uni.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        });
        return false;
      }

      if (!this.addressData.address.trim()) {
        uni.showToast({
          title: '请输入详细地址',
          icon: 'none'
        });
        return false;
      }

      return true;
    }
  }
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.form-container {
  background-color: #fff;
  margin-top: 20rpx;
}

.form-item {
  display: flex;
  align-items: center;
  min-height: 100rpx;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.form-label {
  width: 180rpx;
  font-size: 28rpx;
  color: #333;
}

.form-input {
  flex: 1;
  height: 60rpx;
  font-size: 28rpx;
}

.form-textarea {
  flex: 1;
  width: 100%;
  height: 120rpx;
  font-size: 28rpx;
  line-height: 1.5;
}

.switch-item {
  justify-content: space-between;
}

.save-btn {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100rpx;
  background-color: #e60012;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>