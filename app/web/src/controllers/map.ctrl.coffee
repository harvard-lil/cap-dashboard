angular.module('CAPmodule')
.controller 'MapCtrl', ($rootScope, TopicService) ->
  @toggleRegions = (searchByRegion) ->
    $rootScope.$broadcast 'map.searchByRegion', searchByRegion
  @toggleSelectAll = ->
    $rootScope.$broadcast 'map.toggleSelectAll'
  @reset = ->
      $rootScope.$broadcast 'map.clearAll'
  return
