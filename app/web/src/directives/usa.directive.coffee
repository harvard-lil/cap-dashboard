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
        regionService.toggleRegion
      if searchByRegion
        element.find('.usa-map')
          .addClass('search-by-region')
          .removeClass('search-by-state')
          .find('.region')
          .attr('ng-click', 'toggleRegions()')
      else
        element.find('.usa-map')
          .addClass('search-by-state')
          .removeClass('search-by-region')
          .find('.region')
          .removeAttr('ng-click')

    angular.forEach regions, (path, key) ->
      regionElement = angular.element(path)

      regionElement.attr("search-by-region", "searchByRegion")
      $compile(regionElement)(scope)

.directive 'stateElement', ($compile, $window) ->
  obj=
    restrict: 'A'
    scope:
      searchByRegion: "="

    link: (scope, element, attrs) ->
      scope.$watch 'searchByRegion', ->
        return
      , (oldVal, newVal) ->
        console.log "watching searchByRegion", oldVal, newVal
      # scope.regionClick()
      scope.stateClick = ->
        element.toggleClass('selected')
        console.log element.attr('title')
        return

      scope.stateMouseOver = ->
        element.addClass('active')
        return

      scope.stateMouseOff = ->
        element.removeClass('active')
        return
      mapElement = $('usa-map')
      if mapElement.hasClass 'search-by-state'
        element.attr("ng-click", "stateClick()")
        element.attr("ng-mouseover", "stateMouseOver()")
        element.attr("ng-mouseleave", "stateMouseOff()")
      element.removeAttr("state-element")
      $compile(element)(scope)

  return obj
