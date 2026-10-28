<template>
  <view class="container">
    <!-- 搜索框 -->
    <view class="header" :style="headerStyle">
      <image
        class="back-icon"
        @tap="switchCurrentStore"
        src="../../../static/icons/arrow-left.svg"
      ></image>
      <view class="search-input">
        <image
          class="search-icon"
          src="../../../static/icons/search.svg"
        ></image>
        <input
          placeholder="请输入商品名"
          v-model="searchKeyword"
          @input="onSearchInput"
        />
      </view>
    </view>
    <view class="menu-info">
      <view class="store-info">
        <view class="store-name" @tap="switchCurrentStore">
          {{ currentStore.name || "请选择门店" }}
          <image src="../../../static/icons/arrow-right.svg"></image>
        </view>
        <view class="store-location">
          <image
            class="location-icon"
            src="../../../static/icons/location.svg"
          ></image>
          <view class="distance-info">
            距离您
            <view style="color: red; margin-left: 4rpx"
              >{{ currentStore.distance }}km</view
            >
          </view>
        </view>
      </view>
      <view class="trade-type">自提</view>
    </view>
    <view class="menu">
      <!-- 侧边栏 -->
      <sidebar :list="categoryList" @change="onCategoryChange"></sidebar>
      <!-- 右边 -->
      <scroll-view class="menu-list" scroll-y :show-scrollbar="false" enhanced>
        <!-- 自定义轮播图 -->
        <view class="swiper-container">
          <swiper
            class="swiper"
            :circular="true"
            :autoplay="true"
            :interval="3000"
            :duration="500"
            @change="onSwiperChange"
          >
            <swiper-item
              v-for="(item, index) in swiperList"
              :key="index"
              @tap="onSwiperTab(item)"
            >
              <image
                class="swiper-image"
                :src="item.imageUri"
                mode="aspectFill"
              ></image>
            </swiper-item>
          </swiper>
          <view class="dots">
            <view
              v-for="(item, index) in swiperList"
              :key="index"
              :class="['dot', current === index ? 'active' : '']"
            ></view>
          </view>
        </view>

        <!-- list -->
        <view class="list">
          <view class="section">
            <view class="section-header">{{ currentCategory }}</view>
            <view class="section-list">
              <view
                class="item"
                v-for="(item, index) in filteredGoodsList"
                :key="index"
              >
                <image :src="item.image" @tap="goToProductDetail(item)"></image>
                <view class="info" @tap="goToProductDetail(item)">
                  <view class="name">{{ item.name }}</view>
                  <view class="description">{{ item.description }}</view>
                  <view class="price">¥{{ item.price }}</view>
                </view>
                <view class="add-icon" @tap="addToCart(item)">
                  <image src="../../../static/icons/plus.svg"></image>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <cart-bar
      v-model:cart-items="cartItems"
      v-model:total-price="totalPrice"
      @checkout="onCheckout"
    ></cart-bar>
  </view>
</template>

<script>
import Sidebar from "../../../components/sidebar/index.vue";
import CartBar from "../../../components/cart-bar/index.vue";

