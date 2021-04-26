var webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const DEBUG = process.env.NODE_ENV === "development";
const OUTPUT_PUBLIC_PATH = `/static/${DEBUG ? "frontend-dev/" : "frontend/"}`;
// const OUTPUT_PATH = `${__dirname}/../static/${DEBUG ? "frontend-dev" : "frontend"}`;
const OUTPUT_PATH = `/var/www/otapick/static/${DEBUG ? "frontend-dev" : "frontend"}`;

module.exports = {
  entry: "./src/index.jsx",
  output: {
    publicPath: OUTPUT_PUBLIC_PATH,
    path: OUTPUT_PATH,
    // filename: "[name].bundle.js",
    filename: `[name].${process.env.NODE_ENV}.${DEBUG}.bundle.js`,
    chunkFilename: "[id].[contentHash].bundle.js", // contentHash: コードが変更されるたびに変更されるハッシュ値
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false,
              // modules : true,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  // https://qiita.com/terrierscript/items/f840b5ccff0c0be7420a
  performance: { hints: false },

  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
    new CleanWebpackPlugin(), // [contentHash]リビジョン管理により生成された不要な前バージョンのバンドルファイルを削除
  ],

  // https://stackoverflow.com/questions/58073626/uncaught-typeerror-cannot-read-property-call-of-undefined-at-webpack-requir
  optimization: {
    minimize: true,
    namedModules: true,
    namedChunks: true,
    removeAvailableModules: true,
    flagIncludedChunks: true,
    occurrenceOrder: false,
    usedExports: true,
    concatenateModules: true,
    sideEffects: false, // <----- in prod defaults to true if left blank
  },
};
