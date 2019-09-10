// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  //const week1 = event.currentTime
  const day = new Date(new Date().getTime() + 28800 * 1000);
  var week1 = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const week = day.getDay();
  // const hours = day.getHours();
  // const minte = day.getMinutes();
  // const month = day.getMonth();
  //  return {
  //    day,
  //    week,
  //    hours,
  //    minte,
  //    month
  //  }

  // var deleteCgose = await db.collection('choseCourse').where({
  //   week: week1[week]
  // }).remove();
  // db.collection("weekCourse").where({
  //   week: week1[week]
  // }).get({
  //   success(res) {
  //    var getall_Course = res.data;
  //     for (var i = 0; i < getall_Course.length; i++) {
  //       await db.collection('weekCourse').doc(getall_Course[i]._id).update({
  //         data: {
  //           count: getall_Course[i].count1
  //         },
  //         success(res){
  //           updateCount.concat(res.data)
  //         }
  //       })
  //     }
  //   }
  // })
  // try {
  //   return await {
  //     deleteCgose,
  //     updateCount
  //   }
  // } catch (e) {
  //   console.error(e)
  // }
  var remove = await db.collection('choseCourse').where({
    week: week1[week]
  }).remove();
  var update = await db.collection("weekCourse").where({
    week: week1[week]
  }).update({
    data: {
      count1: 0
    }
  })
  try {
    return{
      remove,
      update
    }
  } catch (e) {
    console.error(e)
  }
}
