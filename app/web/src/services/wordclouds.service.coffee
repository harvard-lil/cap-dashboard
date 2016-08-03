angular.module('CAPmodule')
.service 'WordcloudService', ($http) ->
  getAvailableStates: ->
    $http({
        method: 'GET'
        url: '/wordclouds/list-states'
      }).then (response) ->
        return response.data.states
  getWordclouds: (state) ->
    $http({
      method: 'GET'
      url: "/wordclouds/#{state}"
    }).then (response) ->
      return response.data.images
