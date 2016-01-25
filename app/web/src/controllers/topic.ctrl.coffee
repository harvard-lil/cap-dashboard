angular.module('ftlTopics')
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

  @parseTopicData = ->
    data = @topicData
    allCounts = [
      { key: defaults.keys.appeals_counts, values: [] }
      { key: defaults.keys.SC_counts, values: [] }
      { key: defaults.keys.SC_dissent_counts, values: [] }
      { key: defaults.keys.appeals_dissent_counts, values: [] }
    ]

    for year in [@time.min..@time.max]
      case_counts       = data[year]?[0] || 0
      SC_counts         = data[year]?[1] || 0
      dissent_counts    = data[year]?[2] || 0
      SC_dissent_counts = data[year]?[3] || 0

      appeals_counts = case_counts - SC_counts
      appeals_dissent_counts = dissent_counts - SC_dissent_counts

      allCounts[0].values.push [ year, appeals_counts ]
      allCounts[1].values.push [ year, SC_counts ]
      allCounts[2].values.push [ year, -1 * SC_dissent_counts ]
      allCounts[3].values.push [ year, -1 * appeals_dissent_counts ]

    @generateBarChart(allCounts)
    @graph.api.refresh()

  @generateBarChart = (topicData) =>
    @graph.data = topicData

  return
