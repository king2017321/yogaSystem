// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  if(event.a==1){
    return await db.collection("register").where({
      _openid: event.member_openid
    }).update({
      data: {
        member: true
      }
    })
  }
  else if(event.a==2){
    return await db.collection("register").where({
      _openid: event.member_openid
    }).update({
      data: {
        person_train: true
      }
    })
  }
  
}