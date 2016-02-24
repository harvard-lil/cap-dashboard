(function() {
  var templates_path;

  templates_path = "../../templates/";

  angular.module('ftlTopics', ['templates-main', 'ui.router', 'nvd3']).config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider.state('dashboard', {
      controller: 'DashboardCtrl',
      templateUrl: templates_path + "dashboard.tpl.jade",
      resolve: {
        setupTopics: function(TopicService) {
          return TopicService.init();
        }
      }
    });
  });

}).call(this);

(function() {
  angular.module('ftlTopics').controller('DashboardCtrl', function($http) {
    var defaults;
    defaults = {
      minYear: 2000,
      maxYear: 2015,
      colors: {
        case_counts: 'rgba(0, 117, 255, 1)',
        SC_counts: 'rgba(107, 199, 7, 1)',
        dissent_counts: "rgba(217, 217, 217, 1)",
        SC_dissent_counts: "rgba(255, 240, 0, 1)"
      }
    };
  });

}).call(this);

(function() {
  angular.module('ftlTopics').controller('MainCtrl', function($state) {
    $state.go("dashboard");
  });

}).call(this);

(function() {
  angular.module('ftlTopics').controller('MultiTopicCtrl', function($window, TopicService, GraphService) {
    var addLegendItem, addTopic, defaults, init, lineChartData, removeLegendItem, removeTopic, topicsExist;
    this.topics = {};
    this.currentTopics = [];
    topicsExist = false;
    this.graph = GraphService.lineGraph;
    defaults = GraphService.defaults;
    this.time = angular.copy(GraphService.defaults.time);
    lineChartData = [];
    this.parseSelectedTopicData = function(topic) {
      var index;
      index = this.currentTopics.indexOf(topic);
      if (this.topics[topic].selected && index < 0) {
        this.currentTopics.push(topic);
        return addTopic(topic);
      } else if (!this.topics[topic].selected && index > -1) {
        this.currentTopics.splice(index, 1);
        return removeTopic(topic);
      }
    };
    this.reloadTopicData = function() {
      var data;
      data = [];
      lineChartData = [];
      return TopicService.getManyTopics(this.currentTopics).then((function(_this) {
        return function(response) {
          var obj, singletopic, topicName, val;
          for (topicName in response) {
            val = response[topicName];
            data = (
              obj = {},
              obj["" + topicName] = val,
              obj
            );
            singletopic = GraphService.parseLineChartData(data, _this.time);
            singletopic.color = GraphService.defaults.colors[lineChartData.length - 1];
            lineChartData.push(singletopic);
          }
          return _this.generateChart(lineChartData);
        };
      })(this));
    };
    this.reset = function() {
      var ref, ref1, topic, val;
      ref = this.topics;
      for (topic in ref) {
        val = ref[topic];
        if (val.selected) {
          removeTopic(topic);
          val.selected = false;
        }
      }
      this.currentTopics = [];
      if ((ref1 = this.graph.api) != null) {
        ref1.refresh();
      }
      this.showGraph = false;
    };
    addLegendItem = function(topic, color) {
      var legendItem, underscored_topic;
      underscored_topic = topic.split(' ').join('_');
      legendItem = "<div class=\"legend-item " + underscored_topic + "\">\n  <div class=\"color-spot\" style='background-color:" + color + "'></div>\n  <span class=\"item-title\">\n    " + topic + "\n  </span>\n\n</div>";
      return $('.multi-topics-container').find('.topic-legend-content').append(legendItem);
    };
    removeLegendItem = function(topic) {
      var underscored_topic;
      underscored_topic = topic.split(' ').join('_');
      return $('.multi-topic-legend > .topic-legend-content').find("." + underscored_topic).remove();
    };
    addTopic = (function(_this) {
      return function(topic) {
        return TopicService.getSingleTopic(topic).then(function(response) {
          var data, obj, singletopic;
          data = (
            obj = {},
            obj["" + topic] = response.data,
            obj
          );
          singletopic = GraphService.parseLineChartData(data, _this.time);
          lineChartData.push(singletopic);
          singletopic.color = GraphService.defaults.colors[lineChartData.length - 1];
          addLegendItem(topic, singletopic.color);
          return _this.generateChart(lineChartData);
        });
      };
    })(this);
    removeTopic = (function(_this) {
      return function(topic) {
        var data, key, oldcolor;
        for (key in lineChartData) {
          data = lineChartData[key];
          if (data.key === topic) {
            lineChartData.splice(key, 1);
            oldcolor = GraphService.defaults.colors.splice(key, 1);
            GraphService.defaults.colors.push(oldcolor);
            break;
          }
        }
        removeLegendItem(topic);
        return _this.generateChart(lineChartData);
      };
    })(this);
    init = (function(_this) {
      return function() {
        var ref, results, t, val;
        if (topicsExist) {
          return;
        }
        ref = TopicService.topics;
        results = [];
        for (t in ref) {
          val = ref[t];
          _this.topics[t] = {
            selected: false
          };
          results.push(topicsExist = true);
        }
        return results;
      };
    })(this);
    init();
    this.toggleTopic = function(topic) {
      this.topics[topic].selected = !this.topics[topic].selected;
      return this.parseSelectedTopicData(topic);
    };
    this.generateChart = (function(_this) {
      return function(data) {
        var ref;
        if (!data) {
          return;
        }
        _this.graph.data = data;
        if ((ref = _this.graph.api) != null) {
          ref.refresh();
        }
        _this.showGraph = true;
      };
    })(this);
  });

}).call(this);

