<template>
  <view class="container">
    <view class="order-tabs">
      <view v-for="(tab, index) in tabList" :key="tab.name" class="order-tab"
        :class="{ active: current === index }" @tap="onTabChange(index)">{{ tab.name }}</view>
    </view>
    <view class="order-body">
      <!-- <u-tab-pane v-for="(item, index) in tabList" :key="index"> -->
      <!-- 订单列表 -->
      <view v-if="filteredOrderList.length > 0" class="order-list">
        <view
          class="order-item"
          v-for="(order, orderIndex) in filteredOrderList"
          :key="orderIndex"
          @tap="goToOrderDetail(order)"
        >
          <view class="order-header">
            <view class="store-info">
              <view class="store-name">{{ order.store }}</view>
              <view class="store-address" v-if="order.address">{{ order.address }}</view>
              <view class="user-name" v-if="order.userName">用户：{{ order.userName }}</view>
            </view>
            <view class="order-status">{{ order.status }}</view>
          </view>
          <view class="order-content">
            <view
              class="product-item"
              v-for="(product, productIndex) in order.items"
              :key="productIndex"
            >
              <view class="product-info">
                <view class="product-name">{{ product.name }}</view>
                <view class="product-quantity">x{{ product.quantity }}</view>
              </view>
              <view class="product-price">¥{{ product.customized ? (product.totalPrice / product.quantity).toFixed(2) : product.price }}</view>
            </view>
          </view>
          <view class="order-footer">
            <view class="order-time">{{ order.time }}</view>
            <view class="order-total"
              >合计：<text class="price"
                >¥{{ order.totalPrice.toFixed(2) }}</text
              ></view
            >
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-content">
        <image
          mode="aspectFill"
          src="../../../static/images/no_coupon.png"
        ></image>
        <view class="text">您还没有订单，快去选一杯喜欢的饮品吧</view>
        <view @tap="goMenu" class="drink">去喝一杯</view>
      </view>
      <!-- </u-tab-pane> -->
    </view>
  </view>
</template>

<script>
export default {
  name: "OrderPage",
  data() {
    return {
      current: 0,
      tabList: [{ name: "进行中" }, { name: "历史" }, { name: "退单" }],
      orderList: [],
    };
  },
  computed: {
    // 根据当前标签页筛选订单列表
    filteredOrderList() {
      if (this.current === 0) {
        // 进行中的订单
        return this.orderList.filter(order => order.status === "进行中");
      } else if (this.current === 1) {
        // 历史订单
        return this.orderList.filter(order => order.status === "已完成");
      } else {
        // 退单
        return this.orderList.filter(order => order.status === "已退单");
      }
    },
  },
  onShow() {
    // 每次显示页面时获取最新订单数据
    this.getOrderList();
  },
  methods: {
    onTabChange(index) {
      this.current = index;
    },
    goMenu() {
      // 跳转到菜单页面
      uni.switchTab({
        url: "/pages/list/store/index",
      });
    },
    // 获取订单列表
    getOrderList() {
      // 从本地存储获取订单数据
      const orderList = uni.getStorageSync("orderList") || [];
      this.orderList = orderList;
    },
    goToOrderDetail(order) {
      // 跳转到订单详情页面
      uni.navigateTo({
        url: `/pages/list/order/detail?id=${order.id}`
      });
    },
  },
};
</script>

<style lang="scss">
.order-tabs { display: flex; background: #fff; }
.order-tab { flex: 1; text-align: center; padding: 28rpx 0; color: #888; border-bottom: 4rpx solid transparent; }
.order-tab.active { color: #e60012; border-bottom-color: #e60012; }
.order-body { flex: 1; width: 100%; }
.container {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;

  image {
    width: 240rpx;
    height: 240rpx;
    margin-bottom: 30rpx;
  }

  .text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }

  .drink {
    width: 240rpx;
    height: 80rpx;
    background-color: #e60012;
    color: #fff;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
  }
}

/* 订单列表样式 */
.order-list {
  padding: 20rpx;

  .order-item {
    background-color: #fff;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    padding: 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .order-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;
      padding-bottom: 20rpx;
      border-bottom: 1rpx solid #f5f5f5;

      .store-info {
        .store-name {
          font-size: 28rpx;
          font-weight: bold;
        }

        .store-address {
          font-size: 24rpx;
          color: #999;
          margin-top: 6rpx;
        }

        .user-name {
          font-size: 24rpx;
          color: #999;
          margin-top: 6rpx;
        }
      }

      .order-status {
        font-size: 24rpx;
        color: #e60012;
      }
    }

    .order-content {
      .product-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16rpx;

        .product-info {
          display: flex;

          .product-name {
            font-size: 26rpx;
            margin-right: 20rpx;
          }

          .product-quantity {
            font-size: 26rpx;
            color: #999;
          }
        }

        .product-price {
          font-size: 26rpx;
        }
      }
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 20rpx;
      padding-top: 20rpx;
      border-top: 1rpx solid #f5f5f5;

      .order-time {
        font-size: 24rpx;
        color: #999;
      }

      .order-total {
        font-size: 26rpx;

        .price {
          font-size: 28rpx;
          color: #e60012;
          font-weight: bold;
        }
      }
    }
  }
}

/* 自定义tabs样式 */
:deep(.u-tabs) {
  background-color: #fff;
}

:deep(.u-tab-item) {
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.u-tab-item-active) {
  color: #e60012;
  font-weight: bold;
}

:deep(.u-tabs-scorll__line) {
  background-color: #e60012;
}
</style>
