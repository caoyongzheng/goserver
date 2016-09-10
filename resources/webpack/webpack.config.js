var webpack = require('webpack')
var path = require('path')
var ExtractPlugin = require('extract-text-webpack-plugin')
var precss = require('precss')
var autoprefixer = require('autoprefixer')
var production = process.env.NODE_ENV === 'production'

var initAlias = require('./initAlias.js')
var initPlugins = require('./initPlugins')
var initEntry = require('./initEntry.js')

var config = {
  context: __dirname,
  entry: {
    vendor: ['react', 'react-dom', 'react-router','lodash'],
  },
  output: {
    path: './assets',
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[chunkhash].chunk.js',
    publicPath: production?'/assets/':'http://localhost:3001/assets/',
  },
  module: {
    preLoaders: [{
        test: /\.jsx$/,
        exclude: [/node_modules/],
        loader: 'eslint',
    }],
    loaders: [{
        test: /\.(js|jsx)$/,
        exclude:path.resolve(__dirname, 'node_modules/'),
        loader: 'babel',
        query: {
            compact: false,
            presets: ['es2015', 'stage-0', 'react']
        }
    },{
        test: /\.css$/,
        inculde:path.resolve(__dirname, 'node_modules/'),
        loader: 'style!css!postcss-loader'
    }, {
        test: /\.scss$/,
        exclude:path.resolve(__dirname, 'node_modules/'),
        loader: ExtractPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass')
    }, {
        test: /\.(png|gif|jpe?g|svg|ttf|eot|woff)$/i,
        loader: 'url',
        query: {
            limit: 10000,
        }
    },{
        test: /\.json$/,
        loader:'json'
    }],
  },
  postcss: function() {
    return [precss, autoprefixer];
  },
  resolve: {
    root: [__dirname],
    extensions: ['', '.js', '.jsx'],
    loaderPostfixes:['-loader','']
  },
  debug: !production,
  devtool: production ? false : 'eval',
  devServer: {
    proxy: [
      {
        path: ['/api/','/resources/'],
        target: 'http://127.0.0.1:3000',
      },
      {
        target: 'http://127.0.0.1:3001',
        path: '/',
        pathRewrite:{
          '(^/$)|(^/app/?.*)' : '/assets/template/app.html',
        },
      },
    ]
  },
}
var srcDir = path.resolve(__dirname,'./src')
initPlugins(config)
initEntry(srcDir, config)
initAlias(srcDir, config)
module.exports = config
