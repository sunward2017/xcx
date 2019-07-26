var t = getApp();

Component({
    properties: {},
    data: {
        fixBottom: "-130px",
        paddingBottom: t.globalData.iPhoneX ? "25px" : "0"
    },
    attached: function() {
        var t = this;
        setTimeout(function() {
            t.setData({
                fixBottom: "0"
            });
        }, 0);
    },
    methods: {
        close: function() {
            this.triggerEvent("close");
        },
        shareAll: function() {
            var t = this, e = wx.createCanvasContext("shareCanvas", this);
            e.drawImage("../../source/images/sharead.png", 0, 0, 375, 667), e.draw(!0, function() {
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: 375,
                    height: 667,
                    canvasId: "shareCanvas",
                    success: function(t) {
                        wx.previewImage({
                            current: t.tempFilePath,
                            urls: [ t.tempFilePath ]
                        });
                    }
                }, t);
            });
        },
        collection: function() {
            this.triggerEvent("showcollection");
        }
    }
});