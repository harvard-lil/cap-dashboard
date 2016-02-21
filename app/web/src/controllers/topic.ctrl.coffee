angular.module('ftlTopics')
.controller 'TopicCtrl', ($scope, TopicService, GraphService) ->
  @time   = angular.copy GraphService.defaults.time
  @graph  = GraphService.multiBarChart
  @topics = TopicService.topics

  $scope.$watch ->
    return TopicService.currentTopic
  , (newval, oldval) =>
    return if newval == oldval
    @currentTopic = newval
    @getTopicData @currentTopic

  @getTopicData = (topic) ->
    TopicService.getSingleTopic(topic)
    .then (response) =>
      allCounts = GraphService.parseBarChartData(response.data, @time)
      @generateBarChart allCounts
      @parseTopicKeywords(response.keywords)
    , (response) ->
      console.log "something went wrong"

  @changeCurrentTopic = (topic) ->
    TopicService.currentTopic = topic

  @currentTopic = TopicService.currentTopic
  @getTopicData @currentTopic

  defaults =
    keys :
      appeals_counts         : "Appeal Court Cases"
      case_counts            : "Total Cases"
      SC_counts              : "Supreme Court Cases"
      dissent_counts         : "Total Dissents"
      SC_dissent_counts      : "Supreme Court Dissents"
      appeals_dissent_counts : "Appeals Court Dissents"

  @parseTopicKeywords = (keywords) ->
    @topicKeywords = keywords
    @topicKeywords

  @generateBarChart = (allCounts) =>
    @graph.data = allCounts
    @graph.api.refresh()

  return
