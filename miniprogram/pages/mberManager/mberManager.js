// miniprogram/pages/mberManager/mberManager.js
Page({
  data: {
    number: 1,
    member: [],
    mebernull:1,
    person_train: [],
    details: '', //获取会员的id值
    flaglenth: 1,
    flaglenth1: 1,
    flaglenth2: 1,
    name: '',
    telephone: '',
    time_stamp: '',
    scroll_height: '',
    search: '',
    search_value: [],
    member_openid: '', //增加会员时唯一的openid值获取
    //all_user:[],
    editor: false,
    sum: 0,
    selectAll: false,//编辑

  },
  /**
   * 生命周期函数--监听页面加载
   */
  //添加会员
  all_user: function () {
    var that = this;
    const db = wx.cloud.database();
    var memberlenth = that.data.search_value.length;
    if (memberlenth == 0) {
      db.collection("register").orderBy("time_stamp", 'desc').limit(8).get({
        success(res) {
          that.setData({
            search_value: res.data
          })
        }
      })
    } else {
      db.collection("register").orderBy("time_stamp", 'desc').skip(memberlenth).limit(8).get({
        success(res) {
          var flaglenth = res.data.length
          that.setData({
            flaglenth1: flaglenth
          })
          if (flaglenth > 0) {
            that.setData({
              search_value: that.data.search_value.concat(res.data),
            })
          } else {
            wx.showToast({
              title: '没有更多数据了',
              icon: 'none',
              mask: true,
              duration: 800,
            })
          }
        },
      })
    }
  },
  //会员列表
  member: function () {
    var that = this;
    const db = wx.cloud.database();
    var memberlenth = that.data.member.length;
    if (memberlenth == 0) {
      db.collection("member").orderBy("time_stamp", 'desc').limit(8).get({
        success(res) {
          that.setData({
            member: res.data,
            mebernull: res.data.length
          })
        }
      })
    } else {
      db.collection("member").orderBy("time_stamp", 'desc').skip(memberlenth).limit(8).get({
        success(res) {
          var flaglenth = res.data.length
          that.setData({
            flaglenth: flaglenth
          })
          if (flaglenth > 0) {
            that.setData({
              member: that.data.member.concat(res.data),
            })
          } else {
            wx.showToast({
              title: '没有更多数据了',
              icon: 'none',
              mask: true,
              duration: 800,
            })
          }
        },
      })
    }
  },
  //私教列表
  person_train: function () {
    var that = this;
    const db = wx.cloud.database();
    var memberlenth = that.data.person_train.length;
    if (memberlenth == 0) {
      db.collection("person_train").orderBy("time_stamp", 'desc').limit(8).get({
        success(res) {
          that.setData({
            person_train: res.data,
            mebernull: res.data.length
          })
        }
      })
    } else {
      db.collection("person_train").orderBy("time_stamp", 'desc').skip(memberlenth).limit(8).get({
        success(res) {
          var flaglenth = res.data.length
          that.setData({
            flaglenth2: flaglenth
          })
          if (flaglenth > 0) {
            that.setData({
              person_train: that.data.person_train.concat(res.data),
            })
          } else {
            wx.showToast({
              title: '没有更多数据了',
              icon: 'none',
              mask: true,
              duration: 800,
            })
          }
        },
      })
    }
  },
  bindDownLoad: function () {
    var that = this;
    if (that.data.number == 1 && that.data.flaglenth != 0) {
      wx.showLoading({
        title: '正在加载',
      })
      setTimeout(function () {
        wx.hideLoading();
      }, 1500)
      that.member();
    } else if (that.data.number == 2 && that.data.flaglenth1 != 0) {
      wx.showLoading({
        title: '正在加载',
      })
      setTimeout(function () {
        wx.hideLoading();
      }, 1500)
      that.all_user();
    }
    else if (that.data.number == 4 && that.data.flaglenth2 != 0) {
      wx.showLoading({
        title: '正在加载',
      })
      setTimeout(function () {
        wx.hideLoading();
      }, 1500)
      that.person_train();
    }
  },
  details: function (e) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    setTimeout(function () {
      wx.hideLoading();
      that.setData({
        details: e.currentTarget.dataset.index //获得点击时的会员详情
      })
      const db = wx.cloud.database();
      db.collection("member").where({
        _id: that.data.details
      }).get({
        success(res) {
          console.log(res)
          that.setData({
            name: res.data[0].name,
            telephone: res.data[0].telephone,
            time_stamp: res.data[0].time_stamp,
          })
        }
      })
    }, 1500)
  },
  details1: function (e) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    setTimeout(function () {
      wx.hideLoading();
      that.setData({
        details: e.currentTarget.dataset.index,//获得点击时的会员详情
        name: '',
        telephone: '',
        time_stamp: '',
      })
      console.log(that.data.details)
      const db = wx.cloud.database();
      db.collection("person_train").where({
        _id: that.data.details
      }).get({
        success(res) {
          console.log(res)
          that.setData({
            name: res.data[0].name,
            telephone: res.data[0].telephone,
            time_stamp: res.data[0].time_stamp,
          })
          console.log(res);
        }
      })
    }, 1500)
  },
  //计算scroll-view的高度
  scrollheight() {
    let windowHeight = wx.getSystemInfoSync().windowHeight; // 屏幕的高度  
    let windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕的宽度    
    this.setData({
      scroll_height: windowHeight * 750 / windowWidth - 125 - 50
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '会员管理'  //修改title
    })
    var that = this;
    that.scrollheight();
    that.member();
    that.all_user();
    that.person_train();
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

  },
  bindtapEvent: function (e) {
    var number = e.currentTarget.dataset.index;
    var that = this;
    that.setData({
      number: number,
      details: '',
      flaglenth: 1,
      flaglenth1: 1,
      flaglenth2: 1,
      search: '',
      search_value: '',
      member: '',
      editor: false,
      sum: 0,
      selectAll: false,
      person_train: ''
    })
    if (number == 2) {
      that.all_user();
    } else if (number == 1) {
      that.member();
    }
    else if (number == 4) {
      that.person_train();
    }
  },
  //输入查询信息
  searchInput: function (e) {
    this.setData({
      search: e.detail.value
    })
  },
  //搜索按钮
  searchFn() {
    var that = this;
    const db = wx.cloud.database();
    if (that.data.search == '') {
      wx.showToast({
        title: '请输入需要查询的信息',
        icon: 'none'
      })
      return
    } else {
      db.collection("register").where({
        name: that.data.search
      }).get({
        success(res) {
          that.setData({
            search_value: res.data,
          })
          if (that.data.search_value.length == 0) {
            wx.showToast({
              title: '没有此用户',
              icon: 'none'
            })
          }
        }
      })
      return
    }
  },
  //添加会员
  addmeber: function (e) {
    var that = this;
    const db = wx.cloud.database();
    var id = '';
    var member_openid = '';
    var search_value = that.data.search_value;
    wx.showLoading({
      title: '正在加载',
    })
    setTimeout(function () {
      wx.hideLoading();
      that.setData({
        member_openid: e.currentTarget.dataset.index
      })
      for (var i = 0; i < search_value.length; i++) {
        if (that.data.member_openid == search_value[i]._openid) {
          search_value[i].member = true;
          that.setData({
            search_value: search_value
          })
          db.collection("member").add({
            data: {
              'openid': search_value[i]._openid,
              'name': search_value[i].name,
              'telephone': search_value[i].telephone,
              'time_stamp': search_value[i].time_stamp,
              'deleted': false
            },
          })
          wx.cloud.callFunction({
            name: 'add_meber',
            data: {
              a: 1,
              member_openid: that.data.member_openid
            },
            complete: res => {
              console.log('callFunction test result: ', res);
            }
          })
        }
      }
    }, 1500)
  },
  editor: function () {
    var editor = !this.data.editor;
    this.setData({
      editor: editor
    })
  },
  //会员列表编辑状态下删除会员
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let member = this.data.member;
    const deleted = member[index].deleted; // 获取当前的选中状态
    member[index].deleted = !deleted; // 改变状态
    let sum = this.data.sum;
    let count = 0;
    for (let i = 0; i < member.length; i++) {
      if (member[i].deleted == true) {
        count = count + 1;
      }
    }
    if (count == member.length) {
      this.setData({
        selectAll: true
      })
    }
    if (count != member.length) {
      this.setData({
        selectAll: false
      })
    }
    this.setData({
      member: member,
      sum: count
    });
  },
  //选中全部
  selectAll() {
    let that = this;
    var selectAll = this.data.selectAll;
    let member = this.data.member;
    selectAll = !selectAll;
    if (selectAll) {
      for (let i = 0; i < member.length; i++) {
        member[i].deleted = true;
      }
      that.setData({
        sum: member.length
      })
    } else {
      for (let i = 0; i < member.length; i++) {
        member[i].deleted = false;
      }
      that.setData({
        sum: 0
      })
    }
    that.setData({
      selectAll: selectAll,
      member: member,
    })
  },
  //会员列表->删除会员
  deletememebr() {
    let that = this;
    const db = wx.cloud.database();
    let member = this.data.member;
    if (that.data.sum == 0) {
      wx.showToast({
        title: '请选中需要删除的会员',
        icon: 'none',
      })
    }
    if (that.data.sum != 0) {
      wx.showModal({
        title: '提示',
        content: '是否删除这' + that.data.sum + '个会员',
        confirmColor: 'red',
        success: function (res) {
          if (res.confirm) {
            for (let i = 0; i < member.length; i++) {
              if (member[i].deleted) {
                wx.cloud.callFunction({
                  name: 'delete_member',
                  data: {
                    a: 2,
                    openid: member[i].openid
                  },
                  success(res) {
                    console.log(res)
                  }
                })
                wx.cloud.callFunction({
                  name: 'delete_member',
                  data: {
                    a: 1,
                    member_id: member[i]._id
                  },
                  success(res) {
                    console.log(res)
                  }
                })
                member.splice(i--, 1)
              }
            }
            that.setData({
              member: member,
              sum: 0
            })
          }
        }
      })
    }
  },
  //私教搜索
  searchInput_pt: function (e) {
    this.setData({
      search: e.detail.value
    })
  },
  //搜索私教
  search_pt: function () {
    var that = this;
    const db = wx.cloud.database();
    if (that.data.search == '') {
      wx.showToast({
        title: '请输入需要查询的信息',
        icon: 'none'
      })
      return
    } else {
      db.collection("register").where({
        name: that.data.search
      }).get({
        success(res) {
          that.setData({
            search_value: res.data,
          })
          if (that.data.search_value.length == 0) {
            wx.showToast({
              title: '没有此用户',
              icon: 'none'
            })
          }
        }
      })
      return
    }
  },
  //添加私教
  addperson_train: function (e) {
    var that = this;
    const db = wx.cloud.database();
    var id = '';
    var length=1;
    var openid='';
    var name='';
    var telephone='';
    var time_stamp='';
    var member_openid = '';
    var search_value = that.data.search_value;
    wx.showLoading({
      title: '正在加载',
    })
    setTimeout(function () {
      wx.hideLoading();
      that.setData({
        member_openid: e.currentTarget.dataset.index
      })
      for (var i = 0; i < search_value.length; i++) {
        if (that.data.member_openid == search_value[i]._openid) {
          search_value[i].person_train = true;
          that.setData({
            search_value: search_value
          })
          openid = search_value[i]._openid;
          name = search_value[i].name;
          telephone = search_value[i].telephone;
          time_stamp = search_value[i].time_stamp;
          //添加私教默认添加会员
          db.collection("member").where({
            openid: that.data.member_openid
          }).get({
            success(res) {
             length=res.data.length;
              if (length == 0) {
                db.collection("member").add({
                  data: {
                    'openid': openid,
                    'name': name,
                    'telephone':telephone,
                    'time_stamp':time_stamp,
                    'deleted': false
                  },
                  success(res) {
                    console.log(res)
                  }
                })
                wx.cloud.callFunction({
                  name: 'add_meber',
                  data: {
                    a: 1,
                    member_openid: that.data.member_openid
                  },
                  complete: res => {
                    console.log('callFunction test result: ', res);
                  }
                })
              }
            }
          })
          //和上面对其

          db.collection("person_train").add({
            data: {
              'openid': search_value[i]._openid,
              'name': search_value[i].name,
              'telephone': search_value[i].telephone,
              'time_stamp': search_value[i].time_stamp,
              'deleted': false
            },
          })
          wx.cloud.callFunction({
            name: 'add_meber',
            data: {
              a: 2,
              member_openid: that.data.member_openid
            },
            complete: res => {
              console.log('callFunction test result: ', res);
            }
          })
        }
      }
    }, 1500)
  },
  //选中私教的条目
  selectList_pt(e) {
    const index = e.currentTarget.dataset.index;
    let person_train = this.data.person_train;
    const deleted = person_train[index].deleted; // 获取当前的选中状态
    person_train[index].deleted = !deleted; // 改变状态
    let sum = this.data.sum;
    let count = 0;
    for (let i = 0; i < person_train.length; i++) {
      if (person_train[i].deleted == true) {
        count = count + 1;
      }
    }
    if (count == person_train.length) {
      this.setData({
        selectAll: true
      })
    }
    if (count != person_train.length) {
      this.setData({
        selectAll: false
      })
    }
    this.setData({
      person_train: person_train,
      sum: count
    });
  },
  //删除选中的私教条目
  deletperson_train() {
    let that = this;
    const db = wx.cloud.database();
    let person_train = this.data.person_train;
    if (that.data.sum == 0) {
      wx.showToast({
        title: '请选中需要删除的私教会员',
        icon: 'none',
      })
    }
    if (that.data.sum != 0) {
      wx.showModal({
        title: '提示',
        content: '是否删除这' + that.data.sum + '个私教会员',
        confirmColor: 'red',
        success: function (res) {
          if (res.confirm) {
            for (let i = 0; i < person_train.length; i++) {
              if (person_train[i].deleted) {
                wx.cloud.callFunction({
                  name: 'delete_member',
                  data: {
                    a: 4,
                    openid: person_train[i].openid
                  },
                  success(res) {
                    console.log(res)
                  }
                })
                wx.cloud.callFunction({
                  name: 'delete_member',
                  data: {
                    a: 3,
                    person_train_id: person_train[i]._id
                  },
                  success(res) {
                    console.log(res)
                  }
                })
                person_train.splice(i--, 1)
              }
            }
            that.setData({
              person_train: person_train,
              sum: 0
            })
          }
        }
      })
    }
  },
  //全部选择
  selectAll_pt() {
    let that = this;
    var selectAll = this.data.selectAll;
    let person_train = this.data.person_train;
    selectAll = !selectAll;
    if (selectAll) {
      for (let i = 0; i < person_train.length; i++) {
        person_train[i].deleted = true;
      }
      that.setData({
        sum: person_train.length
      })
    } else {
      for (let i = 0; i < person_train.length; i++) {
        person_train[i].deleted = false;
      }
      that.setData({
        sum: 0
      })
    }
    that.setData({
      selectAll: selectAll,
      person_train: person_train,
    })
  }
})