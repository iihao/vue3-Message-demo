<template>
  <view class="warp" :style="themeStyleVar">
    <nav-bar :title="pageTitle"></nav-bar>
    <view :style="{'padding-top':`${navBarConf.titleBarHeight + navBarConf.statusBarHeight}px`}">
      <view class="content">
        <view class="info-item" @click="uploadAvatar">
          <view class="info-item__left">头像</view>
          <image class="info-avatar" :src="userInfo.avatar" mode=""></image>
        </view>
        <view class="info-item">
          <view class="info-item__left">昵称</view>
          <input v-model="userInfo.nickname" maxlength="20" class="info-nickname" type="text" @input="inputCheck($event, 'nickname')">
        </view>
      </view>
    </view>

    <view class="foot-box">
      <view class="btn" @click="save">保存</view>
    </view>
  </view>
</template>

<script>
import NavBar from '@/components/nav-bar/index.vue' // 标题栏组件
export default {
  components: {
    NavBar
  },
  data() {
    return {
      pageTitle: '编辑个人信息',
      userInfo: {}
    }
  },
  computed: {
    navBarConf() { return this.$store.getters.getNavBarConf }, // 获取设备头部安全区和标题高度
    themeStyleVar() { return this.$store.getters.getThemeStyleVar }, // 当前主题色卡变量
    themeStyle() { return this.$store.getters.getThemeStyle }
  },
  onLoad() { // 页面初次加载
    this.userInfo = JSON.parse(JSON.stringify(this.$store.getters.getUserInfo))
    this.userInfo.avatar = this.userInfo.avatar ? this.userInfo.avatar : this.$tools.platformImg('/images/default-head')
    this.userInfo.nickname = this.userInfo.nickname ? this.userInfo.nickname : `用户${this.userInfo.my_invite_code || ''}`
  },
  methods: {
    // 上传头像
    uploadAvatar() {
      new Promise((resolve, reject) => {
        uni.chooseImage({
          count: 1,
          success: res => {
            const path = res.tempFilePaths[0]
            let ext = null
            // #ifdef H5
            ext = res.tempFiles[0].name.split('.').pop()
            const options = {
              filePath: path,
              cloudPath: Date.now() + '.' + ext
            }
            resolve(options)
            // #endif
            // #ifndef H5
            uni.getImageInfo({
              src: path,
              success(info) {
                const options = {
                  filePath: path,
                  cloudPath: Date.now() + '.' + info.type.toLowerCase()
                }
                resolve(options)
              },
              fail(err) {
                reject(new Error(err.errMsg || '未能获取图片类型'))
              }
            })
            // #endif
          },
          fail: () => {
            reject(new Error('Fail_Cancel'))
          }
        })
      }).then((options) => {
        uni.showLoading({
          title: '图片上传中...'
        })
        return uniCloud.uploadFile({
          ...options,
          onUploadProgress(e) {
            console.log(e)
          }
        })
      }).then(fileRes => {
        console.log(fileRes.fileID)
        uni.hideLoading()

        // 获取临时链接
        // uniCloud.getTempFileURL({
        //   fileList: [fileRes.fileID],
        //   success: (res) => {
        //     this.userInfo.avatar = res.fileList[0].tempFileURL
        //   },
        //   fail: () => {
        //     uni.showModal({
        //       content: '获取临时链接失败',
        //       showCancel: false
        //     })
        //   }
        // })

        // 阿里云可以直接使用fileID进行展示
        this.userInfo.avatar = fileRes.fileID
      }).catch((err) => {
        uni.hideLoading()
        console.log(err)
        if (err.message !== 'Fail_Cancel') {
          uni.showModal({
            content: `图片上传失败，错误信息为：${err.message}`,
            showCancel: false
          })
        }
      })
    },
    // input值去除两边空格
    inputCheck(event, key) {
      if (event.detail.value) { event.detail.value = event.detail.value.replace(/(^\s*)|(\s*$)/g, '') }
      setTimeout(() => { this.userInfo[key] = event.detail.value }, 10)
    },
    // 保存并更新个人信息
    async save() {
      if (this.userInfo.nickname === '') {
        return uni.showToast({
          title: '昵称不能为空～',
          icon: 'none'
        })
      }
      uni.showLoading({
        title: '保存中...'
      })

      // 获取db引用
      const db = uniCloud.database() // 代码块为cdb
      const collection = db.collection('uni-id-users')
      const res = await collection.where({ _id: this.$store.getters.getUid })
        .update({
          avatar: this.userInfo.avatar,
          nickname: this.userInfo.nickname
        })

      uni.hideLoading()
      if (res.success) {
        this.$store.commit('setUserInfo', this.userInfo)

        uni.showModal({
          content: '保存成功～',
          showCancel: false,
          confirmColor: '#1A9BE8',
          success: (res) => {
            if (res.confirm) {
              uni.navigateBack({ delta: 1 })
            }
          }
        })
      } else {
        uni.showToast({
          title: res.result.message,
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  .warp {
    min-height: 100vh;
    background-color: #F7F7F7;
  }

  .content {
    @include flex-center();
    flex-flow: column;
    padding: 24rpx;
    box-sizing: border-box;
    font-size: $uni-font-size-base;
  }

  .info-item {
    width: 100%;
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 24rpx;
    box-sizing: border-box;
    background-color: #FFF;
    border-radius: 12rpx;

    &__right {
      padding: 10rpx 0;
    }

    .info-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      border: 1px solid #FFF;
    }

    .info-nickname {
      text-align: right;
      font-size: $uni-font-size-base;
      padding: 10rpx 0;
    }

  }

  .foot-box {
		position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 108upx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFF;

    .btn {
      width: 702upx;
      height: 80upx;
      font-size: $uni-font-size-lg;
      color: #FFF;
      background-color: var(--global-color-100);
      border-radius: 42upx;
      display: flex;
      justify-content: center;
      align-items: center;
    }

  }

</style>
