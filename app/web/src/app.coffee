angular.module('myApp', [
  'templates-main'
  'ui.router'
  'nvd3'
  ])
.config ($stateProvider, $urlRouterProvider, $httpProvider) ->
  console.log "in config, woo"

  $stateProvider
    .state 'dashboard',
      controller: 'DashboardCtrl'
      views:
        '@':
          templateUrl: '../../templates/dashboard.tpl.jade'
        'single-topic@dashboard':
          templateUrl: '../../templates/single-topic.tpl.jade'
        'multi-topics@dashboard':
          templateUrl: '../../templates/multi-topics.tpl.jade'
  return
