angular.module('ftlTopics')
.controller 'DashboardCtrl', ($http, $state) ->
  console.log 'dashboardctrl'
  @gototopics = ->
    console.log "going to topics"

    $state.go('topics')
    return
  return
