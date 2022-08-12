/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
  productionSourceMap: false,
  publicPath: '/insdot-web/dist/',
  devServer: {
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

}
