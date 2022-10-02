const jwt = require('jsonwebtoken')
const db = uniCloud.database({
  throwOnNotFound: false
})
const _ = db.command
const jwtSecret = '4934a642e916d27'

exports.main = async (event, context) => {
  if (!event.token) {
    return {
      errCode: 2,
      errMsg: "你没有登录"
    }
    throw new Error("未登录不能留言")
  }
  const auth = jwt.verify(event.token.replace('Bearer ', ''), jwtSecret)
  const {
    nickName,
    avatarUrl,
    userId
  } = auth

  if (event.api == 'getUserInfo') {
    const userInfo = await db.collection("user").doc(userId).get()
    if (userInfo.data[0]) {
      return userInfo.data[0]
    }
    throw new Error("未登录")
  }
  if (event.api == 'updateUserInfo') {
    return await db.collection('user').doc(userId).update({
      nickName: event.nickName,
      avatarUrl: event.avatarUrl
    })
  }
  //event为客户端上传的参数
  console.log('event : ', event)

  //返回数据给客户端
  return event
};
