angular.module('CAPmodule')
.directive 'usamap', ($compile, $rootScope, regionAndStateService) ->
  templateUrl: 'assets/img/usa-simple.svg'
  restrict: 'A'
  link: (scope, element, attrs) ->
    usamap = element.find '.usa-map'
    $rootScope.$on 'map.clearAll', ->
      regionAndStateService.clearAll()
      usamap
        .removeClass('search-by-state')
        .removeClass('search-by-region')
        .removeClass('select-all')

    $rootScope.$on 'map.toggleSelectAll', ->
      regionAndStateService.selectAll = !regionAndStateService.selectAll
      if regionAndStateService.selectAll
        usamap.removeClass('search-by-region').removeClass('search-by-state')
        
      usamap.toggleClass('select-all')

    $rootScope.$on 'map.searchByRegion', (elem, searchByRegion) ->
      scope.searchByRegion = searchByRegion
      scope.toggleRegion = (el) ->
        regionElement = angular.element el.parent()
        regionName = el.attr('region')
        regionElement.toggleClass('active')
        regionAndStateService.toggleRegion(regionName)

      if searchByRegion
        usamap
          .addClass('search-by-region')
          .removeClass('search-by-state')
          .removeClass('select-all')
          .find('.state')
          .on 'click', (evt) ->
            el = angular.element this
            scope.toggleRegion el

        element.find('.state').removeClass('selected')
      else
        usamap
          .addClass('search-by-state')
          .removeClass('search-by-region')
          .removeClass('select-all')
        regionAndStateService.clearRegions()

.directive 'stateElement', ($compile, $window, regionAndStateService) ->
  obj=
    restrict: 'A'

    link: (scope, element, attrs) ->
      stateName  = element.attr('title')
      usamap = angular.element('.usa-map')
      element.on 'click', ->
        if usamap.hasClass('search-by-state')
          element.toggleClass 'selected'
          if element.hasClass 'selected'
            regionAndStateService.states.push stateName
          else
            idx = regionAndStateService.states.indexOf stateName
            regionAndStateService.states.splice(idx, 1)

      element.removeAttr("state-element")

      $compile(element)(scope)

  return obj
