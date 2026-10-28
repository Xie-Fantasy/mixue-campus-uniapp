<template>
  <view class="chart-bar">
    <view class="cart-icon-container" @tap="toggleCartPanel">
      <image class="chart-icon" src="../../static/images/chart.png"></image>
      <view v-if="totalItems > 0" class="badge">{{ totalItems }}</view>
    </view>
    <view class="summary">
      合计：<view class="price">¥{{ totalPrice.toFixed(2) }}</view>
    </view>
    <view
      class="checkout-btn"
      :class="{ disabled: totalPrice <= 0 }"
      @tap="onCheckClick"
      >去结算</view
    >

    <!-- 购物车面板 -->
    <view class="cart-panel" v-if="showCartPanel">
      <view class="cart-header">
        <view class="title">购物车</view>
        <view class="clear" @tap="clearCart">清空</view>
      </view>
      <scroll-view class="cart-list" scroll-y>
        <view v-if="cartItems.length === 0" class="empty-cart"
          >购物车是空的</view
        >
        <view
          v-else
          class="cart-item"
          v-for="(item, index) in cartItems"
          :key="index"
        >
          <view class="item-info">
            <view class="item-name">{{ item.name }}</view>
            <!-- 显示定制选项 -->
            <view v-if="item.customized" class="item-customization">
              <view v-if="item.temperature">{{ item.temperature }}</view>
              <view v-if="item.sweetness">{{ item.sweetness }}</view>
              <view v-if="item.toppings && item.toppings.length > 0">
                <text v-for="(topping, idx) in item.toppings" :key="idx">
                  {{ topping.name }}{{ idx < item.toppings.length - 1 ? '，' : '' }}
                </text>
              </view>
            </view>
            <view class="item-price">
              ¥{{ item.customized ? (item.totalPrice / item.quantity).toFixed(2) : item.price }}
            </view>
          </view>
          <view class="item-quantity">
            <view class="quantity-btn" @tap="decreaseQuantity(item)">-</view>
            <view class="quantity">{{ item.quantity }}</view>
            <view class="quantity-btn" @tap="increaseQuantity(item)">+</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 遮罩层 -->
    <view class="mask" v-if="showCartPanel" @tap="toggleCartPanel"></view>
  </view>
</template>

