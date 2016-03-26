'use strict';
let webpack = require('webpack');
let WebpackDevServer = require('webpack-dev-server');
let config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  quiet: true
}).listen(3000, '127.0.0.1', (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening on 127.0.0.1:3000');
});
