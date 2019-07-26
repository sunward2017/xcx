var e = require("../../utils/Const");
var app = getApp();

Page({
  data: {
    title: "",
    enTitle: "",
    ask: "",
    askList: [],
    img: "",
    bgColor: "",
    showShare: !1,
    showCollection: !1
  },
  onLoad: function (e) {
    var t = JSON.parse(e.item), a = "", i = "", n = "", s = [], o = "../../source/images/icon/", r = "",profix="";
    let city = (app.globalData.city && app.globalData.city !== "杭州市") ? 1 : 2;
    switch (t.type) {
      case "1":
        profix = city === 1 ? "湿" : "易腐";
        a = profix+"垃圾", i = "HOUSEHOLD FOOD WASTE", n = profix+"垃圾投放要求:", s = ["液体的食物垃圾如牛奶等，应直接倒入下水口", "有包装的湿垃圾应与包装分开投放对应的垃圾容器内"],
          o += "icon-1.png", r = city === 1 ? "#523E3E" : "#009b4c";
        break;

      case "2":
        profix = city === 1 ? "干" : "其他";
        a =profix+"垃圾", i = "RESIDUAL WASTE", n = profix+"垃圾投放要求:", s = ["尽量沥干水分，垃圾袋到干净后投入干垃圾", "难以辨别的垃圾应投入"+profix+"垃圾内"],
          o += "icon-2.png", r = city === 1 ? "#2D2E28" : "#ECAE37";
        break;

      case "3":
        a = "可回收物", i = "RECYCLABLE WASTE", n = "可回收物投放要求:", s = ["轻投轻放，废纸尽量平整，洁净干燥，避免污染", "立体包装物请清空内容物，清洁压扁后投放", "有尖锐边角的，应包裹后投放"],
          o += "icon-3.png", r = city === 1 ? "#3A4572" : "#127ab3";
        break;

      case "4":
        a = "有害垃圾", i = "HAZARDOUS WASTE", n = "有害垃圾投放要求:", s = ["投放时请注意轻放", "易破损的请连带包装或包裹后轻放", "如易挥发，请密封后投放"],
          o += "icon-4.png", r = "#D12F28";
        break;

      case "5":
        a = "装修垃圾", i = "", n = "请询问物业如何投放", s = [], o = "", r = "#104883";
        break;

      default:
        a = "非生活垃圾", i = "", n = "", s = [], o = "", r = "#104883";
    }
    this.setData({
      item: t,
      title: a,
      enTitle: i,
      ask: n,
      askList: s,
      img: o,
      bgColor: r
    }), this.draw();
  },
  onReady: function () { },
  onShow: function () {
    var t = !wx.getStorageSync(e.CAN_SHOW_CARD_COLLECTION_TIP);
    this.setData({
      showCollection: t
    });
  },
  draw: function () {
    var e = wx.createCanvasContext("shareCanvas", this);
    e.beginPath(), e.rect(0, 0, 300, 410), e.setStrokeStyle(this.data.bgColor), e.setFillStyle(this.data.bgColor),
      e.fill(), e.setTextAlign("center"), e.setFillStyle("#ffffff"), e.setFontSize(32),
      e.fillText(this.data.item.name, 140, 40), e.stroke(), e.setFontSize(18), e.fillText("属于", 140, 80),
      e.stroke(), e.drawImage(this.data.img, 80, 110, 120, 120), e.fillText("长按图片分享吧", 140, 260),
      e.stroke(), e.drawImage("../../source/images/share.png", 100, 280, 80, 80), e.setFontSize(16),
      e.fillText("垃圾分类向导", 140, 390), e.stroke(), e.draw();
  },
  share: function () {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 280,
      height: 410,
      canvasId: "shareCanvas",
      success: function (e) {
        wx.previewImage({
          current: e.tempFilePath,
          urls: [e.tempFilePath]
        });
      }
    }, this);
  },
  backHome: function () {
    var e = getCurrentPages(), t = e.findIndex(function (e) {
      return "pages/index/index" === e.__route__;
    });
    -1 === t ? wx.navigateTo({
      url: "../index/index"
    }) : wx.navigateBack({
      delta: e.length - 1 - t
    });
  },
  toggleCollection: function () {
    this.setData({
      showCollection: !1
    }), wx.setStorageSync(e.CAN_SHOW_CARD_COLLECTION_TIP, "1");
  }
});