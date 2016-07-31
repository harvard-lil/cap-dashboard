request = require 'request'
config = require '../../config'
word_output_dir = config.keys.NGRAM_DIR
fs = require 'fs'

exports.get_words = (req, res) ->
  words = req.query.words
  words = [words] if typeof(words) is "string"
  result = {}
  for word in words
    word_file = "#{word_output_dir}#{word}.txt"
    try
      result[word] = JSON.parse(fs.readFileSync(word_file, 'utf8'))
    catch error
      result[word] = {}
  res.status(200).send {
    result : result
  }
