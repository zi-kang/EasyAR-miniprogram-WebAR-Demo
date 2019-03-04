// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 360
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        this.setData({ height: res.windowHeight });
      }
    });
  },
  goShow: function(ev) {
    wx.navigateTo({
      url: '../show/show'
    });
  },
  goRecognition: function(ev) {
    wx.navigateTo({
      url: '../recognition/recognition'
    });
  }
})