angular.module('ftlTopics')
.controller 'MultiTopicCtrl', ($window, TopicService, GraphService) ->
  # all topics, with selection status
  @topics        = {}

  # current selected topics
  @currentTopics = []

  topicsExist    = false

  @graph         = GraphService.lineGraph
  defaults       = GraphService.defaults
  @time          = angular.copy GraphService.defaults.time

  lineChartData = []
  @parseSelectedTopicData = (topic) ->
    # check for
    index = @currentTopics.indexOf(topic)
    # if topic == 'totals'
    if @topics[topic].selected && index < 0
      @currentTopics.push topic
      addTopic topic

    else if not @topics[topic].selected && index > -1
      @currentTopics.splice(index, 1)
      removeTopic(topic)

  addTopic = (topic) =>
    TopicService
      .getSingleTopic(topic)
      .then (response) =>
        console.log "getting response?", response
        if topic is 'Totals'
          data = {"#{topic}":response}
        else
          data = {"#{topic}":response.data}
        singletopic = GraphService.parseLineChartData(data, @time)
        singletopic.color = GraphService.defaults.colors[lineChartData.length - 1]

        lineChartData.push singletopic
        @generateBarChart lineChartData

  removeTopic = (topic) =>
    for key,data of lineChartData
      if data.key is topic
        lineChartData.splice(key, 1)

    @generateBarChart lineChartData

  init = =>
    return if topicsExist
    @topics['Totals'] = { selected : true }
    for t,val of TopicService.topics
      @topics[t] = { selected : false }
      topicsExist = true

    @parseSelectedTopicData('Totals')

  init()



  @toggleTopic = (topic) ->
    @topics[topic].selected = !@topics[topic].selected
    @parseSelectedTopicData(topic)

  @generateBarChart = (data) =>
    @graph.data = data
    @graph.api.refresh()

  return
