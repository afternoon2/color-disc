  
const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge({
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, '../server'),
    inline: true,
    hot: true
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../dist/index.js'),
        to: path.resolve(__dirname, '../server/index.js')
      }
    ])
  ]
}, common);