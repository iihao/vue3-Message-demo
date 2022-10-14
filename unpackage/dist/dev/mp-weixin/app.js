"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports[Symbol.toStringTag] = "Module";
var common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/home/home.js";
  "./pages/tiehe/tiehe.js";
  "./pages/tiehe/time-line/add.js";
  "./pages/tiehe/time-line/edit.js";
  "./pages/tiehe/time-line/list.js";
  "./pages/tiehe/time-line/detail.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
var App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/huangqiang/Documents/HBuilderProjects/vue3-Message-demo/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
