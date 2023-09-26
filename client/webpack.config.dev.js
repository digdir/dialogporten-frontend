const commonConfig = require('./webpack.common');
const path = require('path');

module.exports = {
  ...commonConfig,
  mode: 'development',
  devtool: 'inline-source-map',
  performance: {
    hints: 'warning',
  },
  optimization: {
    chunkIds: 'natural',
  },
  module: {
    rules: [
      ...commonConfig.module.rules,
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        test: /\.([jt]sx?)?$/,
        use: 'swc-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [...commonConfig.plugins],
  devServer: {
    hot: true,
    static: path.join(__dirname, '/src/public'),
    allowedHosts: 'all',
    port: 3000,
    historyApiFallback: true,
    open: true,

    proxy: {
      '/api': {
        target: {
          host: 'localhost', // REPLACE WITH ACTUAL DEV API URL
          protocol: 'http:',
          port: 3005, // REPLACE WITH ACTUAL DEV API URL
        },
        secure: false,
      },
    },
    client: {
      overlay: {
        errors: false,
        warnings: false,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      // prettier-ignore
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
};
