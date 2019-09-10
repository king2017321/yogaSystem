// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database();
//const _=db.command;
exports.main = async(event, context) => {
  // if (event.a== 1) {
  //   try {
  //     return await db.collection('weekCourse').doc(event._id).update({
  //       data: {
  //         selected: true
  //       }
  //     })
  //   } catch (e) {
  //     console.error(e)
  //   }
  // } else if(event.a==2){
      return await db.collection('weekCourse').doc(event._id).remove()

}