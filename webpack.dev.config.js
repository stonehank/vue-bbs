const path = require('path');
const src = path.join(__dirname, 'src')
const moduleConfig  = require('./module.config')
const pluginConfig  = require('./plugins.config')

module.exports = {
  entry: path.join( src, 'index.js'),
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
};
