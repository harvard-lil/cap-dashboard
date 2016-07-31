angular.module('CAPmodule')
.directive 'alignMiddle', ->
  link: (scope, element, attrs) ->
    table = $(element).closest('.table-responsive')
    tableMarginTop = Math.round( ($(element).height() - $(table).height()) / 2 );
    $('table').css('margin-top', tableMarginTop - 70) # with jQuery
