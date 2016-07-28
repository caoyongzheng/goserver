var webpack = require('webpack')
var path = require('path')
var ExtractPlugin = require('extract-text-webpack-plugin')
var precss = require('precss')
var autoprefixer = require('autoprefixer')
var production = process.env.NODE_ENV === 'production'

var initAlias = require('./initAlias.js')
var initPlugins = require('./initPlugins')

var config = {
    context: __dirname,
    entry: {
        vendor: ['react', 'react-dom', 'react-router','lodash'],
        app: './src/entry/app.jsx',
    },
    output: {
        path: './assets',
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[name]-[hash].chunk.js',
        publicPath: production?'assets/':'http://localhost:9090/assets/',
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
    devtool: production ? false : '[inline-]source-map'
}

initAlias(config)
initPlugins(config)
module.exports = config
