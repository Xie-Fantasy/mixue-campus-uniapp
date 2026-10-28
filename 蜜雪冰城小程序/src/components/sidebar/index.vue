<template>
  <scroll-view class="sidebar" scroll-y :show-scrollbar="false" enhanced>
    <view
      v-for="(item, index) in list"
      :key="index"
      class="sidebar-item"
      :class="{ active: index === current }"
      @tap="switchTab(index)"
    >
      <image class="item-icon" src="../../static/images/menu-icon.png"></image>
      <view class="item-label">{{ item }}</view>
      <view v-if="index === current" class="left-line"></view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    list: {
      type: Array,
      default: () => [
        "鲜萃咖啡",
        "当季新品",
        "本店热销",
        "真鲜果茶",
        "醇香奶茶",
        "轻乳系列",
      ],
    },
    defaultCurrent: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      current: this.defaultCurrent,
    };
  },
  watch: {
    defaultCurrent(newVal) {
      if (this.current !== newVal) {
        this.current = newVal;
      }
    },
  },
  methods: {
    switchTab(index) {
      if (this.current === index) return;

      this.current = index;
      this.$emit("change", index);
    },
  },
};
</script>

<style lang="scss" scoped>
/* sidebar component styles */
@import "../../style/theme.scss";

.sidebar {
  width: 170rpx;
  flex: 0 0 170rpx;
  height: 100%;
  background-color: #f8f8f8;

  .sidebar-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 138rpx;
    position: relative;

    .left-line {
      width: 6rpx;
      height: 48rpx;
      background-color: $primary-color;
      position: absolute;
      left: 0;
    }

    &.active {
      background-color: #ffffff;
    }

    .item-icon {
      width: 58rpx;
      height: 58rpx;
      margin-bottom: 10rpx;
    }

    .item-label {
      font-size: 24rpx;
      color: #333333;
    }
  }
}
</style>
