// const webpack = require('webpack')
const isWsl = require('is-wsl');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const moduleConfig  = require('./module.config')
const pluginConfig  = require('./plugins.config')

const src = path.join(__dirname, 'src')

module.exports= {
  mode: 'production',
  entry: path.join( src, 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename:'serverless-bbs.js',
    library: "serverless-bbs",
    libraryTarget: 'umd',
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
  externals: {
    vue:'vue',
  },

  resolve: {
    extensions: [ '.vue', '.js', '.json', '.css','.scss'],
  },
  module: moduleConfig(false),
  plugins: pluginConfig(false),

  stats: {
    all: false,
    // modules: true,
    // maxModules: 0,
    // errors: true,
    // warnings: true,
    // timings: true,
  }
};