<script>
export default {
  name: "CartBar",
  props: {
    cartItems: {
      type: Array,
      default: () => [],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  emits: ["update:cartItems", "update:totalPrice", "checkout"],
  data() {
    return {
      showCartPanel: false, // 控制购物车面板显示
    };
  },
  computed: {
    // 计算购物车中的商品总数
    totalItems() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
  },
  methods: {
    // 结算按钮点击事件
    onCheckClick() {
      if (this.totalPrice <= 0) {
        uni.showToast({
          title: "购物车为空",
          icon: "none",
          duration: 1500,
        });
        return;
      }

      // 触发结算事件
      this.$emit("checkout");
    },

    // 切换购物车面板显示/隐藏
    toggleCartPanel() {
      this.showCartPanel = !this.showCartPanel;
    },

    // 清空购物车
    clearCart() {
      uni.showModal({
        title: "提示",
        content: "确定要清空购物车吗？",
        success: (res) => {
          if (res.confirm) {
            console.log("清空购物车，发送事件：update:cartItems", []);
            this.$emit("update:cartItems", []);
            this.$emit("update:totalPrice", 0);
            this.showCartPanel = false;
          }
        },
      });
    },

    // 增加商品数量
    increaseQuantity(item) {
      const updatedItems = [...this.cartItems];
      const index = updatedItems.findIndex((i) =>
        item.customized ? i.uniqueId === item.uniqueId : i.id === item.id && !i.customized
      );

      if (index !== -1) {
        const unitPrice = updatedItems[index].customized
          ? updatedItems[index].totalPrice / updatedItems[index].quantity : 0;
        updatedItems[index].quantity += 1;

        // 如果是定制商品，更新总价
        if (updatedItems[index].customized) {
          updatedItems[index].totalPrice = unitPrice * updatedItems[index].quantity;
        }

        this.$emit("update:cartItems", updatedItems);
        this.updateTotalPrice(updatedItems);
      }
    },

    // 减少商品数量
    decreaseQuantity(item) {
      const updatedItems = [...this.cartItems];
      const index = updatedItems.findIndex((i) =>
        item.customized ? i.uniqueId === item.uniqueId : i.id === item.id && !i.customized
      );

      if (index !== -1) {
        if (updatedItems[index].quantity > 1) {
          const unitPrice = updatedItems[index].customized
            ? updatedItems[index].totalPrice / updatedItems[index].quantity : 0;
          updatedItems[index].quantity -= 1;

          // 如果是定制商品，更新总价
          if (updatedItems[index].customized) {
            updatedItems[index].totalPrice = unitPrice * updatedItems[index].quantity;
          }
        } else {
          updatedItems.splice(index, 1);
        }

        this.$emit("update:cartItems", updatedItems);
        this.updateTotalPrice(updatedItems);
      }
    },

    // 更新总价
    updateTotalPrice(items) {
      const newTotal = items.reduce((total, item) => {
        if (item.customized) {
          return total + item.totalPrice;
        } else {
          return total + item.price * item.quantity;
        }
      }, 0);

      this.$emit("update:totalPrice", newTotal);
    },
  },
};
</script>

<style lang="scss">
/* components/cart-bar/index.wxss */
.chart-bar {
  box-sizing: border-box;
  background-color: #ffffff;
  width: 100%;
  left: 0;
  position: fixed;
  bottom: 0;
  padding: 6rpx 24rpx 18rpx;
  display: flex;
  align-items: center;
  z-index: 100; // 确保在其他元素上方显示

  .cart-icon-container {
    position: relative;

    .chart-icon {
      width: 72rpx;
      height: 90rpx;
    }

    .badge {
      position: absolute;
      top: -10rpx;
      right: -10rpx;
      background-color: #e60012;
      color: #fff;
      font-size: 20rpx;
      min-width: 32rpx;
      height: 32rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6rpx;
    }
  }

  .summary {
    margin-left: 30rpx;
    flex: 1;
    display: flex;
    align-items: baseline;
    font-size: 22rpx;

    .price {
      font-size: 32rpx;
    }
  }

  .checkout-btn {
    width: 236rpx;
    height: 90rpx;
    border-radius: 8rpx;
    line-height: 90rpx;
    text-align: center;
    background-color: #e60012;
    color: #ffffff;
    font-size: 32rpx;

    &.disabled {
      background-color: #f7f7f7;
      color: #a6a6a6;
    }
  }

  // 购物车面板
  .cart-panel {
    position: absolute;
    bottom: 120rpx;
    left: 0;
    width: 100%;
    background-color: #fff;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
    z-index: 101;

    .cart-header {
      display: flex;
      justify-content: space-between;
      padding: 30rpx;
      border-bottom: 1rpx solid #f5f5f5;

      .title {
        font-size: 32rpx;
        font-weight: bold;
      }

      .clear {
        font-size: 28rpx;
        color: #999;
      }
    }

    .cart-list {
      box-sizing: border-box;
      width: 100%;
      max-height: 600rpx;
      padding: 0 30rpx;

      .empty-cart {
        padding: 60rpx 0;
        text-align: center;
        color: #999;
        font-size: 28rpx;
      }

      .cart-item {
        display: flex;
        justify-content: space-between;
        padding: 30rpx 0;
        border-bottom: 1rpx solid #f5f5f5;

        .item-info {
          flex: 1;
          padding-right: 20rpx;

          .item-name {
            font-size: 28rpx;
            font-weight: bold;
            margin-bottom: 10rpx;
          }

          .item-customization {
            font-size: 24rpx;
            color: #666;
            margin-bottom: 10rpx;
          }

          .item-price {
            font-size: 28rpx;
            color: #e60012;
          }
        }

        .item-quantity {
          display: flex;
          align-items: center;
          margin-right: 40rpx;

          .quantity-btn {
            width: 50rpx;
            height: 50rpx;
            border-radius: 50%;
            background-color: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32rpx;
          }

          .quantity {
            width: 60rpx;
            text-align: center;
            font-size: 28rpx;
          }
        }
      }
    }
  }

  // 遮罩层
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
}
</style>
