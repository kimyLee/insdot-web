/* eslint-disable @typescript-eslint/no-var-requires */
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  productionSourceMap: false,
  publicPath: '/insdot-web/dist/',
  devServer: {
    https: true,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  chainWebpack: config => {
    config.module
      .rule('.text')
      .test(/\.xml$/)
      .use('text-loader')
      .loader('text-loader')
      .end()
  },
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin(),
    ],
  },
}