(function() {
  angular.module('ftlTopics').controller('TopicCtrl', function($scope, TopicService, GraphService) {
    this.time = angular.copy(GraphService.defaults.time);
    this.graph = GraphService.multiBarChart;
    this.topics = TopicService.topics;
    $scope.$watch(function() {
      return TopicService.currentTopic;
    }, (function(_this) {
      return function(newval, oldval) {
        if (newval === oldval) {
          return;
        }
        return _this.getTopicData(newval);
      };
    })(this));
    this.getTopicData = function(topic) {
      return TopicService.getSingleTopic(topic).then((function(_this) {
        return function(response) {
          var allCounts;
          _this.parseTopicKeywords(response.keywords);
          _this.currentTopic = topic;
          _this.data = response.data;
          allCounts = GraphService.parseBarChartData(response.data, _this.time);
          _this.generateBarChart(allCounts);
        };
      })(this), function(response) {
        return console.log("something went wrong");
      });
    };
    this.changeCurrentTopic = function(topic) {
      return TopicService.currentTopic = topic;
    };
    this.getTopicData(TopicService.currentTopic);
    this.parseTopicData = (function(_this) {
      return function() {
        var counts;
        counts = GraphService.parseBarChartData(_this.data, _this.time);
        return _this.generateBarChart(counts);
      };
    })(this);
    this.parseTopicKeywords = function(keywords) {
      this.topicKeywords = keywords;
      return this.topicKeywords;
    };
    this.generateBarChart = function(allCounts) {
      var ref;
      if (!allCounts) {
        return;
      }
      this.graph.data = allCounts;
      if ((ref = this.graph.api) != null) {
        ref.refresh();
      }
    };
  });

}).call(this);

(function() {
  angular.module('ftlTopics').controller('TopicTocCtrl', function(TopicService) {
    this.list = TopicService.topTopics;
    this.viewTopicDetails = function(topic) {
      return TopicService.currentTopic = topic;
    };
  });

}).call(this);

(function() {
  angular.module('ftlTopics').directive('alignMiddle', function() {
    return {
      link: function(scope, element, attrs) {
        var table, tableMarginTop;
        table = $(element).closest('.table-responsive');
        tableMarginTop = Math.round(($(element).height() - $(table).height()) / 2);
        return $('table').css('margin-top', tableMarginTop - 70);
      }
    };
  });

}).call(this);

