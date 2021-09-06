const HtmlWebPackPlugin = require("html-webpack-plugin");
const WebpackBar = require('webpackbar')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = function pluginConfig(isDevelopment) {
    return [
        new VueLoaderPlugin(),
        isDevelopment && new FriendlyErrorsWebpackPlugin(),
        isDevelopment && new ErrorOverlayPlugin(),
        new WebpackBar(),
        !isDevelopment && new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin({analyzerMode: isDevelopment ? 'disabled' : 'static'}),
        isDevelopment && new HtmlWebPackPlugin({
            template: "./index.html",
            filename: "./index.html"
        })
    ].filter(Boolean)
}

