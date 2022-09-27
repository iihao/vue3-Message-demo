<template>
  <view class="warp" :style="themeStyleVar">
    <nav-bar :title="pageTitle"></nav-bar>
    <view :style="{'padding-top':`${navBarConf.titleBarHeight + navBarConf.statusBarHeight}px`}">
      <view class="content">
        <image class="logo" :src="$tools.platformImg('/images/logo', 'jpg')" mode=""></image>
        <p class="name">亿点点工具</p>
        <p class="version">{{ $consts.VERSION }}</p>
      </view>
    </view>
    <view class="footer">
      <span class="text-item" @click="showCooperation(true)">商务合作</span>
    </view>

    <!-- 商务合作弹窗开始 -->
    <s-popup v-model="visibleCooperationModel" position="center" :prevent-touchmove="true" @hide="showCooperation(false)">
      <view class="cooperation">
        <p class="cooperation-title">亿点点工具合作助手</p>
        <p class="cooperation-subtitle">微信</p>
        <p class="cooperation-paragraph">donghao0126543</p>
        <p class="cooperation-subtitle">邮箱</p>
        <p class="cooperation-paragraph">1435820675@qq.com</p>
        <view class="close-box"><i class="iconfont icon-guanbi" @click="showCooperation(false)"></i></view>

      </view>
    </s-popup>
    <!-- 弹窗结束 -->
  </view>
</template>

<script>
import NavBar from '@/components/nav-bar/index.vue' // 标题栏组件
import SPopup from '@/components/s-popup/index.vue'

export default {
  components: {
    NavBar,
    SPopup
  },
  data() {
    return {
      $consts: this.$consts,
      pageTitle: '关于亿点点工具',
      visibleCooperationModel: false // 是否展示商务合作组件
    }
  },
  computed: {
    navBarConf() { return this.$store.getters.getNavBarConf }, // 获取设备头部安全区和标题高度
    themeStyleVar() { return this.$store.getters.getThemeStyleVar } // 当前主题色卡变量
  },
  methods: {
    // 修改美化组件展示状态
    showCooperation(status = true) { this.visibleCooperationModel = status }
  }
}
</script>

<style lang="scss" scoped>

  .warp {
    min-height: 100vh;
    background-color: #FFF;
  }

  .content {
    @include flex-center();
    flex-flow: column;
    padding: 24rpx;
    border-top: 20rpx solid #F7F7F7;
    box-sizing: border-box;
    font-size: $uni-font-size-base;

    .logo {
      width: 180rpx;
      height: 180rpx;
      margin: 50rpx auto;
      box-shadow: 0 4rpx 10rpx 0 #F7F7F7;
    }

    .name {
      font-size: 36rpx;
      letter-spacing: 6rpx;
    }

    .version {
      margin: 20rpx auto;
      font-size: $uni-font-size-base;
      color: $uni-color-paragraph;
    }

  }

  .footer {
    width: 100%;
    position: absolute;
    bottom: 42rpx;
    bottom: calc(42rpx + constant(safe-area-inset-bottom));
    bottom: calc(42rpx + env(safe-area-inset-bottom));
    display: flex;
    justify-content: center;

    .text-item {
      margin: 0 auto;
      font-size: $uni-font-size-sm;
      color: #888;
      border-bottom: 1px solid #888;
    }
  }

  .cooperation {
    width: 450rpx;
    height: auto;
    min-height: 300rpx;
    background-color: #FFF;
    border-radius: 16rpx;
    text-align: center;
    padding: 42rpx 0;
    box-sizing: border-box;

    .cooperation-title {
      font-size: $uni-font-size-lg;
    }

    .cooperation-subtitle {
      margin-top: 24rpx;
      font-size: $uni-font-size-base;
      color: $uni-color-subtitle;
    }

    .cooperation-paragraph {
      margin-top: 10rpx;
      font-size: $uni-font-size-sm;
      color: $uni-color-paragraph;
    }

    .close-box {
      position: absolute;
      left: calc(50% - 50rpx);
      bottom: -300rpx;
      width: 100rpx;
      height: 100rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #333;
      border-radius: 50%;

      .icon-guanbi {
        font-size: 42rpx;
        color: #FFF;
      }

    }

  }

</style>
