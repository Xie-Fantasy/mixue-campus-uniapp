<template>
  <view class="container">
    <!-- 商品信息 -->
    <view class="product-info">
      <image
        class="product-image"
        :src="product.image"
        mode="aspectFill"
        @error="handleImageError"
      ></image>
      <view class="info">
        <view class="name">{{ product.name }}</view>
        <view class="description">{{ product.description }}</view>
        <view class="price">¥{{ product.price }}</view>
      </view>
    </view>

    <!-- 选项区域 -->
    <view class="options-container">
      <!-- 温度选择 -->
      <view class="option-section">
        <view class="section-title">温度</view>
        <view class="option-list">
          <view
            v-for="(item, index) in temperatureOptions"
            :key="index"
            :class="['option-item', selectedTemperature === item ? 'active' : '']"
            @tap="selectedTemperature = item"
          >
            {{ item }}
          </view>
        </view>
      </view>

      <!-- 甜度选择 -->
      <view class="option-section">
        <view class="section-title">甜度</view>
        <view class="option-list">
          <view
            v-for="(item, index) in sweetnessOptions"
            :key="index"
            :class="['option-item', selectedSweetness === item ? 'active' : '']"
            @tap="selectedSweetness = item"
          >
            {{ item }}
          </view>
        </view>
      </view>

      <!-- 小料选择 -->
      <view class="option-section">
        <view class="section-title">小料</view>
        <view class="option-list">
          <view
            v-for="(item, index) in toppingsOptions"
            :key="index"
            :class="['option-item', selectedToppings.includes(item.name) ? 'active' : '']"
            @tap="toggleTopping(item)"
          >
            {{ item.name }} <text class="extra-price" v-if="item.price > 0">+{{ item.price }}元</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作区 -->
    <view class="bottom-bar">
      <view class="quantity-control">
        <view class="minus" @tap="decreaseQuantity">-</view>
        <view class="quantity">{{ quantity }}</view>
        <view class="plus" @tap="increaseQuantity">+</view>
      </view>
      <view class="add-to-cart" @tap="addToCart">加入购物车</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      productId: '',
      product: { id: '', name: '', description: '', price: 0, image: '/static/images/product-image.png' },
      quantity: 1,
      temperatureOptions: ['热饮', '常温', '去冰', '少冰', '多冰'],
      selectedTemperature: '常温',
      sweetnessOptions: ['无糖', '微糖', '半糖', '少糖', '标准糖'],
      selectedSweetness: '标准糖',
      toppingsOptions: [
        { name: '珍珠', price: 2 },
        { name: '椰果', price: 2 },
        { name: '芋圆', price: 3 },
        { name: '红豆', price: 2 },
        { name: '奶盖', price: 5 }
      ],
      selectedToppings: []
    };
  },
  computed: {
    totalPrice() {
      let toppingsPrice = 0;
      this.selectedToppings.forEach(topping => {
        const toppingItem = this.toppingsOptions.find(item => item.name === topping);
        if (toppingItem) toppingsPrice += toppingItem.price;
      });
      return (this.product.price + toppingsPrice) * this.quantity;
    }
  },
  onLoad(options) {
    if (options && options.id) {
      this.productId = options.id;
      this.fetchProductDetail();
    } else {
      uni.showToast({ title: '商品信息获取失败', icon: 'none', duration: 2000 });
      setTimeout(() => uni.navigateBack(), 2000);
    }
  },
  methods: {
    fetchProductDetail() {
      uni.showLoading({ title: '加载中...' });
      try {
        const currentProductStr = uni.getStorageSync('currentProduct');
        if (currentProductStr) {
          const currentProduct = JSON.parse(currentProductStr);
          if (currentProduct.id.toString() === this.productId.toString()) {
            if (currentProduct.image && !currentProduct.image.startsWith('/')) {
              currentProduct.image = '/' + currentProduct.image.replace(/^\.\.\/\.\.\//, '');
            }
            this.product = currentProduct;
            uni.hideLoading();
            return;
          }
        }
      } catch (error) {}

      try {
        const allProductsStr = uni.getStorageSync('allProducts');
        if (allProductsStr) {
          const productList = JSON.parse(allProductsStr);
          const product = productList.find(item => item.id.toString() === this.productId.toString());
          if (product) {
            if (product.image && !product.image.startsWith('/')) {
              product.image = '/' + product.image.replace(/^\.\.\/\.\.\//, '');
            }
            this.product = product;
            uni.hideLoading();
            return;
          }
        }
      } catch (error) {}

      const mockProducts = [
        { id: 1, name: "生椰拿铁", description: "醇香咖啡搭配香浓生椰乳", price: 13, image: "/static/images/product-image.png" },
        { id: 2, name: "冰萃咖啡", description: "精选阿拉比卡咖啡豆现萃", price: 11, image: "/static/images/product-image.png" },
        { id: 3, name: "美式咖啡", description: "醇香浓郁，回味甘甜", price: 10, image: "/static/images/product-image.png" },
        { id: 4, name: "芝芝莓莓", description: "莓香浓郁，口感丰富", price: 15, image: "/static/images/product-image.png" },
        { id: 5, name: "多肉葡萄", description: "多重果肉，鲜爽可口", price: 14, image: "/static/images/product-image.png" },
        { id: 6, name: "蜜雪冰城", description: "招牌饮品，清爽怡人", price: 6, image: "/static/images/product-image.png" }
      ];

      const mockProduct = mockProducts.find(item => item.id.toString() === this.productId.toString());
      if (mockProduct) {
        this.product = mockProduct;
        uni.hideLoading();
      }
    },
    increaseQuantity() { this.quantity++; },
    decreaseQuantity() { if (this.quantity > 1) this.quantity--; },
    toggleTopping(item) {
      const index = this.selectedToppings.indexOf(item.name);
      if (index > -1) this.selectedToppings.splice(index, 1);
      else this.selectedToppings.push(item.name);
    },
    addToCart() {
      let toppingsPrice = 0;
      const selectedToppingsList = [];
      this.selectedToppings.forEach(toppingName => {
        const topping = this.toppingsOptions.find(item => item.name === toppingName);
        if (topping) {
          toppingsPrice += topping.price;
          selectedToppingsList.push({ name: topping.name, price: topping.price });
        }
      });

      const cartItem = {
        id: this.product.id,
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        image: this.product.image,
        quantity: this.quantity,
        temperature: this.selectedTemperature,
        sweetness: this.selectedSweetness,
        toppings: selectedToppingsList,
        toppingsPrice: toppingsPrice,
        totalPrice: this.totalPrice
      };

      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];

      if (prevPage && prevPage.$vm.addCustomizedItemToCart) {
        prevPage.$vm.addCustomizedItemToCart(cartItem);
        uni.showToast({ title: '已添加到购物车', icon: 'success' });
        setTimeout(() => uni.navigateBack(), 1500);
      } else {
        const tempCartItems = uni.getStorageSync('tempCartItems') || [];
        tempCartItems.push(cartItem);
        uni.setStorageSync('tempCartItems', tempCartItems);
        uni.showToast({ title: '已添加到购物车', icon: 'success' });
        setTimeout(() => uni.navigateBack(), 1500);
      }
    },
    handleImageError() {
      this.product.image = '/static/images/product-image.png';
    }
  }
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 120rpx; /* 为底部操作栏预留空间 */
}

