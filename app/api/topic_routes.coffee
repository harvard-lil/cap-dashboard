topics       = require "../../public/assets/topic_models_small"
topic_totals = require "../../public/assets/data-totals-per-year"

gdocs        = require './gdocs'
topics_dict  = gdocs.topics_dictionary

exports.find_by_topic = (req, res) ->
  try
    topic      = req.params.topic
    topic_num  = "#{topics_dict[topic]}"
    topic_data = topics.clusters[topic_num]
    data = {keywords: topic_data.cluster_words, data: topic_data.data}
    res.status(200).send data
  catch e
    res.status(500).send e

exports.find_by_topics = (req, res) ->
  t = JSON.parse req.query.topics
  data = {}
  try
    for topic in t
      if topic != "Totals"

        topic_num = "#{topics_dict[topic]}"
        topic_data = topics.clusters[topic_num]
        data[topic] = topic_data.data
      else
        data['Total Count'] = topic_totals
    res.status(200).send data
  catch e
    res.status(500).send e

exports.list_topics = (req, res) ->
  try
    list = Object.keys topics_dict
    data = {}
    for t in list
      num = topics_dict[t]
      data[t] = topics.clusters[num].data.total

    res.status(200).json data
  catch e
    res.status(500).send e

exports.get_totals = (req, res) ->
  try
    totals = topic_totals
    res.status(200).send totals
  catch e
    res.status(500).send e
