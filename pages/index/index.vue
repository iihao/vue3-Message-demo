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
              <view class="message-box-a">{{item.message}}</view>
              <text style="vertical-align: inherit;">{{item.createTime}}
              </text>
              <view class="like-number" @click="clickLikes(item._id,item.likeNumber,index)">
                <uni-icons type="hand-up-filled" size="14"></uni-icons>{{item.likeNumber}}
              </view>
            </view>
          </view>
        </scroll-view>

      </view>

      <view class="chat-input-wrapper">
        <view class="input-wrapper">
          <input type="textarea" class="chat-input" trim="all" v-model="inputText" placeholder="请输入留言内容"
            @click="getToken()" />
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
  const createTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  const likeNum = ref(0)
  const token = ref()

  const userProfileList = ref([])

  // const nickName = ref()
  // const avatarUrl = ref()
  // const signature = ref()

  const wxCode = ref()
  const messageId = ref()
  const scrollTop = ref()
  const status = ref(0)

  const getCreateTime = async () => {
    createTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
  }



  //向服务器提交用户留言
  const submitText = async () => {
    if (!inputText.value) {
      uni.showToast({
        title: '留言不能为空',
        icon: 'error'
      })
      throw new Error('不能为空')
    } else {
      await uniCloud.callFunction({
        name: 'happy',
        data: {
          api: "message",
          message: inputText.value,
          likeNum: likeNum.value,
          createTime: createTime.value,
          nickName: userProfileList.value.nickName,
          avatarUrl: userProfileList.value.avatarUrl,
          status: status.value,
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
      }).catch(err => {
        console.log(err)
        uni.showToast({
          title: '留言失败',
          icon: 'error'
        })
      })
    }
  }

  //获取用户留言列表
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
    }).catch(err => {
      console.log(err)
      uni.showToast({
        title: '获取留言失败',
        icon: 'error'
      })
    })
  }

  //获取用户头像及昵称权限
  const getUserInfo = async () => {
    await uni.getUserProfile({
      desc: '用于完善用户信息', // 这个参数是必须的
      success: res => {
        userProfileList.value = res.userInfo
        // avatarUrl.value = res.userInfo.avatarUrl
        // nickName.value = res.userInfo.nickName
        // signature.value = res.userInfo.signature
      },
      fail: err => {
        console.log(err)
      }
    })
  }
  //获取用户登录code
  const getLogin = async () => {
    await uni.login({
      timeout: 10000,
      success: res => {
        wxCode.value = res.code
        console.log(res.code)
      },
      fail: err => {
        console.log(err)
      }
    })
  }


  //滚动页面到最底部
  const scrollButton = async () => {
    const len = messageList.value.length
    scrollTop.value = 'id-' + (len - 1)
    //console.log(scrollTop.value, '滚动')
  }

  //点赞clickLikes
  const clickLikes = async (MsgID, likeNum, index) => {
    likeNum++
    //console.log('messageId.value' + MsgID)
    await uniCloud.callFunction({
      name: 'happy',
      data: {
        api: 'updatelikes',
        likeNumber: likeNum,
        id: MsgID,
        token: uni.getStorageSync('token')
      }
    }).then(res => {
      uni.showToast({
        title: '点赞成功',
        icon: 'success'
      })
      const curMsgVal = messageList.value.filter(val => val._id == MsgID)
      curMsgVal[0].likeNumber++
      //console.log(curMsgVal)
      //console.log(res)
    }).catch(err => {
      uni.showToast({
        title: '你已经点过赞啦',
        icon: 'error'
      })
    })
  }

  //将用户信息传入后端获取token
  const getToken = async () => {
    await getLogin()
    let token = uni.getStorageSync('token')
    if (!token) {
      // if (!avatarUrl.value || !nickName.value) {
      //   uni.showToast({
      //     title: '未登录不能留言',
      //     icon: 'error'
      //   })
      //getUserInfo() 获取用户头像
      // throw new Error('未登录不能留言')
      uniCloud.callFunction({
        name: 'happy',
        data: {
          api: 'loginWithMp',
          nickName: userProfileList.value.nickName || '匿名用户',
          avatarUrl: userProfileList.value.avatarUrl ||
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-f7df76d0-0735-45ba-bd49-e366b3796e28/e89dbb99-fcd8-4182-ad73-82395d85bb9f.png',
          signature: userProfileList.value.signature || '0',
          code: wxCode.value,
        }
      }).then(({
        result
      }) => {
        token = result.token
        //console.log(result)
        uni.setStorageSync('token', token)
        getMessages()
      }).catch(err => {
        uni.showToast({
          title: '登录失败',
          icon: 'error'
        })
      })
    } else {
      getMessages()
    }
  }

  //页面加载时...
  onLoad(() => {
    getToken()
  })
</script>

<style lang="scss">
  @import url("@/src/style/style.scss");
</style>
