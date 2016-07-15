angular.module('ftlTopics')
.controller 'ProgressOverviewCtrl', (progressService) ->
  self = @
  @complete = {}
  numbersToRequest = [
    'total_percent', 'states_percent', 'regions_percent', 'metadata_percent' ]

  getNumbers = ->
    for num in numbersToRequest
      progressService.getNumber(num)
        .then (res) ->
          self.complete[res.name] = parseInt(res.total)

  setInterval ->
    getNumbers()
  , 5000

  getNumbers()

  return
