// miniprogram/pages/more_gongGao/more_gongGao.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: 0,
    gongGao: [],
    gongGao_id: '',
    text: [], //点击公告标题跳转的正文内容
  },
  //返回
  must:function(e){
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading();
      that.setData({
        number: 0
      })
    }, 1000)
  },
  //获得公告内容
  bind_gongGao: function (e) {
    var that = this;
    that.setData({
      gongGao_id: e.currentTarget.dataset.index
    })
    const db = wx.cloud.database();
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading();
      db.collection("gongGao").where({
        _id: that.data.gongGao_id
      }).get({
        success(res) {
          that.setData({
            text: res.data,
            number: 1
          })
          console.log(res.data);
        }
      })
    }, 1500)
  },
  //获得公告
  get_gongGao: function () {
    const db = wx.cloud.database();
    var that = this;
    db.collection("gongGao").orderBy("time", "desc").get({
      success(res) {
        that.setData({
          gongGao: res.data
        })
        console.log(res.data);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_gongGao();
    wx.setNavigationBarTitle({
      title: '更多公告' //修改title
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