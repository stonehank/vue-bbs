const path = require('path');
const dev = path.join(__dirname, 'dev')
const moduleConfig  = require('./module.config')
const pluginConfig  = require('./plugins.config')

module.exports = {
  entry: path.join( dev, 'index.js'),
  output: {
    path: path.join(__dirname, 'demo'),
    filename:'index.js'
  },
  resolve: {
    extensions: [ '.vue', '.js', '.json', '.css','.scss'],
  },
  devtool: 'cheap-module-source-map',
  module: moduleConfig(true),
  plugins: pluginConfig(true),
  devServer: {
    quiet:true,
    hot: true,
  } ,
  // cache: {
  //   type: 'filesystem',
  //   maxAge: 5184000000,
  // },
};
