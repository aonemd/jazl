const path                 = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'Jazl',
    libraryTarget: 'umd',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "jazl.css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
          },
        ]
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
};
