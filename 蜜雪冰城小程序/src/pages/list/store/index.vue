<template>
  <view class="container">
    <!-- 顶部导航区域（包含导航栏和地址选择） -->
    <view class="nav-container">
      <!-- 顶部导航栏 -->
      <view class="custom-nav-bar">
        <view class="left-icon" @tap="goBack">
          <image
            class="icon-image"
            src="../../../static/icons/arrow-left.svg"
            mode="aspectFit"
          ></image>
        </view>
        <view class="nav-title-container">
          <text class="nav-title">{{
            isDeliveryMode ? "选择外送门店" : "选择门店列表"
          }}</text>
        </view>
      </view>

      <!-- 外送地址选择区域 -->
      <view class="delivery-address-container" v-if="isDeliveryMode">
        <view class="address-label-container">
          <text class="address-label">配送地址</text>
        </view>
        <view class="delivery-address" @tap="goToAddressList">
          <!-- 有地址时显示地址信息 -->
          <template v-if="hasAddress">
            <view class="address-left">
              <view class="address-icon">
                <image
                  class="icon-image"
                  src="../../../static/icons/location.svg"
                  mode="aspectFit"
                ></image>
              </view>
              <view class="address-content">
                <view class="address-line">
                  {{ currentAddressDetail }}
                </view>
                <view class="address-sub-line">
                  {{ currentAddressCity }}
                </view>
              </view>
            </view>
            <view class="address-arrow">
              <image
                class="icon-image"
                src="../../../static/icons/arrow-right.svg"
                mode="aspectFit"
              ></image>
            </view>
          </template>

          <!-- 无地址时显示提示 -->
          <template v-else>
            <view class="no-address-tip">
              <text>您还没有添加过地址，点击添加</text>
            </view>
            <view class="address-arrow">
              <image
                class="icon-image"
                src="../../../static/icons/arrow-right.svg"
                mode="aspectFit"
              ></image>
            </view>
          </template>
        </view>
      </view>
    </view>

    <!-- 顶部通知栏 -->
    <view class="notice-bar">
      <view class="notice-content">
        <!-- <image
          class="notice-icon"
          src="../../../static/icons/notice.svg"
        ></image> -->
        <text class="notice-text"
          >欢迎光临蜜雪冰城，{{
            isDeliveryMode ? "请选择外送门店" : "请选择门店"
          }}</text
        >
      </view>
    </view>

    <!-- 标签页 -->
    <view class="tabs">
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @tap="switchTab(index)"
      >
        {{ tab.title }}
      </view>
    </view>

    <!-- 门店列表 -->
    <scroll-view
      class="store-list"
      :class="{ 'with-address': isDeliveryMode }"
      scroll-y
    >
      <view
        v-for="(store, index) in storeList"
        :key="index"
        class="store-item"
        @tap="popupStoreDetail(store)"
      >
        <view class="store-info">
          <view class="store-name">{{ store.name }}</view>
          <view class="store-address">{{ store.address }}</view>
          <view class="store-distance">距离您 {{ store.distance }}km</view>
        </view>
        <view class="store-action">
          <view class="store-status" :class="{ open: store.isOpen }">
            {{ store.isOpen ? "营业中" : "休息中" }}
          </view>
          <view class="goto-btn" @tap.stop="gotoMenu(store)">去点单</view>
        </view>
      </view>
    </scroll-view>

    <!-- 门店详情弹窗 -->
    <uni-popup ref="storeDetailPopup" type="center">
      <view class="store-detail">
        <view class="detail-header">
          <view class="detail-title">门店详情</view>
          <view class="close-btn" @tap="closeStoreDetail">×</view>
        </view>
        <view class="detail-content">
          <view class="detail-item">
            <view class="item-label">门店名称</view>
            <view class="item-value">{{ currentStore.name }}</view>
          </view>
          <view class="detail-item">
            <view class="item-label">营业时间</view>
            <view class="item-value">{{ currentStore.businessHours }}</view>
          </view>
          <view class="detail-item">
            <view class="item-label">门店地址</view>
            <view class="item-value">{{ currentStore.address }}</view>
          </view>
          <view class="detail-item">
            <view class="item-label">联系电话</view>
            <view class="item-value">{{ currentStore.phone }}</view>
          </view>
        </view>
        <view class="detail-footer">
          <view class="nav-btn" @tap="navigateToStore">
            <!-- <image src="../../../static/icons/navigation.svg"></image> -->
            <!-- <image src="../../../static/icons/"></image> -->
            <text>导航</text>
          </view>
          <view class="order-btn" @tap="gotoMenu(currentStore)">去点单</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: "StorePage",
  data() {
    return {
      currentTab: 0,
      searchValue: "",
      isLoading: true,
      orderType: "到店自取",
      isDeliveryMode: false,
      tabs: [{ title: "附近门店" }, { title: "常去门店" }],
      selectedAddress: { id: "1", name: "演示用户", phone: "11111111111", address: "江苏省无锡市滨湖区无锡职业技术学院" },
      storeList: [
        { id: "1", name: "蜜雪冰城（无锡职院店）", address: "江苏省无锡市滨湖区无锡职业技术学院", distance: 1.2, isOpen: true, businessHours: "09:00-22:00", phone: "010-12345678", latitude: 39.9, longitude: 116.3 },
        { id: "2", name: "蜜雪冰城（大悦城店）", address: "江苏省无锡市滨湖区大悦城", distance: 2.5, isOpen: true, businessHours: "09:00-21:30", phone: "010-87654321", latitude: 39.95, longitude: 116.35 },
        { id: "3", name: "蜜雪冰城（万象城店）", address: "江苏省无锡市滨湖区万象城", distance: 3.8, isOpen: false, businessHours: "10:00-22:00", phone: "010-11223344", latitude: 39.92, longitude: 116.32 },
        { id: "4", name: "蜜雪冰城（江南大学店）", address: "江苏省无锡市滨湖区星光广场", distance: 5.8, isOpen: false, businessHours: "10:00-22:00", phone: "010-16523344", latitude: 39.92, longitude: 116.32 },
        { id: "5", name: "蜜雪冰城（江南大学店）", address: "江苏省无锡市滨湖区江南大学", distance: 4.8, isOpen: false, businessHours: "10:00-22:00", phone: "010-16523344", latitude: 39.92, longitude: 116.32 },
        { id: "5", name: "蜜雪冰城（星光广场店）", address: "江苏省无锡市滨湖区星光广场", distance: 5.8, isOpen: false, businessHours: "10:00-22:00", phone: "010-16523344", latitude: 39.92, longitude: 116.32 }
      ],
      currentStore: { id: "", name: "", address: "", distance: 0, isOpen: true, businessHours: "", phone: "", latitude: 0, longitude: 0 }
    };
  },
  computed: {
    hasAddress() {
      return this.selectedAddress && this.selectedAddress.address;
    },
    currentAddressDetail() {
      if (!this.hasAddress) return "";
      const address = this.selectedAddress.address;
      const parts = address.split("市");
      return parts.length > 1 ? parts[1] : address;
    },
    currentAddressCity() {
      if (!this.hasAddress) return "";
      const address = this.selectedAddress.address;
      const parts = address.split("市");
      return parts.length > 1 ? `${parts[0]}市` : "";
    },
  },
  onLoad(options) {
    if (this.storeList.length > 0) {
      this.currentStore = this.storeList[0];
      uni.setStorageSync("selectedStore", JSON.stringify(this.currentStore));
    }
    this.getStoreList();
    this.initAddressList();
    this.checkOrderType();
    uni.$on("addressChanged", (address) => {
      if (address) this.selectedAddress = JSON.parse(JSON.stringify(address));
    });
  },
  onShow() {
    this.checkOrderType();
    this.refreshAddressInfo();
  },
  onUnload() {
    uni.$off("addressChanged");
  },
  methods: {
    checkOrderType() {
      const orderType = uni.getStorageSync("orderType") || "";
      this.isDeliveryMode = orderType.indexOf("外送") !== -1;
      if (this.isDeliveryMode) this.initAddressList();
    },
    initAddressList() {
      if (this.isDeliveryMode) {
        try {
          const addressListStr = uni.getStorageSync("addressList");
          let addressList = addressListStr ? JSON.parse(addressListStr) : [];
          let selectedAddressId = uni.getStorageSync("selectedAddressId");

          if (selectedAddressId && addressList.length > 0) {
            const address = addressList.find(item => item.id === selectedAddressId);
            if (address) {
              this.selectedAddress = address;
            } else if (addressList.length > 0) {
              this.selectedAddress = addressList[0];
              uni.setStorageSync("selectedAddressId", addressList[0].id);
            } else {
              this.selectedAddress = {};
            }
          } else if (addressList.length > 0) {
            this.selectedAddress = addressList[0];
            uni.setStorageSync("selectedAddressId", addressList[0].id);
          } else {
            this.selectedAddress = {};
          }
        } catch (error) {
          this.selectedAddress = {};
        }
      }
    },
    refreshAddressInfo() {
      try {
        const selectedAddressId = uni.getStorageSync("selectedAddressId");
        const addressListStr = uni.getStorageSync("addressList");

        if (!addressListStr) {
          this.selectedAddress = {};
          return;
        }

        const addressList = JSON.parse(addressListStr);
        if (addressList.length === 0) {
          this.selectedAddress = {};
          return;
        }

        if (selectedAddressId) {
          const address = addressList.find(item => item.id === selectedAddressId);
          if (address) {
            this.selectedAddress = JSON.parse(JSON.stringify(address));
            return;
          }
        }

        if (addressList.length > 0) {
          this.selectedAddress = JSON.parse(JSON.stringify(addressList[0]));
          uni.setStorageSync("selectedAddressId", addressList[0].id);
        } else {
          this.selectedAddress = {};
        }
      } catch (error) {
        this.selectedAddress = {};
      }
    },
    getStoreList() {},
    switchTab(index) {
      this.currentTab = index;
    },
    popupStoreDetail(store) {
      this.currentStore = store;
      this.$refs.storeDetailPopup.open();
    },
    closeStoreDetail() {
      this.$refs.storeDetailPopup.close();
    },
    gotoMenu(store) {
      const storeToUse = store || this.currentStore;
      uni.setStorageSync("selectedStore", JSON.stringify(storeToUse));
      uni.switchTab({
        url: "/pages/list/menu/index",
        fail: () => {
          uni.navigateTo({
            url: `/pages/list/menu/index`,
          });
        },
      });
    },
    navigateToStore() {
      uni.openLocation({
        latitude: this.currentStore.latitude,
        longitude: this.currentStore.longitude,
        name: this.currentStore.name,
        address: this.currentStore.address,
      });
    },
    goToAddressList() {
      uni.navigateTo({
        url: "/pages/list/address/index",
        events: {
          addressSelected: function (data) {
            console.log("收到地址选择事件:", data);
          },
        },
        success: () => {
          console.log("跳转到地址列表页面");
        },
      });
    },
    goBack() {
      uni.navigateBack({
        fail: () => {
          uni.switchTab({
            url: "/pages/index/index",
          });
        },
      });
    },
  },
};
</script>