(function() {
  angular.module('ftlTopics').directive('clickOff', function($window) {
    return {
      scope: {
        show: '=',
        excluding: '@'
      },
      link: function(scope, element, attrs) {
        return $($window).on('click', function(evt) {
          var classToExclude, e;
          classToExclude = scope.excluding;
          e = $(evt.target);
          if ($(element).css('display') === 'none') {
            return;
          }
          if (e.closest(element).length > 0) {
            return;
          }
          if (e.hasClass(classToExclude)) {
            return;
          }
          return scope.$evalAsync(function() {
            return scope.show = false;
          });
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('ftlTopics').service('DefaultsService', function() {
    var obj;
    return obj = {
      colors: ["#0075FF", "#D9D9D9", "#D2E7FF", "#ECA633", "#78B6FF", "#7ED321"],
      time: {
        min: 1850,
        max: 2014
      }
    };
  });

}).call(this);

(function() {
  angular.module('ftlTopics').service('GraphService', function(TopicService, DefaultsService) {
    var obj;
    return obj = {
      defaults: {
        time: DefaultsService.time,
        colors: DefaultsService.colors
      },
      lineGraph: {
        data: [],
        options: {
          color: DefaultsService.colors,
          chart: {
            useInteractiveGuideline: true,
            lineChartWithFocus: true,
            showLegend: false,
            type: 'lineChart',
            height: 450,
            margin: {
              top: 20,
              right: 20,
              bottom: 60,
              left: 55
            },
            x: function(d) {
              return d.x;
            },
            y: function(d) {
              return d.y;
            },
            transitionDuration: 500,
            yAxis: {
              tickFormat: d3.format(',.2f')
            }
          }
        }
      },
      multiBarChart: {
        options: {
          color: DefaultsService.colors,
          chart: {
            showLegend: false,
            stacked: true,
            type: 'multiBarChart',
            height: 450,
            margin: {
              top: 20,
              right: 20,
              bottom: 60,
              left: 55
            },
            x: function(d) {
              return d[0];
            },
            y: function(d) {
              return d[1];
            },
            transitionDuration: 500,
            yAxis: {
              tickFormat: d3.format(',.0f')
            }
          }
        },
        config: {
          visible: true,
          extended: false,
          disabled: false,
          refreshDataOnly: true,
          deepWatchOptions: true,
          deepWatchData: true,
          deepWatchDataDepth: 1,
          debounce: 10
        }
      },
      parseLineChartData: function(data, timeRange) {
        var i, percent, ref, ref1, singleTopicData, topicName, val, value, year;
        for (topicName in data) {
          val = data[topicName];
          singleTopicData = {
            values: [],
            key: topicName,
            area: false,
            strokeWidth: 1,
            classed: 'line-graph'
          };
          for (year = i = ref = timeRange.min, ref1 = timeRange.max; ref <= ref1 ? i <= ref1 : i >= ref1; year = ref <= ref1 ? ++i : --i) {
            value = parseInt(val[year]) || 0;
            percent = value > 0 ? parseFloat((value / TopicService.totals[year]) * 100) : 0;
            singleTopicData.values.push({
              x: year,
              y: percent
            });
          }
        }
        return singleTopicData;
      },
      parseBarChartData: function(data, timeRange) {
        var SC_counts, SC_dissent_counts, allCounts, appeals_counts, appeals_dissent_counts, case_counts, dissent_counts, i, keys, ref, ref1, ref2, ref3, ref4, ref5, year;
        keys = {
          appeals_counts: "Appeal Court Cases",
          case_counts: "Total Cases",
          SC_counts: "Supreme Court Cases",
          dissent_counts: "Total Dissents",
          SC_dissent_counts: "Supreme Court Dissents",
          appeals_dissent_counts: "Appeals Court Dissents"
        };
        allCounts = [
          {
            key: keys.appeals_counts,
            values: []
          }, {
            key: keys.SC_counts,
            values: []
          }, {
            key: keys.SC_dissent_counts,
            values: []
          }, {
            key: keys.appeals_dissent_counts,
            values: []
          }
        ];
        for (year = i = ref = timeRange.min, ref1 = timeRange.max; ref <= ref1 ? i <= ref1 : i >= ref1; year = ref <= ref1 ? ++i : --i) {
          case_counts = ((ref2 = data[year]) != null ? ref2[0] : void 0) || 0;
          SC_counts = ((ref3 = data[year]) != null ? ref3[1] : void 0) || 0;
          dissent_counts = ((ref4 = data[year]) != null ? ref4[2] : void 0) || 0;
          SC_dissent_counts = ((ref5 = data[year]) != null ? ref5[3] : void 0) || 0;
          appeals_counts = case_counts - SC_counts;
          appeals_dissent_counts = dissent_counts - SC_dissent_counts;
          allCounts[0].values.push([year, appeals_counts]);
          allCounts[1].values.push([year, SC_counts]);
          allCounts[2].values.push([year, -1 * SC_dissent_counts]);
          allCounts[3].values.push([year, -1 * appeals_dissent_counts]);
        }
        return allCounts;
      }
    };
  });

}).call(this);

(function() {
  angular.module('ftlTopics').service("TopicService", function($http, $q) {
    var obj;
    return obj = {
      currentTopic: "Breach of Contract",
      topics: [],
      init: function() {
        return this.getList().then((function(_this) {
          return function(list) {
            var i, len, s, sorted, topTopics;
            sorted = Object.keys(list).sort(function(a, b) {
              return list[b][0] - list[a][0];
            });
            topTopics = [];
            for (i = 0, len = sorted.length; i < len; i++) {
              s = sorted[i];
              topTopics.push([s, list[s]]);
            }
            _this.topTopics = topTopics;
            return _this.getTotals();
          };
        })(this));
      },
      getList: function() {
        return $http({
          method: 'GET',
          url: "/topics/list"
        }).then((function(_this) {
          return function(response) {
            _this.topics = response.data;
            return response.data;
          };
        })(this));
      },
      getSingleTopic: function(topic) {
        if (topic === 'Total Count') {
          return this.getTotals().then(function(response) {
            return response;
          });
        } else {
          return $http({
            method: 'GET',
            url: "/topic/" + topic
          }).then(function(response) {
            return response.data;
          });
        }
      },
      getManyTopics: function(topics) {
        var jsonTopic;
        jsonTopic = JSON.stringify(topics);
        return $http({
          method: 'GET',
          url: "/topics/",
          params: {
            topics: jsonTopic
          }
        }).then(function(response) {
          return response.data;
        });
      },
      getTotals: function() {
        return $http({
          method: 'GET',
          url: "/topics/totals"
        }).then((function(_this) {
          return function(response) {
            _this.totals = response.data;
            return _this.totals;
          };
        })(this));
      }
    };
  });

}).call(this);
;angular.module('templates-main', ['../../templates/dashboard.tpl.jade', '../../templates/main-toc.tpl.jade', '../../templates/multi-topics.tpl.jade', '../../templates/single-topic.tpl.jade', '../../templates/topic-toc-container.tpl.jade']);

angular.module("../../templates/dashboard.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/dashboard.tpl.jade",
    "<div ng-controller=\"DashboardCtrl\" class=\"dashboard-container\"><div class=\"dashboard-title-container\"><img src=\"./assets/img/logo-medium-blue.svg\" class=\"ftl-logo\"><h1 class=\"text-center\"> <span class=\"blue-text\">FTL </span><span>TOPIC EXPLORER</span></h1><h4 class=\"text-center\">Explore topics and trends in California law<br><span class=\"blue-text\">read more...</span></h4></div><div class=\"meta-container col-sm-12\"><div ng-controller=\"TopicTocCtrl as toc\" class=\"toc-container col-sm-12\"><div class=\"toc-header\"><a name=\"popular\">&nbsp;</a><div class=\"title\">POPULAR TOPICS</div><div class=\"subtitle\">Click on a topic for more details</div></div><div class=\"col-sm-12\"><div class=\"col-sm-6\"><ul ng-repeat=\"topicArray in toc.list track by $index\"><a href=\"#singletopic\" target=\"_self\"><li ng-if=\"$index &lt; 4\" ng-click=\"toc.viewTopicDetails(topicArray[0])\"><span class=\"topic-title\">{{topicArray[0]}} </span><span class=\"pull-right total-count\">{{topicArray[1][0]}}</span></li></a></ul></div><div class=\"col-sm-6\"><ul ng-repeat=\"topicArray in toc.list track by $index\"><a href=\"#singletopic\" target=\"_self\"><li ng-if=\"$index &gt;= 4 &amp;&amp; $index &lt; 8\" ng-click=\"toc.viewTopicDetails(topicArray[0])\"><span class=\"topic-title\">{{topicArray[0]}} </span><span class=\"pull-right total-count\">{{topicArray[1][0]}}</span></li></a></ul></div></div></div></div><div class=\"section-divider col-sm-12\"><div class=\"border-gray\"></div><div class=\"section-icon icon-bar-chart\"></div></div><div class=\"meta-container col-sm-12\"><div ng-controller=\"TopicCtrl as st\" class=\"single-topic-container\"><div class=\"col-sm-12\"><div ng-if=\"st.currentTopic\" class=\"topic-header\"><a name=\"singletopic\">&nbsp;</a><div class=\"title\"><span>{{st.currentTopic}}</span><span> FROM </span><span><input type=\"number\" min=\"1800\" ng-model=\"st.time.min\" ng-max=\"st.time.max\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"></span><span> </span> TO <span><input type=\"number\" max=\"2015\" ng-min=\"st.time.min\" ng-model=\"st.time.max\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"></span></div></div></div><div class=\"col-sm-2 topic-menu\"><ul><li ng-repeat=\"(topic,val) in st.topics\" ng-click=\"st.changeCurrentTopic(topic)\" ng-class=\"{'selected':st.currentTopic == topic}\" class=\"single-topic\">{{ topic }}</li></ul></div><div class=\"col-sm-10\"><nvd3 ng-if=\"st.graph.data\" options=\"st.graph.options\" data=\"st.graph.data\" config=\"st.graph.config\" api=\"st.graph.api\" class=\"single-topic-graph\"></nvd3><div class=\"topic-legend-container\"><div class=\"topic-legend-content\"><div class=\"legend-item\"><div class=\"color-spot case-one\"></div><span class=\"item-title\">Supreme Court cases</span></div><div class=\"legend-item\"><div class=\"color-spot case-two\"></div><span class=\"item-title\">Appeals Court cases</span></div><div class=\"legend-item\"><div class=\"color-spot dissent-one\"></div><span class=\"item-title\">Supreme Court dissents</span></div><div class=\"legend-item\"><div class=\"color-spot dissent-two\"></div><span class=\"item-title\">Appeals Court dissents</span></div></div></div><div class=\"keyword-list\">Keywords: {{st.topicKeywords.join(', ')}}</div></div></div></div><div class=\"section-divider col-sm-12\"><div class=\"border-gray\"></div><div class=\"section-icon icon-line-chart\"></div></div><div class=\"meta-container col-sm-12\"><div ng-controller=\"MultiTopicCtrl as mt\" class=\"multi-topics-container\"><div class=\"col-sm-12\"><div class=\"topic-header\"><a name=\"multitopics\"></a><div class=\"title\"> <span>COMPARE TOPICS </span><span>FROM </span><span><input type=\"number\" min=\"1800\" ng-model=\"mt.time.min\" ng-max=\"mt.time.max\" ng-blur=\"mt.reloadTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; mt.reloadTopicData()\"></span><span>TO </span><span> <input type=\"number\" max=\"2015\" ng-min=\"mt.time.min\" ng-model=\"mt.time.max\" ng-blur=\"mt.reloadTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; mt.reloadTopicData()\"></span></div></div></div><div class=\"col-sm-2 topic-menu\"><ul><li ng-click=\"mt.reset()\" ng-disable=\"mt.topics.length === 0\" class=\"single-topic\">RESET</li><li ng-click=\"mt.toggleTopic(topic)\" ng-class=\"{'selected':val.selected}\" ng-repeat=\"(topic,val) in mt.topics\" data-show=\"show\" class=\"single-topic\">{{ topic }}</li></ul></div><div class=\"col-sm-10\"><nvd3 options=\"mt.graph.options\" data=\"mt.graph.data\" config=\"mt.graph.config\" api=\"mt.graph.api\" class=\"multi-topic-graph\"></nvd3><div class=\"topic-legend-container multi-topic-legend col-sm-12\"><div class=\"topic-legend-content\"></div></div></div></div></div></div>");
}]);

angular.module("../../templates/main-toc.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/main-toc.tpl.jade",
    "<div align-middle class=\"main-toc-container col-sm-12\"><div class=\"section-icon\"></div><div class=\"table-responsive col-sm-8 col-sm-offset-2\"><table class=\"table\"><thead><th class=\"title\"><a href=\"#popular\" target=\"_self\">POPULAR TOPICS</a></th><th class=\"title\"><a href=\"#singletopic\" target=\"_self\">TOPIC IN DETAIL</a></th><th class=\"title\"> <a href=\"#multitopics\" target=\"_self\">COMPARE TOPICS</a></th></thead><tbody><tr><td class=\"description\"><a href=\"#popular\" target=\"_self\">TOP CASE TOPICS IN LOCAL\n" +
    "AND STATE COURTS\n" +
    "FROM 1850 TO 2014</a></td><td class=\"description\"><a href=\"#singletopic\" target=\"_self\">EXPLORE A SINGLE TOPIC\n" +
    "IN DETAIL OVER TIME. SEE\n" +
    "DISSENT VOTES IN \n" +
    "LOCAL AND STATE COURTS</a></td><td class=\"description\"><a href=\"#multitopics\" target=\"_self\">COMPARE DIFFERENT \n" +
    "TOPICS OVER TIME\n" +
    "SOMETHING ELSE</a></td></tr><tr><td><a href=\"#popular\" target=\"_self\"><div class=\"arrow-icon\"></div></a></td><td><a href=\"#singletopic\" target=\"_self\"><div class=\"arrow-icon\"></div></a></td><td><a href=\"#multitopics\" target=\"_self\"><div class=\"arrow-icon\"></div></a></td></tr></tbody></table></div></div>");
}]);

