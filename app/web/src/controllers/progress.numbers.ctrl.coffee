angular.module('CAPmodule')
.controller 'ProgressNumbersCtrl', (progressService) ->
  @numbers = {}
  d = new Date('2018')
  @numbers.date = "01/01/17"

  numbersToRequest = [
    'total_percent',
    'pages',
    'volumes',
    'cases',
    'metadata',
    'metadata_change'
    'volumes_change'
    'pages_change'
  ]

  self = @
  getNumbers = ->
    for num in numbersToRequest
      progressService.getNumber(num)
        .then (res) ->
          self.numbers[res.name] = res.total

  setInterval ->
    getNumbers()
  , 60000

  getNumbers()

  return
