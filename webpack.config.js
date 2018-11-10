const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/jazl.js'),
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'jazl.min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      }
    ]
  }
};
