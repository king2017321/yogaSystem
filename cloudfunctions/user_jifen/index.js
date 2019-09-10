// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
 
  if(event.b==1){
    return await db.collection("register").where({
      _openid: event.openid
    }).update({
      data: {
        jifen_value:event.jifen
      }
    })
  }
  else if(event.b==2){
    return await db.collection("register").where({
      _openid: event.current_openid
    }).update({
      data: {
        jifen_value: event.jifen
      }
    })
  }
  
}