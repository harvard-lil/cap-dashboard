angular.module('myApp')
.service "TopicService", ($http) ->
  console.log "HELLO"
  obj =
    getSingleTopic: (topic) ->
      $http({
        method: 'GET',
        url: "/topic/#{topic}"
      })
    getSeveralTopics: (topics) ->
      $http({
        method: 'GET'
        url: "/topics/"
        params:
          topics: JSON.stringify(topics)
        })
