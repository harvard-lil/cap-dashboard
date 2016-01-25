angular.module('myApp')
.controller 'TopicCtrl', ($scope, TopicService) ->
  @minYear = 1850
  @maxYear = 2014

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
    minYear: @minYear
    maxYear: @maxYear

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

    for year in [@minYear..@maxYear]
      allCounts[0].values.push [year, (data[year]?[0] || 0)]
      allCounts[1].values.push [year, (data[year]?[1] || 0)]
      allCounts[2].values.push [year, (-1 * data[year]?[2] || 0)]
      allCounts[3].values.push [year, (-1 * data[year]?[3] || 0)]

    @generateBarChart(allCounts)
    @api.refresh()

  @config =
    visible: true
    extended: false
    disabled: false
    refreshDataOnly: true
    deepWatchOptions: true
    deepWatchData: true
    deepWatchDataDepth: 1
    debounce: 10

  @generateBarChart = (topicData) =>
    @data = topicData
    @options =
      color : defaults.colors
      chart:
        showLegend: false
        stacked:true
        type: 'multiBarChart',
        height: 450,
        margin :
            top: 20,
            right: 20,
            bottom: 60,
            left: 55
        x: (d) -> return d[0]
        y: (d) -> return d[1]

        transitionDuration: 500
        yAxis:
          axisLabel: 'counts',
          tickFormat:
            d3.format ',.0f'



  return
