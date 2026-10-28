<template>
  <view class="container">
    <!-- 订单状态 -->
    <view class="status-section">
      <view class="status-title">{{ orderInfo.status }}</view>
      <view class="status-desc">{{ getStatusDescription() }}</view>
    </view>

    <!-- 订单信息 -->
    <view class="info-section">
      <!-- 门店信息 -->
      <view class="store-info">
        <view class="store-name">{{ orderInfo.store }}</view>
        <view class="store-address" v-if="orderInfo.address">{{ orderInfo.address }}</view>
      </view>

      <!-- 用户信息 -->
      <view class="user-info">
        <view class="label">用户名：</view>
        <view class="value">{{ orderInfo.userName || '匿名用户' }}</view>
      </view>

      <view class="user-info">
        <view class="label">手机号：</view>
        <view class="value">{{ orderInfo.userPhone || '未绑定手机号' }}</view>
      </view>

      <!-- 订单时间 -->
      <view class="order-time">
        <view class="label">下单时间：</view>
        <view class="value">{{ orderInfo.time }}</view>
      </view>

      <!-- 订单号 -->
      <view class="order-number">
        <view class="label">订单号：</view>
        <view class="value">{{ orderInfo.id }}</view>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="product-section">
      <view class="section-title">商品信息</view>
      <view class="product-list">
        <view class="product-item" v-for="(item, index) in orderInfo.items" :key="index">
          <view class="product-info">
            <view class="product-name">{{ item.name }}</view>
            <view class="product-desc">{{ item.description || '' }}</view>
            <view v-if="item.customized" class="product-desc">{{ item.temperature }} / {{ item.sweetness }}<text v-for="topping in item.toppings" :key="topping.name"> / {{ topping.name }}</text></view>
          </view>
          <view class="product-price-info">
            <view class="product-price">¥{{ item.customized ? (item.totalPrice / item.quantity).toFixed(2) : item.price }}</view>
            <view class="product-quantity">x{{ item.quantity }}</view>
          </view>
        </view>
      </view>

      <!-- 合计 -->
      <view class="total-info">
        <view class="total-label">合计</view>
        <view class="total-value">¥{{ orderInfo.totalPrice.toFixed(2) }}</view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-btns">
      <view class="btn btn-secondary" @tap="goBack">返回订单列表</view>
      <view class="btn btn-primary" @tap="reorder">再来一单</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderId: '',
      orderInfo: {
        id: '',
        status: '进行中',
        time: '',
        store: '',
        address: '',
        items: [],
        totalPrice: 0,
        userName: '匿名用户',
        userPhone: '未绑定手机号'
      }
    }
  },
  onLoad(options) {
    if (options.id) {
      this.orderId = options.id;
      this.getOrderDetail();
    } else if (options.orderInfo) {
      // 如果是直接传递了订单信息
      try {
        this.orderInfo = JSON.parse(decodeURIComponent(options.orderInfo));
      } catch (error) {
        console.error('解析订单信息失败', error);
        uni.showToast({
          title: '订单信息解析失败',
          icon: 'none'
        });
      }
    } else {
      uni.showToast({
        title: '未找到订单信息',
        icon: 'none'
      });
      setTimeout(() => {
        this.goBack();
      }, 1500);
    }
  },
  methods: {
    // 获取订单详情
    getOrderDetail() {
      const orderList = uni.getStorageSync('orderList') || [];
      const order = orderList.find(item => item.id === this.orderId);

      if (order) {
        this.orderInfo = order;
      } else {
        uni.showToast({
          title: '未找到该订单',
          icon: 'none'
        });
        setTimeout(() => {
          this.goBack();
        }, 1500);
      }
    },

    // 获取订单状态描述
    getStatusDescription() {
      const status = this.orderInfo.status;
      if (status === '进行中') {
        return '您的订单正在制作中，请耐心等待';
      } else if (status === '已完成') {
        return '您的订单已完成，感谢您的惠顾';
      } else if (status === '已退单') {
        return '该订单已退款，资金将原路返回';
      }
      return '';
    },

    // 返回订单列表
    goBack() {
      uni.switchTab({ url: '/pages/list/order/index' });
    },

    // 再来一单
    reorder() {
      // 将当前订单中的商品添加到购物车
      const cartItems = this.orderInfo.items.map(item => ({
        ...item,
        totalPrice: item.customized ? item.totalPrice / item.quantity : item.price,
        quantity: 1 // 默认数量设为1
      }));

      // 保存到本地存储
      uni.setStorageSync('reorderItems', JSON.stringify(cartItems));

      // 跳转到菜单页
      uni.navigateTo({
        url: '/pages/list/menu/index'
      });

      // 提示用户
      uni.showToast({
        title: '已将商品添加到购物车',
        icon: 'none'
      });
    }
  }
}
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 150rpx; // 为底部按钮留出空间
}

// 订单状态区域
.status-section {
  background-color: #e60012;
  color: #fff;
  padding: 50rpx 30rpx;

  .status-title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }

  .status-desc {
    font-size: 24rpx;
    opacity: 0.8;
  }
}

// 订单信息区域
.info-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 30rpx;

  .store-info {
    margin-bottom: 20rpx;

    .store-name {
      font-size: 28rpx;
      font-weight: bold;
      margin-bottom: 8rpx;
    }

    .store-address {
      font-size: 24rpx;
      color: #999;
    }
  }

  .user-info {
    display: flex;
    margin-top: 16rpx;
    font-size: 26rpx;

    .label {
      color: #999;
      width: 180rpx;
    }

    .value {
      flex: 1;
      color: #333;
    }
  }

  .order-time, .order-number {
    display: flex;
    margin-top: 16rpx;
    font-size: 26rpx;

    .label {
      color: #999;
      width: 180rpx;
    }

    .value {
      flex: 1;
      color: #333;
    }
  }
}

// 商品区域
.product-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 30rpx;

  .section-title {
    font-size: 28rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }

  .product-list {
    .product-item {
      display: flex;
      justify-content: space-between;
      padding: 16rpx 0;
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .product-info {
        flex: 1;

        .product-name {
          font-size: 26rpx;
          margin-bottom: 6rpx;
        }

        .product-desc {
          font-size: 22rpx;
          color: #999;
        }
      }

      .product-price-info {
        display: flex;
        align-items: center;

        .product-price {
          font-size: 26rpx;
          margin-right: 20rpx;
        }

        .product-quantity {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }

  .total-info {
    display: flex;
    justify-content: space-between;
    margin-top: 30rpx;
    padding-top: 20rpx;
    border-top: 1px solid #f5f5f5;

    .total-label {
      font-size: 28rpx;
    }

    .total-value {
      font-size: 32rpx;
      font-weight: bold;
      color: #e60012;
    }
  }
}

// 底部按钮
.bottom-btns {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .btn {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    margin: 0 10rpx;

    &.btn-secondary {
      background-color: #f5f5f5;
      color: #666;
    }

    &.btn-primary {
      background-color: #e60012;
      color: #fff;
    }
  }
}
</style>
