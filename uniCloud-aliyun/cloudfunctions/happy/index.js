const jwt = require('jsonwebtoken')
const db = uniCloud.database({
  throwOnNotFound: false
})
const _ = db.command
const appId = 'wxe4934a642e916d27'
const appSecret = '29e52d7983d0ccfe0bce367ebf772df4'
const jwtSecret = '4934a642e916d27'

exports.main = async (event, context) => {
  const errorToken = () => {
    if (!event.token) {
      return {
        errCode: 2,
        errMsg: "你没有登录"
      }
      throw new Error("未登录不能留言")
    }
  }

  if (event.api === 'loginWithMp') {
    const wxRes = await uniCloud.httpclient.request(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${event.code}&grant_type=authorization_code`, {
        dataType: 'json',
      }
    )
    const userId = wxRes.data.openid
    if (!userId) {
      throw new Error(wxRes.data.errmsg)
    }
    const user = await db.collection('user').doc(userId).get()
    const token = 'Bearer ' + jwt.sign({
      userId,
      nickName: event.nickName,
      avatarUrl: event.avatarUrl,
      signature: event.signature,
    }, jwtSecret)
    if (user.data[0]) {
      return {
        user: user.data[0],
        token
      }
    } else {
      const data = {
        _id: userId,
        createdAt: Date.now(),
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        signature: event.signature,
      }
      await db.collection('user').add(data)
    }
    return {
      user: data,
      token
    }
  }



  const auth = jwt.verify(event.token.replace('Bearer ', ''), jwtSecret)
  const nickName = auth.nickName
  const avatarUrl = auth.avatarUrl
  const userId = auth.userId


  if (event.api == 'message') {
    errorToken()
    return await db.collection('message').add({
      message: event.message,
      likeNumber: event.likeNum,
      createTime: event.createTime,
      status: event.status,
      nickName,
      avatarUrl,
      userId,
    })
  }
  if (event.api == 'getMessage') {
    return await db.collection('message').where(
      _.or({
        status: 1
      }, {
        userId
      })).orderBy('createTime', 'desc').get()
  }
  if (event.api == 'updatelikes') {
    const curLikeUser = await db.collection('message').where({
      _id: event.id,
      likeUser: userId
    }).get()
    if (curLikeUser.data[0]) {
      throw new Error("你已经点过赞啦")
      return {
        errCode: 2,
        errMsg: "你已经点过赞啦"
      }
    } else {
      return await db.collection('message').doc(event.id).update({
        likeNumber: event.likeNumber,
        likeUser: _.push(userId)
      })
    }
  }
  //event为客户端上传的参数
  console.log('event : ', event)
  //返回数据给客户端
  return event
};
