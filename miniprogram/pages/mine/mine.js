// miniprogram/pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    charm: 0,//魅力值
    member: 0,//会员积分
    flag: '',
    openid: '',
    date: '1880-01-01',
    mail: '输入邮箱',
    flag1: false,//是否显示完成按钮
    flag3:false,
    jifen_value:''
  },
  //获得邮箱
  getmail_bath: function () {
    var that = this;
    const db = wx.cloud.database();
    db.collection("register").where({
      _openid: that.data.openid
    }).get({
      success(res) {
        that.setData({
          mail: res.data[0].mail,
          jifen_value: res.data[0].jifen_value
        })
        if (res.data[0].birthday!=''){
            that.setData({
              date: res.data[0].birthday,
            })
        }
      },
    })
  },
  //转到详细地址
  address: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading();
      wx.navigateTo({
        url: '../../pages/address_mail/address_mail?openid=' + that.data.openid
      })
    }, 1000)
  },
  //出生日期
  bindDateChange: function (e) {
    var that = this;
    that.setData({
      date: e.detail.value,
      flag1: true
    })
  },
  //完成按钮
  must: function () {
    var that = this;
    const db = wx.cloud.database();
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading();
      wx.cloud.callFunction({
        name: 'updata_mine',
        data: {
          a: 2,
          openid: that.data.openid,
          date:that.data.date
        },
        success() {
          wx.showToast({
            title: '保存成功',
          })
          that.setData({
            flag1: false
          })
        }
      })
    }, 1000)
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
            that.getmail_bath();
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
  onLoad() {
    wx.setNavigationBarTitle({
      title: '个人中心'  //修改title
    })
    this.getOpenid();
    this.setData({
      flag3:true
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
      this.setData({
        flag1: false
      })
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
    this.getOpenid();
    this.setData({
      flag1: false
    })
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