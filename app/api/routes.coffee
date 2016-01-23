# fs     = require "fs"
topics_dict = require "../../public/assets/topics_dictionary"
topics      = require "../../public/assets/topic_models_small"


min_year = 1850
max_year = 2015

exports.findByTopic = (req, res) ->
  topic    = req.params.topic
  topic_num = "#{topics_dict.list[topic]}"
  res.status(200).send(topics.clusters[topic_num].data)

exports.findByTopics = (req, res) ->
  topics    = req.data.topics
  topic_num = "#{topics_dict.list[topic]}"
  data = {}
  res.status(200).send(topics.clusters[topic_num].data)

exports.listTopics = (req, res) ->
  topics = Object.keys topics_dict.list
  res.status(200).json { topics : topics }
