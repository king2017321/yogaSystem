// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  // const addcourse =db.collection("weekCourse").orderBy('time1', 'asc').get();
  // const register1 =db.collection("register").orderBy('name', 'asc').get();
  // const member1 =db.collection("member").orderBy('name', 'asc').get();
  // const chosecourse =db.collection("choseCourse").orderBy('name', 'asc').get();
  // var pro =await Promise.all([ addcourse, register1, member1, chosecourse])
  // let addCourse=pro[0].result.data;
  // let register = pro[1].result.data;
  // let member = pro[2].result.data;
  // let choseCourse = pro[3].result.data;
  return await db.collection("weekCourse").orderBy('time1', 'asc').get();
}