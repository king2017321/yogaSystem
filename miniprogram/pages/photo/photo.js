// miniprogram/pages/photo/photo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      openid:'',
      flag:'false',
  },
  getOpenid: function () {
    var that = this;
    const db = wx.cloud.database();
    wx.cloud.callFunction({
      name: 'login',
      success(res) {
        that.setData({
          openid: res.result.openid
        })
        db.collection("register").where({
          _openid: that.data.openid
        }).get({
          success(res) {
            if (res.data.length != 0) {
              that.setData({
                flag: true
              })
            }
            else {
              that.setData({
                flag: false
              })
              wx.showLoading({
                title: '注册',
              })
              setTimeout(function () {
                wx.hideLoading();
                wx.navigateTo({
                  url: '../../pages/login/login',
                })
              }, 1000)
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getOpenid();
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