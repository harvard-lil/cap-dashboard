angular.module('CAPmodule')
.controller 'LimericksCtrl', (LimerickService) ->
  LimerickService.getList()
  @generate = ->
    LimerickService.getLimerick()
      .then (res) =>
        @limerick = res.limerick

  @generate()
  return
