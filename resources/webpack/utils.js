var fs = require('fs')
var _ = require('lodash')
var path = require('path')

function walkFile(dir, handle) {
  var filesNames = fs.readdirSync(dir)
  _.forEach(filesNames, function(filename) {
    var absFilename = path.resolve(dir, filename)
    var fileStat = fs.lstatSync(absFilename)
    if (fileStat.isDirectory()) {
      walkFile(absFilename, handle)
      return
    }
    handle(absFilename, filename)
  })
}
module.exports = {
  walkFile
}
