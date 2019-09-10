// miniprogram/pages/gongGao_manager/gongGao_manager.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    text: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '公告管理'  //修改title
    })
  },

  _text: function (e) {
    this.setData({
      text: e.detail.value
    })
  },

  _title: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  //确定按钮
  must: function () {
    var that = this;
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const cur_date = date.getDate();
    const time=cur_year+'/'+cur_month+'/'+cur_date
    var title = that.data.title;
    var text = that.data.text;
    const db = wx.cloud.database();
    if (title == '' || text == '') {
      wx.showToast({
        title: '公告或内容不能为空',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
    }
    else {
      db.collection("gongGao").add({
        data: {
          "title": that.data.title,
          "text": that.data.text,
          "time": time
        },
        success(res) {
          wx.showToast({
            title: '添加成功',
            mask: true,
            duration: 1500,
          })
          that.setData({
            title:'',
            text:'',
          })
        },
      })
    }
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