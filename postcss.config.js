module.exports = {
  plugins: [
    [
      'postcss-import',
      {
        // Options
      }
    ],
    [
      'postcss-preset-env',
      {
        stage: 1,
      },
    ],
  ],
};
