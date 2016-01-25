angular.module('ftlTopics')
.service "TopicService", ($http) ->
  obj =
    currentTopic : "Water Rights"
    topics : []

    getList: ->
      $http({
        method: 'GET'
        url: "/topics/list"
        })
      .then (response) =>
        @topics = response.data
        response

    getSingleTopic: (topic) ->
      $http({
        method: 'GET',
        url: "/topic/#{topic}"
      })

    getSeveralTopics: (topics) ->
      jsonTopic = JSON.stringify topics
      $http({
        method: 'GET'
        url: "/topics/"
        params:
          topics: jsonTopic
        })
