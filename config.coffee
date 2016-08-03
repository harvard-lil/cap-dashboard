config = {}
config.keys = {}
keys = require './keys'

if process.env.NODE_ENV is 'development'
  config.keys =
    NODE_ENV       : process.env.NODE_ENV
    AWS_AKID       : keys.AWS_AKID
    AWS_SAK        : keys.AWS_SAK
    AWS_BUCKET     : keys.AWS_BUCKET
    AWS_ADDRESS    : keys.AWS_ADDRESS
    MYSQL_HOST     : ""
    MYSQL_USER     : ""
    MYSQL_PASSWORD : ""
    MYSQL_DATABASE : ""
    NGRAM_DIR      : keys.NGRAM_DIR_LOCAL
    PROGRESS_STATS : "http://localhost:8001/fake-number/"
    PROGRESS_API   : "http://localhost:8001/fake-number/"

else
  config.keys = keys

module.exports = config
