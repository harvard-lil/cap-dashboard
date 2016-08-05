angular.module('CAPmodule')
.controller 'LimericksCtrl', (LimerickService) ->
  LimerickService.getList()
    .then =>
      @generate()

  @generate = ->
    LimerickService.getLimerick()
      .then (res) =>
        @limerick = res.limerick


  return
