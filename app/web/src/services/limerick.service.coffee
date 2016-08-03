angular.module('CAPmodule')
.service 'LimerickService', ($http) ->
  getLimerick: ->
    $http({
        method: 'GET'
        url: '/limerick'
      }).then (response) ->
        return response.data
  getList: ->
    $http({
        method: 'GET'
        url: '/limerick/all'
      }).then (response) ->
        return response.data.limerick
