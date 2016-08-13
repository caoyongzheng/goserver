var path = require('path')
var _ = require('lodash')
var utils = require('./utils.js')

function initAlias(dir,config) {
  config.resolve.alias = config.resolve.alias || {}
  config.module.noParse = config.module.noParse || []
  utils.walkFile(dir, function(absFilename, filename) {
    if (_.startsWith(filename, 'alias') || _.startsWith(filename, 'noParse')) {
      var alias = require(absFilename)
      console.log('@', absFilename)
      _.forEach(alias, function(value, key) {
        var oldAlias = config.resolve.alias[key]
        if (!_.isEmpty(oldAlias)) {
          throw `key: "${key}" is duplicated, with two value:\n1. ${oldAlias}\n2. ${value}`
        }
        var absValue = path.resolve(path.dirname(absFilename), value)
        console.log('alias:', key, ', value: ', absValue)
        config.resolve.alias[key] = absValue
        if (_.startsWith(filename, 'noParse')) {
          config.module.noParse.push(absValue)
        }
      })
      console.log()
    }
  })
  console.log()
}

module.exports = initAlias
