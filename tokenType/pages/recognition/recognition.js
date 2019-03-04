// pages/recognition/recognition.js
// import upng from '../../UPNG.js'
Page({
  data: {
    height: '360',
    width: '20',
    status: false,
    scanStatus: 'none',
    msg: "请点击识别图片",
    src: ''
  },

  onLoad: function (options) {
    this.ctx = wx.createCameraContext();

    wx.getSystemInfo({
      success: res => {
        this.setData({ height: res.windowHeight * 0.8, width: res.windowWidth});
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


  urlTobase64(imgPath) {
    let that = this;

    wx.getFileSystemManager().readFile({
      filePath: imgPath, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => { //成功的回调
        // console.log('data:image/png;base64,' + res.data)
        that.searchPhotp(res.data)
      }
    })


    // let canvas = wx.createCanvasContext('firstCanvas')
    // // 1. 绘制图片至canvas
    // canvas.drawImage(imgPath, 0, 0, this.data.width, this.data.height);
    // // 绘制完成后执行回调，API 1.7.0
    // canvas.draw(false, () => {
    //   // 2. 获取图像数据， API 1.9.0
    //   wx.canvasGetImageData({
    //     canvasId: 'firstCanvas',
    //     x: 0,
    //     y: 0,
    //     width: this.data.width,
    //     height: this.data.height,
    //     success(res) {
    //       // console.log(res)
    //       // 3. png编码
    //      let pngData = upng.encode([res.data.buffer], res.width, res.height, 1, 0)
    //       // 4. base64编码
    //      let base64 = wx.arrayBufferToBase64(pngData)
    //       that.searchPhotp(base64)
    //     }
      // })
    // })
  },

  searchPhotp: function(imageBase64) {
    let that = this;
    wx.request({
      url: 'https://cn1-crs.easyar.com:8443/search', 
      data: {
        image: imageBase64
      },
      header: {
        'Authorization': '6f2JkthQHm9rBVhsXxl9DNUPb+6H7eaReuzzza3PdYMC77cRX24kp6Hf6srJMgZwL5Z7KR0AjUKEYlxszht8qA==',
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success(res) {
        if (res.data.statusCode == 0) {
          that.setData({ msg: '识别成功'});
          setTimeout(() => {
            console.info('go to webar');
            wx.navigateTo({
              url: '../show/show'
            });
          }, 500);
        } else {
          that.status = false;
          that.setData({ msg: '识别失败，请点击重试'});
        }
      },

      fail(err) {
        console.log(err)
        that.status = false;
        that.setData({ msg: '识别失败，请点击重试'});
      }
    })
  },

  takePhoto: function (e) {
    if (this.status) return;
    console.log(11111)
    this.status = true;

    this.ctx.takePhoto({
      quality: 'low',
      success: res => {
        this.setData({ msg: '识别中...', src: res.tempImagePath});
        this.urlTobase64(res.tempImagePath);
      },
      fail: err => {
        this.stopScan();
        this.setData({ msg: '未识别到目标' });
      }
    });
  }
})