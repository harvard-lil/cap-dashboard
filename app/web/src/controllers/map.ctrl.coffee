angular.module('ftlTopics')
.controller 'MapCtrl', ($http) ->
  console.log "map controller"
  @regionClick = ->
    console.log "clicked!"

  return
