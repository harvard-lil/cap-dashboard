angular.module('myApp')
.service "TopicService", ($http) ->
  obj =
    currentTopic : null
    topics : []

    getList: ->
      $http({
        method: 'GET'
        url: "/topics/list"
        })
      .then (response) =>
        @topics = response.data
        console.log "setting topics:", @topics
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
