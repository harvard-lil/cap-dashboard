angular.module('ftlTopics')
.controller 'ProgressOverviewCtrl', ->
  console.log "Progress overview controller"
  @complete =
    percent:  10
    states:   17
    regions:  13
    metadata: 14

  return
