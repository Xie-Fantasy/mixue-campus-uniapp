<template>
  <view class="container">
    <view class="address-list" v-if="addressList.length > 0">
      <view
        class="address-item"
        v-for="(item, index) in addressList"
        :key="index"
        @tap="selectAddress(item.id)"
      >
        <view class="item-wrapper" @tap="gotoAddressDetail(item.id)">
          <view class="user-info">
            <text class="name">{{item.name}}</text>
            <text class="phone">{{item.phone}}</text>
            <view class="default-tag" v-if="item.isDefault">默认</view>
          </view>
          <view class="address-info">{{item.address}}</view>
        </view>
        <view class="operation">
          <view class="edit" @tap.stop="editAddress(item.id)">
            <text>编辑</text>
          </view>
          <view class="delete" @tap.stop="deleteAddress(item.id)">
            <text>删除</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-address" v-else>
      <view class="empty-icon">
        <image src="/static/icons/location.svg" style="width: 80rpx; height: 80rpx" mode="aspectFit"></image>
      </view>
      <view class="empty-text">您还没有添加收货地址</view>
      <view class="empty-tip">添加地址后，下单更便捷</view>
    </view>

    <view class="add-address-btn" @tap="addNewAddress">
      <text>新增收货地址</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      addressList: []
    }
  },
  onLoad() {
    // 加载地址列表数据
    this.loadAddressList();
  },
  onShow() {
    // 每次显示页面时重新加载数据
    this.loadAddressList();
  },
  methods: {
    // 加载地址列表
    loadAddressList() {
      try {
        const addressListStr = uni.getStorageSync('addressList');
        if (addressListStr) {
          this.addressList = JSON.parse(addressListStr);
        }
      } catch (error) {
        console.error('加载地址列表失败:', error);
        uni.showToast({
          title: '加载地址失败',
          icon: 'none'
        });
      }
    },

    // 选择地址
    selectAddress(id) {
      try {
        // 获取选中的地址对象
        const selectedAddress = this.addressList.find(item => item.id === id);

        if (selectedAddress) {
          console.log('选择地址:', selectedAddress);

          // 存储选中的地址ID
          uni.setStorageSync('selectedAddressId', id);

          // 获取页面实例，准备返回
          const pages = getCurrentPages();
          if (pages.length > 1) {
            // 获取上一页实例
            const prevPage = pages[pages.length - 2];

            // 如果上一页有refreshAddressInfo方法，直接调用
            if (prevPage.$vm && typeof prevPage.$vm.refreshAddressInfo === 'function') {
              // 尝试直接修改上一页的数据
              prevPage.$vm.selectedAddress = JSON.parse(JSON.stringify(selectedAddress));
              console.log('已直接设置上一页的地址:', selectedAddress);
            }

            // 返回上一页
            uni.navigateBack({
              success: () => {
                console.log('返回上一页成功');
                // 额外发出一个事件通知
                uni.$emit('addressChanged', selectedAddress);
              }
            });
          }
        } else {
          uni.showToast({
            title: '地址数据有误',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('选择地址失败:', error);
        uni.showToast({
          title: '选择地址失败',
          icon: 'none'
        });
      }
    },

    // 跳转到地址详情页
    gotoAddressDetail(id) {
      uni.navigateTo({
        url: `/pages/list/address/detail?id=${id}`
      });
    },

    // 跳转到新增地址页面
    addNewAddress() {
      uni.navigateTo({
        url: '/pages/list/address/edit'
      });
    },

    // 编辑地址
    editAddress(id) {
      uni.navigateTo({
        url: `/pages/list/address/edit?id=${id}`
      });
    },

    // 删除地址
    deleteAddress(id) {
      uni.showModal({
        title: '提示',
        content: '确定要删除此地址吗？',
        success: (res) => {
          if (res.confirm) {
            // 从地址列表中移除该地址
            const newAddressList = this.addressList.filter(item => item.id !== id);

            // 更新本地存储
            uni.setStorageSync('addressList', JSON.stringify(newAddressList));

            // 如果删除的是当前选中的地址，则更新选中的地址
            const selectedAddressId = uni.getStorageSync('selectedAddressId');
            if (selectedAddressId === id) {
              // 如果还有其他地址，选择第一个作为默认地址
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

            // 更新页面数据
            this.addressList = newAddressList;

            // 提示删除成功
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
          }
        }
      });
    }
  }
}
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.address-list {
  flex: 1;
  padding: 20rpx;
}

.address-item {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  position: relative;
}

.item-wrapper {
  display: flex;
  flex-direction: column;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
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
  display: inline-block;
  font-size: 22rpx;
  color: #e60012;
  border: 1px solid #e60012;
  border-radius: 8rpx;
  padding: 2rpx 10rpx;
  margin-left: 20rpx;
}

.address-info {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  margin-bottom: 10rpx;
}

.operation {
  display: flex;
  justify-content: flex-end;
  border-top: 1rpx solid #f5f5f5;
  padding-top: 20rpx;
}

.edit, .delete {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  margin-left: 30rpx;
}

.edit {
  color: #e60012;
}

.delete {
  color: #666;
}

.edit text, .delete text {
  margin-right: 6rpx;
}

.empty-address {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

.empty-icon {
  font-size: 120rpx;
  color: #e60012;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: bold;
}

.empty-tip {
  font-size: 28rpx;
  color: #999;
}

.add-address-btn {
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
