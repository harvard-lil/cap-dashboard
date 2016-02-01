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
    index = @currentTopics.indexOf(topic)

    if @topics[topic].selected && index < 0
      @currentTopics.push topic
      addTopic topic

    else if not @topics[topic].selected && index > -1
      @currentTopics.splice(index, 1)
      removeTopic(topic)

  @reloadTopicData = ->
    data = []
    lineChartData = []
    TopicService
      .getManyTopics(@currentTopics)
      .then (response) =>
        for topicName, val of response
          data = {"#{topicName}":val}

          singletopic = GraphService.parseLineChartData(data, @time)
          singletopic.color = GraphService.defaults.colors[lineChartData.length - 1]
          lineChartData.push singletopic
        @generateChart lineChartData

  addLegendItem = (topic, color) ->
    underscored_topic = topic.split(' ').join('_')
    legendItem = """
      <div class="legend-item #{underscored_topic}">
        <div class="color-spot" style='background-color:#{color}'></div>
        <span class="item-title">
          #{topic}
        </span>

      </div>
    """
    $('.multi-topic-legend > .topic-legend-content').append legendItem

  removeLegendItem = (topic) ->
    underscored_topic = topic.split(' ').join('_')
    $('.multi-topic-legend > .topic-legend-content').find(".#{underscored_topic}").remove()

  addTopic = (topic) =>
    TopicService
      .getSingleTopic(topic)
      .then (response) =>

        if topic is 'Totals'
          data = {"#{topic}":response}
        else
          data = {"#{topic}":response.data}
        singletopic = GraphService.parseLineChartData(data, @time)
        lineChartData.push singletopic
        singletopic.color = GraphService.defaults.colors[lineChartData.length - 1]
        addLegendItem(topic, singletopic.color)
        @generateChart lineChartData

  removeTopic = (topic) =>
    for key,data of lineChartData
      if data.key is topic
        lineChartData.splice(key, 1)

        oldcolor = GraphService.defaults.colors.splice(key, 1)
        GraphService.defaults.colors.push oldcolor
        break

    removeLegendItem(topic)
    @generateChart lineChartData

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

  @generateChart = (data) =>
    @graph.data = data
    @graph.api.refresh()

  return
