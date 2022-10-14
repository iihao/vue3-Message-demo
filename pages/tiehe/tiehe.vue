<template>
  <view class="main">
    <view class="timeline">
      <timeline v-for="(item,index) in formData" :key="item._id" :timestamp="formatDate(item.timestamp)"
        :title="item.title" :desc="item.desc" :size="20" color="#1a233b" @editClick="handleItemClick(item._id)">
        <template #icon>
          <uni-icons :type="selectIcon(item.diydesc)" size="18" color="#ffffff"></uni-icons>
        </template>
      </timeline>
    </view>
    <button type="primary" class="timeline-send-btn" @click="addTimeline"> 新增时间线 </button>

    <!-- 测试用... by (https://github.com/iihao) -->
    <!--    <view style="display: flex;">
      <button type="primary" @click="editTimeline"> 修改 </button>
      <button type="primary" @click="timelineList"> 列表 </button>
      <button type="primary" @click="timelineDetail"> 详情 </button>
    </view> -->

  </view>
</template>

<script setup>
  import timeline from '../../uni_modules/iihao-timeline/components/timeline/timeline.vue'
  import {
    ref,
    watch
  } from "vue";
  import {
    onLoad,
    onReady
  } from '@dcloudio/uni-app'
  import dayjs from 'dayjs'

  const db = uniCloud.database()
  const addTimeline = () => {
    uni.navigateTo({
      url: '/pages/tiehe/time-line/add',
      events: getTimeline()
    })
  }
  const editTimeline = () => {
    uni.navigateTo({
      url: '/pages/tiehe/time-line/edit',
      events: {

      }
    })
  }
  const timelineList = () => {
    uni.navigateTo({
      url: '/pages/tiehe/time-line/list'
    })
  }
  const timelineDetail = () => {
    uni.navigateTo({
      url: '/pages/tiehe/time-line/detail'
    })
  }

  const formatDate = (val) => {
    return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
  }
  const formData = ref({})
  // 获取表单数据
  const getTimeline = () => {
    uni.showLoading({
      mask: true
    })
    db.collection("time-line").field("title,desc,timestamp,diydesc").orderBy('timestamp', 'desc').get().then((
      res) => {
      const data = res.result.data
      console.log(res)
      if (data) {
        formData.value = data
        console.log(formData.value)
      }
    }).catch((err) => {
      uni.showModal({
        content: err.message || '请求服务失败',
        showCancel: false
      })
    }).finally(() => {
      uni.hideLoading()
    })
  }

  //动态图标
  const selectIcon = (val) => {
    if (val) {
      switch (true) {
        case val.indexOf('add') > -1:
          return 'paperplane-filled'
        case val.indexOf('del') > -1:
          return 'trash-filled'
        case val.indexOf('ref') > -1:
          return 'refresh'
        default:
          return "star-filled";
      }
    }
  }

  //修改时间轴
  const handleItemClick = (val) => {
    uni.navigateTo({
      url: '/pages/tiehe/time-line/edit?id=' + val
    })
  }
  // watch(() => formData.value, () => {
  //   getTimeline()
  // })

  onLoad(() => {
    getTimeline()
  })
</script>

<style lang="scss">
  @import url("@/src/style/style.scss");

  .main {
    width: 100%;
    height: 100%;
    background-color: var(--box-color);
  }

  .timeline {
    height: 90%;
    overflow: auto;
  }

  .timeline-send-btn {
    height: 40px;
    width: 40%;
    background-color: var(--button-bg) !important;
    font-size: 16px;
    position: fixed;
    left: 30%;
    bottom: 20px;
  }
</style>
