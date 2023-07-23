'use strict'
const path = require('path')
const distDir = path.resolve(__dirname, 'dist')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: './app/index.ts',
  output: {
    filename: 'bundle.js',
    path: distDir,
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 60800,
  },
  plugins: [
    new HtmlWebpackPlugin({ title: 'Better Book Bundle Builder' }), 
    new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' })
  ],
  module: {
    rules: [
      { test: /\.ts$/, use: ['ts-loader'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, use: 'url-loader?limit=100000' },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}
