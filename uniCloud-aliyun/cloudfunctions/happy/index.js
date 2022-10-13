const jwt = require('jsonwebtoken')
const db = uniCloud.database()
const dbCmd = db.command
//小程序配置
const appId = 'wxe4934a642e916d27'
const appSecret = '29e52d7983d0ccfe0bce367ebf772df4'
const jwtSecret = '4934a642e916d27'


exports.main = async (event, context) => {
  const dbJQL = uniCloud.databaseForJQL({
    event,
    context
  })
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
    /*调用接口，获取openid*/
    let wxRes = await uniCloud.httpclient.request(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${event.code}&grant_type=authorization_code`, {
        dataType: 'json',
      }
    )
    console.log(wxRes)
    wxRes = wxRes.data.openid
    if (!wxRes) {
      throw new Error(wxRes.data.errmsg)
    } else {
      //JWT封装token
      const token = 'Bearer ' + jwt.sign({
        userId: wxRes
      }, jwtSecret)
      //判断用户表是否存在openid
      const user = await db.collection('user').doc(wxRes).get()
      if (user.data[0]) {
        //存在用户，返回用户信息
        return {
          user: user.data[0],
          token
        }
      } else {
        //不存在用户，新增一条用户数据
        const userData = {
          _id: wxRes,
          createdAt: Date.now(),
          nickName: event.nickName,
          avatarUrl: event.avatarUrl,
          signature: event.signature,
        }
        await db.collection('user').add(userData)
        return {
          user: userData,
          token
        }
      }
    }
  }
  const auth = jwt.verify(event.token.replace('Bearer ', ''), jwtSecret)
  if (event.api == 'message') {
    errorToken()
    return await dbJQL.collection('message').add({
      message: event.message,
      likeNumber: event.likeNum,
      createTime: event.createTime,
      status: event.status,
      userId: auth.userId,
    })
  }
  if (event.api == 'getMessage') {
    dbJQL.setUser({ // 指定后续执行操作的用户信息，此虚拟用户将同时拥有传入的uid、role、permission
      //uid: auth.userId,  建议此处使用真实uid
      role: ['admin'], // 指定当前执行用户的角色为admin。如果只希望指定为admin身份，可以删除uid和permission节点
      //permission: []
    })
    const message =
      await dbJQL.collection('message').where(
        `status == 1  || userId == '${auth.userId}'`).getTemp()
    const user = await dbJQL.collection('user').getTemp()
    return await dbJQL.collection(message, user).orderBy('createTime', 'desc').get()

  }

  if (event.api == 'updatelikes') {
    const curLikeUser = await db.collection('message').where({
      _id: event.id,
      likeUser: auth.userId
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
        likeUser: dbCmd.push(auth.userId)
      })
    }
  }
  //event为客户端上传的参数
  console.log('event : ', event)
  //返回数据给客户端
  return event
};
