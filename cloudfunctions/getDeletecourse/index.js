// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
let db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  var { courselenth } = event;
  var course = db.collection("weekCourse").orderBy('week', 'asc').skip(courselenth).limit(10).get()
  return await course;
}