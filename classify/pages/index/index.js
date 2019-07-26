//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    iPhoneX: app.globalData.iPhoneX,
    showShare: false,
    showCollection: false,
    showVoice: false,
    time: 0,
    contactX: 20,
    contactY: 375,
    showCamera:true,
    cityType:'hz',
  },
  imgUrl:'',
  onLoad: function (options) {
    let  city = options.city;
    if(city){
      app.globalData.city=city;
      this.setData({ cityType: city === "上海市" ? "sh" : "hz" })
    }
    var t = this;
    wx.getSystemInfo({
      success: function (e) {
        app.globalData.windowWidth = e.windowWidth, app.globalData.windowHeight = e.windowHeight,
          t.setData({
            contactX: e.windowWidth - 70,
            contactY: e.windowHeight - 375
          });
      }
    });
  },
  contactChange:function(){},
  goSearch: function () {
    wx.navigateTo({
      url: "../search/search"
    });
  },
  goList: function (t) {
    wx.navigateTo({
      url: "../list/list?type=" + t
    });
  },
  bind1: function () {
    this.goList(1);
  },
  bind2: function () {
    this.goList(2);
  },
  bind3: function () {
    this.goList(3);
  },
  bind4: function () {
    this.goList(4);
  },
  showShare: function () {
    this.setData({
      showShare: true
    });
  },
  openCollection: function () {
    this.setData({
      showCollection: true
    });
  },
  closeShare: function () {
    this.setData({
      showShare:false
    });
  },
  closeCollection: function () {
    this.setData({
      showCollection: false
    });
  },
  openGame: function () {
    wx.navigateTo({
      url: "../game/game"
    });
  },
  catchCamera: function (res) {
    let _this =this;
    wx.chooseImage({
      sizeType: ["compressed"],
      sourceType: ["camera"],
      success: function (res) {
       let n= wx.getFileSystemManager();
       let a=n.readFileSync(res.tempFilePaths[0], "base64");
       _this.imgUrl = res.tempFilePaths[0];
       _this.sendImg(a);
      }
    })
  },
  uploadImgToServer:function(formData){
    let filePath= this.imgUrl; 
    wx.uploadFile({
      url: 'https://v7.okertrip.com/uploadFile',
      header: {
        "Content-Type": "multipart/form-data"
      },
      filePath:filePath,
      name: 'fileimg',
      formData:{'param':formData},
      success: function (res) {
      }
    })
  },
  goCitys:function(){
    wx.navigateTo({
      url: "../citys/citys"
    });
  },
  sendImg:function(img){
    let _this = this;
    wx.showLoading({
      title: "正在识别..",
      mask: true
    })
    wx.request({
       url:'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general',
       header: { 'Content-Type':'application/x-www-form-urlencoded'},
       method: 'POST',
       data:{
         'access_token':'24.39c84aae876c4bbb1cb2ce24bcf2cd84.2592000.1564832383.282335-16715731',
         'image':img
       },
       success:function(res){
           if (res.data && res.data.result.length > 0) {
           let key = res.data.result[0].keyword; //搜索结果
             let result =app.globalData.source.find(i => (i.name === key));
             if (result) {
               _this.goCard({type:result.cats,name:result.name});
             } else {
               _this.searchFromServer(key);
             }
          }else{
            wx.showToast({
              title: '未识别,请重新拍摄上传',
              icon: 'error',
              duration: 2000
            })
          }
         _this.uploadImgToServer(JSON.stringify(res.data)) //上传图片
        },
        fail:function(res){
          wx.showToast({
            title: '未识别，请重新拍摄上传',
            icon: 'error',
            duration: 2000
          })
        },
        complete:function(e){
          wx.hideLoading();
        }
     })
  },
  searchFromServer:function(key){
    wx.showLoading({
      title: "已识别,正在查询...",
      mask: true
    })
    wx.request({
      url: 'https://v7.okertrip.com/queryGoodsInfo?goodsName=' + key,
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function (res) {
        if (res.statusCode == 200) {
          let result = res.data && res.data.data && res.data.data.find(i => (i.goodsName === key));
          if (result) {
            _this.goCard({
                cats: result.pid + '',
                name: result.goodsName
              })
          } else {
            wx.navigateTo({
              url: "../search/search?item=" + key
            });
          }
        } else {
          wx.showToast({
            title: "未知类型的垃圾,我会继续学习",
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '未知类型的垃圾,我会继续学习',
          icon: 'none',
          duration: 2000
        })
      },
      complete:function(){
        wx.hideLoading();
      }
    }) 
  },
  goCard: function (e) {
    wx.navigateTo({
      url: "../card/card?item=" + JSON.stringify(e)
    });
  },
  goProduct:function(){
    const {cityType} = this.data;
    if(cityType!=="sh"){
      wx.navigateTo({
        url: "../out/out"
      });
    }
  }
})
