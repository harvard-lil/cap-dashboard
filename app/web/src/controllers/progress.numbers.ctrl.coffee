angular.module('ftlTopics')
.controller 'ProgressNumbersCtrl', (progressService) ->
  @numbers = {}
  d = new Date('2018')
  @numbers.date = "#{d.getMonth()}/#{d.getDate()}/#{d.getYear()}"
  numbersToRequest = [
    'percent', 'pages', 'records', 'volumes', 'cases' ]

  self = @
  getNumbers = ->
    for num in numbersToRequest
      progressService.getNumber(num)
        .then (res) ->
          self.numbers[res.name] = parseInt(res.total)

  setInterval ->
    getNumbers()
  , 5000

  getNumbers()

  return
