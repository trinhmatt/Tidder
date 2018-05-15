var path = require('path');
var webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = false;

module.exports = {
 entry: './client/app.js',
 mode: 'development',
 output: {
  path: path.join(__dirname, 'client'),
  filename: 'bundle.js'
 },
 plugins: [new MiniCssExtractPlugin({
     filename: "styles.css"
   })],
 module: {
  rules: [{
   test: /.jsx?$/,
   loader: 'babel-loader',
   exclude: /node_modules/,
  }, {
    test: /\.s?css$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
  }]
  },
  devtool: isProduction ? 'source-map' : 'inline-source-map'
}
