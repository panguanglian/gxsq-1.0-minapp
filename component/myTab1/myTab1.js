Component({
  properties: {

  },
  data: { // 组件内部数据
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://image.weilanwl.com/img/4x3-1.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://image.weilanwl.com/img/4x3-2.jpg'
    }, {
      id: 2,
      type: 'image',
      url: 'https://image.weilanwl.com/img/4x3-3.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://image.weilanwl.com/img/4x3-4.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://image.weilanwl.com/img/4x3-2.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://image.weilanwl.com/img/4x3-4.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://image.weilanwl.com/img/4x3-2.jpg'
    }],
  },
  methods: { // 组件内部方法
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    }
  }
})