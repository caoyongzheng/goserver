var path = require('path')
var fs = require('fs')
var _ = require('lodash')
var DirPath = path.resolve(__dirname, './src')
var allAlias = []

function getAllAlias(dir) {
  var filesNames = fs.readdirSync(dir)
  _.forEach(filesNames, function(filename) {
    var absFilename = path.resolve(dir, filename)
    var fileStat = fs.lstatSync(absFilename)
    if (fileStat.isDirectory()) {
      getAllAlias(absFilename)
      return
    }
    if (_.startsWith(filename, 'alias') || _.startsWith(filename, 'noParse')) {
      allAlias.push(absFilename)
    }
  })
}

function initAlias(config) {
  config.resolve.alias = config.resolve.alias || {}
  config.module.noParse = config.module.noParse || []
  getAllAlias(DirPath)
  _.forEach(allAlias, function(aliasfile) {
    var alias = require(aliasfile)
    console.log('@', aliasfile)
    _.forEach(alias, function(value, key) {
      var oldAlias = config.resolve.alias[key]
      if (!_.isEmpty(oldAlias)) {
        throw `key: "${key}" is duplicated, with two value:\n1. ${oldAlias}\n2. ${value}`
      }
      var aliasValue = path.resolve(path.dirname(aliasfile), value)
      console.log('alias:', key, ', value: ', aliasValue)
      config.resolve.alias[key] = aliasValue

      if (_.startsWith(path.basename(aliasfile), 'noParse')) {
        config.module.noParse.push(aliasValue)
      }
    })
    console.log()
  })
  console.log()
}

module.exports = initAlias
