// miniprogram/pages/gongGao/gongGao.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
        gongGao:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '公告内容'  //修改title
    })
    var that=this;
    var gongGao_id = options.gongGao_id;
    console.log(gongGao_id);
    const db=wx.cloud.database();
    db.collection("gongGao").where({
      _id: gongGao_id
    }).get({
      success(res){
        that.setData({
          gongGao: res.data
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