const MinifyPlugin = require("babel-minify-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const NodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "./dist/bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },
  externals:[
    NodeExternals()
  ],
  plugins: [
    new MinifyPlugin(),
    new CompressionPlugin()
  ],
  devtool: process.env.NODE_ENV === "production" ? "source-map" : "inline-source-map"
};