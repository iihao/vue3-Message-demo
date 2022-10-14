"use strict";
var common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + timeline)();
}
const timeline = () => "../../uni_modules/iihao-timeline/components/timeline/timeline.js";
const _sfc_main = {
  __name: "tiehe",
  setup(__props) {
    const db = common_vendor.pn.database();
    const addTimeline = () => {
      common_vendor.index.navigateTo({
        url: "/pages/tiehe/time-line/add",
        events: getTimeline()
      });
    };
    const formatDate = (val) => {
      return common_vendor.dayjs(val).format("YYYY-MM-DD HH:mm:ss");
    };
    const formData = common_vendor.ref({});
    const getTimeline = () => {
      common_vendor.index.showLoading({
        mask: true
      });
      db.collection("time-line").field("title,desc,timestamp,diydesc").orderBy("timestamp", "desc").get().then((res) => {
        const data = res.result.data;
        console.log(res);
        if (data) {
          formData.value = data;
          console.log(formData.value);
        }
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "\u8BF7\u6C42\u670D\u52A1\u5931\u8D25",
          showCancel: false
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    };
    const selectIcon = (val) => {
      if (val) {
        switch (true) {
          case val.indexOf("add") > -1:
            return "paperplane-filled";
          case val.indexOf("del") > -1:
            return "trash-filled";
          case val.indexOf("ref") > -1:
            return "refresh";
          default:
            return "star-filled";
        }
      }
    };
    const handleItemClick = (val) => {
      common_vendor.index.navigateTo({
        url: "/pages/tiehe/time-line/edit?id=" + val
      });
    };
    common_vendor.onLoad(() => {
      getTimeline();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(formData.value, (item, index, i0) => {
          return {
            a: "6823d121-1-" + i0 + "," + ("6823d121-0-" + i0),
            b: common_vendor.p({
              type: selectIcon(item.diydesc),
              size: "18",
              color: "#ffffff"
            }),
            c: item._id,
            d: common_vendor.o(($event) => handleItemClick(item._id), item._id),
            e: "6823d121-0-" + i0,
            f: common_vendor.p({
              timestamp: formatDate(item.timestamp),
              title: item.title,
              desc: item.desc,
              size: 20,
              color: "#1a233b"
            })
          };
        }),
        b: common_vendor.o(addTimeline)
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/huangqiang/Documents/HBuilderProjects/vue3-Message-demo/pages/tiehe/tiehe.vue"]]);
wx.createPage(MiniProgramPage);
