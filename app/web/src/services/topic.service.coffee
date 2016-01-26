angular.module('ftlTopics')
.service "TopicService", ($http, $q) ->
  obj =
    currentTopic : "Water Rights"
    topics : []
    init : ->
      @getList()

    getList: ->
      $http({
        method: 'GET'
        url: "/topics/list"
        })
      .then (response) =>
        @topics = response.data
        response.data

    getSingleTopic: (topic) ->
      if topic is 'Totals'
        @getTotals()
          .then (response) ->
            return response
      else
        $http({
          method: 'GET',
          url: "/topic/#{topic}"
        }).then (response) ->
          return response.data

    getSeveralTopics: (topics) ->
      jsonTopic = JSON.stringify topics
      $http({
        method: 'GET'
        url: "/topics/"
        params:
          topics: jsonTopic
        })

    getTotals: ->
      $http({
        method: 'GET'
        url: "/topics/totals"
        }).then (response) =>
          @totals = response.data
          @totals
