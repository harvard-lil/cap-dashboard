templates_path = "../../templates/"
angular.module("CAPmodule", [
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
      resolve:
        scrollTop: ->
          $('html, body').animate({ scrollTop: 0 })


    .state "topics",
      url: "/topics"
      templateUrl: "#{templates_path}topic.dashboard.tpl.jade"
      resolve:
        setupTopics: (TopicService) ->
          TopicService.init()
        scrollTop: ->
          $('html, body').animate({ scrollTop: 0 })

    .state "topics.states",
      url: "/topics/:states"
      templateUrl: "#{templates_path}topic.dashboard.tpl.jade"
      resolve:
        scrollTop: ->
          $('html, body').animate({ scrollTop: 0 })

    .state "wordclouds",
      url: "/wordclouds"
      templateUrl: "#{templates_path}wordclouds.tpl.jade"
      resolve:
        scrollTop: ->
          $('html, body').animate({ scrollTop: 0 })

    .state "ngrams",
      url: "/ngrams"
      templateUrl: "#{templates_path}ngrams.tpl.jade"
      resolve:
        scrollTop: ->
          $('html, body').animate({ scrollTop: 0 })

    .state "limericks",
      url: "/limericks"
      templateUrl: "#{templates_path}limericks.tpl.jade"
      resolve:
        scrollTop: ->
          $('html, body').animate({ scrollTop: 0 })
