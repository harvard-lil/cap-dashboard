angular.module('myApp')
.service 'GraphService', ->
  colors = ["#0075FF", "#2F2F2F", "#D9D9D9", "#D2E7FF", "#ECA633", "#78B6FF", "#7ED321"]
  obj =
    defaults :
      minYear : 1850
      maxYear : 2000
      colors  : colors
    lineGraph :
      data : {}
      options :
        color : colors
        chart:
          useInteractiveGuideline: true
          lineChartWithFocus : true
          showLegend: false
          type: 'lineChart',
          height: 450,
          margin:
            top: 20
            right: 20
            bottom: 60
            left: 55
          x: (d) -> return d.x
          y: (d) -> return d.y

          transitionDuration: 500
          yAxis:
            tickFormat:
              d3.format ',.0f'
