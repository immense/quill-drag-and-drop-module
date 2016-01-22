module.exports = {
  entry: './src/quill-module.js',
  output: {
    filename: 'quill-module.js',
    library: 'DragAndDropModule',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
  externals: {
    quill: {
      root: "Quill",
      commonjs: "quill",
      commonjs2: "quill",
      amd: "quill"
    }
  }
};
