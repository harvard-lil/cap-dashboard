angular.module('CAPmodule')
.controller 'DashboardCtrl', ($http, $state, progressService) ->

  @gototopics = ->
    $state.go 'topics'
    return
  @gotowordclouds = ->
    $state.go 'wordclouds'
    return

  @gotongrams = ->
    $state.go 'ngrams'
    return
  return
