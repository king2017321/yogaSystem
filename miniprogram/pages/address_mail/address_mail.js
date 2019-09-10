// miniprogram/pages/address_mail/address_mail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    mail: '',
    openid: '',
    date:[]
  },
  //获得输入mail
  _mail:function(e){
    this.setData({
      mail: e.detail.value
    })
  },
  //获得输入的address
  _address:function(e){
    this.setData({
      address:e.detail.value
    })
  },
  //获得邮箱和地址
  getmail_address:function(){
    var that=this;
    const db=wx.cloud.database();
    db.collection("register").where({
      _openid:that.data.openid
    }).get({
      success(res){
        that.setData({
          address:res.data[0].address,
          mail: res.data[0].mail,
        })
        console.log(res.data);
      },
    })
  },
  save: function() {
    var that = this;
    const db = wx.cloud.database();
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading();
      if ( !(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(that.data.mail))){
        wx.showToast({
          title: '请输入正确的邮箱',
          mask: true,
          icon:'none',
        })
      }
      else{
        wx.cloud.callFunction({
          name: 'updata_mine',
          data: {
            a: 1,
            openid: that.data.openid,
            address: that.data.address,
            mail: that.data.mail
          },
          success() {
            wx.showToast({
              title: '保存成功',
            })
          }
        })
      }
      
    }, 1000)
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(that.data.address);
    that.setData({
      openid: options.openid
    })
    that.getmail_address();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})