angular.module('ftlTopics')
.directive 'usamap', ($compile, $rootScope, regionService) ->
  templateUrl: 'assets/img/usa-simple.svg'
  restrict: 'A'
  link: (scope, element, attrs) ->
    regions = element[0].querySelectorAll('.state')
    $rootScope.$on 'map.searchByRegion', (elem, searchByRegion) ->
      scope.searchByRegion = searchByRegion
      scope.toggleRegion = (el) ->
        console.log "toggleRegion directive", el
        regionService.toggleRegion(el)
        el.toggleClass('active')

      if searchByRegion
        element.find('.usa-map')
          .addClass('search-by-region')
          .removeClass('search-by-state')
          .find('.region')
          .attr('ng-click', 'toggleRegions()')

        element.find('.state').removeClass('selected')
      else
        element.find('.usa-map')
          .addClass('search-by-state')
          .removeClass('search-by-region')
          .find('.region')
          .removeAttr('ng-click')


.directive 'stateElement', ($compile, $window) ->
  obj=
    restrict: 'A'

    link: (scope, element, attrs) ->
      mapElement = angular.element('.usa-map')

      element.on 'click', ->
        element.toggleClass 'selected'

      element.removeAttr("state-element")

      $compile(element)(scope)

  return obj
