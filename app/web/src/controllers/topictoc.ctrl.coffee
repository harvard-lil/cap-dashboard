angular.module('ftlTopics')
.controller 'TopicTocCtrl', (TopicService) ->

  TopicService
    .getList()
    .then (response) =>
      @list = response
    , ->
      console.log "uh oh!"

  @viewTopicDetails = (topic) ->
    TopicService.currentTopic = topic
  return
