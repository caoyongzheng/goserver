var webpack = require('webpack')
var path = require('path')
var ExtractPlugin = require('extract-text-webpack-plugin')
var CleanPlugin = require('clean-webpack-plugin')
var precss = require('precss')
var autoprefixer = require('autoprefixer')
var production = process.env.NODE_ENV === 'production'

var alias = require('./alias.js')
var noParse = require('./noParse.jsx')

var config = {
    context: __dirname,
    entry: {
        vendor: ['react', 'react-dom', 'react-router','lodash'],
        app: './js/entry/app.jsx',
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
        noParse:[/node_modules\/json-schema\/lib\/validate\.js/]
    },
    postcss: function() {
        return [precss, autoprefixer];
    },
    resolve: {
        root: [__dirname],
        alias: alias,
        extensions: ['', '.js', '.jsx'],
        loaderPostfixes:['-loader','']
    },
    plugins: [
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
    ],
    debug: !production,
    devtool: production ? false : '[inline-]source-map'
}

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

for (var i in noParse) {
    if (noParse.hasOwnProperty(i)) {
        config.resolve.alias[i] = path.resolve(__dirname,noParse[i])
        config.module.noParse.push(noParse[i])
    }
}

module.exports = config
