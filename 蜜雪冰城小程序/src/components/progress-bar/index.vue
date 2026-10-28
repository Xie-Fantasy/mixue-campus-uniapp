<template>
  <div class="track" :style="trackStyle">
    <div class="bar" :style="barStyle"></div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    value: {
      type: Number,
      default: 0,
    },
    trackStyle: {
      type: String,
      default: "",
    },
  },
  computed: {
    barStyle() {
      return `width: ${this.value}%`;
    },
  },
};
</script>

<style scoped>
.track {
  background-color: #ebebeb;
  height: 5rpx;
  width: 100%;
  border-radius: 3rpx;
  overflow: hidden;
}
.track .bar {
  background-color: #e60012;
  height: 100%;
  width: 0;
}
</style>
