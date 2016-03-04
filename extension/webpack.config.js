process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: `${__dirname}/dist/index.js`
  },
  devtools: 'source-map',
  module: {
    loaders: [{
      test: /.js$/,
      loader: 'babel-loader',
      exclude: 'node_modules',
    }]
  },
  resolve: {
    alias: {
      config: path.join(__dirname, 'config', `config.${process.env.NODE_ENV}`)
    }
  }
}