angular.module("../../templates/multi-topics.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/multi-topics.tpl.jade",
    "<div ng-controller=\"MultiTopicCtrl as mt\" class=\"multi-topics-container\"><div class=\"col-sm-12\"><div class=\"topic-header\"><a name=\"multitopics\"></a><div class=\"title\"> <span>COMPARE TOPICS </span><span>FROM </span><span><input type=\"number\" min=\"1800\" ng-model=\"mt.time.min\" ng-max=\"mt.time.max\" ng-blur=\"mt.reloadTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; mt.reloadTopicData()\"></span><span>TO </span><span> <input type=\"number\" max=\"2015\" ng-min=\"mt.time.min\" ng-model=\"mt.time.max\" ng-blur=\"mt.reloadTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; mt.reloadTopicData()\"></span></div></div></div><div class=\"col-sm-2 topic-menu\"><ul><li ng-click=\"mt.reset()\" ng-disable=\"mt.topics.length === 0\" class=\"single-topic\">RESET</li><li ng-click=\"mt.toggleTopic(topic)\" ng-class=\"{'selected':val.selected}\" ng-repeat=\"(topic,val) in mt.topics\" data-show=\"show\" class=\"single-topic\">{{ topic }}</li></ul></div><div class=\"col-sm-10\"><nvd3 options=\"mt.graph.options\" data=\"mt.graph.data\" config=\"mt.graph.config\" api=\"mt.graph.api\" class=\"multi-topic-graph\"></nvd3><div class=\"topic-legend-container multi-topic-legend col-sm-12\"><div class=\"topic-legend-content\"></div></div></div></div>");
}]);

