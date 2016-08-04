angular.module('CAPmodule')
.controller 'ProgressNumbersCtrl', (progressService) ->
  @numbers = {}
  d = new Date('2018')
  @numbers.date = "03/01/17"

  numbersToRequest = [
    'percentComplete'
    'pagesProcessed'
    'volumesProcessed'
    'metadataComplete'
    'metadataCompleteChange'
    'volumesProcessedChange'
    'pagesProcessedChange'
  ]

  self = @

  getNum = (num) ->
    progressService.getNumber(num)
    .then (res) ->
      self.numbers[res.name] = res.total

  getNumbers = -> getNum(num) for num in numbersToRequest

  setInterval(( ->  getNumbers()), 6000)
  setInterval(( -> getNum('casesProcessed')), 3000)

  getNumbers()
  getNum('casesProcessed')

  return
