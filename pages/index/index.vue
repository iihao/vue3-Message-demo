<template>
  <view class="app-container">
    <view class="app-main">
      <view class="chat-wrapper">
        <scroll-view scroll-y='true' scroll-with-animation='true' :scroll-into-view="scrollTop">
          <view class="message-wrapper" v-for="(item,index) in messageList" :key="item._id" :id="'id-'+index">
            <view class="avatar-box-wrapper">
              <image :src="item.userId[0].avatarUrl" class="message-pp"></image>
            </view>
            <view class="message-box-wrapper">
              <text style="vertical-align: inherit; color:coral;">{{item.userId[0].nickName}}</text>
              <text class="status" v-if="item.status == 0">未审核</text>
              <view class="message-box-a">{{item.message}}</view>
              <text style="vertical-align: inherit;">{{item.createTime}}
              </text>
              <!-- 点赞-->
              <view class="like-number" @click="clickLikes(item._id,item.likeNumber,index)">
                <uni-icons type="hand-up-filled" size="14" :color="likeColor"></uni-icons>{{item.likeNumber}}
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
    onLoad,
    onReady
  } from '@dcloudio/uni-app'
  import dayjs from 'dayjs'


  const inputText = ref('')
  const messageList = ref([])
  const createTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  const likeNum = ref(0)
  const token = ref()

  const likeColor = ref()

  const userProfileList = ref([])

  const db = uniCloud.database()

  // const nickName = ref()
  // const avatarUrl = ref()
  // const signature = ref()

  const wxCode = ref()
  const messageId = ref()
  const scrollTop = ref()
  const status = ref(0)

  const agreementMsg = ref({})

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
        inputText.value = ''
        uni.showToast({
          title: '留言成功',
          icon: 'success'
        })
        uni.pageScrollTo({
          scrollTop: 0,
          selector: '.app-main',
          duration: 400
        });
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
      uni.hideLoading()
      console.log(val)
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
      },
      fail: err => {
        console.log(err)
      }
    })
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
      likeColor.value = 'red'
      const curMsgVal = messageList.value.filter(val => val._id == MsgID)
      curMsgVal[0].likeNumber++
      //console.log(curMsgVal)
      console.log(res)
    }).catch(err => {
      console.log(err)
      uni.showToast({
        title: '你已经点过赞啦',
        icon: 'error'
      })
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
  //将用户信息传入后端获取token
  const getToken = async () => {
    await getLogin()
    let token = uni.getStorageSync('token')
    if (!token) {
      uniCloud.callFunction({
        name: 'happy',
        data: {
          api: 'loginWithMp',
          nickName: userProfileList.value.nickName || '匿名用户',
          avatarUrl: userProfileList.value.avatarUrl ||
            'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-f7df76d0-0735-45ba-bd49-e366b3796e28/e89dbb99-fcd8-4182-ad73-82395d85bb9f.png',
          code: wxCode.value,
        }
      }).then(({
        result
      }) => {
        token = result.token
        console.log(result)
        uni.setStorageSync('token', token)
        getMessages()
      }).catch(err => {
        uni.hideLoading()
        console.log(err)
        uni.showToast({
          title: '登录失败',
          icon: 'error'
        })
      })
    } else {
      getMessages()
    }
  }
  //未登录弹窗
  const showModal = () => {
    if (uni.getStorageSync('token')) {
      uni.showLoading({
        title: '加载中'
      })
      getMessages()
    } else {
      uni.showModal({
        title: agreementMsg.value.title || '用户协议',
        content: agreementMsg.value.content || 'content',
        confirmText: '同意',
        cancelText: '退出',
        success: function(res) {
          if (res.confirm) {
            uni.showLoading({
              title: '加载中'
            })
            getToken()
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    }
  }

  //页面加载时...
  onLoad(() => {
    //数据库查询协议内容
    db.collection('show-agreement').limit(1).get()
      .then(res => {
        agreementMsg.value = res.result.data[0]
        showModal()
      })


    getLogin()
    console.log('onLoad')
  })
  onReady(() => {

    console.log('onReady')
  })
</script>

<style lang="scss">
  @import url("@/src/style/style.scss");
</style>