.product-info {
  background-color: #fff;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rpx;

  .product-image {
    width: 300rpx;
    height: 300rpx;
    border-radius: 20rpx;
    margin-bottom: 30rpx;
  }

  .info {
    width: 100%;
    text-align: center;

    .name {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .description {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 20rpx;
    }

    .price {
      font-size: 40rpx;
      color: #e60012;
      font-weight: bold;
    }
  }
}

.options-container {
  background-color: #fff;
  padding: 30rpx;
  flex: 1;

  .option-section {
    margin-bottom: 40rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .option-list {
      display: flex;
      flex-wrap: wrap;

      .option-item {
        padding: 10rpx 30rpx;
        border-radius: 30rpx;
        background-color: #f5f5f5;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        font-size: 28rpx;

        &.active {
          background-color: #fce8e8;
          color: #e60012;
        }

        .extra-price {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .quantity-control {
    display: flex;
    align-items: center;

    .minus, .plus {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40rpx;
      font-weight: bold;
    }

    .quantity {
      width: 80rpx;
      text-align: center;
      font-size: 32rpx;
    }
  }

  .add-to-cart {
    flex: 1;
    height: 80rpx;
    background-color: #e60012;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 40rpx;
    margin-left: 30rpx;
    font-size: 32rpx;
    font-weight: bold;
  }
}
</style>