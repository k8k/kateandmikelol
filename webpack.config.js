'use strict';
var webpack = require('webpack');
var path = require('path');
var jade = require('jade') || null;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

// PATHS
var PATHS = {
  app: __dirname + '/app'
};
//for some reason wont watch witht he html plugin! look into this
var plugins = [
  new webpack.HotModuleReplacementPlugin()
];

// For standard HTML users, just set jade to null here or remove jade dependencies in package.json and re-install
jade = null;
if (jade) {
  var template = jade.compileFile('./app/index.jade');
  plugins.push(
    new HtmlWebpackPlugin({
          templateContent: template,
          inject: 'body', //auto inject so we dont need to include bundle.js in our index.jade
          favicon: 'favicon.ico'
    })
  )
}

module.exports = {
  context: PATHS.app,
  entry: {
    app: ['webpack/hot/dev-server', './core/bootstrap.js']
  },
  output: {
    path: PATHS.app,
    filename: 'bundle.js'
  },
  devServer: {
    inline: true,
  },
  module: {
    loaders: [
    {
      test: /\.styl$/,
      loader: 'style!css!stylus'
    },
    {
      test: /\.css$/,
      loader: 'style!css'
    },
    {
      test: /\.html$/,
      loader: 'html'
    },
    {
        test: /\.jade$/,
        loader: 'jade'
    },
    {
      test: /\.js$/,
      loader: 'ng-annotate!babel?presets[]=es2015!jshint',
      exclude: /node_modules|bower_components/
    }
  ]
  },
  plugins: plugins
};
