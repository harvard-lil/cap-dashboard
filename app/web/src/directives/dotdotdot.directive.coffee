angular.module('CAPmodule')
.directive 'dotdotdot', ->
  obj =
    template: """
              <span class="dot dot-one"></span>
              <span class="dot dot-two"></span>
              <span class="dot dot-three"></span>
    """
    restrict: 'A'
    scope:
      showIf: "="
    link: (scope, element, attrs) ->
