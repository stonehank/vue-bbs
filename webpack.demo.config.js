'use strict';

const isWsl = require('is-wsl');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const moduleConfig  = require('./module.config')
const pluginConfig  = require('./plugins.config')

const dev = path.join(__dirname, 'demo-src')

module.exports= {
  mode: 'production',
  entry: path.join( dev, 'index.js'),
  output: {
    path: path.join(__dirname, 'demo'),
    filename:'index.js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: !isWsl,
        cache: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
        },
      }),
    ],
  },
  resolve: {
    extensions: [ '.vue', '.js', '.json', '.css','.scss'],
  },
  module: moduleConfig(false),
  plugins: pluginConfig(false,true),
};
