angular.module('CAPmodule')
.controller 'TopicTocCtrl', (TopicService) ->

  @list = TopicService.topTopics

  @viewTopicDetails = (topic) ->
    TopicService.currentTopic = topic
  return
