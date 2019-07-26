// pages/list/list.js
import data from '../../source/local.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cats: 1,
    list: [],
    title: "",
    sub: "",
    ask: "",
    askList: [],
    img: "",
    bgColor: "",
    selectedItem: "",
    loadingTip: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    var r = "", n = "", i = "", a = [], s = "../../source/images/icon/", u = "",profix="";
    let city=(app.globalData.city&&app.globalData.city!=="杭州市")?1:2;
    switch (type) {
      case "1":
        profix = city ===1?"湿":"易腐";
        r =profix+"垃圾是指:", n = "易腐垃圾，食材废料，剩菜剩饭，过期食品，瓜皮果壳，绿植，中药等生活废弃物", i = profix+"垃圾投放要求", a = ["液体的食物垃圾如牛奶等，应直接倒入下水口", "有包装的湿垃圾应与包装分开投放对应的垃圾容器内"],
          s += "icon-1.png", u = city === 1 ? "#523E3E":"#009b4c";
        break;

      case "2":
        profix = city === 1 ? "干" : "其他";
        r =profix+ "垃圾是指:",
        n = profix+"垃圾是指除有害垃圾、湿垃圾、可回收垃圾以外的其他生活废弃物", i = profix+"垃圾投放要求", a = ["尽量沥干水分", "难以辨别的垃圾应投入"+profix+"垃圾内"],
          s += "icon-2.png", u =city===1? "#2D2E28":"#ECAE37";
        break;

      case "3":
        r = "可回收物是指:", n = "废纸张、废塑料、废金属、废玻璃、废织物等适宜回收，可循环利用的废弃物", i = "可回收物投放要求", a = ["轻投轻放", "洁净干燥，避免污染", "废纸尽量平整", "立体包装物请清空内容物，清洁压扁后投放", "有尖锐边角的，应包裹后投放"],
          s += "icon-3.png", u = city===1? "#3A4572":"#127ab3";
        break;

      case "4":
        r = "有害垃圾是指:", n = "对人体健康或者自然环境造成直接或潜在危害的废弃物", i = "有害垃圾投放要求", a = ["投放时请注意轻放", "易破损的请连带包装或包裹后轻放", "如易挥发，请密封后投放"],
          s += "icon-4.png", u ="#D12F28";
    }
    this.setData({
      cats: type,
      title: r,
      sub: n,
      ask: i,
      askList: a,
      img: s,
      bgColor: u,
      list:data[type],
    });

  },
  bindCellType: function (e) {
    var t = e.currentTarget.dataset.cats, r = e.currentTarget.dataset.name, n = JSON.stringify({
      type: t,
      name: r
    });
    wx.navigateTo({
      url: "../card/card?item=" + n
    });
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