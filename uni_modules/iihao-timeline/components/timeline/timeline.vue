<template>
  <view class="timeline-item">
    <view class="left-line">

      <view @click="iconClick" class="timeline-item-icon"
        :style="{'backgroundColor':color,'width':size+'px','height':size+'px',}">
        <slot name="icon"></slot>
      </view>

      <view v-if="showTail" class="timeline-item-tail"></view>
    </view>
    <view class="timeline-item-wrapper">
      <view class="time" @click="$emit('editClick')" :style="{'height':size+'px','lineHeight':(size>40?40:size)+'px'}">
        {{timestamp}} <text style="color: #b3b3b3; font-size: 10px; margin-left: 10rpx;" @click="editClick"> 修改</text>
      </view>
      <view class="item-body" @click="bodyClick">
        <view class="title" v-if="title!=''">
          {{title}}
        </view>
        <view class="desc" v-if="desc!=''">
          {{desc}}
        </view>
        <slot name="body"></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
  /**
   * 
   * @description 时间线
   * @property {Boolean} showTail 显示节点连接线 
   * @property {String} timestamp 时间
   * @property {String} color 节点颜色
   * @property {String} title 标题 
   * @property {String} desc 描述 
   * @property {Number} size 节点大小(单位px,最大40) 
   * @event {Function()} onIconClick 时间线图标点击事件
   * @event {Function()} onTimeClick 时间线时间点击事件
   * @event {Function()} onBodyClick 时间线内容点击事件
   */
  defineProps({
    showTail: {
      type: Boolean,
      default: true
    },
    timestamp: {
      type: String,
      default: function() {
        return ""
      }
    },
    color: {
      type: String,
      default: function() {
        return null
      }
    },
    title: {
      type: String,
      default: function() {
        return ""
      }
    },
    desc: {
      type: String,
      default: function() {
        return ""
      }
    },
    size: {
      type: Number,
      default: function() {
        return 16
      }
    }
  })
</script>

<style lang="scss">
  .timeline-item {
    position: relative;
    padding-bottom: 20px;

    .left-line {
      position: absolute;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      width: 40px;
      flex-direction: column;
      align-items: center;

      .timeline-item-tail {
        height: 100%;
        width: 2px;
        background-color: #c7c7c7;
      }


      .timeline-item-icon {
        background-color: #e4e7ed;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        max-width: 40px;
        max-height: 40px;
        z-index: 10;
        opacity: 0.6;
      }
    }


    .timeline-item-wrapper {
      position: relative;
      padding-left: 44px;

      .time {
        color: #999999;
        font-size: 30rpx;
        max-height: 40px;
      }

      .item-body {
        background-color: #FFFFFF;
        padding: 20rpx;
        margin-left: -80rpx;
        margin-right: 20rpx;
        margin-top: 20rpx;
        border-radius: 20rpx;
        border-color: rgba(242, 242, 242, 1);
        padding-inline-start: 50rpx;

        .title {
          color: #199ED8;
          font-size: 32rpx;
          font-weight: 500;

          .title-text {
            display: inline-block;
            vertical-align: middle;
            padding-left: 10rpx;
          }
        }

        .desc {
          padding-inline-start: 30rpx;
          padding-top: 10rpx;
          color: #7f7f7f;
          font-size: 30rpx;
        }
      }
    }
  }
</style>
