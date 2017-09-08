const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const formatter = require('eslint-friendly-formatter');

const port = process.env.PORT || 9000;

module.exports = {
  devtool: 'inline-source-map',

  entry: {
    'muxy-extensions': './src/index.js',
    'muxy-extensions.min': './src/index.js'
  },

  resolve: {
    alias: {
      lodash$: 'libs/lodash.custom.min.js'
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
        options: { formatter }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  output: {
    library: 'Muxy',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ],

  devServer: {
    port,
    https: {
      key: fs.readFileSync('./certs/testing.key'),
      cert: fs.readFileSync('./certs/testing.crt')
    }
  }
};
