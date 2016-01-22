# min 1850
# max 2015
angular.module('myApp', ['ui.router'])
.controller 'MainCtrl', ($http) ->
  defaults =
    minYear : 2000
    maxYear : 2015
    colors  :
      case_counts       : 'rgba(0, 117, 255, 1)'
      SC_counts         : 'rgba(107, 199, 7, 1)'
      dissent_counts    : "rgba(217, 217, 217, 1)"
      SC_dissent_counts : "rgba(255, 240, 0, 1)"


  $http({
    method: 'GET',
    url: '/topic/custody'
  })
  .then (response) =>
    parsedData = this.parseTopicData(response.data)
    this.generateBarChart(parsedData)

  , (response) ->
    console.log "something bad"

  this.parseTopicData = (data) ->
    allCounts =
      case_counts       : []
      SC_counts         : []
      dissent_counts    : []
      SC_dissent_counts : []

    for year in [defaults.minYear..defaults.maxYear]
      allCounts.case_counts.push data[year]?[0] || 0
      allCounts.SC_counts.push data[year]?[1] || 0
      allCounts.dissent_counts.push data[year]?[2] || 0
      allCounts.SC_dissent_counts.push data[year]?[3] || 0

    allCounts

  this.generateBarChart = (topicData) ->
    barChartData =
      labels  : [defaults.minYear..defaults.maxYear]
      datasets: []

    for d,val of topicData
      count = {}
      count.fillColor       = defaults.colors[d]
      count.strokeColor     = defaults.colors[d]
      count.highlightFill   = 'rgba(220,220,220,1)'
      count.highlightStroke = 'rgba(220,220,220,1)'
      count.data = topicData[d]
      count.stacked = true
      barChartData.datasets.push count


    ctx = document.getElementById("canvas").getContext("2d");
    window.myBar = new Chart(ctx).Bar barChartData,
    responsive : true
  return
