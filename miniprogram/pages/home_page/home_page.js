// miniprogram/pages/home_page/home_page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    heigth: 200,
    openid: '',
    yesRegister:false,
    gongGao: [],
    gongGao_id: 1,
    more_gongGao: [],
    manager: false,
    contact:[],
    image1:'',
    image2:'',
    image3:'',
  },
  //获得轮播图
  get_images() {
    var that = this;
    const db = wx.cloud.database();
    db.collection("image").orderBy("time", "desc").where({
      image: 'image1'
    }).limit(1).get({
      success(res) {
        that.setData({
          image1: res.data
        })
        console.log(res)
      }
    })
    db.collection("image").orderBy("time", "desc").where({
      image: 'image2'
    }).limit(1).get({
      success(res) {
        that.setData({
          image2: res.data
        })
        console.log(res)
      }
    })
    db.collection("image").orderBy("time", "desc").where({
      image: 'image3'
    }).limit(1).get({
      success(res) {
        that.setData({
          image3: res.data
        })
        console.log(res)
      }
    })
  },
  //用户跳转其它
  qita:function(){
    wx.showLoading({
      title: '加载中',
      mask:true,
    })
    setTimeout(function () {
      wx.hideLoading();
      wx.navigateTo({
        url: '../../pages/user_qita/user_qita'
      })
    }, 1000)
  },

  //获得联系“我们信息”
  get_contact:function(){
    var that = this;
    const db = wx.cloud.database();
    db.collection("contact_us").orderBy("time","desc").limit(1).get({
      success(res) {
        that.setData({
          contact: res.data
        })
        console.log(res.data)
      }
    })
  },
  //others其它管理
  others:function(){
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    setTimeout(function () {
      wx.hideLoading();
      wx.navigateTo({
        url: '../../pages/contact_us/contact_us'
      })
    }, 1000)
  },
  //点击更多公告
  more_gongGao: function() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    setTimeout(function() {
      wx.hideLoading();
      wx.navigateTo({
        url: '../../pages/more_gongGao/more_gongGao'
      })
    }, 1000)
  },
  //得到公告中内容的id
  bind_gongGao: function(e) {
    var that = this;
    that.setData({
      gongGao_id: e.currentTarget.dataset.index //e.target.dataset的区别
    })
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    setTimeout(function() {
      wx.hideLoading();
      wx.navigateTo({
        url: '../../pages/gongGao/gongGao?gongGao_id=' + that.data.gongGao_id, //通过该页面把gongGao_id传值给gongGao页面
      })
    }, 1000)
  },
  //获取公告（最近两个）
  get_gongGao: function() {
    var that = this;
    const db = wx.cloud.database();
    db.collection("gongGao").orderBy("time", "desc").limit(2).get({
      success(res) {
        that.setData({
          gongGao: res.data
        })
        console.log(res.data)
      }
    })

  },
  // 获得打开用户openid
  getOpenid: function() {
    var that = this;
    const db=wx.cloud.database();
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('callFunction test result: ', res)
      },
      success(res) {
        that.setData({
          openid: res.result.openid
        })
        db.collection("register").where({
          _openid:that.data.openid
        }).get({
          success(res){
            if(res.data.length!=0){
              that.setData({
                yesRegister:true,
              })
            }
          }
        })
        if (that.data.openid == 'ogQMg5ZXhDAdBtnVkFVjWPHo9Nk4' || that.data.openid =='ogQMg5fMnqOFM55wr_QWJQa_Xyb4') {
          that.setData({
            heigth: 400,
            manager: true
          })
          return res.result.openid
        } else return false;
      },
      fail() {
        return false
      }
    })
  },
  //跳转活动页面
  activity: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    setTimeout(function () {
      wx.hideLoading();
      wx.navigateTo({
        url: '../../pages/activity/activity'
      })
    }, 1000)
  },
  //预约课程页面
  yuyueCourse: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    setTimeout(function () {
      wx.hideLoading();
      wx.switchTab({
        url: '../../pages/appointment/appointment'
      })
    }, 1000)
  },
  //跳转照片墙
  photo: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    setTimeout(function () {
      wx.hideLoading();
      wx.navigateTo({
        url: '../../pages/photo/photo'
      })
    }, 1000)
  },
  //跳转管理课程
  managerCourse: function() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    setTimeout(function () {
      wx.hideLoading();
      wx.navigateTo({
        url: '../../pages/addClass/addClass'
      })
    }, 1000)
  },
  //会员管理
  managerMember: function() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    setTimeout(function () {
      wx.hideLoading();
      wx.navigateTo({
        url: '../../pages/mberManager/mberManager'
      })
    }, 1000)
  },
  //公告管理
  gongGao: function() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    setTimeout(function () {
      wx.hideLoading();
      wx.navigateTo({
        url: '../../pages/gongGao_manager/gongGao_manager'
      })
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOpenid();
    this.get_gongGao();
    this.get_images();
    this.get_contact();
    wx.setNavigationBarTitle({
      title: '一沐瑜伽' //修改title
    })
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
    this.get_images();
    this.get_gongGao();
    this.get_contact();
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