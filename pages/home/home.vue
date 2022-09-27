<template>
  <view class="app-main">

    <view class="app-profile-box">
      <view class="app-setting">
        <uni-icons type="gear" size="20"></uni-icons>
      </view>
      <image width="150rpx" height="150rpx" v-if="token&&userInfo.avatarUrl" :src="userInfo.avatarUrl"></image>
      <image v-else class="logo-img"
        src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-f7df76d0-0735-45ba-bd49-e366b3796e28/e89dbb99-fcd8-4182-ad73-82395d85bb9f.png">
      </image>
      <view class="app-profile-box-name">
        <text class="uer-name" v-if="token&&userInfo.nickName">{{userInfo.nickName}}</text>
        <text class="uer-name" v-else>匿名用户</text>
      </view>

    </view>

    <view class="app-activity-box">
      <view class="activity-info-boxes">
        <view class="activity-info-box time">
          <view class="info-icon-wrapper">
            <uni-icons color="#004dfc" type="calendar" size="24"></uni-icons>
          </view>
          <view class="info-text-wrapper">
            <text class="info-text-upper">13天</text>
            <text class="info-text-bottom">铁盒Age</text>
          </view>
        </view>
        <view class="activity-info-box atendee">
          <view class="info-icon-wrapper">
            <uni-icons color="#00ba9d" type="medal" size="24"></uni-icons>
          </view>
          <view class="info-text-wrapper">
            <text class="info-text-upper">128个</text>
            <text class="info-text-bottom">金币Coin</text>
          </view>
        </view>
        <view class="activity-info-box meeting">
          <view class="info-icon-wrapper">
            <uni-icons color="#715fc2" type="chat" size="24"></uni-icons>
          </view>
          <view class="info-text-wrapper">
            <text class="info-text-upper">12条</text>
            <text class="info-text-bottom">留言Message</text>
          </view>
        </view>
        <view class="activity-info-box reject">
          <view class="info-icon-wrapper">
            <uni-icons color="#ff562d" type="star" size="24"></uni-icons>
          </view>
          <view class="info-text-wrapper">
            <text class="info-text-upper">12赞</text>
            <text class="info-text-bottom">获赞Likes</text>
          </view>
        </view>
      </view>
    </view>

    <view class="app-activity-box">

      <button class="activity-info-box" open-type="share">
        <uni-icons color="#ff562d" type="redo-filled" size="28"></uni-icons>
        <text class="text">分享给好友</text>
      </button>
      <button class="activity-info-box" open-type="contact">
        <uni-icons color="#ff562d" type="weixin" size="28"></uni-icons>
        <text class="text">在线客服</text>
      </button>

    </view>

  </view>
</template>

<script setup>
  import {
    ref,
    watch
  } from 'vue'
  import {
    onLoad
  } from '@dcloudio/uni-app'

  const token = ref(uni.getStorageSync('token'))
  const userInfo = ref([])

  const getUserInfo = () => {
    uniCloud.callFunction({
      name: 'userInfo',
      data: {
        api: 'getUserInfo',
        token: token.value
      }
    }).then(res => {
      userInfo.value = res.result
      console.log(res.result)
    })
  }
  //页面加载时...
  onLoad(() => {
    getUserInfo()
  })
</script>

<style lang="scss">
  @import url("@/src/style/style.scss");
</style>
