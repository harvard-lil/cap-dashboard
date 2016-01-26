angular.module('ftlTopics')
.directive 'clickOff', ($window) ->
  scope:
    show: '='
    excluding: '@'

  link: (scope, element, attrs) ->
    $($window).on 'click', (evt) ->
      classToExclude = scope.excluding
      e = $(evt.target)

      return if $(element).css('display') is 'none'
      return if e.closest(element).length > 0
      return if e.hasClass classToExclude
      
      scope.$evalAsync ->
        scope.show = false