<style lang="scss">
.container {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 30rpx;
}

/* 顶部导航区域样式 */
.nav-container {
  background: linear-gradient(to bottom, #ff3b3b, transparent);
  padding-bottom: 30rpx;
  position: relative;
}

/* 顶部导航栏样式 */
.custom-nav-bar {
  position: relative;
  width: 100%;
  height: 90rpx;
  display: flex;
  align-items: center;
  padding: 0;
  color: #fff;
  padding-top: var(--status-bar-height, 25px);
  box-sizing: content-box;
  z-index: 99;
}

.left-icon {
  position: absolute;
  left: 30rpx;
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
  z-index: 100;
  display: flex;
  align-items: center;
  height: 90rpx;
}

.nav-title-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  text-align: center;
}

/* 外送地址选择区域样式 */
.delivery-address-container {
  background-color: #fff;
  padding: 0;
  border-radius: 16rpx;
  overflow: hidden;
  margin: 70rpx 30rpx 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.address-label-container {
  background: #333;
  padding: 10rpx 20rpx;
  border-radius: 0 16rpx 0 0;
  display: inline-block;
  position: relative;
  left: 0;
  top: 0;
}

.address-label {
  font-size: 24rpx;
  color: #fff;
}

.delivery-address {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
}

.address-left {
  display: flex;
  flex: 1;
  align-items: flex-start;
}

.address-icon {
  margin-right: 15rpx;
  color: #333;
  margin-top: 4rpx;
  display: flex;
  align-items: center;
}

.address-content {
  flex: 1;
  overflow: hidden;
}

.address-line {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}

.address-sub-line {
  font-size: 28rpx;
  color: #666;
}

.address-arrow {
  margin-left: 15rpx;
  color: #999;
  display: flex;
  align-items: center;
}

/* 修改其他相关样式 */
.notice-bar {
  background-color: #ffeeee;
  padding: 14rpx 20rpx;
  font-size: 24rpx;
  color: #e60012;
  margin: 0 20rpx 10rpx 20rpx;
  border-radius: 8rpx;
}

.notice-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.notice-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 10rpx;
}

