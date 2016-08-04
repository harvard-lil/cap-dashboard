angular.module('CAPmodule')
.service 'DefaultsService', ->
  obj =
    colors: [
      "#0075FF"
      "#D9D9D9"
      "#D2E7FF"
      "#ECA633"
      "#78B6FF"
      "#7ED321"
    ]

    time:
      min : 1850
      max : 2014

  return obj
