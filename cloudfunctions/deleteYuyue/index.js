// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
const db = cloud.database();
//const _=db.command;
exports.main = async (event, context) => {
  var courseid = event.courseId;
  var _openid = event.current_openid
  try {
    return await db.collection('choseCourse').where({
      courseId:courseid,
      _openid: _openid
    }).remove()
  } catch (e) {
    console.error(e)
  }
}