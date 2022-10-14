"use strict";
var common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  __name: "timeline",
  props: {
    showTail: {
      type: Boolean,
      default: true
    },
    timestamp: {
      type: String,
      default: function() {
        return "";
      }
    },
    color: {
      type: String,
      default: function() {
        return null;
      }
    },
    title: {
      type: String,
      default: function() {
        return "";
      }
    },
    desc: {
      type: String,
      default: function() {
        return "";
      }
    },
    size: {
      type: Number,
      default: function() {
        return 16;
      }
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o((...args) => _ctx.iconClick && _ctx.iconClick(...args)),
        b: __props.color,
        c: __props.size + "px",
        d: __props.size + "px",
        e: __props.showTail
      }, __props.showTail ? {} : {}, {
        f: common_vendor.t(__props.timestamp),
        g: common_vendor.o((...args) => _ctx.editClick && _ctx.editClick(...args)),
        h: common_vendor.o(($event) => _ctx.$emit("editClick")),
        i: __props.size + "px",
        j: (__props.size > 40 ? 40 : __props.size) + "px",
        k: __props.title != ""
      }, __props.title != "" ? {
        l: common_vendor.t(__props.title)
      } : {}, {
        m: __props.desc != ""
      }, __props.desc != "" ? {
        n: common_vendor.t(__props.desc)
      } : {}, {
        o: common_vendor.o((...args) => _ctx.bodyClick && _ctx.bodyClick(...args))
      });
    };
  }
};
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/huangqiang/Documents/HBuilderProjects/vue3-Message-demo/uni_modules/iihao-timeline/components/timeline/timeline.vue"]]);
wx.createComponent(Component);
