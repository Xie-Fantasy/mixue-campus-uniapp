<template>
  <view class="page">
    <view class="user-area">
      <view class="user-box">
        <image class="avatar" src="../../../static/images/vip-pic.png"></image>
        <view class="name">{{
          user && user.desensitiveMobile
            ? user.desensitiveMobile
            : "登录获得更多会员权益"
        }}</view>
      </view>
      <view
        v-if="!(user && user.desensitiveMobile)"
        class="login-btn"
        @tap="login"
        >授权登录</view
      >
    </view>
    <!-- 两个卡片 -->
    <view class="card-container">
      <view class="card">
        <view class="meta">
          <view class="count">54</view>
          <view class="name">雪王币</view>
        </view>
        <image class="icon" src="../../../static/images/me-coin.png"></image>
      </view>
      <view class="card">
        <view class="meta">
          <view class="count">54</view>
          <view class="name">优惠券</view>
        </view>
        <image class="icon" src="../../../static/images/me-coupon.png"></image>
      </view>
    </view>
    <!-- 四个list -->
    <view class="list-items">
      <view class="item">
        <view class="content">
          <image class="icon" src="../../../static/images/qr-code.png"></image>
          <view class="label">兑换码</view>
        </view>
        <view class="left-arrow">></view>
      </view>
      <view class="item" @click="gotoCustomPage('privacy')">
        <view class="content">
          <image class="icon" src="../../../static/images/lock.png"></image>
          <view class="label">隐私政策</view>
        </view>
        <view class="left-arrow">></view>
      </view>
      <view class="item" @click="gotoCustomPage('agreement')">
        <view class="content">
          <image class="icon" src="../../../static/images/paper.png"></image>
          <view class="label">用户协议</view>
        </view>
        <view class="left-arrow">></view>
      </view>
      <view class="item" @click="gotoCustomPage('xuke')">
        <view class="content">
          <image class="icon" src="../../../static/images/xuke.png"></image>
          <view class="label">经营信息公示</view>
        </view>
        <view class="left-arrow">></view>
      </view>
    </view>
    <!-- 蜜雪冰城app -->
    <view class="list-items app-download">
      <view class="item">
        <view class="content">
          <image class="icon" src="../../../static/images/app.png"></image>
          <view class="label">蜜雪冰城APP</view>
        </view>
        <view class="left-arrow">
          <view class="tips">下载APP体验更佳</view>
        </view>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view v-if="isLogin" class="logout-btn" @tap="logout">退出登录</view>
  </view>
</template>

<script>
export default {
  name: "MinePage",
  data() {
    return {
      isLogin: false,
      user: null,
      userInfo: {
        nickName: "用户昵称",
        avatarUrl: "../../assets/images/me-avatar.png", // 默认头像或登录后更新
      },
      customPageUrls: { privacy: "", agreement: "", xuke: "" },
    };
  },
  created() {
    // 在页面创建时检查登录状态，可以从本地存储或状态管理获取
    this.checkLoginStatus();
  },
  // 添加onShow生命周期，确保每次页面显示时都检查登录状态
  onShow() {
    this.checkLoginStatus();
  },
  methods: {
    login() {
      // 使用uni-app的导航方法替代微信小程序的方法
      uni.navigateTo({
        url: "/pages/list/login/index",
      });
    },
    checkLoginStatus() {
      // 实际项目中应从 storage 或 vuex 获取登录状态和用户信息
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
    gotoCustomPage(code) {
      const url = this.customPageUrls[code];
      if (url) {
        // 使用uni-app的导航方法
        uni.navigateTo({
          url: `/pages/webview/index?url=${encodeURIComponent(url)}`,
        });
      } else {
        console.warn("未找到对应的页面URL:", code);
      }
    },
    logout() {
      // 显示确认对话框
      uni.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            // 清除登录信息
            uni.removeStorageSync("userInfo");
            uni.removeStorageSync("isLogin");

            // 更新状态
            this.isLogin = false;
            this.user = null;

            // 显示提示
            uni.showToast({
              title: "已退出登录",
              icon: "none",
            });
          }
        },
      });
    },
  },
};
</script>

<style scoped>
/* pages/mine/index.wxss */
.page {
  background: linear-gradient(to bottom, #fbe7e6, #f8f8f8);
  width: 100%;
  min-height: 100vh; /* 使用 min-height 保证内容超出时能滚动 */
  box-sizing: border-box;
  padding: 0 30rpx;
  padding-top: 170rpx; /* 保持原顶部内边距 */
}
.list-items {
  margin-bottom: 26rpx;
  display: flex;
  width: 100%;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10rpx; /* 给所有list-items加圆角 */
  overflow: hidden; /* 配合圆角 */
}
.list-items.app-download {
  /* border-radius: 10rpx; */ /* 已统一添加 */
}
.list-items.app-download .tips {
  margin-right: 10rpx;
  font-size: 24rpx;
  color: #999; /* 恢复灰色 */
}
.list-items .item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 36rpx 30rpx;
  cursor: pointer; /* 添加手型光标 */
  border-bottom: 1rpx solid #f8f8f8; /* 添加分隔线 */
}
.list-items .item:last-child {
  border-bottom: none; /* 最后一个item无下边框 */
}
.list-items .item .left-arrow {
  font-size: 20rpx;
  display: flex;
  color: #ccc; /* 箭头颜色 */
}
.list-items .item .content {
  display: flex;
  align-items: center;
}
.list-items .item .content .icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 25rpx;
}
.list-items .item .content .label {
  font-size: 26rpx;
  color: #333; /* 标签颜色 */
}
.page .card-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 26rpx;
}
.page .card-container .card {
  width: calc(50% - 13rpx); /* 使用 calc 替代固定宽度，适应不同屏幕 */
  background-color: #fff;
  border-radius: 15rpx;
  box-sizing: border-box;
  padding: 23rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page .card-container .card .icon {
  width: 72rpx;
  height: 72rpx;
}
.page .card-container .card .meta {
  text-align: left; /* 文字左对齐 */
}
.page .card-container .card .meta .count {
  font-size: 24rpx;
  font-weight: bold;
  color: #333;
}
.page .card-container .card .meta .name {
  font-size: 17rpx;
  color: #999; /* 恢复灰色 */
}
.page .user-area {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 26rpx;
}
.page .user-area .user-box {
  display: flex;
  align-items: center;
}
.page .user-area .user-box .avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%; /* 圆形头像 */
  overflow: hidden;
  border: 2rpx solid #fff; /* 可选：添加白色边框 */
}
.page .user-area .user-box .name {
  font-size: 28rpx;
  margin-left: 24rpx;
  color: #333;
  font-weight: bold;
}
.page .user-area .login-btn {
  width: 150rpx;
  height: 62rpx;
  border-radius: 31rpx; /* 改为更圆的按钮 */
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25rpx;
  background-color: #d2252c;
  border: none;
  cursor: pointer;
}
.page .user-area .login-btn:hover {
  opacity: 0.9;
}
.page .user-area .login-btn.active {
  /* Vue 中一般不用 .active，用 :active 伪类 */
  opacity: 0.6;
}
.page .user-area .login-btn:active {
  /* 添加 :active 伪类 */
  opacity: 0.8;
}

/* 退出登录按钮样式 */
.logout-btn {
  margin: 30rpx auto;
  width: 90%;
  height: 90rpx;
  background-color: #fff;
  color: #d2252c;
  border: 1px solid #d2252c;
  border-radius: 45rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
}

.logout-btn:active {
  opacity: 0.8;
}
</style>
