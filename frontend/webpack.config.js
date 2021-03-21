var webpack = require("webpack");

module.exports = {
  entry: "./src/index.jsx",
  output: {
    publicPath: "/static/frontend/",
    path: __dirname + "/../static/frontend",
    filename: "main.js",
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
