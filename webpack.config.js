const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");

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
        // {
          // from: "src/javascripts/popper.min.js",
          // to: "../javascripts/popper.min.js"
        // },
        // {
          // from: "src/javascripts/tooltip.min.js",
          // to: "../javascripts/tooltip.min.js"
        // },
        { from: "stylesheets", to: "../stylesheets", ignore: [ '*.scss' ] },
        { from: "image", to: "../image" },
        // { from: "src/octicons", to: "../octicons" },
        // { from: "src/sounds", to: "../sounds" },
        { from: "fonts", to: "../fonts" },
        { from: "manifest.json", to: "../manifest.json" },
      ])
    ],
    devtool: "source-map",
    resolve: {
      extensions: [".js", ".jsx", ".scss"]
    }
  },
  // {
  //   entry: {
  //     popup: "./src/stylesheets/popup.scss",
  //     content: "./src/stylesheets/content.scss",
  //     options: "./src/stylesheets/options.scss"
  //   },
  //   output: {
  //     path: path.resolve(__dirname, "./dist/assets/stylesheets/"),
  //     filename: "[name].css"
  //   },
  //   module: {
  //     rules: [
  //       {
  //         test: /\.scss$/,
  //         use: ExtractTextPlugin.extract({
  //           fallback: "style-loader",
  //           use: ["css-loader", "sass-loader?outputStyle=expanded"]
  //         })
  //       }
  //     ]
  //   },
  //   plugins: [new ExtractTextPlugin("[name].css")]
  // }
];
