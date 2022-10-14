"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var common_vendor = require("../../../common/vendor.js");
var js_sdk_validator_timeLine = require("../../../js_sdk/validator/time-line.js");
const db = common_vendor.pn.database();
const dbCollectionName = "time-line";
function getValidator(fields) {
  let result = {};
  for (let key in js_sdk_validator_timeLine.validator) {
    if (fields.indexOf(key) > -1) {
      result[key] = js_sdk_validator_timeLine.validator[key];
    }
  }
  return result;
}
const _sfc_main = {
  data() {
    let formData = {
      "title": "",
      "desc": "",
      "timestamp": null,
      "diydesc": ""
    };
    return {
      formData,
      formOptions: {},
      rules: __spreadValues({}, getValidator(Object.keys(formData)))
    };
  },
  onReady() {
    this.$refs.form.setRules(this.rules);
  },
  methods: {
    submit() {
      common_vendor.index.showLoading({
        mask: true
      });
      this.$refs.form.validate().then((res) => {
        return this.submitForm(res);
      }).catch(() => {
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    submitForm(value) {
      return db.collection(dbCollectionName).add(value).then((res) => {
        common_vendor.index.showToast({
          icon: "none",
          title: "\u65B0\u589E\u6210\u529F"
        });
        this.getOpenerEventChannel().emit("refreshData");
        setTimeout(() => common_vendor.index.navigateBack(), 500);
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "\u8BF7\u6C42\u670D\u52A1\u5931\u8D25",
          showCancel: false
        });
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_datetime_picker2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_datetime_picker = () => "../../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_datetime_picker + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.formData.title = $event),
    b: common_vendor.p({
      placeholder: "\u6807\u9898",
      modelValue: $data.formData.title
    }),
    c: common_vendor.p({
      name: "title",
      label: ""
    }),
    d: common_vendor.o(($event) => $data.formData.desc = $event),
    e: common_vendor.p({
      placeholder: "\u63CF\u8FF0",
      type: "textarea",
      modelValue: $data.formData.desc
    }),
    f: common_vendor.p({
      name: "desc",
      label: ""
    }),
    g: common_vendor.o(($event) => $data.formData.timestamp = $event),
    h: common_vendor.p({
      ["return-type"]: "timestamp",
      modelValue: $data.formData.timestamp
    }),
    i: common_vendor.p({
      name: "timestamp",
      label: ""
    }),
    j: common_vendor.o(($event) => $data.formData.diydesc = $event),
    k: common_vendor.p({
      placeholder: "\u56FE\u6807\u5C5E\u6027(add/del/ref)",
      modelValue: $data.formData.diydesc
    }),
    l: common_vendor.p({
      name: "diydesc",
      label: ""
    }),
    m: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    n: common_vendor.sr("form", "0b368bcc-0"),
    o: common_vendor.p({
      model: $data.formData,
      ["validate-trigger"]: "submit",
      ["err-show-type"]: "toast",
      rules: $data.rules
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/huangqiang/Documents/HBuilderProjects/vue3-Message-demo/pages/tiehe/time-line/add.vue"]]);
wx.createPage(MiniProgramPage);
