// miniprogram/pages/contact_us/contact_us.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contact: '',
    phoneNum: '',
    address: '',
    image1: [],
    image2: [],
    image3: [],
    time: '',
  },
  //加载获得image的fileid
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
  //获得时间
  _time() {
    var date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    var time=year + '.' + month + '.' + day + '.' + hour + '.' + minute + '.' + second
    this.setData({
      time:time
    })
  },
  _image1: function() {
    var that = this;
    that._time();
    const db = wx.cloud.database();
    wx.chooseImage({
      success: function(res) {
        wx.cloud.uploadFile({
          cloudPath: that.data.time,
          filePath: res.tempFilePaths[0],
          success(res) {
            that.setData({
              image1: res.fileID
            })
            db.collection("image").add({
              data: {
                "fileid": that.data.image1,
                "time": that.data.time,
                "image": "image1",
              },
              success(res) {
                that.get_images(); //每次添加后刷新一次获取的图片
              }
            })

          }
        })
      },
    })
  },
  _image2: function() {
    var that = this;
    that._time();
    const db = wx.cloud.database();
    wx.chooseImage({
      success: function(res) {
        wx.cloud.uploadFile({
          cloudPath: that.data.time,
          filePath: res.tempFilePaths[0],
          success(res) {
            that.setData({
              image1: res.fileID
            })
            db.collection("image").add({
              data: {
                "fileid": that.data.image1,
                "time": that.data.time,
                "image": "image2",
              },
              success(res) {
                that.get_images(); //每次添加后刷新一次获取的图片
              }
            })
          }
        })
      },
    })
  },
  _image3: function() {
    var that = this;
    that._time();
    const db = wx.cloud.database();
    wx.chooseImage({
      success: function(res) {
        wx.cloud.uploadFile({
          cloudPath: that.data.time,
          filePath: res.tempFilePaths[0],
          success(res) {
            that.setData({
              image1: res.fileID
            })
            db.collection("image").add({
              data: {
                "fileid": that.data.image1,
                "time": that.data.time,
                "image": "image3",
              },
              success(res) {
                that.get_images(); //每次添加后刷新一次获取的图片
              }
            })

          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(this.data.time);
    var that = this;
    that.get_images();
    wx.setNavigationBarTitle({
      title: '其它' //修改title
    })
    console.log(that.data.time)
  },
  _contact: function(e) {
    this.setData({
      contact: e.detail.value
    })
  },

  _phoneNum: function(e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  _address: function(e) {
    this.setData({
      address: e.detail.value
    })
  },
  //确定按钮
  must: function() {
    var that = this;
    that._time();
    // const date = new Date();
    // const cur_year = date.getFullYear();
    // const cur_month = date.getMonth() + 1;
    // const cur_date = date.getDate();
    // const time = cur_year + '/' + cur_month + '/' + cur_date
    var contact = that.data.contact;
    var phoneNum = that.data.phoneNum;
    var address = that.data.address;
    const db = wx.cloud.database();
    if (contact == '' || phoneNum == '' || address == '') {
      wx.showToast({
        title: '姓名或联系人或地址不能为空',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
    } else {
      db.collection("contact_us").add({
        data: {
          "contact": that.data.contact,
          "phoneNum": that.data.phoneNum,
          "address": that.data.address,
          "time":that.data.time
        },
        success(res) {
          wx.showToast({
            title: '添加成功',
            mask: true,
            duration: 1500,
          })
          that.setData({
            contact: '',
            phoneNum: '',
            address: '',
          })
        },
      })
    }
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