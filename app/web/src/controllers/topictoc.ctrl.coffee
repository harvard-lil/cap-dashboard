angular.module('ftlTopics')
.controller 'TopicTocCtrl', (TopicService) ->

  TopicService
    .getList()
    .then (response) =>
      @list = response.data
    , ->
      console.log "uh oh!"

  @viewTopicDetails = (topic) ->
    TopicService.currentTopic = topic
  return
