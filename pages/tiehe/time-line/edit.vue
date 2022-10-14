<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast" :rules="rules">
      <uni-forms-item name="title" label="">
        <uni-easyinput placeholder="标题" v-model="formData.title"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="desc" label="">
        <uni-easyinput placeholder="描述" v-model="formData.desc"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="timestamp" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.timestamp"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="diydesc" label="">
        <uni-easyinput placeholder="图标属性(add/del/ref)" v-model="formData.diydesc"></uni-easyinput>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-bth" @click="submit">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import {
    validator
  } from '@/js_sdk/validator/time-line.js';

  const db = uniCloud.database();
  const dbCollectionName = 'time-line';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.indexOf(key) > -1) {
        result[key] = validator[key]
      }
    }
    return result
  }



  export default {
    data() {
      let formData = {
        "title": "",
        "desc": "",
        "timestamp": null,
        "diydesc": ""
      }
      return {
        formData,
        formOptions: {},
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onLoad(e) {
      if (e.id) {
        const id = e.id
        this.formDataId = id
        this.getDetail(id)
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {

      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {}).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
          uni.showToast({
            icon: 'none',
            title: '修改成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      },

      /**
       * 获取表单数据
       * @param {Object} id
       */
      getDetail(id) {
        uni.showLoading({
          mask: true
        })
        db.collection(dbCollectionName).doc(id).field("title,desc,timestamp,diydesc").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data

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
    }
  }
</script>

<style>
  .uni-container {
    padding: 15px;
    --button-bg: #1a233b;
  }



  .uni-bth {
    height: 40px;
    width: 40%;
    background-color: var(--button-bg) !important;
    font-size: 16px;
  }

  .uni-input-border,
  .uni-textarea-border {
    width: 100%;
    font-size: 14px;
    color: #666;
    border: 1px #e5e5e5 solid;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .uni-input-border {
    padding: 0 10px;
    height: 35px;

  }

  .uni-textarea-border {
    padding: 10px;
    height: 80px;
  }

  .uni-button-group {
    margin-top: 50px;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    justify-content: center;
  }

  .uni-button {
    width: 184px;
  }
</style>
