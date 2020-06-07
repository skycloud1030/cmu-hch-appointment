const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");

var config = {
  optimization: {
    splitChunks: { chunks: "all" },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  entry: {
    index: [path.resolve(__dirname, "src/index.js")],
  },
  output: {
    publicPath: "./",
    path: path.resolve(__dirname, "docs"),
    chunkFilename: "[name].[contenthash:4].bundle.js",
    filename: "[name].[contenthash:4].js",
    libraryTarget: "umd",
    umdNamedDefine: true,
    globalObject: "this",
  },
  plugins: [
    new AntdDayjsWebpackPlugin(),
    new CopyWebpackPlugin({ patterns: [{ from: "src/assert", to: "./" }] }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
    }),
    // new HardSourceWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:4].css",
      chunkFilename: "[name].[contenthash:4].css",
    }),
  ],
  performance: { hints: false },
  resolve: {
    alias: {},
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "node_modules/react-hooks"),
        ],
        loader: "babel-loader",
        query: {
          cacheDirectory: true,
          // plugins: [["import", { libraryName: "antd", style: "css" }]],
        },
      },
      {
        test: /\.worker\.js$/,
        use: [
          { loader: "worker-loader", options: { name: "worker.[hash].js" } },
          {
            loader: "babel-loader",
            query: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.cssm$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]",
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
            options: { javascriptEnabled: true },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "url-loader?name=[path][name].[ext]&limit=50000",
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=[path][name].[ext]",
      },
      {
        test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
        loader: "url-loader?mimetype=application/font-woff",
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader:
          "url-loader?name=[path][name].[ext]&limit=50000&mimetype=application/octet-stream",
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader:
          "url-loader?name=[path][name].[ext]&limit=50000&mimetype=image/svg+xml",
      },
    ],
  },
};
module.exports = (env, argv) => {
  if (argv.mode === "development") {
  }
  if (argv.mode === "production") {
  }
  return config;
};
