angular.module('CAPmodule')
.controller 'DashboardCtrl', ($http, $state, progressService) ->

  @gototopics = ->
    $state.go 'topics'
    return

  @gotowordclouds = ->
    $state.go 'wordclouds'
    return

  @gotolimericks = ->
    $state.go 'limericks'
    return

  @gotongrams = ->
    $state.go 'ngrams'
    return
  return
