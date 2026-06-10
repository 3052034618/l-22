export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/action/index',
    'pages/compare/index',
    'pages/task/index',
    'pages/message/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#00B42A',
    navigationBarTitleText: '碳中和管理',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#00B42A',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/action/index',
        text: '填报'
      },
      {
        pagePath: 'pages/compare/index',
        text: '对比'
      },
      {
        pagePath: 'pages/task/index',
        text: '任务'
      },
      {
        pagePath: 'pages/message/index',
        text: '消息'
      }
    ]
  }
})
