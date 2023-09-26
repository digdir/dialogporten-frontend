const devConfig = require('./webpack.config.dev');

module.exports = {
  ...devConfig,
  mode: 'docker',
  devServer: {
    ...devConfig.devServer,

    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        router: () => 'http://node-server:3001',
        secure: false,
      },
    },
  },
};
