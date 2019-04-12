require("sdk/libs/strophe");
let WebIM = require("utils/WebIM")["default"];
let msgStorage = require("comps/chat/msgstorage");
let msgType = require("comps/chat/msgtype");
let ToastPannel = require("./comps/toast/toast");
let disp = require("utils/broadcast");

// 请求api
let req = require('./utils/api')

function ack(receiveMsg) {
  // 处理未读消息回执
  var bodyId = receiveMsg.id;         // 需要发送已读回执的消息id
  var ackMsg = new WebIM.message("read", WebIM.conn.getUniqueId());
  ackMsg.set({
    id: bodyId,
    to: receiveMsg.from
  });
  WebIM.conn.send(ackMsg.body);
}

function onMessageError(err) {
  if (err.type === "error") {
    wx.showToast({
      title: err.errorText
    });
    return false;
  }
  return true;
}

function getCurrentRoute() {
  let pages = getCurrentPages();
  let currentPage = pages[pages.length - 1];
  return currentPage.route;
}

function calcUnReadSpot(message) {
  let myName = wx.getStorageSync("myUsername");
  let members = wx.getStorageSync("member") || []; //好友
  var listGroups = wx.getStorageSync('listGroup') || []; //群组
  let allMembers = members.concat(listGroups)
  let count = allMembers.reduce(function (result, curMember, idx) {
    let chatMsgs;
    if (curMember.roomId) {
      chatMsgs = wx.getStorageSync(curMember.roomId + myName.toLowerCase()) || [];
    } else {
      chatMsgs = wx.getStorageSync(curMember.name.toLowerCase() + myName.toLowerCase()) || [];
    }

    return result + chatMsgs.length;
  }, 0);
  getApp().globalData.unReadMessageNum = count;
  disp.fire("em.xmpp.unreadspot", message);
}



//app.js
App({
  req,
  ToastPannel,
  globalData: {
    unReadMessageNum: 0,
    userInfo: null,
    saveFriendList: [],
    saveGroupInvitedList: [],
    isIPX: false //是否为iphone X
  },

  conn: {
    closed: false,
    curOpenOpt: {},
    open(opt) {
      // wx.showLoading({
      //   title: '正在初始化客户端...',
      //   mask: true
      // })
      this.curOpenOpt = opt;
      WebIM.conn.open(opt);
      this.closed = false;
    },
    reopen() {
      if (this.closed) {
        //this.open(this.curOpenOpt);
        WebIM.conn.open(this.curOpenOpt);
        this.closed = false;
      }
    }
  },
  onLaunch: function () {
    // 展示本地存储能力
    var me = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 
    disp.on("em.main.ready", function () {
      calcUnReadSpot();
    });
    disp.on("em.chatroom.leave", function () {
      calcUnReadSpot();
    });
    disp.on("em.chat.session.remove", function () {
      calcUnReadSpot();
    });
    disp.on('em.chat.audio.fileLoaded', function () {
      calcUnReadSpot()
    });

    WebIM.conn.listen({
      onOpened(message) {   // 建立连接
        console.log('%c [opened] 成功连接 ', 'color: green')
        console.log(message)
        // 登陆状态
        WebIM.conn.setPresence()
        // 获取好友列表
        WebIM.conn.getRoster({
          success(lists) {
            console.log('%c *** 好友列表 ***', 'color: blue')
            console.log(lists)
          }
        })
      },
      onClosed(message) {  // 连接关闭
        console.log('%c [close] 连接关闭 ', 'color: red')
        console.log(message)
        me.conn.closed = true;
      },

      onTextMessage(message) {  // 接收文本消息
        console.log('%c *** 接收到的文本Text消息 ***', 'color: green')
        console.log(message)

        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.TEXT);
          }
          calcUnReadSpot(message);
          ack(message);
        }
      },
      onEmojiMessage(message) {  // 接收表情
        console.log('%c [emoji] 表情', 'color: yellow')
        console.log(message)

        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.TEXT);
          }
          calcUnReadSpot(message);
          ack(message);
        }
      },
      onPictureMessage(message) {  // 接收图片
        console.log('%c [image] 接收图片', 'color: #2b99ff')
        console.log(message)
        let options = { url: message.url }
        options.onFileDownloadComplete = function (data) {
          console.log('%c *** 图片下载成功 ***', 'color: green')
          console.log(data)
        }
        options.onFileDownloadError = function (err) {
          console.log('%c *** 图片下载失败 ***', 'color: red')
          console.log(err)
        }

        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.TEXT);
          }
          calcUnReadSpot(message);
          ack(message);
        }
      },

      onRoster(message) {
        console.log('*** Roster ***')
        console.log(message)
      },
      onError(error) {  // 错误监听
        console.log(error)
      }
    })



  },
  globalData: {
    userInfo: null
  }
})