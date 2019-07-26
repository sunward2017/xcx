// pages/search/search.js
import data from '../../source/local.js';
import r from "../../utils/Const";
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchVal: "",
    searchResults: [],
    selectedItem: "",
    isSearching: false,
    hotList: [],
    localHistoryList: [],
    showVoice: false,
    time: 0,
    showCamera: true,
    list:app.globalData.source,
    cityType:"getHzType",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.city&&app.globalData.city!=='杭州市'){
      this.setData({cityType:'getShType'});
    }
    if(options.item){
      this.setData({searchVal:options.item},function(){
        this.searchValue(options.item)
      })
    }
  },
  bindSearchVal: function (t) {
    var e = t.detail?t.detail.value:t;
    e ? (this.setData({
      searchVal: e
    }), this.searchValue(e)) : this.setData({
      searchResults: [],
      searchVal: e
    });
  },
  searchValue: function (t) {
    var e = this;
    var list = this.data.list
    if (t) {
      var a = list.filter(function (item) {
        return item.name.includes(t);
      });
      a.length ? (a.sort(function (e, a) {
        return a.name === t ? 1 : -1;
      }), this.setData({
        searchResults: a
      }, function () {
        list.filter(function (e) {
          return e.name === t;
        }).length&&e.searchFromServer(t)
      })) : this.setData({
        searchResults: a
      },function(){this.searchFromServer(t)});
    }
  },
  searchFromServer:function(t){
     let _this =this;
     wx.request({
       url: 'https://v7.okertrip.com/queryGoodsInfo?goodsName='+t,
       header: { 'Content-Type': 'application/x-www-form-urlencoded' },
       method: 'POST',
       success: function (res) {
         if(res.statusCode==200){
            let result = res.data.data?res.data.data.map(i=>({name:i.goodsName,cats:i.pid+''})):[];
          _this.setData({searchResults:result})
         }else{
           wx.showToast({
             title: '请稍后再试或通知客服',
             icon: 'error',
             duration: 2000
           })

         }
       },
       error:function(){
         wx.showToast({
           title: '请稍后再试或通知客服',
           icon: 'error',
           duration: 2000
         })

       }
     }) 
  },
  manualSearch: function () {
    var t = this.data.searchResults;
    if (t.length) {
      var e = {
        type: t[0].cats,
        name: t[0].name
      };
      this.goCard(e);
    }
  },
  getLocalHistoryList: function () {
    var t = [];
    try {
      var e = wx.getStorageSync(r.SEARCH_HISTORY_CACHE_NEW);
      t = JSON.parse(e) || [];
    } catch (e) {
      t = [];
    }
    this.setData({
      localHistoryList: t
    });
  },
  bindHotType:function(e){
    const value= e.currentTarget.dataset.name;
    this.bindSearchVal(value)
  },
  bindCellType: function (t) {
    var e = {
      type: t.currentTarget.dataset.cats,
      name: t.currentTarget.dataset.name
    };
    this.goCard(e);
  },
  bindClearSearch:function(){
    this.setData({searchVal:''})
  },
  goCard: function (e) {
    this.recordLocal({
      cats: e.type,
      name: e.name
    }), wx.navigateTo({
      url: "../card/card?item=" + JSON.stringify(e)
    });
  },
  recordLocal: function(t) {
        var e = this.data.localHistoryList, a = e.findIndex(function(e) {
            return e.name === t.name;
        });
        a > -1 && e.splice(a, 1), e.length >= 10 && e.pop(), e.unshift(t), wx.setStorageSync(r.SEARCH_HISTORY_CACHE_NEW, JSON.stringify(e));
    },
  clearLocalHistory: function () {
    this.setData({
      localHistoryList: []
    }), wx.removeStorageSync(r.SEARCH_HISTORY_CACHE_NEW);
  },
  catchCamera: function (res) {
    let _this = this;
    wx.chooseImage({
      sizeType: ["compressed"],
      sourceType: ["camera"],
      success: function (res) {
        let n = wx.getFileSystemManager();
        let a = n.readFileSync(res.tempFilePaths[0], "base64");
        _this.sendImg(a);
      }
    })
  },
  sendImg: function (img) {
    let _this = this;
    wx.showLoading({
      title: "正在识别..",
      mask: true
    })
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      data: {
        'access_token': '24.39c84aae876c4bbb1cb2ce24bcf2cd84.2592000.1564832383.282335-16715731',
        'image': img
      },
      success: function (res) {
        wx.hideLoading();
        if(res.data&&res.data.result.length>0){
          _this.bindSearchVal(res.data.result[0].keyword)
        }else{
          wx.showToast({
            title: '未识别,请重新拍摄上传',
            icon: 'error',
            duration: 2000
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '未识别,请重新拍摄上传',
          icon: 'error',
          duration: 2000
        })
      },
      complete:function(){
        wx.hideLoading();
      }
    })
  },
  getHotList:function(){
    let _this = this;
    wx.request({
      url: 'https://v7.okertrip.com/queryGoodsSortInfo',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function (res) {
        let data = res.data
        if(data.data){
          _this.setData({ hotList: data.data.slice(0, 10).map(i => ({ name: i.goodsName, cats: i.pid + '' }))})
        }else{
          _this.setData({hotlist:[]})
        }
      }
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
     this.getHotList(),this.getLocalHistoryList();
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