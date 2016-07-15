angular.module('ftlTopics')
.controller 'DashboardCtrl', ($http, $state, progressService) ->

  @gototopics = ->
    $state.go 'topics'
    return

  return
