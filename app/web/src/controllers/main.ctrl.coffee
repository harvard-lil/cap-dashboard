angular.module('myApp')
.controller 'MainCtrl', ($state) ->
  $state.go("dashboard")
  return
