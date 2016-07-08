angular.module('ftlTopics')
.controller 'TopicDashboardCtrl', ($http, $state) ->

  defaults =
    minYear : 2000
    maxYear : 2015
    colors  :
      case_counts       : 'rgba(0, 117, 255, 1)'
      SC_counts         : 'rgba(107, 199, 7, 1)'
      dissent_counts    : "rgba(217, 217, 217, 1)"
      SC_dissent_counts : "rgba(255, 240, 0, 1)"

  console.log $state.params

  return
