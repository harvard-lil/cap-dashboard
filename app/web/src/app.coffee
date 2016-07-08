templates_path = "../../templates/"
angular.module('ftlTopics', [
  'templates-main'
  'ui.router'
  'nvd3'
  ])
.config ($stateProvider, $urlRouterProvider, $httpProvider) ->

  $stateProvider
    .state 'dashboard',
      controller: 'DashboardCtrl'
      templateUrl: "#{templates_path}dashboard.tpl.jade"
    .state 'topics',
      url: '/state/:stateName'
      controller: 'TopicDashboardCtrl'
      templateUrl: "#{templates_path}topic.dashboard.tpl.jade"
      resolve:
        setupTopics: (TopicService) ->
          TopicService.init()

    return
