module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  // https://qiita.com/terrierscript/items/f840b5ccff0c0be7420a
  performance: { hints: false }
};