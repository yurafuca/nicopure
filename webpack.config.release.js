const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = [
  {
    entry: {
      background: "./javascripts/background.js",
      popup: "./javascripts/popup.js",
    },
    output: {
      path: path.resolve(__dirname, "./dist/assets/javascripts"),
      filename: "[name].js"
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          query: {
            cacheDirectory: true,
            presets: ["react", "es2015"]
          }
        },
        {
          test: /\.css$/,
          loaders: ["style-loader", "css-loader?modules"]
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin("[name].css"),
      new CopyWebpackPlugin([
        { from: "html", to: "../html" },
        { from: "javascripts/popper.min.js", to: "../javascripts/popper.min.js" },
        { from: "javascripts/tooltip.min.js", to: "../javascripts/tooltip.min.js" },
        { from: "stylesheets", to: "../stylesheets", ignore: [ '*.scss' ] },
        { from: "image", to: "../image" },
        { from: "fonts", to: "../fonts" },
        { from: "manifest.json", to: "../manifest.json" },
      ]),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      new webpack.optimize.UglifyJsPlugin()
    ],
    resolve: {
      extensions: [".js", ".jsx", ".scss"]
    }
  }
];
