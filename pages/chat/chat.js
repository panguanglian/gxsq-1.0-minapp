// pages/chat/chat.js
let disp = require("../../utils/broadcast");
var WebIM = require("../../utils/WebIM")["default"];
let isfirstTime = true

Page({

  data: {
    
  },

  onLoad: function (options) {
    getApp().conn.open({
      apiUrl: WebIM.config.apiURL,
      user: 'test1',
      pwd: '123456',
      grant_type: this.data.grant_type,
      appKey: WebIM.config.appkey
    });
    //监听未读消息数
    disp.on("em.xmpp.unreadspot", function (message) {
      console.log('%c 未读消息', 'color: red')
      console.log(message)
      me.setData({
        arr: me.getChatList(),
        unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum,
      });
    });
  },


  onReady: function () {
    
  },

  onShow: function () {
    
  },


  onHide: function () {
    
  },

  onUnload: function () {
    
  },


  onPullDownRefresh: function () {
    
  },


  onReachBottom: function () {
    
  },

  onShareAppMessage: function () {
    
  }
})