angular.module("../../templates/single-topic.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/single-topic.tpl.jade",
    "<div ng-controller=\"TopicCtrl as st\" class=\"single-topic-container\"><div class=\"col-sm-12\"><div ng-if=\"st.currentTopic\" class=\"topic-header\"><a name=\"singletopic\">&nbsp;</a><div class=\"title\"><span>{{st.currentTopic}}</span><span> FROM </span><span><input type=\"number\" min=\"1800\" ng-model=\"st.time.min\" ng-max=\"st.time.max\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"></span><span> </span> TO <span><input type=\"number\" max=\"2015\" ng-min=\"st.time.min\" ng-model=\"st.time.max\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"></span></div></div></div><div class=\"col-sm-2 topic-menu\"><ul><li ng-repeat=\"(topic,val) in st.topics\" ng-click=\"st.changeCurrentTopic(topic)\" ng-class=\"{'selected':st.currentTopic == topic}\" class=\"single-topic\">{{ topic }}</li></ul></div><div class=\"col-sm-10\"><nvd3 ng-if=\"st.graph.data\" options=\"st.graph.options\" data=\"st.graph.data\" config=\"st.graph.config\" api=\"st.graph.api\" class=\"single-topic-graph\"></nvd3><div class=\"topic-legend-container\"><div class=\"topic-legend-content\"><div class=\"legend-item\"><div class=\"color-spot case-one\"></div><span class=\"item-title\">Supreme Court cases</span></div><div class=\"legend-item\"><div class=\"color-spot case-two\"></div><span class=\"item-title\">Appeals Court cases</span></div><div class=\"legend-item\"><div class=\"color-spot dissent-one\"></div><span class=\"item-title\">Supreme Court dissents</span></div><div class=\"legend-item\"><div class=\"color-spot dissent-two\"></div><span class=\"item-title\">Appeals Court dissents</span></div></div></div><div class=\"keyword-list\">Keywords: {{st.topicKeywords.join(', ')}}</div></div></div>");
}]);

