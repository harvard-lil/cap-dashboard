config  = require '../../config'
AWS     = require 'aws-sdk'
s3      = new AWS.S3()
request = require 'request'

s3.config.update({accessKeyId: config.keys.AWS_AKID, secretAccessKey: config.keys.AWS_SAK})

@limericks = []
exports.get_list = (req, res) =>
  self = @
  s3.listObjects {Bucket: config.keys.AWS_BUCKET, Prefix: "limericks/"}, (err, data) ->
    if err
      res.status(500).send {Error: err.stack}
    for lim in data.Contents
      self.limericks.push(lim.Key) if (lim.Key.indexOf('.txt') > -1)

    res.status(200).send {limericks: @limericks}

exports.get_random = (req, res) =>
  max = @limericks.length - 1
  num = Math.floor(Math.random() * max)
  random_limerick = @limericks[num]

  s3.getObject {Bucket: config.keys.AWS_BUCKET, Key: random_limerick}, (err, data) ->
    if err
      res.status(500).send {Error: err.stack}
    limerick = data.Body.toString().split('\n')
    res.status(200).send {limerick:limerick}
