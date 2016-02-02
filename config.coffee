config = {}
config.keys = {}

if process.env.NODE_ENV is 'development'
  keys = require './keys'
  config.keys = keys

module.exports = config
