templates_path = "../../templates/"
angular.module("ftlTopics", [
  "templates-main"
  "ui.router"
  "nvd3"
  ])
.config ($stateProvider, $urlRouterProvider) ->
  $stateProvider
    .state "dashboard",
      url: ''
      controller: "DashboardCtrl"
      templateUrl: "#{templates_path}dashboard.tpl.jade"
    .state "topics",
      url: "/topics"
      templateUrl: "#{templates_path}topic.dashboard.tpl.jade"
      resolve:
        setupTopics: (TopicService) ->
          TopicService.init()
    .state "topics.states",
      url: "/topics/:states"
      templateUrl: "#{templates_path}topic.dashboard.tpl.jade"
    .state "wordclouds",
      url: "/wordclouds"
      templateUrl: "#{templates_path}wordclouds.tpl.jade"
    .state "ngrams",
      url: "/ngrams"
      templateUrl: "#{templates_path}ngrams.tpl.jade"
