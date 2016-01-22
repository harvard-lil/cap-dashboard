angular.module('myApp', ['ui.router'])
.config ($stateProvider, $urlRouterProvider, $httpProvider) ->
  console.log "in config, woo"
  $stateProvider
    .state 'dashboard',
      template: "<div>HELLO</div>"
      url: "/"
      controller: ->
        console.log "HELLO dashboard"
    .state 'single-topic'
    .state 'compare-topics'
