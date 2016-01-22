angular.module('myApp', [
  'templates-main'
  'ui.router'
  ])
.config ($stateProvider, $urlRouterProvider, $httpProvider) ->
  console.log "in config, woo"

  $stateProvider
    .state 'dashboard',
      templateUrl: '../../templates/dashboard.tpl.jade'
      controller: ->
        console.log "HELLO dashboard"
        return
    # .state 'single-topic'
    # .state 'compare-topics'
  return
