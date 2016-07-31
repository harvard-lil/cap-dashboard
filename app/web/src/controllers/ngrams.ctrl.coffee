angular.module('CAPmodule')
.controller 'NgramsCtrl', (NgramsService, GraphService) ->
  @words = ''
  @graph  = GraphService.lineGraph()
  @graph.options.chart.yAxis.tickFormat = d3.format '1'

  @findWords = ->
    words = @words.split(/[ ,]+/)
    NgramsService
      .getWords(words)
      .then (response) =>
        @data = response.result
        @generateChart @data

  @generateChart = (data) =>
    ngrams = GraphService.parseNgramData(data)
    return if !ngrams
    @graph.data = ngrams
    @graph.api?.refresh()
    @showGraph = true
    return


  return
