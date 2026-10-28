<template>
  <view class="container">
    <!-- 地址详情区域 -->
    <view class="address-card" v-if="address">
      <view class="user-info">
        <text class="name">{{address.name}}</text>
        <text class="phone">{{address.phone}}</text>
        <view class="default-tag" v-if="address.isDefault">默认</view>
      </view>

      <view class="address-info">
        <text class="address-text">{{address.address}}</text>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <text class="empty-text">未找到地址信息</text>
    </view>

    <!-- 操作按钮区域 -->
    <view class="action-buttons">
      <view class="button edit-button" @tap="editAddress">
        <text class="button-text">编辑地址</text>
      </view>

      <view class="button delete-button" @tap="deleteAddress">
        <text class="button-text">删除地址</text>
      </view>
    </view>

    <!-- 其他操作区域 -->
    <view class="other-actions">
      <view class="action-item" @tap="setAsDefault" v-if="!address?.isDefault">
        <text class="action-text">设为默认地址</text>
        <text class="action-icon">></text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      addressId: '',
      address: null
    }
  },
  onLoad(options) {
    if (options && options.id) {
      this.addressId = options.id;
      this.loadAddressDetail();
    } else {
      this.showError('地址参数无效');
    }
  },
  onShow() {
    // 页面每次显示时重新加载，确保数据最新
    if (this.addressId) {
      this.loadAddressDetail();
    }
  },
  methods: {
    // 加载地址详情
    loadAddressDetail() {
      try {
        const addressListStr = uni.getStorageSync('addressList');
        if (addressListStr) {
          const addressList = JSON.parse(addressListStr);
          const foundAddress = addressList.find(item => item.id === this.addressId);

          if (foundAddress) {
            this.address = foundAddress;
          } else {
            this.showError('未找到该地址');
          }
        } else {
          this.showError('未找到地址数据');
        }
      } catch (error) {
        console.error('加载地址详情失败:', error);
        this.showError('加载地址失败');
      }
    },

    // 编辑地址
    editAddress() {
      uni.navigateTo({
        url: `/pages/list/address/edit?id=${this.addressId}`
      });
    },

    // 删除地址
    deleteAddress() {
      uni.showModal({
        title: '删除地址',
        content: '确定要删除该地址吗？',
        success: (res) => {
          if (res.confirm) {
            try {
              const addressListStr = uni.getStorageSync('addressList');
              if (addressListStr) {
                let addressList = JSON.parse(addressListStr);

                // 过滤掉要删除的地址
                const newAddressList = addressList.filter(item => item.id !== this.addressId);

                // 保存更新后的列表
                uni.setStorageSync('addressList', JSON.stringify(newAddressList));

                // 如果删除的是当前选中的地址，则更新选中的地址
                const selectedAddressId = uni.getStorageSync('selectedAddressId');
                if (selectedAddressId === this.addressId) {
                  if (newAddressList.length > 0) {
                    // 优先选择默认地址
                    const defaultAddress = newAddressList.find(item => item.isDefault);
                    if (defaultAddress) {
                      uni.setStorageSync('selectedAddressId', defaultAddress.id);
                    } else {
                      uni.setStorageSync('selectedAddressId', newAddressList[0].id);
                    }
                  } else {
                    // 如果没有地址了，清除选中的地址ID
                    uni.removeStorageSync('selectedAddressId');
                  }
                }

                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                });

                // 返回上一页
                setTimeout(() => {
                  uni.navigateBack();
                }, 1500);
              }
            } catch (error) {
              console.error('删除地址失败:', error);
              this.showError('删除失败，请重试');
            }
          }
        }
      });
    },

    // 设为默认地址
    setAsDefault() {
      try {
        const addressListStr = uni.getStorageSync('addressList');
        if (addressListStr) {
          let addressList = JSON.parse(addressListStr);

          // 将所有地址设为非默认
          addressList.forEach(item => {
            item.isDefault = (item.id === this.addressId);
          });

          // 保存更新后的列表
          uni.setStorageSync('addressList', JSON.stringify(addressList));

          // 更新选中的地址ID
          uni.setStorageSync('selectedAddressId', this.addressId);

          // 更新当前地址对象
          this.address.isDefault = true;

          uni.showToast({
            title: '已设为默认地址',
            icon: 'success'
          });
        }
      } catch (error) {
        console.error('设置默认地址失败:', error);
        this.showError('设置失败，请重试');
      }
    },

    // 显示错误提示
    showError(message) {
      uni.showToast({
        title: message,
        icon: 'none'
      });
    }
  }
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

.address-card {
  background-color: #ffffff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.name {
  font-size: 32rpx;
  font-weight: bold;
  margin-right: 20rpx;
}

.phone {
  font-size: 28rpx;
  color: #666;
}

.default-tag {
  margin-left: auto;
  font-size: 24rpx;
  color: #FF5F5F;
  padding: 4rpx 12rpx;
  border: 1rpx solid #FF5F5F;
  border-radius: 8rpx;
}

.address-info {
  margin-top: 10rpx;
}

.address-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.action-buttons {
  display: flex;
  padding: 30rpx 20rpx;
}

.button {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10rpx;
}

.edit-button {
  background-color: #0066FF;
  color: #fff;
}

.delete-button {
  background-color: #fff;
  border: 1px solid #FF5F5F;
  color: #FF5F5F;
}

.button-text {
  font-size: 28rpx;
  font-weight: 500;
}

.other-actions {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
}

.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.action-text {
  font-size: 28rpx;
  color: #333;
}

.action-icon {
  font-size: 24rpx;
  color: #999;
}
</style>