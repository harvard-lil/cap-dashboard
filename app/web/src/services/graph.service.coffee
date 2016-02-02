angular.module('ftlTopics')
.service 'GraphService', ->
  colors = ["#0075FF", "#2F2F2F", "#D9D9D9", "#D2E7FF", "#ECA633", "#78B6FF", "#7ED321"]
  obj =
    defaults :
      time :
        min : 1850
        max : 2014
      colors  : colors

    lineGraph :
      data : {}
      options :
        color : colors
        chart :
          useInteractiveGuideline: true
          lineChartWithFocus : true
          showLegend: false
          type: 'lineChart'
          height: 450
          margin:
            top   : 20
            right : 20
            bottom: 60
            left  : 55
          x: (d) -> return d.x
          y: (d) -> return d.y

          transitionDuration: 500
          yAxis:
            tickFormat:
              d3.format ',.0f'
    multiBarChart :
      options :
        color : colors
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
            tickFormat:
              d3.format ',.0f'
      config :
        visible: true
        extended: false
        disabled: false
        refreshDataOnly: true
        deepWatchOptions: true
        deepWatchData: true
        deepWatchDataDepth: 1
        debounce: 10

    parseLineChartData: (data, timeRange) ->
      for topicName,val of data
        singleTopicData =
          values      : []
          key         : topicName
          area        : false
          strokeWidth : 1
          classed     : 'line-graph'

        for year in [timeRange.min..timeRange.max]
          singleTopicData.values.push {x:year, y: parseInt(val[year]) ||  0}

      singleTopicData
