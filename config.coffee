config = {}
config.keys = {}

if process.env.NODE_ENV is 'production' 
  config.keys.MONGO_URL = process.env.MONGOLAB_URI
else
  keys = require './keys'
  config.keys = keys

module.exports = config