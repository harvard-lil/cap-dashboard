templates_path = "../../templates/"
angular.module('ftlTopics', [
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
          templateUrl: "#{templates_path}dashboard.tpl.jade"

        'main-toc@dashboard':
          templateUrl: "#{templates_path}main-toc.tpl.jade"

        'topic-toc-container@dashboard':
          templateUrl:  "#{templates_path}topic-toc-container.tpl.jade"

        'single-topic@dashboard':
          templateUrl: "#{templates_path}single-topic.tpl.jade"
          
        'multi-topics@dashboard':
          templateUrl: "#{templates_path}multi-topics.tpl.jade"
  return
