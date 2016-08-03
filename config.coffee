config = {}
config.keys = {}

if process.env.NODE_ENV is 'development'
  keys = require './keys'
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
    PROGRESS_STATS : keys.PROGRESS_STATS
    PROGRESS_API   : keys.PROGRESS_STATS

else
  config.keys = process.env

module.exports = config
