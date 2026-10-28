<template>
  <div class="page">
    <!-- 轮播图 -->
    <view class="swiper-container">
      <swiper @change="onSwiperChange">
        <swiper-item v-for="(item, index) in swiperList" :key="index">
          <image
            @tap="onSwiperTab"
            :data-item="item"
            mode="aspectFill"
            :src="item.imageUri"
          ></image>
        </swiper-item>
      </swiper>
      <view class="dots">
        <view
          class="dot"
          :class="{ active: current === index }"
          v-for="(item, index) in swiperList"
          :key="index"
        ></view>
      </view>
    </view>

    <!-- 会员、积分 -->
    <div class="member-area">
      <div class="vip-box">
        <image src="../../static/images/vip-pic.png" />
        <div class="meta">
          <div class="title">
            {{ isLogin && user ? user.desensitiveMobile : "尊敬的用户" }}
          </div>
          <progress-bar :value="45"></progress-bar>
          <div class="tips">
            {{
              isLogin
                ? "再升一级可享【升级礼包】等6项权益"
                : "会员可享【限时优惠】等多项权益"
            }}
          </div>
        </div>
      </div>
      <div v-if="isLogin" class="coin-box">
        <image src="../../static/images/coin.png" />
        <div class="currency">51</div>
      </div>
      <div v-if="!isLogin" class="login-btn" @click="gotoLogin">授权登录</div>
    </div>

    <!-- 点餐banner -->
    <div class="menu-banner">
      <div class="location">
        <image src="../../static/images/menu.png" />
        <div class="name">蜜雪冰城（无锡职院店）</div>
      </div>
      <div class="menu-cards">
        <image
          class="menu-card"
          @click="onMenuCardClick('到店自取')"
          src="../../static/images/到店自取.png"
        />
        <image
          class="menu-card"
          @click="onMenuCardClick('雪王外送')"
          src="../../static/images/雪王外送.png"
        />
      </div>
    </div>

    <!-- 三个卡片 -->
    <div class="banner-list">
      <image
        class="banner"
        src="../../static/images/banner-1.jpg"
        @click="onArticleClick"
      />
      <image class="banner" src="../../static/images/banner-2.jpg" />
      <image class="banner" src="../../static/images/banner-3.jpg" />
    </div>
  </div>
</template>

<script>
import ForceSwiper from "../../components/force-swiper/index.vue";
import ProgressBar from "../../components/progress-bar/index.vue";

export default {
  name: "IndexPage",
  components: { ForceSwiper, ProgressBar },
  data() {
    return {
      swiperList: [
        {imageUri: "/static/carousel/banner-1.gif", type: "url", target: ""},
        {imageUri: "/static/carousel/banner-2.jpg", type: "url", target: ""},
        {imageUri: "/static/carousel/banner-3.gif", type: "url", target: ""},
        {imageUri: "/static/carousel/banner-4.gif", type: "url", target: ""},
      ],
      current: 0, isLogin: false, user: null, i: 0,
    };
  },
  created() { this.checkLoginStatus(); },
  onShow() { this.checkLoginStatus(); },
  methods: {
    checkLoginStatus() {
      try {
        const storedUserInfo = uni.getStorageSync("userInfo");
        const storedIsLogin = uni.getStorageSync("isLogin");
        if (storedIsLogin === "true" && storedUserInfo) {
          this.isLogin = true;
          this.user = JSON.parse(storedUserInfo);
        } else {
          this.isLogin = false;
          this.user = null;
        }
      } catch (e) {
        console.error("读取登录状态出错:", e);
        this.isLogin = false;
        this.user = null;
      }
    },
    onSwiperChange(e) { this.current = e.detail.current; },
    gotoLogin() { uni.navigateTo({ url: "/pages/list/login/index" }); },
    onMenuCardClick(type) {
      uni.setStorageSync("orderType", type);
      uni.switchTab({ url: "/pages/list/store/index" });
    },
    onArticleClick() { uni.navigateTo({ url: `/pages/web-view/index?url=http://mxbc.com/` }); },
    onSwiperTab(item) {
      if (item.type === "url") {
        uni.navigateTo({ url: `/pages/web-view/index?url=${item.target}` });
      } else {
        uni.navigateTo({ url: `/pages/product/detail?id=${item.target}` });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.page {
  background-color: #f6f6f6;
  min-height: 100vh;
}

/* 会员区域样式 */
.member-area {
  margin: 24rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
}

.vip-box {
  flex: 1;
  display: flex;
  align-items: center;
}

.vip-box image {
  width: 80rpx;
  height: 80rpx;
}

.meta {
  margin-left: 20rpx;
  flex: 1;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.tips {
  font-size: 24rpx;
  color: #999;
  margin-top: 16rpx;
}

.coin-box {
  display: flex;
  align-items: center;
}

.coin-box image {
  width: 40rpx;
  height: 40rpx;
}

.currency {
  font-size: 32rpx;
  font-weight: bold;
  margin-left: 8rpx;
}

.login-btn {
  background-color: #e60012;
  color: #ffffff;
  padding: 12rpx 24rpx;
  border-radius: 30rpx;
  font-size: 28rpx;
}

/* 点餐 */
.menu-banner {
  width: 100%;
  padding: 0 30rpx;
  box-sizing: border-box;
  margin-bottom: 36rpx;
}

.menu-banner .location {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.menu-banner .location image {
  width: 18rpx;
  height: 24rpx;
}

.menu-banner .location .name {
  font-size: 22rpx;
  margin-left: 14rpx;
}

.menu-banner .menu-cards {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.menu-banner .menu-card {
  width: 330rpx;
  height: 340rpx;
  box-shadow: 0px 0.5px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 20rpx;
}

/* 三个卡片 */
.banner-list {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0 30rpx;
  box-sizing: border-box;
}

.banner-list .banner {
  width: 216rpx;
  height: 160rpx;
  box-shadow: 0px 0.5px 5px 1px rgba(0, 0, 0, 0.1);
  border-radius: 20rpx;
}

.swiper-container {
  width: 100vw;
  height: 646rpx;
  position: relative;
}

.swiper-container swiper {
  width: 100%;
  height: 100%;
}

.swiper-container swiper.round {
  border-radius: 16rpx;
  overflow: hidden;
}

.swiper-container swiper-item {
  width: 100%;
  height: 100%;
}

.swiper-container image {
  width: 100%;
  height: 100%;
}

.dots {
  position: absolute;
  display: flex;
  bottom: 20rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  margin-right: 12rpx;
  background-color: rgba(255, 255, 255, 0.4);
}

.dot.active {
  width: 18rpx;
  height: 12rpx;
  border-radius: 6rpx;
  background-color: #ffffff;
}
</style>
