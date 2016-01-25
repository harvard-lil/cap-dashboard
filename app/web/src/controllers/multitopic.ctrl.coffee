angular.module('myApp')
.controller 'MultiTopicCtrl', ($window, TopicService, GraphService) ->
  @topics        = {}
  @currentTopics = []
  topicsExist    = false

  @graph         = GraphService.lineGraph
  defaults       = GraphService.defaults
  @time          = angular.copy GraphService.defaults.time


  @setupTopics = ->
    return if topicsExist
    for t,val of TopicService.topics
      @topics[t] = { selected : false }
      topicsExist = true

  @renderMultiTopicGraph = (topic) ->
    index = @currentTopics.indexOf(topic)
    if @topics[topic].selected && index < 0
      @currentTopics.push topic
    else if not @topics[topic].selected && index > -1
      @currentTopics.splice(index, 1)

    TopicService
      .getSeveralTopics(@currentTopics)
      .then (response) =>
        @topicsData = response.data
        @parseTopicData()

  @toggleTopic = (topic) ->
    @topics[topic].selected = !@topics[topic].selected
    @renderMultiTopicGraph(topic)

  @parseTopicData = ->
    data      = @topicsData
    allTopics = []
    c         = 0

    for topicName,val of data
      singleTopicData =
        values      : []
        key         : topicName
        color       : defaults.colors[c]
        area        : false
        strokeWidth : 1
        classed     : 'line-graph'

      for year in [@time.min..@time.max]
        singleTopicData.values.push {x:year, y:val[year]?[0] || 0}

      allTopics.push singleTopicData
      c++

    @generateBarChart(allTopics)
    @graph.api.refresh()

  @generateBarChart = (data) =>
    @graph.data = data

  return
