angular.module('ftlTopics')
.controller 'MainCtrl', ($state) ->
  $state.go("dashboard")
  return
