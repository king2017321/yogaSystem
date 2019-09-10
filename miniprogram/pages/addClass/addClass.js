// miniprogram/pages/addClass/addClass.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courselenth: 0,
    flag: 0, //判断输入框瑜伽类型不能为空
    flag1: 0,
    selectAll: false,
    sum: 0, //选中删除条目
    personCenter: [{
      addCourse: '添加课程',
      deleteCourse: '删除课程',
      checkYuyu: '查看已预约',
      checkVip: '查看会员信息',
      addVip: '添加会员',
      deleteVip: '删除会员'
    }],
    number: 1,
    week: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    stratTime: '',
    currentWeek: '',
    endTime: '',
    yogoTeacher: '',
    yogoType1: '',
    yogoType_value: '',
    yogoCount: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    current_yogoCount: 20,
    deleteCourse_value: [],
    currentNandu: 2,
    yogoNandu: [1, 2, 3, 4, 5],
    courseName1: '团课',
    courseName: ['团课', '私教', '教培'],
    choseCourse: [],
    completeYuyue: '', //用来标志已预约课程按钮中选择日期的
    noYuyue: true, //判断当前没有与预约人时渲染
    flaglenth: '', //标志上拉刷新到最底部时停止上拉刷新
    course_stop: '', //标志课程是否暂停预约，默认为false
    scroll_height: '', //动态改变高度
    jifen: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  choseCourse: function () {
    var that = this;
    const db = wx.cloud.database();
    let courselenth = that.data.choseCourse.length;
    if (courselenth == 0) {
      db.collection("choseCourse").orderBy("week", 'asc').orderBy('time1', 'asc').where({
        week: that.data.completeYuyue
      }).limit(10).get({
        success(res) {
          that.setData({
            choseCourse: res.data
          })
          //判断该星期天是否有预约的课程
          var choseCourse = that.data.choseCourse;
          for (var i = 0; i < choseCourse.length; i++) {
            if (that.data.completeYuyue == choseCourse[i].week) {
              that.setData({
                noYuyue: true
              })
              break;
            }
          }
          console.log(res.data.length);
        }
      })
    } else {
      db.collection("choseCourse").orderBy("week", 'asc').orderBy('time1', 'asc').where({
        week: that.data.completeYuyue
      }).skip(courselenth).limit(8).get({
        success(res) {
          console.log(res.data.length);
          let flaglenth = res.data.length
          that.setData({
            flaglenth: flaglenth
          })
          var choseCourse = that.data.choseCourse;
          for (var i = 0; i < choseCourse.length; i++) {
            if (that.data.completeYuyue == choseCourse[i].week) {
              that.setData({
                noYuyue: true
              })
              break;
            }
          }
          if (flaglenth > 0) {
            that.setData({
              choseCourse: that.data.choseCourse.concat(res.data),
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
        fail(res) {
          console.log(res);
        }
      })
    }
  },
  getCourse: function () {
    var that = this;
    let courselenth = that.data.deleteCourse_value.length;
    wx.cloud.callFunction({
      name: 'getDeletecourse',
      data: {
        courselenth: courselenth
      },
      success(res) {
        let flaglenth = res.result.data.length
        that.setData({
          flaglenth: flaglenth
        })
        if (flaglenth > 0) {
          that.setData({
            deleteCourse_value: that.data.deleteCourse_value.concat(res.result.data),
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
      fail(res) {
        console.log(res);
      }
    })
  },
  //srcollheith的高度
  scrollheight() {
    let windowHeight = wx.getSystemInfoSync().windowHeight; // 屏幕的高度  
    let windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕的宽度    
    this.setData({
      scroll_height: windowHeight * 750 / windowWidth - 248
    })
  },

  getOpenid: function () {
    var that = this;
    var openid;
    const db = wx.cloud.database();
    wx.cloud.callFunction({
      name: 'login',
      success(res) {
        openid = res.result.openid
        //获得当前积分
      }
    })
  },
  onLoad: function (options) {
    //获取删除的全部课程内容
    var that = this;
    wx.setNavigationBarTitle({
      title: '课程管理' //修改title
    })
    that.getOpenid();
    //获取到课程是否暂停
    const db = wx.cloud.database();
    db.collection('course_stop').doc('XEFrOnkPDdDCJ3fJ').get({
      success(res) {
        that.setData({
          course_stop: res.data.coursestop
        })
      },
    })
    //获取到scroll的动态高度
    that.scrollheight();
    that.getCourse();
    //加载时获取日期
    const date = new Date();
    const week = date.getDay();
    var stratTime = 0;
    var endTime = 0;
    var stratHours = 0;
    if (date.getHours() < 10) {
      stratHours = '0' + date.getHours();
    } else {
      stratHours = date.getHours();
    }
    var endHours = date.getHours() + 1;
    if (endHours < 10) {
      endHours = '0' + date.getHours() + 1;
    }
    if (date.getMinutes() < 10) {
      stratTime = stratHours + ':' + '0' + date.getMinutes();
      endTime = endHours + ':' + '0' + date.getMinutes();
    } else {
      stratTime = stratHours + ':' + date.getMinutes();
      endTime = endHours + ':' + date.getMinutes();
    }
    if (this.data.number == 1) {
      if (week != 0) {
        that.setData({
          currentWeek: that.data.week[week - 1],
          stratTime: stratTime,
          endTime: endTime
        })
      } else {
        that.setData({
          currentWeek: that.data.week[week + 6],
          stratTime: stratTime,
          endTime: endTime
        })
      }
    }
  },
  //点击全选
  selectAll: function () {
    let that = this;
    var selectAll = this.data.selectAll;
    let deleteCourse_value = this.data.deleteCourse_value;
    selectAll = !selectAll;
    if (selectAll) {
      for (let i = 0; i < deleteCourse_value.length; i++) {
        deleteCourse_value[i].selected = true;
      }
      that.setData({
        sum: deleteCourse_value.length
      })
    } else {
      for (let i = 0; i < deleteCourse_value.length; i++) {
        deleteCourse_value[i].selected = false;
      }
      that.setData({
        sum: 0
      })
    }
    that.setData({
      selectAll: selectAll,
      deleteCourse_value: deleteCourse_value,
    })
  },
  //选择删除
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let deleteCourse_value = this.data.deleteCourse_value;
    const selected = deleteCourse_value[index].selected; // 获取当前的选中状态
    deleteCourse_value[index].selected = !selected; // 改变状态
    let sum = this.data.sum;
    let count = 0;
    for (let i = 0; i < deleteCourse_value.length; i++) {
      if (deleteCourse_value[i].selected == true) {
        count = count + 1;
      }
    }
    if (count == deleteCourse_value.length) {
      this.setData({
        selectAll: true
      })
    }
    if (count != deleteCourse_value.length) {
      this.setData({
        selectAll: false
      })
    }
    this.setData({
      deleteCourse_value: deleteCourse_value,
      sum: count
    });
  },
  //删除选择的课程
  deleteCourse: function (e) {
    let that = this;
    const db = wx.cloud.database();
    let deleteCourse_value = this.data.deleteCourse_value;
    if (that.data.sum == 0) {
      wx.showToast({
        title: '没有要删除的课程',
        icon: 'none',
      })
    }
    if (that.data.sum != 0) {
      wx.showModal({
        title: '提示',
        content: '是否删除这' + that.data.sum + '门课程',
        confirmColor: 'red',
        success: function (res) {
          if (res.confirm) {
            for (var i = 0; i < deleteCourse_value.length;i++) {
              if (deleteCourse_value[i].selected) {
                wx.cloud.callFunction({
                  name: "deleteCourse",
                  data: {
                    a: 1,
                    _id: deleteCourse_value[i]._id
                  },
                  success(res){
                    deleteCourse_value.splice(i--, 1);
                  }
                })
                // wx.cloud.callFunction({
                //   name: "deleteCourse",
                //   data: {
                //     a: 1,
                //     _id: deleteCourse_value[i]._id
                //   },
                //   success(res) {
                //     console.log("删除：" + res);
                //     deleteCourse_value.splice(i--, 1);
                //     wx.cloud.callFunction({
                //       name: 'deleteCourse',
                //       data: {
                //         a: 2
                //       }
                //     }).then(console.log)
                //   }
                // })
                // db.collection("weekCourse").doc(deleteCourse_value[i]._id).update({
                //   data: {
                //     selected: true
                //   }
                // })

              }
            }
            that.setData({
              deleteCourse_value: deleteCourse_value,
              sum: 0
            })
          }
          
        }
      })
    }
  },
  bindtapEvent: function (e) {
    let that = this
    let number = e.currentTarget.dataset.index;
    wx.hideLoading();
    that.setData({
      number,
      completeYuyue: '', //每点击一下就刷新这个值。
      noYuyue: false,
      choseCourse: '',
    })
    const date = new Date();
    const week = date.getDay();
    var stratTime = 0;
    var endTime = 0;
    var stratHours = 0;
    if (date.getHours() < 10) {
      stratHours = '0' + date.getHours();
    } else {
      stratHours = date.getHours();
    }
    var endHours = date.getHours() + 1;
    if (endHours < 10) {
      endHours = '0' + date.getHours() + 1;
    }
    if (date.getMinutes() < 10) {
      stratTime = stratHours + ':' + '0' + date.getMinutes();
      endTime = endHours + ':' + '0' + date.getMinutes();
    } else {
      stratTime = stratHours + ':' + date.getMinutes();
      endTime = endHours + ':' + date.getMinutes();
    }
    if (this.data.number == 1) {
      if (week != 0) {
        that.setData({
          currentWeek: that.data.week[week - 1],
          stratTime: stratTime,
          endTime: endTime
        })
      } else {
        that.setData({
          currentWeek: that.data.week[week + 6],
          stratTime: stratTime,
          endTime: endTime
        })
      }
    }
  },
  bindchangTime: function (e) {
    const value = e.detail.value
    this.setData({
      currentWeek: this.data.week[value]
    })
  },
  bindchangeStrat: function (e) {
    const value = e.detail.value
    this.setData({
      stratTime: value
    })
  },
  bindchangeEnd: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  yogoCount: function (e) {
    this.setData({
      current_yogoCount: e.detail.value
    })
  },
  course: function (e) {
    this.setData({
      courseName1: this.data.courseName[e.detail.value]
    })
  },
  yogoTeacher: function (e) {
    if (e.detail.value)
      this.setData({
        yogoTeacher: e.detail.value,
        flag1: 1
      })
    else {
      this.setData({
        flag1: 0
      })
    }
  },
  yogoNandu: function (e) {
    const value = e.detail.value
    this.setData({
      currentNandu: this.data.yogoNandu[value]
    })
  },
  yogoType: function (e) {
    if (e.detail.value)
      this.setData({
        yogoType1: e.detail.value,
        flag: 1
      })
    else {
      this.setData({
        flag: 0
      })
    }
  },

  must: function () {
    const db = wx.cloud.database()
    if (this.data.flag == 0 || this.data.flag1 == 0) {
      wx.showModal({
        title: '提示',
        content: '瑜伽类型/课程老师不能为空',
      })
    } else {
      wx.showToast({
        title: '添加成功',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
      this.setData({
        yogoType: '',
        yogoType_value: '',
        flag: 0,
        flag1: 0,
      })
      db.collection("weekCourse").add({
        data: {
          "week": this.data.currentWeek,
          "time1": this.data.stratTime,
          "time2": this.data.endTime,
          "yogoTeacher": this.data.yogoTeacher,
          "yogoType": this.data.yogoType1,
          "yuyue": '预约',
          "selected": false,
          count: this.data.current_yogoCount,
          count1: 0,
          "yogoNandu": this.data.currentNandu,
          "yogoName": this.data.courseName1,
        }
      }).then((res) => {
        wx.showToast({
          title: '添加成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
        console.log(res)
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
    var that = this;
    if (that.data.number == 1) {
      this.setData({
        deleteCourse_value: []
      })
      that.getCourse();
    }
    if (that.data.number == 3) {
      that.setData({
        choseCourse: []
      })
      that.choseCourse();
    }
  },
  //scroll-view上拉实现刷新
  bindDownLoad: function () {
    var that = this;
    if (this.data.number == 1) {
      setTimeout(function () {
        wx.showLoading({
          title: '加载中',
        })
        setTimeout(function () {
          wx.hideLoading();
          that.getCourse();
        }, 1000)
      }, 1500)
    } else if (that.data.number == 3 && that.data.completeYuyue != '') {
      setTimeout(function () {
        wx.showLoading({
          title: '加载中',
        })
        setTimeout(function () {
          wx.hideLoading();
          that.choseCourse();
        }, 1000)
      }, 1500)
    }
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
  //查看已经预约了的课程
  completeYuyue: function (e) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    setTimeout(function () {
      wx.hideLoading();
      that.setData({
        completeYuyue: e.currentTarget.dataset.index //获得点击时的周数，即星期几的已预约的课程
      })
      that.choseCourse(); //动态渲染choseCourse的数组值，拿到点击过后的星期日期数
    }, 1500)
  },
  //停止预约
  course_stop: function () {
    const db = wx.cloud.database();
    let course_stop = !this.data.course_stop;
    this.setData({
      course_stop: course_stop
    })
    db.collection('course_stop').doc('XEFrOnkPDdDCJ3fJ').update({
      data: {
        coursestop: course_stop
      },
      success: console.log,
      fail: console.error
    })
  },
  //取消会员预约课程
  cancel: function (e) {
    var that = this;
    const db = wx.cloud.database();
    var courseId = e.currentTarget.dataset.index;
    var week = e.currentTarget.dataset.week;
    var getChose = that.data.choseCourse;
    var courseCount;
    var _id = e.currentTarget.dataset._id;
    var current_openid = e.currentTarget.dataset.openid
    wx.showModal({
      title: '提示',
      content: '是否取消该会员预约课程',
      confirmColor: 'red',
      showCancel: true,
      mask: true,
      success: function (res) {
        // if(res.confirm){
        //   
        // }
        if (res.confirm) {
          db.collection("register").where({
            _openid: current_openid
          }).get({
            success(res) {
              that.setData({
                jifen: res.data[0].jifen_value
              })
              wx.cloud.callFunction({
                name: 'user_jifen',
                data: {
                  b: 2,
                  current_openid: current_openid,
                  jifen: that.data.jifen - 15,
                },
                success(res) {
                  console.log("jifen:" + that.data.jifen + " current_openid:" + current_openid)
                  console.log(res);
                }
              })
            },
          })

          db.collection("weekCourse").where({
            _id: courseId
          }).get({
            success(res) {
              courseCount = res.data[0].count1;
              wx.cloud.callFunction({
                name: 'delete_member',
                data: {
                  _id: courseId,
                  a: 6,
                  count: courseCount - 1,
                },
                success(res) {
                  console.log("courseCount:" + (courseCount - 1));
                  console.log(res);
                  wx.cloud.callFunction({
                    name: 'deleteYuyue',
                    data: {
                      current_openid: current_openid,
                      courseId: courseId
                    },
                    success(res) {
                      console.log(current_openid + "courseId " + courseId)
                      //console.log(courseId)
                      console.log(res);
                      // that.choseCourse();
                      //循环
                      for (var i = 0; i < getChose.length; i++) {
                        if (_id == getChose[i]._id) {
                          getChose.splice(i--, 1);
                          wx.showToast({
                            title: '取消成功',
                            icon: "success",
                            mask: true
                          })
                          break;
                        }
                      }
                      that.setData({
                        choseCourse: getChose
                      })
                    }
                  })
                },
                fail(res) {
                  console.log(res)
                }
              })
            }
          })

        }
      }
    })
  }
})