export default {
  components: {
    Sidebar,
    CartBar,
  },
  data() {
    return {
      headerStyle: "",
      searchKeyword: "", // 搜索关键词
      cartItems: [], // 购物车商品
      totalPrice: 0, // 购物车总价
      swiperList: [
        {
          imageUri: "/static/carousel/IMG_1508.JPG",
          type: "url",
          target: "",
        },
        {
          imageUri: "/static/carousel/IMG_1508.JPG",
          type: "product",
          target: "1",
        },
        {
          imageUri: "/static/carousel/IMG_1508.JPG",
          type: "url",
          target: "",
        },
      ],
      current: 0,
      currentCategoryIndex: 0,
      categoryList: ["鲜萃咖啡","当季新品","本店热销","真鲜果茶","醇香奶茶","轻乳系列"],
      goodsList: [
        // 鲜萃咖啡
        {
          id: 1,
          categoryId: 0,
          name: "生椰拿铁",
          description: "醇香咖啡搭配香浓生椰乳",
          price: 13,
          image: "/static/images/product-image.png",
        },
        {
          id: 2,
          categoryId: 0,
          name: "冰萃咖啡",
          description: "精选阿拉比卡咖啡豆现萃",
          price: 11,
          image: "/static/images/product-image.png",
        },
        {
          id: 3,
          categoryId: 0,
          name: "美式咖啡",
          description: "醇香浓郁，回味甘甜",
          price: 10,
          image: "/static/images/product-image.png",
        },
        // 当季新品
        {
          id: 4,
          categoryId: 1,
          name: "芝芝莓莓",
          description: "莓香浓郁，口感丰富",
          price: 15,
          image: "/static/images/product-image.png",
        },
        {
          id: 5,
          categoryId: 1,
          name: "多肉葡萄",
          description: "多重果肉，鲜爽可口",
          price: 14,
          image: "/static/images/product-image.png",
        },
        // 本店热销
        {
          id: 6,
          categoryId: 2,
          name: "蜜雪冰城",
          description: "招牌饮品，清爽怡人",
          price: 6,
          image: "/static/images/product-image.png",
        },
        {
          id: 7,
          categoryId: 2,
          name: "柠檬水",
          description: "新鲜柠檬，酸甜可口",
          price: 5,
          image: "/static/images/product-image.png",
        },
        // 真鲜果茶
        {
          id: 8,
          categoryId: 3,
          name: "满杯百香果",
          description: "酸甜百香果，清爽解腻",
          price: 12,
          image: "/static/images/product-image.png",
        },
        {
          id: 9,
          categoryId: 3,
          name: "杨枝甘露",
          description: "经典港式饮品，香甜软糯",
          price: 14,
          image: "/static/images/product-image.png",
        },
        // 醇香奶茶
        {
          id: 10,
          categoryId: 4,
          name: "蜜香奶茶",
          description: "醇香奶茶，香浓丝滑",
          price: 9,
          image: "/static/images/product-image.png",
        },
        {
          id: 11,
          categoryId: 4,
          name: "椰香奶茶",
          description: "椰香浓郁，奶味十足",
          price: 11,
          image: "/static/images/product-image.png",
        },
        // 轻乳系列
        {
          id: 12,
          categoryId: 5,
          name: "芝士轻乳",
          description: "轻盈奶香，芝士醇厚",
          price: 13,
          image: "/static/images/product-image.png",
        },
        {
          id: 13,
          categoryId: 5,
          name: "芒果轻乳",
          description: "芒果清甜，奶香浓郁",
          price: 14,
          image: "/static/images/product-image.png",
        },
      ],
      currentStore: {
        id: "",
        name: "请选择门店",
        address: "",
        distance: 0,
        isOpen: true,
        businessHours: "",
        phone: "",
        latitude: 0,
        longitude: 0,
      },
    };
  },
  computed: {
    // 获取当前分类名称
    currentCategory() {
      return this.categoryList[this.currentCategoryIndex];
    },
    // 根据当前分类和搜索关键词筛选商品列表
    filteredGoodsList() {
      let result = this.goodsList.filter(
        (item) => item.categoryId === this.currentCategoryIndex
      );

      // 如果有搜索关键词，进行模糊匹配
      if (this.searchKeyword.trim()) {
        const keyword = this.searchKeyword.toLowerCase().trim();
        result = result.filter(
          (item) =>
            item.name.toLowerCase().includes(keyword) ||
            item.description.toLowerCase().includes(keyword)
        );
      }

      return result;
    },
  },
  onLoad(options) {
    this.makeHeaderStyle();
    // 尝试从URL参数获取门店信息
    if (options.storeInfo) {
      try {
        const storeInfo = JSON.parse(decodeURIComponent(options.storeInfo));
        this.currentStore = storeInfo;
      } catch (error) {
        this.getStoreFromStorage();
      }
    } else {
      this.getStoreFromStorage();
    }
  },
  onShow() {
    this.getStoreFromStorage();
    this.checkReorderItems();
    this.checkTempCartItems();
  },
  methods: {
    checkReorderItems() {
      try {
        const reorderItemsStr = uni.getStorageSync("reorderItems");
        if (reorderItemsStr) {
          const reorderItems = JSON.parse(reorderItemsStr);
          if (reorderItems && reorderItems.length > 0) {
            this.cartItems = [];
            reorderItems.forEach((item) => {
              if (item.customized) this.addCustomizedItemToCart(item);
              else this.addToCart(item, false);
            });
            uni.removeStorageSync("reorderItems");
          }
        }
      } catch (error) {}
    },
    getStoreFromStorage() {
      try {
        const storeInfo = uni.getStorageSync("selectedStore");
        if (storeInfo) {
          this.currentStore = JSON.parse(storeInfo);
        }
      } catch (error) {}
    },
    makeHeaderStyle() {
      // 微信端按胶囊按钮定位，H5 等平台使用普通顶部间距。
      this.headerStyle = "padding-top: 12px;";
      // #ifdef MP-WEIXIN
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
      const { top, height } = menuButtonInfo;
      const menuButtonCenterPoint = top + height / 2;
      this.headerStyle = `margin-top: calc(${menuButtonCenterPoint}px - 32rpx);`;
      // #endif
    },
    switchCurrentStore() {
      uni.switchTab({
        url: "/pages/list/store/index",
      });
    },
    onSwiperChange(e) {
      this.current = e.detail.current;
    },
    onSwiperTab(item) {
      if (item.type === "url") {
        uni.navigateTo({
          url: `/pages/web-view/index?url=${item.target}`,
        });
      } else {
        uni.navigateTo({
          url: `/pages/product/detail?id=${item.target}`,
        });
      }
    },
    onCategoryChange(index) {
      this.currentCategoryIndex = index;
    },
    onSearchInput() {},
    addToCart(item, showToast = true) {
      const existingItem = this.cartItems.find(
        (cartItem) => cartItem.id === item.id && !cartItem.customized
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cartItems.push({
          ...item,
          quantity: 1,
          customized: false,
        });
      }

      this.updateTotalPrice();

      if (showToast) {
        uni.showToast({
          title: "已添加到购物车",
          icon: "success",
          duration: 1500,
        });
      }
    },
    addCustomizedItemToCart(item) {
      const customizedItem = {
        ...item,
        customized: true,
        uniqueId: Date.now(),
      };
      this.cartItems.push(customizedItem);
      this.updateTotalPrice();
    },
    checkTempCartItems() {
      try {
        const tempCartItemsStr = uni.getStorageSync("tempCartItems");
        if (tempCartItemsStr) {
          const tempCartItems = JSON.parse(tempCartItemsStr);
          if (tempCartItems && tempCartItems.length > 0) {
            tempCartItems.forEach((item) => {
              this.addCustomizedItemToCart(item);
            });
            uni.removeStorageSync("tempCartItems");
          }
        }
      } catch (error) {}
    },
    goToProductDetail(item) {
      try {
        uni.setStorageSync("allProducts", JSON.stringify(this.goodsList));
        uni.setStorageSync("currentProduct", JSON.stringify(item));
        uni.navigateTo({
          url: `/pages/product/detail?id=${item.id}`,
        });
      } catch (error) {
        uni.navigateTo({
          url: `/pages/product/detail?id=${item.id}`,
        });
      }
    },
    updateTotalPrice() {
      this.totalPrice = this.cartItems.reduce((total, item) => {
        if (item.customized && item.totalPrice) {
          return total + item.totalPrice;
        } else {
          return total + item.price * item.quantity;
        }
      }, 0);
    },
    onCheckout() {
      if (this.cartItems.length === 0) {
        uni.showToast({
          title: "购物车为空",
          icon: "none",
          duration: 1500,
        });
        return;
      }

      const userInfoStr = uni.getStorageSync("userInfo");
      let userName = "匿名用户";
      let userPhone = "未绑定手机号";

      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          if (userInfo.desensitiveMobile) {
            userName = userInfo.desensitiveMobile;
          }
          if (userInfo.mobile) {
            userPhone = userInfo.mobile;
          }
        } catch (error) {}
      }

      const orderInfo = {
        id: Date.now().toString(),
        items: [...this.cartItems],
        totalPrice: this.totalPrice,
        status: "进行中",
        time: new Date().toLocaleString(),
        store: this.currentStore.name || "未知门店",
        address: this.currentStore.address || "未知地址",
        userName: userName,
        userPhone: userPhone,
      };

      let orderList = uni.getStorageSync("orderList") || [];
      orderList.unshift(orderInfo);
      uni.setStorageSync("orderList", orderList);

      this.cartItems = [];
      this.totalPrice = 0;

      uni.showToast({
        title: "支付成功",
        icon: "success",
        duration: 1000,
      });

      setTimeout(() => {
        uni.navigateTo({
          url: `/pages/list/order/detail?id=${orderInfo.id}`,
        });
      }, 1200);
    },
  },
};
</script>

