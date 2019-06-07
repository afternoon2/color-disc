const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  externals: {
    Konva: 'konva'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'color-disc.js',
    library: 'ColorDisc',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[folder]-[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: loader => [
                require('autoprefixer')({
                  browsers: ['last 5 version', '> 1%']
                }),
                require('cssnano')()
              ]
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  }
};
