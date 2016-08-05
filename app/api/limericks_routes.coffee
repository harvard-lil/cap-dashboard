config  = require '../../config'
AWS     = require 'aws-sdk'
s3      = new AWS.S3()
request = require 'request'

s3.config.update({accessKeyId: config.keys.AWS_AKID, secretAccessKey: config.keys.AWS_SAK})

@limericks = []

get_limericks = () ->
  data = s3.sync.listObjects({Bucket: config.keys.AWS_BUCKET, Prefix: "limericks/"})
  limericks = []
  for lim in data.Contents
    limericks.push(lim.Key) if (lim.Key.indexOf('.txt') > -1)
  return limericks

exports.get_list = (req, res) =>
  try
    @limericks = get_limericks()
    res.status(200).send {limericks: @limericks}
  catch e
    res.status(500).send {Error: e}

exports.get_random = (req, res) =>
  @limericks = get_limericks() if !@limericks.length
  max = @limericks.length - 1
  num = Math.floor(Math.random() * max)
  random_limerick = @limericks[num]
  if !random_limerick
    get_limericks
  try
    data = s3.sync.getObject({Bucket: config.keys.AWS_BUCKET, Key: random_limerick})
    limerick = data.Body.toString().split('\n')
    res.status(200).send {limerick:limerick}
  catch e
    res.status(500).send {Error: e.stack}
