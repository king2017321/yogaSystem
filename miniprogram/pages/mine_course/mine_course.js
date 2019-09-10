// miniprogram/pages/mine_course/mine_course.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mine_course: [],
    openid: '',
    number: 1,
    yuyue_id: '',
    flag: true,
  },
  //获得预约课程的id
  details: function(e) {
    var that = this;
    var yuyue_id1=that.data.yuyue_id;
    var yuyue_id = e.currentTarget.dataset.index;
    var flag = that.data.flag;
    flag = !flag;
    that.setData({
      yuyue_id:yuyue_id,
      flag:flag
    })
    
    // if(yuyue_id==that.data.yuyue_id){
    //   flag = !flag;
    // }
    // else{
    //   this.setData({
    //     yuyue_id: yuyue_id,
    //     flag: flag
    //   })
    // }
    // this.setData({
    //   yuyue_id: yuyue_id,
    //   flag: flag
    // })
    
    // wx.showLoading({
    //   title: '加载中',
    // })
    // setTimeout(function () {
    //   wx.hideLoading();
    //   wx.navigateTo({
    //     url: '../../pages/yuyue_course/yuyue_course?yuyue_id='+that.data.yuyue_id
    //   })
    // }, 1000)

  },
  //预约
  yuyue: function() {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function() {
      wx.hideLoading();
      wx.switchTab({
        url: '../../pages/appointment/appointment'
      })
    }, 1000)
  },
  //获得自己openid
  getOpenid: function() {
    var that = this;
    const db = wx.cloud.database();
    wx.cloud.callFunction({
      name: 'login',
      success(res) {
        that.setData({
          openid: res.result.openid
        })
        console.log(that.data.openid)
        db.collection("register").where({
          _openid: that.data.openid
        }).get({
          success(res) {
            if (res.data.length != 0) {
              that.get_course();
            }
            else{
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
  //获得自己预约的课程
  get_course: function() {
    var that = this;
    const db = wx.cloud.database();
    db.collection("choseCourse").orderBy("week", "asc").where({
      _openid: that.data.openid
    }).get({
      success(res) {
        that.setData({
          mine_course: res.data
        })
        console.log(that.data.mine_course);
        if (that.data.mine_course.length == 0) {
          that.setData({
            number: 0
          })
        } else {
          that.setData({
            number: 1
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '已约课程' //修改title
    })
    this.getOpenid()
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
    this.getOpenid();
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