.tabs {
  display: flex;
  background-color: #ffffff;
  border-bottom: 1rpx solid #eeeeee;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  position: relative;
}

.tab-item.active {
  color: #e60012;
  font-weight: bold;
}

.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background-color: #e60012;
}

.store-list {
  height: calc(100vh - 230rpx);
  background-color: #ffffff;
}

.store-list.with-address {
  height: calc(100vh - 350rpx);
}

.store-item {
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #eeeeee;
  position: relative;
}

.store-info {
  flex: 1;
  padding-right: 20rpx;
}

.store-name {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.store-address {
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 10rpx;
}

.store-distance {
  font-size: 24rpx;
  color: #999999;
}

.store-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.store-status {
  font-size: 24rpx;
  color: #999999;
  margin-bottom: 10rpx;
}

.store-status.open {
  color: #07c160;
}

.goto-btn {
  padding: 8rpx 20rpx;
  background-color: #e60012;
  color: #ffffff;
  font-size: 24rpx;
  border-radius: 6rpx;
}

/* 门店详情弹窗样式 */
.store-detail {
  width: 650rpx;
  background-color: #ffffff;
  border-radius: 10rpx;
  overflow: hidden;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #eeeeee;
}

.detail-title {
  font-size: 32rpx;
  font-weight: bold;
}

.close-btn {
  font-size: 40rpx;
  color: #666666;
}

.detail-content {
  padding: 30rpx;
}

.detail-item {
  margin-bottom: 20rpx;
}

.item-label {
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 10rpx;
}

.item-value {
  font-size: 28rpx;
  color: #333333;
}

.detail-footer {
  display: flex;
  border-top: 1rpx solid #eeeeee;
}

.nav-btn,
.order-btn {
  flex: 1;
  height: 90rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.nav-btn {
  background-color: #f5f5f5;
  color: #333333;
  border-right: 1rpx solid #eeeeee;
}

.nav-btn image {
  width: 32rpx;
  height: A2rpx;
  margin-right: 10rpx;
}

.order-btn {
  background-color: #e60012;
  color: #ffffff;
}

/* 如果使用了滚动区域，需要调整样式 */
.has-delivery-address {
  height: calc(100vh - 270rpx) !important;
}

.icon-image {
  width: 36rpx;
  height: 36rpx;
}

.left-icon .icon-image {
  width: 40rpx;
  height: 40rpx;
  filter: brightness(0) invert(1); /* 将图标变为白色 */
}

/* 无地址提示样式 */
.no-address-tip {
  flex: 1;
  font-size: 28rpx;
  color: #999;
  text-align: left;
}
</style>
