<template>
  <view class="app-container">
    <view class="app-main">
      <view class="chat-wrapper">
        <scroll-view scroll-y='true' scroll-with-animation='true' :scroll-into-view="scrollTop">
          <view class="message-wrapper" v-for="(item,index) in messageList" :key="item._id" :id="'id-'+index">
            <view class="avatar-box-wrapper">
              <image :src="item.avatarUrl" class="message-pp"></image>
            </view>
            <view class="message-box-wrapper">
              <text style="vertical-align: inherit; color:coral;">{{item.nickName}}</text>
              <view class="message-box">{{item.message}}</view>
              <text style="vertical-align: inherit;">{{item.createTime}}
              </text>
              <view class="like-number" @click="clickLikes">
                <uni-icons type="hand-up-filled" size="14"></uni-icons>{{item.likeNumber}}
              </view>
            </view>
          </view>
        </scroll-view>

      </view>

      <view class="chat-input-wrapper">
        <view class="input-wrapper">
          <input type="textarea" class="chat-input" trim="all" v-model="inputText" placeholder="请输入留言内容"
            @focus="userInfo()" />
        </view>
        <view>
          <button class="chat-send-btn" @click="submitText()">发送</button>
        </view>
      </view>
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
  import dayjs from 'dayjs'


  const inputText = ref('')
  const messageList = ref([])
  const likeNum = ref(0)
  const createTime = ref()
  const nickName = ref()
  const avatarUrl = ref()
  const scrollTop = ref()
  createTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')

  //向服务器提交用户留言
  const submitText = async () => {
    if (!inputText.value) {
      throw new Error('不能为空')
    } else {
      await uniCloud.callFunction({
        name: 'happy',
        data: {
          api: "message",
          message: inputText.value,
          likeNum: likeNum.value,
          createTime: createTime.value,
          nickName: nickName.value,
          avatarUrl: avatarUrl.value,
          token: uni.getStorageSync('token')
        }
      }).then(res => {
        getMessages()
        scrollButton()
        inputText.value = ''
        uni.showToast({
          title: '留言成功',
          icon: 'success'
        })
      })
    }
  }

  //获取所有用户留言列表
  const getMessages = (apiVal) => {
    uniCloud.callFunction({
      name: 'happy',
      data: {
        api: apiVal || 'getMessage',
        token: uni.getStorageSync('token')
      }
    }).then(val => {
      //console.log(val.result.data)
      messageList.value = val.result.data
    })
  }

  //获取用户头像及昵称权限
  const getUserInfo = () => {
    uni.getUserProfile({
      desc: '用于留言', // 这个参数是必须的
      success: res => {
        avatarUrl.value = res.userInfo.avatarUrl
        nickName.value = res.userInfo.nickName
        uni.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
        uni.setStorageSync('nickName', res.userInfo.nickName)
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    })
  }

  //获取用户信息并存到浏览器及服务器
  const userInfo = () => {
    nickName.value = uni.getStorageSync('nickName')
    avatarUrl.value = uni.getStorageSync('avatarUrl')
    if (!nickName.value) {
      getUserInfo()
    } else {
      console.log(nickName.value)
    }
  }

  //滚动页面到最底部
  const scrollButton = async () => {
    const len = messageList.value.length
    scrollTop.value = 'id-' + (len - 1)
    console.log(scrollTop.value, '滚动')
  }

  //点赞clickLikes
  const clickLikes = () => {
    uniCloud.callFunction({
      name: 'happy',
      data: {
        api: 'updatelikes',
        likeNumber: likeNum.value
      }
    })
  }

  //页面加载时...
  onLoad(() => {
    getToken()
  })
  const getToken = () => {
    const token = uni.getStorageSync('token')
    if (!token) {
      uni.login().then(({
        code
      }) => {
        uniCloud.callFunction({
          name: 'happy',
          data: {
            api: 'loginWithMp',
            code
          }
        }).then(({
          result
        }) => {
          token = result.token
          uni.setStorageSync('token', token)
          getMessages()
        })
      })
    } else {
      getMessages()
    }
  }
</script>

<style>
  @import url("@/src/style/style.css");
</style>
