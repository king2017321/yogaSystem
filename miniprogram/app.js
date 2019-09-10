//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
          wx.cloud.init({
            env: "fist-55b4f9",
            // database: "scond - 067da5",
            // storage:"scond-067da5",
            // functions:"scond-067da5"
          })
    }
    this.globalData = {}
  },
})
