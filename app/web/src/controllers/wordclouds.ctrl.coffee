angular.module('CAPmodule')
.controller 'WordcloudsCtrl', (WordcloudService) ->
  @states = []
  WordcloudService.getAvailableStates()
    .then (res) =>
      @states = res

  @selectState = (state) ->
    @currentState = state
    WordcloudService.getWordclouds(state)
      .then (images) =>
        @images = images

  @currentState = 'California'
  @selectState(@currentState)
  return
