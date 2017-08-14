'use strict';

const env = process.env.NODE_ENV || 'development';

const webpack = require('webpack');
const path = require('path');
const webpackUMDExternal = require('webpack-umd-external');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pluginsList = [];
const outputFileName = 'bundle.min.js';

const config = {
  devtool: 'source-map',
  entry: {
    'js/main': [
      './demo/index.js'
    ]},
  output: {
    path: path.join(__dirname, 'demo'),
    filename: outputFileName
  },
  //
  // externals: webpackUMDExternal({
  //   'react': 'React',
  //   'swipe-js-iso': 'Swipe'
  // }),
  //
  // resolve: {
  //   extensions: ['', '.js', '.jsx']
  // },

  plugins: pluginsList,

  module: {
    // preLoaders: [{
    //   test: /\.jsx?$/,
    //   loaders: ['eslint'],
    //   exclude: /node_modules/
    // }],

    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['babel']
    }, {
      test: /\.css$/,
      exclude: /(node_modules)/,
      loader: 'style!css'
    }]
  }
};

module.exports = config;
