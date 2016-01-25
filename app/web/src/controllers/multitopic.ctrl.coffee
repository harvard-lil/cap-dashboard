angular.module('myApp')
.controller 'MultiTopicCtrl', (TopicService, GraphService) ->
  @graph         = {}
  @topics        = {}
  @currentTopics = []
  topicsExist    = false

  @setupTopics = ->
    return if topicsExist
    for t,val of TopicService.topics
      @topics[t] = { selected : false }
      topicsExist = true

  defaults = GraphService.defaults

  @renderMultiTopicGraph = ->
    topics = @topics
    _.mapObject topics, (val, key) =>
      if @currentTopics.indexOf(key) < 0
        @currentTopics.push key if val.selected
      else
        index = @currentTopics.indexOf(key)
        @currentTopics.splice(index, 1)

    TopicService
      .getSeveralTopics(@currentTopics)
      .then (response) =>
        @topicsData = response.data
        @parseTopicData()

  @toggleTopic = (topic) ->
    @topics[topic].selected = !@topics[topic].selected
    @renderMultiTopicGraph()

  @parseTopicData = ->
    data      = @topicsData
    allTopics = []
    c         = 0

    for topicName,val of data
      singleTopicData =
        values      : []
        key         : topicName
        color       : GraphService.defaults.colors[c]
        area        : false
        strokeWidth : 1
        classed     : 'line-graph'

      for year in [GraphService.defaults.minYear..GraphService.defaults.maxYear]
        singleTopicData.values.push {x:year, y:val[year]?[0] || 0}

      allTopics.push singleTopicData
      c++
    @generateBarChart(allTopics)
    @graph.api.refresh()

  @generateBarChart = (data) =>
    @graph.data = data
    @graph.options = GraphService.lineGraph.options

  return
