# fs     = require "fs"
topics_dict = require "../../public/assets/topics_dictionary"
topics      = require "../../public/assets/topic_models_small"


min_year = 1850
max_year = 2015

exports.findByTopic = (req, res) ->
  # topics = JSON.parse(topics)
  topic    = req.params.topic
  # console.log "getting topic:", topics_dict.list
  topic_num = "#{topics_dict.list[topic]}"
  data = {}
  # for year in [min_year..max_year]
  #   data[year]

  res.status(200).send(topics.clusters[topic_num].data)

exports.listTopics = (req, res) ->
  topics = Object.keys topics_dict.list
  # this should probably be ordered somehow
  res.status(200).json { topics : topics }
