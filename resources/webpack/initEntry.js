var path = require('path')
var _ = require('lodash')
var utils = require('./utils.js')
var HtmlWebpackPlugin = require('html-webpack-plugin')

function initEntry(dir, config) {
  config.plugins = config.plugins || []
  config.entry = config.entry || []

  utils.walkFile(dir,function(absFilename, filename) {
    if (_.startsWith(filename, 'entry-')) {
      var key = path.parse(absFilename).name.replace('entry-', '')
      if (!_.isEmpty(config.entry[key])) {
        throw `entry: "${key}" is duplicated, with two value:\n1. ${config.entry[key]}\n2. ${absFilename}`
      }
      config.entry[key] = absFilename
      config.plugins.push(new HtmlWebpackPlugin({
        title: key,
        chunks: ['vendor', key],
        filename: `template/${key}.html`,
        template: 'src/template/template.html',
      }))
      console.log('entry:', key, ', value: ', absFilename)
    }
  })
  console.log()
}

module.exports = initEntry
