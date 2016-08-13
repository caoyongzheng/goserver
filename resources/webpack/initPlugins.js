var webpack = require('webpack')
var production = process.env.NODE_ENV === 'production'
var ExtractPlugin = require('extract-text-webpack-plugin')
var CleanPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

function initPlugins(config) {
  config.plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: "js/vendor.bundle.js",
        minChunks: Infinity
    }),
    new ExtractPlugin("css/[name].bundle.css"),
    new webpack.ProvidePlugin({
       jQuery: "jquery",
       $: "jquery"
    }),
    new HtmlWebpackPlugin({
      title: 'My App',
      filename: 'template/app.html',
      template: 'src/template/template.html',
    }),
  ]

  if (production) {
      config.plugins = config.plugins.concat([
          new webpack.DefinePlugin({
              "process.env": {
                  NODE_ENV: JSON.stringify("production")
              }
          }),

          // This plugin looks for similar chunks and files
          // and merges them for better caching by the user
          new webpack.optimize.DedupePlugin(),

          // This plugins optimizes chunks and modules by
          // how much they are used in your app
          new webpack.optimize.OccurenceOrderPlugin(),

          // This plugin prevents Webpack from creating chunks
          // that would be too small to be worth loading separately
          new webpack.optimize.MinChunkSizePlugin({
              minChunkSize: 51200, // ~50kb
          }),

          // This plugin minifies all the Javascript code of the final bundle
          new webpack.optimize.UglifyJsPlugin({
              mangle: {
                  except: ['exports', 'require']
              },
              compress: {
                  warnings: false, // Suppress uglification warnings
              },
              output: {
                  comments: false,
              }
          }),

          // This plugins defines various variables that we can set to false
          // in production to avoid code related to them from being compiled
          // in our final bundle
          new webpack.DefinePlugin({
              __SERVER__: !production,
              __DEVELOPMENT__: !production,
              __DEVTOOLS__: !production,
              'process.env': {
                  BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
              },
          }),

          new CleanPlugin('assets')
      ])
  }
}

module.exports = initPlugins
