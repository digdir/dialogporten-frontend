const devConfig = require('./webpack.config.dev');

module.exports = {
  ...devConfig,
  mode: 'docker',
  devServer: {
    ...devConfig.devServer,
    proxy: {
      '/api': {
        target: 'http://node-server:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        secure: false,
      },
      '/auth': {
        target: 'http://node-server:3000',
        changeOrigin: true,
        secure: false,
      },
      '/test': {
        target: 'http://node-server:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
