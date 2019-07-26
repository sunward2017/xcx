//app.js
import c from "./utils/Const"
import data from './source/local';

App({
  onLaunch: function () { 
    this.forceUpdate();
  },
  globalData: {
    iPhoneX: false,
    source: [].concat(data[1], data[2], data[3], data[4]),
    windowWidth: 0,
    windowHeight: 0,
    city:'杭州市'
  },
  onShow:function(){
    wx.removeStorageSync(c.LOCALSTORE_DATA_NEW);
  },
  forceUpdate: function () {
    if (wx.getUpdateManager) {
      var e = wx.getUpdateManager();
      e.onCheckForUpdate(function (e) {
        console.log("is need update ", e.hasUpdate);
      }), e.onUpdateReady(function () {
        wx.showModal({
          title: "更新提示",
          content: "新版本已经准备好，是否重启应用？",
          success: function (t) {
            if(t.confirm){
              e.applyUpdate()
            };
          }
        });
      }), e.onUpdateFailed(function () {
        wx.showModal({
          title: "更新提示",
          content: "新版本下载失败",
          showCancel: !1
        });
      });
    }
  }
})