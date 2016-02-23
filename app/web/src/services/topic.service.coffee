angular.module('ftlTopics')
.service "TopicService", ($http, $q) ->
  obj =
    currentTopic : "Water Rights"
    topics : []
    init : ->
      @getList()
        .then (list) =>
          # sort most popular topics
          sorted = Object.keys(list).sort (a, b) ->
            return list[b][0] - list[a][0]
          topTopics = []
          topTopics.push([s, list[s]]) for s in sorted
          @topTopics = topTopics
          @getTotals()


    getList: ->
      $http({
        method: 'GET'
        url: "/topics/list"
        })
      .then (response) =>
        @topics = response.data
        response.data

    getSingleTopic: (topic) ->
      if topic is 'Total Count'
        @getTotals()
          .then (response) ->
            return response
      else
        $http({
          method: 'GET',
          url: "/topic/#{topic}"
        }).then (response) ->
          return response.data

    getManyTopics: (topics) ->
      jsonTopic = JSON.stringify topics
      $http({
        method: 'GET'
        url: "/topics/"
        params:
          topics: jsonTopic
        })
      .then (response) ->
        return response.data

    getTotals: ->
      $http({
        method: 'GET'
        url: "/topics/totals"
        }).then (response) =>
          @totals = response.data
          @totals
