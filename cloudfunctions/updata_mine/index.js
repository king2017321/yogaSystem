// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  // var openid=await cloud.callFunction({
  //   name: 'login',
  //   success(res) {
  //     that.setData({
  //       openid: res.result.openid
  //     })
  //     console.log("云函数调用云函数")
  //   }
  // })
  if (event.a == 1) {
    return await db.collection("register").where({
      _openid: event.openid
    }).update({
      data: {
        address: event.address,
        mail: event.mail
      }
    })
  }
  else if(event.a==2){
    return await db.collection("register").where({
      _openid: event.openid
    }).update({
      data: {
        birthday:event.date
      }
    })
  }
}