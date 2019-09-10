// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.a == 1) {
    return db.collection("member").doc(event.member_id).remove();
  }
  else if (event.a == 2) {
    return db.collection("register").where({
      _openid: event.openid
    }).update({
      data: {
        member: false
      }
    })
  }
  else if (event.a == 3) {
    return db.collection("person_train").doc(event.person_train_id).remove();
  }
  else if (event.a == 4) {
    return db.collection("register").where({
      _openid: event.openid
    }).update({
      data: {
        person_train: false
      }
    })
  }
  else if(event.a==5){
    return await db.collection("weekCourse").doc(event._id).update({
      data:{
        count1:event.count1
      }
    })
  }
  else if(event.a==6){
    return await db.collection("weekCourse").doc(event._id).update({
      data: {
        count1: event.count
      }
    })
  }
}