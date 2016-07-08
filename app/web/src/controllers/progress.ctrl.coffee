angular.module('ftlTopics')
.controller 'ProgressCtrl', ->
  console.log "in progress ctrl"
  progress_nums =
    percent_complete:        40
    states_complete:         2
    total_number_processed:  78984393
    total_pages_processed:   123423
    total_volumes_processed: 1243
    total_cases_processed:   5434
    

  return
