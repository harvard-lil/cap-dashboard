angular.module('ftlTopics')
.directive 'svgMap', ($compile) ->
  templateUrl: 'assets/img/usa.svg'
  restrict: 'A'
  link: (scope, element, attrs) ->
      regions = element[0].querySelectorAll('.state')
      angular.forEach regions, (path, key) ->
        regionElement = angular.element(path)
        regionElement.attr("region", "")
        regionElement.attr("dummy-data", "dummyData")
        regionElement.attr("hover-region", "hoverRegion")
        $compile(regionElement)(scope)

.directive 'stateElement', ($compile, $state) ->
  restrict: 'A'
  scope:
    hoverRegion: "="
  link: (scope, element, attrs) ->
    # scope.elementId = element.attr("id")
    scope.regionClick = ->
      $state.go('dashboard',{stateName:element.attr('title')})
      console.log "clicking region:",element.attr('title')
    # scope.regionMouseOver = ->
    #   console.log 'hovering on ',element.attr('title')

    element.attr("ng-click", "regionClick()")
    # element.attr("ng-mouseover", "regionMouseOver()")
    element.removeAttr("state-element")
    $compile(element)(scope)
