angular.module('ftlTopics')
.controller 'MapCtrl', ($rootScope) ->
  @toggleRegions = (searchByRegion) ->
    $rootScope.$broadcast 'map.searchByRegion', searchByRegion
  @toggleSelectAll = ->
    $rootScope.$broadcast 'map.toggleSelectAll'
  return
