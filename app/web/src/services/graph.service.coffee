angular.module('CAPmodule')
.service 'GraphService', (TopicService, DefaultsService) ->
  newLineDataObj = (key) ->
    values : []
    key : key
    area        : false
    strokeWidth : 1
    classed     : 'line-graph'

  newLineGraph = ->
    data : []
    options :
      color : DefaultsService.colors
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
            d3.format ',.2f'

  obj =
    defaults :
      time : DefaultsService.time
      colors: DefaultsService.colors

    lineGraph : ->
      newLineGraph()

    multiBarChart :
      options :
        color : DefaultsService.colors
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

    parseNgramData: (data) ->
      # count_per_year is {year:count, year:count...}
      count_per_year = {}
      tmp_results = {}
      all_words = []
      
      for word,val of data
        if word == 'ERROR'
          all_words['ERROR'] = val
          continue
        totals = val['total_country']
        single_word_result = newLineDataObj(word)
        for year,count of totals
          single_word_result.values.push {x:parseInt(year), y:count}

        all_words.push single_word_result
      return all_words

    parseLineChartData: (data, timeRange) ->
      for topicName,val of data
        singleTopicData = newLineDataObj(topicName)

        for year in [timeRange.min..timeRange.max]
          value = parseInt(val[year]) ||  0
          percent = if value > 0 then parseFloat((value / TopicService.totals[year])*100) else 0
          singleTopicData.values.push {x:year, y:percent}

      singleTopicData

    parseBarChartData: (data, timeRange) ->
      keys =
        appeals_counts         : "Appeal Court Cases"
        case_counts            : "Total Cases"
        SC_counts              : "Supreme Court Cases"
        dissent_counts         : "Total Dissents"
        SC_dissent_counts      : "Supreme Court Dissents"
        appeals_dissent_counts : "Appeals Court Dissents"

      allCounts = [
        { key: keys.appeals_counts, values: [] }
        { key: keys.SC_counts, values: [] }
        { key: keys.SC_dissent_counts, values: [] }
        { key: keys.appeals_dissent_counts, values: [] }
      ]

      for year in [timeRange.min..timeRange.max]
        case_counts       = data[year]?[0] || 0
        SC_counts         = data[year]?[1] || 0
        dissent_counts    = data[year]?[2] || 0
        SC_dissent_counts = data[year]?[3] || 0

        appeals_counts         = case_counts - SC_counts
        appeals_dissent_counts = dissent_counts - SC_dissent_counts

        allCounts[0].values.push [ year, appeals_counts ]
        allCounts[1].values.push [ year, SC_counts ]
        allCounts[2].values.push [ year, -1 * SC_dissent_counts ]
        allCounts[3].values.push [ year, -1 * appeals_dissent_counts ]

      return allCounts
