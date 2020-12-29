module.exports = {
  mode: 'development',
  entry: './ts/index.ts',
  output: {
    path: `${__dirname}/js`,
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    modules: [
      "node_modules"
    ],
    extensions: [".ts", ".js"]
  }
};