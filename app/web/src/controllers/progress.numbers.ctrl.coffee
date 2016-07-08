angular.module('ftlTopics')
.controller 'ProgressNumbersCtrl', ->
  console.log "Progress numbers controller"
  @numbers =
    percent: 40
    date:    "10/25/2016"
    pages:   18865997
    records: 772265
    volumes: 196825
    cases:   20618901
  return
