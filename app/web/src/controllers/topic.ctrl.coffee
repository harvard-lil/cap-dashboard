angular.module('myApp')
.controller 'TopicCtrl', ($scope, TopicService, GraphService) ->
  @time  = angular.copy GraphService.defaults.time
  @graph = GraphService.multiBarChart
  $scope.$watch ->
    return TopicService.currentTopic
  , (newval, oldval) =>
    return if newval == oldval
    @currentTopic = newval
    @getTopicData @currentTopic

  @getTopicData = (topic) ->
    TopicService.getSingleTopic(topic)
    .then (response) =>
      @topicData = response.data.data
      @parseTopicData()
      @parseTopicKeywords(response.data.keywords)
    , (response) ->
      console.log "something went wrong"

  defaults =
    keys :
      case_counts: "Local Cases"
      SC_counts: "SC Cases"
      dissent_counts: "Local Dissents"
      SC_dissent_counts: "SC Dissents"

  @parseTopicKeywords = (keywords) ->
    @topicKeywords = keywords

  @parseTopicData = ->
    data = @topicData

    allCounts = [
      { key: defaults.keys.case_counts, values: [] }
      { key: defaults.keys.SC_counts, values: [] }
      { key: defaults.keys.dissent_counts, values: [] }
      { key: defaults.keys.SC_dissent_counts, values: [] }
    ]

    for year in [@time.min..@time.max]
      allCounts[0].values.push [year, (data[year]?[0] || 0)]
      allCounts[1].values.push [year, (data[year]?[1] || 0)]
      allCounts[2].values.push [year, (-1 * data[year]?[2] || 0)]
      allCounts[3].values.push [year, (-1 * data[year]?[3] || 0)]

    @generateBarChart(allCounts)
    @graph.api.refresh()

  @generateBarChart = (topicData) =>
    @graph.data = topicData

  return