<style lang="scss">
/* 头部搜索区域 */
.header {
  display: flex;
  align-items: center;
  padding: 0 30rpx;

  .back-icon {
    width: 48rpx;
    height: 48rpx;
    margin-right: 20rpx;
  }

  .search-input {
    flex: 1;
    height: 64rpx;
    background-color: #f5f5f5;
    border-radius: 32rpx;
    display: flex;
    align-items: center;
    padding: 0 24rpx;

    .search-icon {
      width: 32rpx;
      height: 32rpx;
      margin-right: 12rpx;
    }

    input {
      flex: 1;
      height: 100%;
      font-size: 28rpx;
    }
  }
}

/* 菜单信息区域 */
.menu-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;

  .store-info {
    flex: 1;

    .store-name {
      display: flex;
      align-items: center;
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 8rpx;

      image {
        width: 24rpx;
        height: 24rpx;
        margin-left: 8rpx;
      }
    }

    .store-location {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #999;

      .location-icon {
        width: 24rpx;
        height: 24rpx;
        margin-right: 8rpx;
      }

      .distance-info {
        display: flex;
        align-items: center;
      }
    }
  }

  .trade-type {
    padding: 4rpx 16rpx;
    background-color: #f5f5f5;
    border-radius: 20rpx;
    font-size: 24rpx;
    color: #666;
  }
}

