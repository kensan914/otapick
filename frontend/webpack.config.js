module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname + "/../static/frontend",
    filename: "main.js",
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
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
    ]
  },
  // https://qiita.com/terrierscript/items/f840b5ccff0c0be7420a
  performance: { hints: false }
};