/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
  productionSourceMap: false,
  publicPath: '/insdot-web/build/',
  devServer: {
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

}
