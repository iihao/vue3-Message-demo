"use strict";var e=require("../../common/vendor.js");Array||e.resolveComponent("uni-icons")();const N=()=>"../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";Math||N();const U={__name:"index",setup(m){const i=e.ref(""),c=e.ref([]),v=e.ref(e.dayjs().format("YYYY-MM-DD HH:mm:ss")),h=e.ref(0);e.ref();const x=e.ref(e.index.getStorageSync("_id")),k=e.ref(),l=e.ref([]),_=e.pn.database(),u=e.ref();e.ref();const y=e.ref(),w=e.ref(0),d=e.ref({}),S=async()=>{if(i.value)await e.pn.callFunction({name:"happy",data:{api:"message",message:i.value,likeNum:h.value,createTime:v.value,nickName:l.value.nickName,avatarUrl:l.value.avatarUrl,status:w.value,token:e.index.getStorageSync("token")}}).then(o=>{r(),i.value="",e.index.showToast({title:"\u7559\u8A00\u6210\u529F",icon:"success"}),e.index.pageScrollTo({scrollTop:0,selector:".app-main",duration:400})}).catch(o=>{console.log(o),e.index.showToast({title:"\u7559\u8A00\u5931\u8D25",icon:"error"})});else throw e.index.showToast({title:"\u7559\u8A00\u4E0D\u80FD\u4E3A\u7A7A",icon:"error"}),new Error("\u4E0D\u80FD\u4E3A\u7A7A")},r=o=>{e.pn.callFunction({name:"happy",data:{api:o||"getMessage",token:e.index.getStorageSync("token")}}).then(t=>{e.index.hideLoading(),console.log(t),c.value=t.result.data}).catch(t=>{console.log(t),e.index.showToast({title:"\u83B7\u53D6\u7559\u8A00\u5931\u8D25",icon:"error"})})},b=async(o,t,n)=>{t++,await e.pn.callFunction({name:"happy",data:{api:"updatelikes",likeNumber:t,id:o,token:e.index.getStorageSync("token")}}).then(a=>{e.index.showToast({title:"\u70B9\u8D5E\u6210\u529F",icon:"success"}),k.value="red";const s=c.value.filter(p=>p._id==o);s[0].likeNumber++,console.log(a)}).catch(a=>{console.log(a),e.index.showToast({title:"\u4F60\u5DF2\u7ECF\u70B9\u8FC7\u8D5E\u5566",icon:"error"})})},g=async()=>{await e.index.login({timeout:1e4,success:o=>{u.value=o.code,console.log(o.code)},fail:o=>{console.log(o)}})},f=async()=>{await g();let o=e.index.getStorageSync("token");o?r():e.pn.callFunction({name:"happy",data:{api:"loginWithMp",nickName:l.value.nickName||"\u533F\u540D\u7528\u6237",avatarUrl:l.value.avatarUrl||"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-f7df76d0-0735-45ba-bd49-e366b3796e28/e89dbb99-fcd8-4182-ad73-82395d85bb9f.png",code:u.value}}).then(({result:t})=>{o=t.token,console.log(t),e.index.setStorageSync("token",o),e.index.setStorageSync("_id",t.user._id),r()}).catch(t=>{e.index.hideLoading(),console.log(t),e.index.showToast({title:"\u767B\u5F55\u5931\u8D25",icon:"error"})})},T=()=>{e.index.getStorageSync("token")?(e.index.showLoading({title:"\u52A0\u8F7D\u4E2D"}),r()):e.index.showModal({title:d.value.title||"\u7528\u6237\u534F\u8BAE",content:d.value.content||"content",confirmText:"\u540C\u610F",cancelText:"\u9000\u51FA",success:function(o){o.confirm?(e.index.showLoading({title:"\u52A0\u8F7D\u4E2D"}),f()):o.cancel&&console.log("\u7528\u6237\u70B9\u51FB\u53D6\u6D88")}})},L=(o,t)=>{const a=JSON.parse(JSON.stringify(c.value)).filter(s=>s._id==o);if(a[0].likeUser&&a[0].likeUser.indexOf(t)>-1)return!0;console.log("\u7559\u8A00\u5217\u8868",a)};return e.onLoad(()=>{_.collection("show-agreement").limit(1).get().then(o=>{d.value=o.result.data[0],T()}),g(),console.log("onLoad")}),e.onReady(()=>{console.log("onReady")}),(o,t)=>({a:e.f(c.value,(n,a,s)=>e.e({a:n.userId[0].avatarUrl,b:e.t(n.userId[0].nickName),c:n.status==0},n.status==0?{}:{},{d:e.t(n.message),e:e.t(n.createTime),f:"1e0064b8-0-"+s,g:e.p({type:"hand-up-filled",size:"14",color:L(n._id,x.value)?"red":""}),h:e.t(n.likeNumber),i:e.o(p=>b(n._id,n.likeNumber)),j:n._id,k:"id-"+a})),b:y.value,c:e.o(n=>f()),d:i.value,e:e.o(n=>i.value=n.detail.value),f:e.o(n=>S())})}};var M=e._export_sfc(U,[["__file","/Users/huangqiang/Documents/HBuilderProjects/iihao/pages/index/index.vue"]]);wx.createPage(M);
