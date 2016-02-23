angular.module('ftlTopics')
.controller 'TopicCtrl', ($scope, TopicService, GraphService) ->
  @time   = angular.copy GraphService.defaults.time
  @graph  = GraphService.multiBarChart
  @topics = TopicService.topics

  $scope.$watch ->
    return TopicService.currentTopic
  , (newval, oldval) =>
    return if newval == oldval
    @getTopicData newval

  @getTopicData = (topic) ->
    TopicService.getSingleTopic(topic)
    .then (response) =>
      @parseTopicKeywords(response.keywords)
      @currentTopic = topic
      allCounts = GraphService.parseBarChartData(response.data, @time)
      @generateBarChart allCounts
      return
    , (response) ->
      console.log "something went wrong"

  @changeCurrentTopic = (topic) ->
    TopicService.currentTopic = topic

  @getTopicData TopicService.currentTopic

  @parseTopicKeywords = (keywords) ->
    @topicKeywords = keywords
    @topicKeywords

  @generateBarChart = (allCounts) ->
    return if !allCounts
    @graph.data = allCounts
    @graph.api?.refresh()
    return

  return
