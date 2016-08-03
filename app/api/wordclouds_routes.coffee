config = require '../../config'
AWS = require 'aws-sdk'
s3 = new AWS.S3()

s3.config.update({accessKeyId: config.keys.AWS_AKID, secretAccessKey: config.keys.AWS_SAK});

exports.get_state = (req, res) ->
  state = req.params.state

  s3.listObjects {Bucket: config.keys.AWS_BUCKET, Prefix: "wordclouds/#{state}"}, (err, data) ->
    if err
      res.status(500).send {Error: err.stack}

    image_urls = []
    for i in data.Contents
      if i.Key.indexOf('.png') > -1
        image_urls.push "#{config.keys.AWS_ADDRESS}/#{config.keys.AWS_BUCKET}/#{i.Key}"
    res.status(200).send {images: image_urls}

exports.list_states = (req, res) ->
  try
    list = s3.sync.getObject({Bucket: config.keys.AWS_BUCKET, Key: 'wordclouds/states.txt'})
  catch e
    res.status(500).send {Error: err.stack}

  states = list.Body.toString().split('\n')
  res.status(200).send {states:states}
