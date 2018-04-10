var path = require('path');
var webpack = require('webpack');

module.exports = {
 entry: './client/app.js',
 output: {
  path: path.join(__dirname, 'client'),
  filename: 'bundle.js'
 },
 module: {
  rules: [{
   test: /.jsx?$/,
   loader: 'babel-loader',
   exclude: /node_modules/,
  },
  {
   test: /\.css$/,
   loader: "style-loader!css-loader"
  }]
 }
}
