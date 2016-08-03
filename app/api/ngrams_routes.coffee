config          = require '../../config'
fs              = require 'fs'
AWS             = require 'aws-sdk'
word_output_dir = "#{config.keys.NGRAM_DIR}/"

s3 = s3 || new AWS.S3()
s3.config.update({accessKeyId: config.keys.AWS_AKID, secretAccessKey: config.keys.AWS_SAK});

exports.get_words = (req, res) ->
  words = req.query.words
  words = [words] if typeof(words) is "string"
  result = {}

  for word in words
    word_file = "#{word_output_dir}#{word}.txt"

    try
      # fibrous, you beautiful thing, I love you
      data = s3.sync.getObject({Bucket: config.keys.AWS_BUCKET, Key: "#{word_file}"})
      result[word] = JSON.parse(data.Body.toString())
    catch e
      if result['ERROR']
        result['ERROR'].push(word)
      else
        result['ERROR'] = [word]

  res.status(200).send { result : result }
