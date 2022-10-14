"use strict";
var common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "home",
  setup(__props) {
    const token = common_vendor.ref(common_vendor.index.getStorageSync("token"));
    const userProfileList = common_vendor.ref([]);
    const userInfo = common_vendor.ref([]);
    const messageCount = common_vendor.ref(0);
    const userLikeCount = common_vendor.ref(0);
    const ageDateDiff = common_vendor.ref(0);
    const setUserInfo = async () => {
      await common_vendor.index.getUserProfile({
        desc: "\u7528\u4E8E\u5B8C\u5584\u7528\u6237\u4FE1\u606F",
        success: (res) => {
          userProfileList.value = res.userInfo;
        },
        fail: (err) => {
          console.log(err);
        }
      });
    };
    const getUserInfo = () => {
      common_vendor.pn.callFunction({
        name: "userInfo",
        data: {
          api: "getUserInfo",
          token: token.value
        }
      }).then((res) => {
        userInfo.value = res.result;
        getMessageCount(userInfo.value._id);
        getUserLikeCount(userInfo.value._id);
        getAgeDateDiff(userInfo.value._id);
        common_vendor.index.hideLoading();
        console.log(res.result);
      }).catch((err) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u5931\u8D25",
          icon: "error"
        });
      });
    };
    const db = common_vendor.pn.database();
    const getMessageCount = (val) => {
      db.collection("message").where(`userId == "${val}"`).groupBy("userId").groupField("sum(1) as messageCount").get().then((res) => {
        const msResult = res.result.data[0];
        messageCount.value = msResult.messageCount;
        console.log(messageCount.value);
      });
    };
    const getUserLikeCount = (val) => {
      db.collection("message").where(`userId == "${val}"`).groupBy("userId").groupField("sum(likeNumber) as userLikeCount").get().then((res) => {
        const msResult = res.result.data[0];
        userLikeCount.value = msResult.userLikeCount;
        console.log(userLikeCount.value);
      });
    };
    const getAgeDateDiff = (val) => {
      db.collection("user").where(`_id == "${val}"`).get().then((res) => {
        const msResult = res.result.data[0];
        const creatAt = common_vendor.dayjs(msResult.createdAt).format("YYYY-MM-DD HH:mm:ss");
        ageDateDiff.value = common_vendor.dayjs().diff(common_vendor.dayjs(creatAt), "day");
        console.log(ageDateDiff.value);
      });
    };
    common_vendor.onLoad(() => {
      common_vendor.index.showLoading();
      getUserInfo();
    });
    common_vendor.watch(() => userProfileList.value, () => {
      common_vendor.pn.callFunction({
        name: "userInfo",
        data: {
          api: "updateUserInfo",
          nickName: userProfileList.value.nickName,
          avatarUrl: userProfileList.value.avatarUrl,
          token: token.value
        }
      }).then((res) => {
        common_vendor.index.showLoading();
        console.log("\u4FEE\u6539\u4FE1\u606F\u6210\u529F", res);
        getUserInfo();
      });
    }, {
      deep: true
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "gear",
          size: "20"
        }),
        b: common_vendor.o(($event) => setUserInfo()),
        c: token.value && userInfo.value.avatarUrl
      }, token.value && userInfo.value.avatarUrl ? {
        d: userInfo.value.avatarUrl,
        e: common_vendor.o(($event) => setUserInfo())
      } : {}, {
        f: token.value && userInfo.value.nickName
      }, token.value && userInfo.value.nickName ? {
        g: common_vendor.t(userInfo.value.nickName)
      } : {}, {
        h: common_vendor.p({
          color: "#004dfc",
          type: "calendar",
          size: "24"
        }),
        i: common_vendor.t(ageDateDiff.value),
        j: common_vendor.p({
          color: "#00ba9d",
          type: "medal",
          size: "24"
        }),
        k: common_vendor.p({
          color: "#715fc2",
          type: "chat",
          size: "24"
        }),
        l: common_vendor.t(messageCount.value),
        m: common_vendor.p({
          color: "#ff562d",
          type: "star",
          size: "24"
        }),
        n: common_vendor.t(userLikeCount.value)
      });
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/huangqiang/Documents/HBuilderProjects/vue3-Message-demo/pages/home/home.vue"]]);
wx.createPage(MiniProgramPage);
