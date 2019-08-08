// pages/recognition/recognition.js
Page({
  data: {
    height: '360',
    status: false,
    scanStatus: 'none',
    msg: "请点击识别图片",
    canvasWidth: '10',
    canvasHeight: '10',
    isRequest: false
  },

  onLoad: function (options) {
    this.ctx = wx.createCameraContext();

    wx.getSystemInfo({
      success: res => {
        this.setData({ height: res.windowHeight * 0.8 });
      }
    });
  },

  stopScan: function () {
    this.setData({ scanStatus: 'none' });
  },

  onShow: function () {
    this.setData({ msg: '请点击识别图片' });
  },

  error: function (e) {
    this.setData({ msg: '打开摄像头失败，请点击“立即体验' });
  },

  searchPhoto: function (filePath) {
    wx.uploadFile({
      url: '您的请求接口',
      filePath,
      name: 'image',
      success: res => {
        this.status = false;
        let msg = JSON.parse(res.data);
        that.setData({isRequest: false});
        if (msg.statusCode == 0) {
          this.setData({ msg: '识别成功' });
          setTimeout(() => {
            console.info('go to webar');
            wx.navigateTo({
              url: '../show/show'
            });
          }, 500);
        }
      },
      fail: err => {
        this.status = false;
        this.setData({ msg: JSON.stringify(err), isRequest: false });
      }
    });
  },

  transformArrayBufferToFilePath: function(frame){
    var that = this;
    const data = new Uint8ClampedArray(frame.data);
    this.setData({canvasWidth: frame.width, canvasHeight: frame.height, isRequest: true});
    wx.canvasPutImageData({
      canvasId: 'firstCanvas',
      x: 0,
      y: 0,
      width: frame.width,
      height: frame.height,
      data: data,
      success(res) {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: frame.width,
          height: frame.height,
          canvasId: 'firstCanvas',
          success(res) {
            that.searchPhoto(res.tempFilePath)
          }
        })
      },
      fail(err) {
        that.setData({isRequest: false});
      }
    });
  },

  takePhoto: function (e) {
    if (this.status) return;

    this.status = true;

    const context = wx.createCameraContext()

    this.listener = context.onCameraFrame((frame) => {
      if(!this.data.isRequest) {
        this.transformArrayBufferToFilePath(frame);
      }
    })
    this.listener.start({
      success: res => {
        this.setData({ msg: '识别中...' });
      },
      fail: err => {
        this.setData({ msg: err});
      }
    })
  }
})
