const path = require('path');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/zhwl/' : './',
  pages: {
    index: 'src/pages/login/main.js',
    system: 'src/pages/system/main.js',
    business: 'src/pages/business/main.js',
    personnel: 'src/pages/personnel/main.js',
    car: 'src/pages/car/main.js',
    settlement: 'src/pages/settlement/main.js',
    search: 'src/pages/search/main.js',
  },
  configureWebpack: config => {
    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@c': path.resolve(__dirname, './src/components'),
          '@a': path.resolve(__dirname, './src/assets'),
        },
      },
    });
  },
  devServer: {
    port: '8001',
    //api地址前缀
    proxy: {
      '/zhwl': {
        target: 'http://10.16.11.186:80', //10.16.11.186:80  10.16.11.227:7001
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '/zhwl': '',
        },
      },
    },
  },
};
