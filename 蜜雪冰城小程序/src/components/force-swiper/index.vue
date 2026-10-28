<template>
  <div class="swiper-container" :style="style">
    <swiper @change="onSwiperChange" :class="{ round: round }">
      <swiper-item v-for="(item, index) in list" :key="index">
        <image
          @tap="onSwiperTab"
          :data-item="item"
          mode="aspectFill"
          :src="item.imageUri"
        ></image>
      </swiper-item>
    </swiper>
    <div class="dots" :style="dotsStyle">
      <div
        class="dot"
        :class="{ active: current === index }"
        v-for="(item, index) in list"
        :key="index"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ForceSwiper",
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    style: {
      type: String,
      default: "",
    },
    dotsStyle: {
      type: String,
      default: "",
    },
    round: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      current: 0,
    };
  },
  methods: {
    onSwiperChange(e) {
      const { current } = e.detail;
      this.current = current;
    },
    onSwiperTab(e) {
      const item = e.currentTarget.dataset.item;
      this.$emit("swiper-tab", item);
    },
  },
};
</script>

<style scoped>
.swiper-container {
  position: relative;
  width: 100%;
  height: 100%;
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
