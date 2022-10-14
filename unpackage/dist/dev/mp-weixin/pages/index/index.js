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
  __name: "index",
  setup(__props) {
    const inputText = common_vendor.ref("");
    const messageList = common_vendor.ref([]);
    const createTime = common_vendor.ref(common_vendor.dayjs().format("YYYY-MM-DD HH:mm:ss"));
    const likeNum = common_vendor.ref(0);
    common_vendor.ref();
    const getUserId = common_vendor.ref(common_vendor.index.getStorageSync("_id"));
    common_vendor.ref();
    const userProfileList = common_vendor.ref([]);
    const db = common_vendor.pn.database();
    const wxCode = common_vendor.ref();
    common_vendor.ref();
    const scrollTop = common_vendor.ref();
    const status = common_vendor.ref(0);
    const agreementMsg = common_vendor.ref({});
    common_vendor.ref(false);
    const submitText = async () => {
      if (!inputText.value) {
        common_vendor.index.showToast({
          title: "\u7559\u8A00\u4E0D\u80FD\u4E3A\u7A7A",
          icon: "error"
        });
        throw new Error("\u4E0D\u80FD\u4E3A\u7A7A");
      } else {
        await common_vendor.pn.callFunction({
          name: "happy",
          data: {
            api: "message",
            message: inputText.value,
            likeNum: likeNum.value,
            createTime: createTime.value,
            nickName: userProfileList.value.nickName,
            avatarUrl: userProfileList.value.avatarUrl,
            status: status.value,
            token: common_vendor.index.getStorageSync("token")
          }
        }).then((res) => {
          getMessages();
          inputText.value = "";
          common_vendor.index.showToast({
            title: "\u7559\u8A00\u6210\u529F",
            icon: "success"
          });
          common_vendor.index.pageScrollTo({
            scrollTop: 0,
            selector: ".app-main",
            duration: 400
          });
        }).catch((err) => {
          console.log(err);
          common_vendor.index.showToast({
            title: "\u7559\u8A00\u5931\u8D25",
            icon: "error"
          });
        });
      }
    };
    const getMessages = (apiVal) => {
      common_vendor.pn.callFunction({
        name: "happy",
        data: {
          api: apiVal || "getMessage",
          token: common_vendor.index.getStorageSync("token")
        }
      }).then((val) => {
        common_vendor.index.hideLoading();
        console.log(val);
        messageList.value = val.result.data;
      }).catch((err) => {
        console.log(err);
        common_vendor.index.showToast({
          title: "\u83B7\u53D6\u7559\u8A00\u5931\u8D25",
          icon: "error"
        });
      });
    };
    const clickLikes = async (MsgID, likeNum2, index) => {
      likeNum2++;
      await common_vendor.pn.callFunction({
        name: "happy",
        data: {
          api: "updatelikes",
          likeNumber: likeNum2,
          id: MsgID,
          token: common_vendor.index.getStorageSync("token")
        }
      }).then((res) => {
        common_vendor.index.showToast({
          title: "\u70B9\u8D5E\u6210\u529F",
          icon: "success"
        });
        const curMsgVal = messageList.value.filter((val) => val._id == MsgID);
        curMsgVal[0].likeNumber++;
        console.log(res);
      }).catch((err) => {
        console.log(err);
        common_vendor.index.showToast({
          title: "\u4F60\u5DF2\u7ECF\u70B9\u8FC7\u8D5E\u5566",
          icon: "error"
        });
      });
    };
    const getLogin = async () => {
      await common_vendor.index.login({
        timeout: 1e4,
        success: (res) => {
          wxCode.value = res.code;
          console.log(res.code);
        },
        fail: (err) => {
          console.log(err);
        }
      });
    };
    const getToken = async () => {
      await getLogin();
      let token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.pn.callFunction({
          name: "happy",
          data: {
            api: "loginWithMp",
            nickName: userProfileList.value.nickName || "\u533F\u540D\u7528\u6237",
            avatarUrl: userProfileList.value.avatarUrl || "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-f7df76d0-0735-45ba-bd49-e366b3796e28/e89dbb99-fcd8-4182-ad73-82395d85bb9f.png",
            code: wxCode.value
          }
        }).then(({
          result
        }) => {
          token = result.token;
          console.log(result);
          common_vendor.index.setStorageSync("token", token);
          common_vendor.index.setStorageSync("_id", result.user._id);
          getMessages();
        }).catch((err) => {
          common_vendor.index.hideLoading();
          console.log(err);
          common_vendor.index.showToast({
            title: "\u767B\u5F55\u5931\u8D25",
            icon: "error"
          });
        });
      } else {
        getMessages();
      }
    };
    const showModal = () => {
      if (common_vendor.index.getStorageSync("token")) {
        common_vendor.index.showLoading({
          title: "\u52A0\u8F7D\u4E2D"
        });
        getMessages();
      } else {
        common_vendor.index.showModal({
          title: agreementMsg.value.title || "\u7528\u6237\u534F\u8BAE",
          content: agreementMsg.value.content || "content",
          confirmText: "\u540C\u610F",
          cancelText: "\u9000\u51FA",
          success: function(res) {
            if (res.confirm) {
              common_vendor.index.showLoading({
                title: "\u52A0\u8F7D\u4E2D"
              });
              getToken();
            } else if (res.cancel) {
              console.log("\u7528\u6237\u70B9\u51FB\u53D6\u6D88");
            }
          }
        });
      }
    };
    const isLike = (msgId, userId) => {
      const message = JSON.parse(JSON.stringify(messageList.value));
      const msgList = message.filter((val) => val._id == msgId);
      if (msgList[0].likeUser) {
        const likeList = msgList[0].likeUser.indexOf(userId);
        if (likeList > -1) {
          return true;
        }
      }
    };
    common_vendor.onLoad(() => {
      db.collection("show-agreement").limit(1).get().then((res) => {
        agreementMsg.value = res.result.data[0];
        showModal();
      });
      getLogin();
      console.log("onLoad");
    });
    common_vendor.onReady(() => {
      console.log("onReady");
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(messageList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.userId[0].avatarUrl,
            b: common_vendor.t(item.userId[0].nickName),
            c: item.status == 0
          }, item.status == 0 ? {} : {}, {
            d: common_vendor.t(item.message),
            e: common_vendor.t(item.createTime),
            f: "6be892eb-0-" + i0,
            g: common_vendor.p({
              type: "hand-up-filled",
              size: "14",
              color: isLike(item._id, getUserId.value) ? "red" : ""
            }),
            h: common_vendor.t(item.likeNumber),
            i: common_vendor.n(isLike(item._id, getUserId.value) ? "red" : ""),
            j: common_vendor.o(($event) => clickLikes(item._id, item.likeNumber)),
            k: item._id,
            l: item._id
          });
        }),
        b: scrollTop.value,
        c: common_vendor.o(($event) => getToken()),
        d: inputText.value,
        e: common_vendor.o(($event) => inputText.value = $event.detail.value),
        f: common_vendor.o(($event) => submitText())
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/huangqiang/Documents/HBuilderProjects/vue3-Message-demo/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