/* 自定义轮播图样式 */
.swiper-container {
  position: relative;
  width: 100%;
  height: 300rpx;

  .swiper {
    width: 100%;
    height: 100%;

    .swiper-image {
      width: 100%;
      height: 100%;
    }
  }

  .dots {
    position: absolute;
    bottom: 20rpx;
    left: 30rpx;
    display: flex;

    .dot {
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.4);
      margin-right: 12rpx;
      transition: all 0.3s;

      &.active {
        width: 18rpx;
        height: 12rpx;
        border-radius: 6rpx;
        background-color: #ffffff;
      }
    }
  }
}

/* 菜单主体区域 */
.menu {
  display: flex;
  height: calc(100vh - 200rpx);

  .menu-list {
    flex: 1;
    min-width: 0;
    height: 100%;

    .list {
      padding: 20rpx;

      .section {
        margin-bottom: 30rpx;

        .section-header {
          font-size: 32rpx;
          font-weight: bold;
          margin-bottom: 20rpx;
        }

        .section-list {
          .item {
            display: flex;
            margin-bottom: 30rpx;

            image {
              flex-shrink: 0;
              width: 160rpx;
              height: 160rpx;
              border-radius: 12rpx;
              margin-right: 20rpx;
            }

            .info {
              flex: 1;
              min-width: 0;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 10rpx 0;

              .name {
                font-size: 28rpx;
                font-weight: bold;
              }

              .description {
                font-size: 24rpx;
                color: #999;
              }

              .price {
                font-size: 32rpx;
                color: #e60012;
                font-weight: bold;
              }
            }

            .add-icon {
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 48rpx;
              height: 48rpx;
              background-color: #e60012;
              border-radius: 50%;
              margin-top: 56rpx;

              image {
                width: 24rpx;
                height: 24rpx;
                margin: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
