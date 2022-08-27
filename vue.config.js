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
  // module: {
  //   rules: [
  //     {
  //       test: /\.css$/,
  //       use: ['style-loader', 'css-loader'],
  //     },
  //     {
  //       test: /\.ttf$/,
  //       use: ['file-loader'],
  //     },
  //   ],
  // },
  // chainWebpack: config => {
  //   config.module
  //     .rule('css')
  //     .test(/\.css$/)
  //     .use('style-loader')
  //     .css('style-loader')
  //     .rule('ttf')
  //     .test(/\.ttf$/)
  //     .use('file-loader')
  // },
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin(),
    ],
  },
}
