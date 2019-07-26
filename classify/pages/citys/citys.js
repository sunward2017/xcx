// pages/citys/citys.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  change1:function(){
    this.goHome('杭州市')
  },
  change2: function () {
    this.goHome('上海市')
   },
  change3: function () {
    wx.showLoading({
      title: '正在定位...',
    })
     this.impower();  
  },
  impower: function () {
    let _this = this;
    wx.getSetting({
      success: (res) =>{
        console.log(res);
        if(res.authSetting['scope.userLocation'] === false) {
          _this.openConfirm()
        } else {
          _this.getLocation()
        }
      },

    })
  },
  getLocation:function(){
    let _this= this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        _this.getDistrict(res.latitude, res.longitude)
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '请开启WiFi及位置权限',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  openConfirm:function(){
    let _this = this;
    wx.showModal({
      title: '请求授权当前位置',
      content: '需要获取您的地理位置，请确认授权',
      success: function (res) {
        if (res.cancel) {
          //取消授权
          wx.showToast({
            title: '拒绝授权',
            icon: 'none',
            duration: 1000
          })
        } else if (res.confirm) {
          //确定授权，通过wx.openSetting发起授权请求
          wx.openSetting({
            success: function (res) {
              if (res.authSetting["scope.userLocation"] == true) {
                wx.showToast({
                  title: '授权成功,正在定位...',
                  icon: 'success',
                  duration: 1000
                })
                _this.getLocation() 
              } else {
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        }
      }
    })  
  },
  getDistrict(latitude, longitude) {
    let self = this;
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=DI2BZ-63Q3X-VZP4K-7V3SB-L4FGS-GSBJD`,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var city = res.data.result.address_component.city;
         if(city){
           wx.showModal({
             title: '提示',
             content: '当前定位城市--' + city,
             success(res) {
               self.goHome(city)
             }
           })
         }else{
           wx.showToast({
             title: '城市定位失败，请重试',
             icon:"none",
             duration: 2000
           })
         }
      },
      fail:function(e){
        wx.showToast({
          title:'城市定位失败，请重试',
          icon: 'error',
          duration: 2000
        })
      },
      complete:function(){
        wx.hideLoading();
      },
    })
  },
  goHome(city){
    wx.navigateTo({
      url: "../index/index?city=" +city
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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