angular.module("../../templates/topic-toc-container.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/topic-toc-container.tpl.jade",
    "<div ng-controller=\"TopicTocCtrl as toc\" class=\"toc-container col-sm-12\"><div class=\"toc-header\"><a name=\"popular\">&nbsp;</a><div class=\"title\">POPULAR TOPICS</div><div class=\"subtitle\">Click on a topic for more details</div></div><div class=\"col-sm-12\"><div class=\"col-sm-6\"><ul ng-repeat=\"topicArray in toc.list track by $index\"><a href=\"#singletopic\" target=\"_self\"><li ng-if=\"$index &lt; 4\" ng-click=\"toc.viewTopicDetails(topicArray[0])\"><span class=\"topic-title\">{{topicArray[0]}} </span><span class=\"pull-right total-count\">{{topicArray[1][0]}}</span></li></a></ul></div><div class=\"col-sm-6\"><ul ng-repeat=\"topicArray in toc.list track by $index\"><a href=\"#singletopic\" target=\"_self\"><li ng-if=\"$index &gt;= 4 &amp;&amp; $index &lt; 8\" ng-click=\"toc.viewTopicDetails(topicArray[0])\"><span class=\"topic-title\">{{topicArray[0]}} </span><span class=\"pull-right total-count\">{{topicArray[1][0]}}</span></li></a></ul></div></div></div>");
}]);
