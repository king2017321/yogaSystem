// miniprogram/pages/yuyue_course/yuyue_course.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yuyue_id:'',
    course_text:''//课程内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      yuyue_id:options.yuyue_id
    })
    console.log(that.data.yuyue_id);
    const db=wx.cloud.database();
    db.collection("choseCourse").where({
      openid: that.data.yuyue_id
    }).get({
      success(res){
        that.setData({
          course_text:res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})