angular.module('CAPmodule')
.service 'NgramsService', ($http) ->
  getWords: (words) ->
    $http({
      method: 'GET'
      url: "/ngrams"
      params:
        words: words
      })
    .then (response) ->
      return response.data
