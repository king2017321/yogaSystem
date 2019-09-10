Page({
  /**
   * 页面的初始数据
   */
  data: {
    calendar: [],
    width: 0,
    flag1:false,
    flag:false,
    currentIndex: 0,
    currentTime: 0,
    currentWeek: '',
    currentMinutes: '',
    currentHours: '',
    currentTrueweek: '',
    Week: [],
    count: '',
    currentTab: 0,
    stratTime: 55,
    // register: [],
    member_openid: [],
    pt_openid: [],
    openid: '',
    choseCourse: [],
    time_stamp: '', //获得当前时间戳
    srcoll_height: '',
    jifen: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //滑动顶部
  clickTab: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  swiperTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  //获得预约课程会员
  choseCourse: function () {
    var that = this;
    const db = wx.cloud.database();
    db.collection("choseCourse").where({
      _openid: that.data.openid
    }).get({
      success(res) {
        that.setData({
          choseCourse: res.data
        })
        console.log(res)
        that.userchose();
        that.pt_openid();
        that.member();
        //that.register();
      },
    })
    // wx.cloud.callFunction({
    //   name: "choseCourse",
    //   data:{
    //     openid:that.data.openid
    //   },
    //   success(res) {
    //     that.setData({
    //       choseCourse: res.result.data,
    //     })
    //     that.userchose();
    //     console.log(res.result.data,+ "411444")
    //   }
    // })
  },
  //获得数据库中全部课程，最大值100条
  getCourse: function () {
    this.getOpenid(); //和下面that.choseCourse();是为了解决在onLoad异步用success回调
    var that = this;
    wx.cloud.callFunction({
      name: 'addData',
      success(res) {
        that.setData({
          Week: res.result.data,
        })
        that.choseCourse();
        console.log(res.result.data);
        return true;
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  //日期排版
  dateTypesetting: function () {
    var that = this;
    this.getCourse();
    function getThisMonthDays(year, month) {
      return new Date(year, month, 0).getDate();
    }
    // 计算每月第一天是星期几
    function getFirstDayOfWeek(year, month) {
      return new Date(Date.UTC(year, month - 1, 1)).getDay();
    }
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const cur_date = date.getDate();
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.setData({
      currentWeek: date.getDay(),
      currentHours: date.getHours(),
      currentMinutes: date.getMinutes(),
      currentTrueweek: date.getDay(),
      currentTime: '星期' + weeks_ch[date.getDay()]
    })
    //利用构造函数创建对象
    function calendar(date, week) {
      this.date = cur_year + '-' + cur_month + '-' + date;
      if (date == cur_date) {
        this.week = "今天";
      } else if (date == cur_date + 1) {
        this.week = "明天";
      } else {
        this.week = '星期' + week;
      }
    }
    //用来判断是否最后几天
    function calendar1(add, week) {
      this.date = add;
      if (date == cur_date) {
        this.week = "今天";
      } else if (date == cur_date + 1) {
        this.week = "明天";
      } else {
        this.week = '星期' + week;
      }
    }
    //当前月份的天数
    var monthLength = getThisMonthDays(cur_year, cur_month)
    //当前月份的第一天是星期几
    var week = getFirstDayOfWeek(cur_year, cur_month)
    var x = week;
    var monthlenth1 = monthLength + 3;
    for (var i = 1; i <= monthLength; i++) {
      //当循环完一周后，初始化再次循环
      if (x > 6) {
        x = 0;
      }
      //利用构造函数创建对象
      that.data.calendar[i] = new calendar(i, [weeks_ch[x]][0])
      x++;
    }
    //显示最后几天
    var month;
    var year;
    var add;
    if (cur_month == 12) {
      month = 1;
      year = cur_year + 1;
      that.data.calendar[i] = new calendar1(year + '-' + month + '-' + i % monthLength, [weeks_ch[x%7]][0])
      that.data.calendar[i + 1] = new calendar1(year + '-' + month + '-' + (i + 1) % monthLength, [weeks_ch[(x + 1)%7]][0])
      that.data.calendar[i + 2] = new calendar1(year + '-' + month + '-' + (i + 2) % monthLength, [weeks_ch[(x + 2)%7]][0])
    } else {
      month = cur_month + 1;
      year = cur_year;
      that.data.calendar[i] = new calendar1(year + '-' + month + '-' + i % monthLength, [weeks_ch[x%7]][0])
      that.data.calendar[i + 1] = new calendar1(year + '-' + month + '-' + (i + 1) % monthLength, [weeks_ch[(x + 1)%7]][0])
      that.data.calendar[i + 2] = new calendar1(year + '-' + month + '-' + (i + 2) % monthLength, [weeks_ch[(x + 2)%7]][0])
    }
    console.log(that.data.calendar[31])
    //限制要渲染的日历数据天数为4天以内（用户体验）
    var flag = that.data.calendar.splice(cur_date, that.data.calendar.length - cur_date <= 4 ? that.data.calendar.length : 4)
    that.setData({
      calendar: flag
    })
    //设置scroll-view的子容器的宽度
    that.setData({
      width: 186 * parseInt(that.data.calendar.length - cur_date <= 7 ? that.data.calendar.length : 7)
    })

  },
  //设置开始时间判断当天课程是否已经超过时间
  stratTime: function () {
    var that = this;
    const date = new Date();
    const week = date.getDay();
    var stratTime = 0;
    var stratHours = 0;
    var years = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (date.getHours() < 10) {
      stratHours = '0' + date.getHours();
    } else {
      stratHours = date.getHours();
    }
    if (date.getMinutes() < 10) {
      stratTime = stratHours + ':' + '0' + date.getMinutes();
    } else {
      stratTime = stratHours + ':' + date.getMinutes();
    }
    that.setData({
      stratTime: stratTime,
      time_stamp: years + '/' + month + '/' + day + ' ' + stratTime
    })
  },
  scrollheight() {
    let windowHeight = wx.getSystemInfoSync().windowHeight; // 屏幕的高度  
    let windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕的宽度    
    this.setData({
      srcoll_height: windowHeight * 750 / windowWidth - 208
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '瑜伽约课' //修改title
    })
    this.dateTypesetting();
    this.stratTime();
    this.scrollheight();
    // const openid = this.data.openid;
    // var member = this.data.member;
    // var db = wx.cloud.database();
    // this.setData({
    //   aaaa: member
    // })
    // console.log("44");
    // for (var j = 0; j < member.length; j++) {
    //   console.log("524554");
    //   if (member[j]['_openid'] == openid) {
    //     console.log("452456");
    //     db.collection("choseCourse").doc("XCyuDJT75u228Qaa").remove({
    //       success(res) {
    //         console.log('删除成功' + res);
    //       }
    //     })
    //   }
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //wx.showNavigationBarLoading()//在标题栏中显示加载
    this.getCourse();
    this.stratTime(); //下拉更新时间
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  // addClass: function() {
  //   wx.navigateTo({
  //     url: '../addClass/addClass',
  //   })
  // },

  //获得注册用户
  // register: function () {
  //   var that = this;
  //   var db = wx.cloud.database();
  //   db.collection("register").orderBy('telephone', 'asc').get({
  //     success(res) {
  //       that.setData({
  //         register: res.data
  //       })

  //     },
  //     fail(res) {
  //       console.log(res)
  //     },
  //   })
  // },
  pt_openid: function () {
    var that = this;
    var db = wx.cloud.database();
    db.collection("person_train").where({
      openid: that.data.openid
    }).get({
      success(res) {
        that.setData({
          pt_openid: res.data,
          flag:true,
        })
      },
      fail(res) {
        console.log(res)
      },
    })
  },
  //获得会员openid
  member: function () {
    var that = this;
    var db = wx.cloud.database();
    db.collection("member").where({
      openid: that.data.openid
    }).get({
      success(res) {
        that.setData({
          member_openid: res.data,
          flag1:true
        })
      },
      fail(res) {
        console.log(res)
      },
    })
  },
  //获得openid
  getOpenid: function () {
    var that = this;
    const db = wx.cloud.database();
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('callFunction test result: ', res)
      },
      success(res) {
        that.setData({
          openid: res.result.openid
        })
        //获得当前积分
        // db.collection("register").where({
        //   _openid: that.data.openid
        // }).get({
        //   success(res) {
        //     that.setData({
        //       jifen: res.data[0].jifen_value
        //     })
        //   },
        // })
      }
    })
  },
  //判断用户是否注册小程序
  register_yn() {
    var that = this;
    var openid = that.data.openid;
    const db = wx.cloud.database();
    db.collection("register").where({
      _openid: openid
    }).get({
      success(res) {
        console.log(res.data)
        if (res.data.length == 0) {
          return false
        } else {
          return true
        }
      },
    })
  },

  //逻辑严谨，应该需要判断register里面的值，如果不是会员即不能预约课程
  button1: function (e) {
    var that = this;
    var week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var week1 = new Date().getDay();
    console.log(week1);
    var openid = that.data.openid;
    const db = wx.cloud.database();
    var currId = e.currentTarget.dataset.index;
    var Week = this.data.Week;
    var member_openid = that.data.member_openid;
    var course_stop = false;
    var pt_openid = that.data.pt_openid;
    var jifen;
    wx.showLoading({
      title: '加载中',
      mask:true,
    })
    setTimeout(function () {
      wx.hideLoading();
    }, 1500)
    db.collection("register").where({
      _openid: openid
    }).get({
      success(res) {
        jifen = res.data[0].jifen_value;
        if (res.data.length != 0) {
          db.collection('course_stop').doc('XEFrOnkPDdDCJ3fJ').get({
            success(res) {
              course_stop = res.data.coursestop
              if (course_stop) {
                wx.showToast({
                  title: '停课中',
                  icon: 'none',
                  mask: true
                })
              } else {
                if (pt_openid.length != 0) {
                  for (var i = 0; i < Week.length; i++) {
                    if (Week[i]['_id'] == currId) {
                      if (week[week1] == Week[i]['week'] || week[(week1 + 1) % 7] == Week[i]['week']) { //规定是能当天和第二天能够预约
                        if (Week[i]['yuyue'] == '已预约') {
                          //预约过后不能取消预约课程，只有管理员才能取消
                          wx.showToast({
                            title: '请联系管理员取消',
                            icon: "none",
                            mask: true,
                          })
                        } else if (Week[i]['yuyue'] == '预约') {
                          db.collection("weekCourse").where({
                            _id: Week[i]._id
                          }).get({
                            success(res) {
                              if (res.data[0].count-res.data[0].count1 > 0) {
                                Week[i]['yuyue'] = '已预约';
                                console.log(Week[i]['yuyue'])
                                Week[i]['count1'] = that.data.Week[i]['count1'] -0+1;
                                wx.cloud.callFunction({
                                  name: 'delete_member',
                                  data: {
                                    _id: Week[i]['_id'],
                                    a: 5,
                                    count1: Week[i]['count1']
                                  },
                                  success() {
                                    wx.cloud.callFunction({
                                      name: 'user_jifen',
                                      data: {
                                        b: 1,
                                        openid: that.data.openid,
                                        jifen:jifen -0+10,
                                      },
                                    })
                                    db.collection("choseCourse").add({
                                      data: {
                                        "name": pt_openid[0].name,
                                        "telephone": pt_openid[0].telephone,
                                        "courseId": Week[i]['_id'],
                                        "time1": Week[i]['time1'],
                                        "time2": Week[i]["time2"],
                                        "week": Week[i]['week'],
                                        "yogoName": Week[i]['yogoName'],
                                        "time_stamp": that.data.time_stamp,
                                        "count1": Week[i]['count1'],
                                        "yogoNandu": Week[i]['yogoNandu'],
                                        "yogoTeacher": Week[i]['yogoTeacher'],
                                        "yogoType": Week[i]['yogoType'],
                                      },
                                    }),
                                      wx.showToast({
                                        title: '预约成功',
                                        icon: "success",
                                        mask: true,
                                      })
                                  },
                                  fail(res) {
                                    wx.showModal({
                                      title: '提示',
                                      content: '服务器繁忙,稍后再试',
                                      showCancel: false,
                                      mask: true,
                                    })
                                  }
                                })
                                that.setData({
                                  Week: Week,
                                })
                              } else {
                                wx.showModal({
                                  title: '错误',
                                  content: '预约失败刷新后重试',
                                  showCancel: false,
                                  mask: true,
                                })
                              }
                            }
                          })

                        }

                        break;
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '暂不能预约',
                          showCancel: false,
                          mask:true,
                        })
                      }
                    }
                  }
                } else if (member_openid.length != 0) {
                  for (var i = 0; i < Week.length; i++) {
                    if (Week[i]['_id'] == currId) {
                      if (week[week1] == Week[i]['week'] || week[(week1 + 1) % 7] == Week[i]['week']) { //规定是能当天和第二天能够预约
                        if (Week[i]['yogoName'] == '团课') {
                          if (Week[i]['yuyue'] == '已预约') {
                            //预约过后不能取消预约课程，只有管理员才能取消
                            wx.showToast({
                              title: '请联系管理员取消',
                              icon: "none",
                              mask: true,
                            })
                          } else if (Week[i]['yuyue'] == '预约') {
                            db.collection("weekCourse").where({
                              _id: Week[i]._id
                            }).get({
                              success(res) {
                                if (res.data[0].count - res.data[0].count1 > 0) {
                                  Week[i]['yuyue'] = '已预约';
                                  console.log(Week[i]['yuyue'])
                                  Week[i]['count1'] = that.data.Week[i]['count1']-0 + 1;
                                  wx.cloud.callFunction({
                                    name: 'delete_member',
                                    data: {
                                      _id: Week[i]['_id'],
                                      a: 5,
                                      count1: Week[i]['count1']
                                    },
                                    success() {
                                      wx.cloud.callFunction({
                                        name: 'user_jifen',
                                        data: {
                                          b: 1,
                                          openid: that.data.openid,
                                          jifen:jifen -0+10,
                                        },
                                      })
                                      db.collection("choseCourse").add({
                                        data: {
                                          "name": member_openid[0].name,
                                          "telephone": member_openid[0].telephone,
                                          "courseId": Week[i]['_id'],
                                          "time1": Week[i]['time1'],
                                          "time2": Week[i]["time2"],
                                          "week": Week[i]['week'],
                                          "yogoName": Week[i]['yogoName'],
                                          "time_stamp": that.data.time_stamp,
                                          "count1": Week[i]['count1'],
                                          "yogoNandu": Week[i]['yogoNandu'],
                                          "yogoTeacher": Week[i]['yogoTeacher'],
                                          "yogoType": Week[i]['yogoType'],
                                        },
                                      }),
                                        wx.showToast({
                                          title: '预约成功',
                                          icon: "success",
                                          mask: true,
                                        })
                                    }
                                  })
                                  that.setData({
                                    Week: Week,
                                  })
                                } else {
                                  wx.showModal({
                                    title: '错误',
                                    content: '预约失败刷新后重试',
                                    showCancel: false,
                                    mask: true,
                                  })
                                }
                              }
                            })  
                          }
                        } else {
                          wx.showToast({
                            title: '没有权限',
                            icon: 'none',
                            mask: true
                          })
                        }

                        break;
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '暂不能预约',
                          showCancel: false,
                          mask: true,
                        })
                      }
                    }
                  }
                } else {
                  wx.showToast({
                    title: '没有权限',
                    icon: 'none',
                    mask: true
                  })
                }
              }
            },
          })
        } else {
          wx.showLoading({
            title: '请先注册',
          })
          setTimeout(function () {
            wx.hideLoading();
            wx.navigateTo({
              url: '../../pages/login/login',
            })
          }, 2000)

        }
      }
    })

  },
  //用户加载时显示已选课程,将choseCourse中的选课信息与week中匹配，修改week里面的值
  userchose: function () {
    var that = this;
    var week = that.data.Week;
    const db = wx.cloud.database();
    var openid = that.data.openid;
    var choseCourse = that.data.choseCourse;
    for (var i = 0; i < week.length; i++) {
      for (var j = 0; j < choseCourse.length; j++) {
        if (that.data.openid == choseCourse[j]['_openid']) {
          if (week[i]['_id'] == choseCourse[j]['courseId']) {
            week[i]['yuyue'] = '已预约'
          }
        }
      }
    }
    that.setData({
      Week: week
    })
  },
  select: function (event) {
    const date1 = new Date();
    this.setData({
      currentIndex: event.currentTarget.dataset.index,
      currentWeek: (date1.getDay() + event.currentTarget.dataset.index) % 7,
      currentTab: 0,
    })
    console.log(event.currentTarget.dataset.date)
  },

  selectTime: function (event) {
    //为下半部分的点击事件
    this.setData({
      // currentTime: event.currentTarget.dataset.tindex
    })
    console.log(event.currentTarget.dataset.time)
  }
})