const jwt = require('jsonwebtoken')
const db = uniCloud.database({
  throwOnNotFound: false
})
const appId = 'wxe4934a642e916d27'
const appSecret = '29e52d7983d0ccfe0bce367ebf772df4'
const jwtSecret = '4934a642e916d27'

exports.main = async (event, context) => {
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
      }
      await db.collection('user').add(data)
    }
    return {
      user: data,
      token
    }
  }
  if (!event.token) {
    throw new Error('用户未登录')
  } else {
    const auth = jwt.verify(event.token.replace('Bearer ', ''), jwtSecret)
  }

  if (event.api == 'message') {
    return await db.collection('message').add({
      message: event.message,
      likeNumber: event.likeNum,
      createTime: event.createTime,
      nickName: auth.nickName,
      avatarUrl: auth.avatarUrl,
      userId: auth.userId,
    })
  }
  if (event.api == 'getMessage') {
    return await db.collection('message').get()
  }
  if (event.api == 'updatelikes') {
    return await db.collection('message').where({
      _id: event._id
    }).update({
      likeNumber: event.likeNum
    })
  }
  //event为客户端上传的参数
  console.log('event : ', event)
  //返回数据给客户端
  return event
};
