angular.module('ftlTopics')
.service "progressService", ($http) ->
  return obj =
    getNumber: (requestedNumber) ->
      $http({
        method: 'GET'
        url: "/progress/#{requestedNumber}"
        })
        .then (res) ->
          res.data
