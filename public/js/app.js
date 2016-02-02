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
    addLegendItem = function(topic, color) {
      var legendItem, underscored_topic;
      underscored_topic = topic.split(' ').join('_');
      legendItem = "<div class=\"legend-item " + underscored_topic + "\">\n  <div class=\"color-spot\" style='background-color:" + color + "'></div>\n  <span class=\"item-title\">\n    " + topic + "\n  </span>\n\n</div>";
      return $('.multi-topic-legend > .topic-legend-content').append(legendItem);
    };
    removeLegendItem = function(topic) {
      var underscored_topic;
      underscored_topic = topic.split(' ').join('_');
      return $('.multi-topic-legend > .topic-legend-content').find("." + underscored_topic).remove();
    };
    addTopic = (function(_this) {
      return function(topic) {
        return TopicService.getSingleTopic(topic).then(function(response) {
          var data, obj, obj1, singletopic;
          if (topic === 'Total Count') {
            data = (
              obj = {},
              obj["" + topic] = response,
              obj
            );
          } else {
            data = (
              obj1 = {},
              obj1["" + topic] = response.data,
              obj1
            );
          }
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
        var ref, t, val;
        if (topicsExist) {
          return;
        }
        _this.topics['Total Count'] = {
          selected: true
        };
        ref = TopicService.topics;
        for (t in ref) {
          val = ref[t];
          _this.topics[t] = {
            selected: false
          };
          topicsExist = true;
        }
        return _this.parseSelectedTopicData('Total Count');
      };
    })(this);
    init();
    this.toggleTopic = function(topic) {
      this.topics[topic].selected = !this.topics[topic].selected;
      return this.parseSelectedTopicData(topic);
    };
    this.generateChart = (function(_this) {
      return function(data) {
        _this.graph.data = data;
        return _this.graph.api.refresh();
      };
    })(this);
  });

}).call(this);

(function() {
  angular.module('ftlTopics').controller('TopicCtrl', function($scope, TopicService, GraphService) {
    var defaults;
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
        _this.currentTopic = newval;
        return _this.getTopicData(_this.currentTopic);
      };
    })(this));
    this.getTopicData = function(topic) {
      return TopicService.getSingleTopic(topic).then((function(_this) {
        return function(response) {
          _this.topicData = response.data;
          _this.parseTopicData();
          return _this.parseTopicKeywords(response.keywords);
        };
      })(this), function(response) {
        return console.log("something went wrong");
      });
    };
    this.changeCurrentTopic = function(topic) {
      return TopicService.currentTopic = topic;
    };
    this.currentTopic = TopicService.currentTopic;
    this.getTopicData(this.currentTopic);
    defaults = {
      keys: {
        appeals_counts: "Appeal Court Cases",
        case_counts: "Total Cases",
        SC_counts: "Supreme Court Cases",
        dissent_counts: "Total Dissents",
        SC_dissent_counts: "Supreme Court Dissents",
        appeals_dissent_counts: "Appeals Court Dissents"
      }
    };
    this.parseTopicKeywords = function(keywords) {
      this.topicKeywords = keywords;
      return this.topicKeywords;
    };
    this.parseTopicData = function() {
      var SC_counts, SC_dissent_counts, allCounts, appeals_counts, appeals_dissent_counts, case_counts, data, dissent_counts, i, ref, ref1, ref2, ref3, ref4, ref5, year;
      data = this.topicData;
      allCounts = [
        {
          key: defaults.keys.appeals_counts,
          values: []
        }, {
          key: defaults.keys.SC_counts,
          values: []
        }, {
          key: defaults.keys.SC_dissent_counts,
          values: []
        }, {
          key: defaults.keys.appeals_dissent_counts,
          values: []
        }
      ];
      for (year = i = ref = this.time.min, ref1 = this.time.max; ref <= ref1 ? i <= ref1 : i >= ref1; year = ref <= ref1 ? ++i : --i) {
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
      this.generateBarChart(allCounts);
      return this.graph.api.refresh();
    };
    this.generateBarChart = (function(_this) {
      return function(topicData) {
        return _this.graph.data = topicData;
      };
    })(this);
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
  angular.module('ftlTopics').service('GraphService', function() {
    var colors, obj;
    colors = ["#0075FF", "#2F2F2F", "#D9D9D9", "#D2E7FF", "#ECA633", "#78B6FF", "#7ED321"];
    return obj = {
      defaults: {
        time: {
          min: 1850,
          max: 2014
        },
        colors: colors
      },
      lineGraph: {
        data: {},
        options: {
          color: colors,
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
              tickFormat: d3.format(',.0f')
            }
          }
        }
      },
      multiBarChart: {
        options: {
          color: colors,
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
        var i, ref, ref1, singleTopicData, topicName, val, year;
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
            singleTopicData.values.push({
              x: year,
              y: parseInt(val[year]) || 0
            });
          }
        }
        return singleTopicData;
      }
    };
  });

}).call(this);

(function() {
  angular.module('ftlTopics').service("TopicService", function($http, $q) {
    var obj;
    return obj = {
      currentTopic: "Water Rights",
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
            return _this.topTopics = topTopics;
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
    "<div ng-controller=\"DashboardCtrl\" class=\"dashboard-container\"><div class=\"dashboard-title-container\"><img src=\"./assets/img/logo-medium.svg\" class=\"ftl-logo\"><h1 class=\"text-center\">CALIFORNIA CASES</h1><h4 class=\"text-center\">Explore common case topics in California<br><span class=\"blue-text\">from 1850 – 2014</span></h4></div><div class=\"meta-container col-sm-12\"><div align-middle class=\"main-toc-container col-sm-12\"><div class=\"section-icon\"></div><div class=\"table-responsive col-sm-8 col-sm-offset-2\"><table class=\"table\"><thead><th class=\"title\"><a href=\"#popular\" target=\"_self\">POPULAR TOPICS</a></th><th class=\"title\"><a href=\"#singletopic\" target=\"_self\">TOPIC IN DETAIL</a></th><th class=\"title\"> <a href=\"#multitopics\" target=\"_self\">COMPARE TOPICS</a></th></thead><tbody><tr><td class=\"description\"><a href=\"#popular\" target=\"_self\">TOP CASE TOPICS IN LOCAL\n" +
    "AND STATE COURTS\n" +
    "FROM 1850 TO 2014</a></td><td class=\"description\"><a href=\"#singletopic\" target=\"_self\">EXPLORE A SINGLE TOPIC\n" +
    "IN DETAIL OVER TIME. SEE\n" +
    "DISSENT VOTES IN \n" +
    "LOCAL AND STATE COURTS</a></td><td class=\"description\"><a href=\"#multitopics\" target=\"_self\">COMPARE DIFFERENT \n" +
    "TOPICS OVER TIME\n" +
    "SOMETHING ELSE</a></td></tr><tr><td><a href=\"#popular\" target=\"_self\"><div class=\"arrow-icon\"></div></a></td><td><a href=\"#singletopic\" target=\"_self\"><div class=\"arrow-icon\"></div></a></td><td><a href=\"#multitopics\" target=\"_self\"><div class=\"arrow-icon\"></div></a></td></tr></tbody></table></div></div></div><div class=\"section-divider col-sm-12\"><div class=\"section-divider icon-topics\"></div></div><div class=\"meta-container col-sm-12\"><div ng-controller=\"TopicTocCtrl as toc\" class=\"toc-container\"><div class=\"toc-header\"><a name=\"popular\">&nbsp;</a><div class=\"title\">POPULAR TOPICS</div><div class=\"subtitle\">Click on a topic for more details</div></div><div class=\"row toc-content\"><div class=\"col-sm-12\"><div class=\"col-sm-6\"><ul ng-repeat=\"topicArray in toc.list track by $index\"><a href=\"#singletopic\" target=\"_self\"><li ng-if=\"$index &lt; 4\" ng-click=\"toc.viewTopicDetails(topicArray[0])\"><span class=\"topic-title\">{{topicArray[0]}} </span><span class=\"pull-right total-count\">{{topicArray[1][0]}}</span></li></a></ul></div><div class=\"col-sm-6\"><ul ng-repeat=\"topicArray in toc.list track by $index\"><a href=\"#singletopic\" target=\"_self\"><li ng-if=\"$index &gt;= 4 &amp;&amp; $index &lt; 8\" ng-click=\"toc.viewTopicDetails(topicArray[0])\"><span class=\"topic-title\">{{topicArray[0]}} </span><span class=\"pull-right total-count\">{{topicArray[1][0]}}</span></li></a></ul></div></div></div></div></div><div class=\"section-divider col-sm-12\"><div class=\"border-gray\"></div><div class=\"section-divider icon-bar-chart\"></div></div><div class=\"meta-container col-sm-12\"><div ng-controller=\"TopicCtrl as st\" class=\"single-topic-container\"><div class=\"row\"><div class=\"col-sm-12\"><div ng-if=\"st.topicKeywords\" class=\"single-topic-header\"><div class=\"title\"><span>{{st.currentTopic}}</span><a name=\"singletopic\">&nbsp;</a><span class=\"blue-text\">IN DETAIL</span></div></div></div></div><form ng-if=\"st.currentTopic\" class=\"date-form\"><label>Showing data from </label><input type=\"number\" min=\"1800\" ng-model=\"st.time.min\" ng-max=\"st.time.max\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"><label>to</label><input type=\"number\" max=\"2015\" ng-min=\"st.time.min\" ng-model=\"st.time.max\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"></form><div class=\"graph-top-container col-sm-12\"><button ng-click=\"(st.showMenu = !st.showMenu)\" class=\"regular-btn btn show-menu dropdown-topic-list\">PICK A DIFFERENT TOPIC</button><div click-off show=\"st.showMenu\" excluding=\"dropdown-topic-list\" ng-if=\"st.showMenu\" class=\"dropdown-topic-menu dropdown-topic-list\"><ul ng-repeat=\"(topic,val) in st.topics\" data-show=\"show\"><li ng-click=\"st.changeCurrentTopic(topic)\" ng-class=\"{'selected':val.selected}\" class=\"single-topic\">{{ topic }}</li></ul></div></div><nvd3 options=\"st.graph.options\" data=\"st.graph.data\" config=\"st.graph.config\" api=\"st.graph.api\"></nvd3><div class=\"topic-legend-container col-sm-12\"><div class=\"topic-legend-content text-center\"><div class=\"legend-item\"><div class=\"color-spot case-one\"></div><span class=\"item-title\">Supreme Court cases</span></div><div class=\"legend-item\"><div class=\"color-spot case-two\"></div><span class=\"item-title\">Appeals Court cases</span></div><div class=\"legend-item\"><div class=\"color-spot dissent-one\"></div><span class=\"item-title\">Supreme Court dissents</span></div><div class=\"legend-item\"><div class=\"color-spot dissent-two\"></div><span class=\"item-title\">Appeals Court dissents</span></div></div></div><div class=\"col-sm-12 keyword-list\">Keywords: {{st.topicKeywords.join(', ')}}</div></div></div><div class=\"section-divider col-sm-12\"><div class=\"border-gray\"></div><div class=\"section-divider icon-line-chart\"></div></div><div class=\"meta-container col-sm-12\"><div ng-controller=\"MultiTopicCtrl as mt\" class=\"multi-topics-container\"><div class=\"multi-topic-header\"><div class=\"title\">COMPARE TOPICS</div><a name=\"multitopics\"></a></div><br><form ng-if=\"mt.currentTopics.length\" class=\"date-form\"><label>Showing data from </label><input type=\"number\" min=\"1800\" ng-model=\"mt.time.min\" ng-max=\"mt.time.max\" ng-blur=\"mt.reloadTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; mt.reloadTopicData()\"><label>to</label><input type=\"number\" max=\"2015\" ng-min=\"mt.time.min\" ng-model=\"mt.time.max\" ng-blur=\"mt.reloadTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; mt.reloadTopicData()\"></form><button ng-click=\"(mt.showMenu = !mt.showMenu)\" class=\"regular-btn btn show-menu dropdown-topic-list\">ADD OR REMOVE A TOPIC</button><div click-off show=\"mt.showMenu\" excluding=\"dropdown-topic-list\" ng-if=\"mt.showMenu\" class=\"dropdown-topic-menu dropdown-topic-list\"><ul ng-repeat=\"(topic,val) in mt.topics\" data-show=\"show\"><li ng-click=\"mt.toggleTopic(topic)\" ng-class=\"{'selected':val.selected}\" class=\"single-topic\">{{ topic }}</li></ul></div><nvd3 ng-if=\"mt.currentTopics.length\" options=\"mt.graph.options\" data=\"mt.graph.data\" config=\"mt.graph.config\" api=\"mt.graph.api\" class=\"multi-topic-graph\"></nvd3><div class=\"topic-legend-container multi-topic-legend col-sm-12\"><div class=\"topic-legend-content text-center\"></div></div></div></div></div>");
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
    "<div ng-controller=\"MultiTopicCtrl as mt\" class=\"multi-topics-container\"><div class=\"multi-topic-header\"><div class=\"title\">COMPARE TOPICS</div><a name=\"multitopics\"></a></div><br><form ng-if=\"mt.currentTopics.length\" class=\"date-form\"><label>Showing data from </label><input type=\"number\" min=\"1800\" ng-model=\"mt.time.min\" ng-max=\"mt.time.max\" ng-blur=\"mt.reloadTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; mt.reloadTopicData()\"><label>to</label><input type=\"number\" max=\"2015\" ng-min=\"mt.time.min\" ng-model=\"mt.time.max\" ng-blur=\"mt.reloadTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; mt.reloadTopicData()\"></form><button ng-click=\"(mt.showMenu = !mt.showMenu)\" class=\"regular-btn btn show-menu dropdown-topic-list\">ADD OR REMOVE A TOPIC</button><div click-off show=\"mt.showMenu\" excluding=\"dropdown-topic-list\" ng-if=\"mt.showMenu\" class=\"dropdown-topic-menu dropdown-topic-list\"><ul ng-repeat=\"(topic,val) in mt.topics\" data-show=\"show\"><li ng-click=\"mt.toggleTopic(topic)\" ng-class=\"{'selected':val.selected}\" class=\"single-topic\">{{ topic }}</li></ul></div><nvd3 ng-if=\"mt.currentTopics.length\" options=\"mt.graph.options\" data=\"mt.graph.data\" config=\"mt.graph.config\" api=\"mt.graph.api\" class=\"multi-topic-graph\"></nvd3><div class=\"topic-legend-container multi-topic-legend col-sm-12\"><div class=\"topic-legend-content text-center\"></div></div></div>");
}]);

angular.module("../../templates/single-topic.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/single-topic.tpl.jade",
    "<div ng-controller=\"TopicCtrl as st\" class=\"single-topic-container\"><div class=\"row\"><div class=\"col-sm-12\"><div ng-if=\"st.topicKeywords\" class=\"single-topic-header\"><div class=\"title\"><span>{{st.currentTopic}}</span><a name=\"singletopic\">&nbsp;</a><span class=\"blue-text\">IN DETAIL</span></div></div></div></div><form ng-if=\"st.currentTopic\" class=\"date-form\"><label>Showing data from </label><input type=\"number\" min=\"1800\" ng-model=\"st.time.min\" ng-max=\"st.time.max\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"><label>to</label><input type=\"number\" max=\"2015\" ng-min=\"st.time.min\" ng-model=\"st.time.max\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"></form><div class=\"graph-top-container col-sm-12\"><button ng-click=\"(st.showMenu = !st.showMenu)\" class=\"regular-btn btn show-menu dropdown-topic-list\">PICK A DIFFERENT TOPIC</button><div click-off show=\"st.showMenu\" excluding=\"dropdown-topic-list\" ng-if=\"st.showMenu\" class=\"dropdown-topic-menu dropdown-topic-list\"><ul ng-repeat=\"(topic,val) in st.topics\" data-show=\"show\"><li ng-click=\"st.changeCurrentTopic(topic)\" ng-class=\"{'selected':val.selected}\" class=\"single-topic\">{{ topic }}</li></ul></div></div><nvd3 options=\"st.graph.options\" data=\"st.graph.data\" config=\"st.graph.config\" api=\"st.graph.api\"></nvd3><div class=\"topic-legend-container col-sm-12\"><div class=\"topic-legend-content text-center\"><div class=\"legend-item\"><div class=\"color-spot case-one\"></div><span class=\"item-title\">Supreme Court cases</span></div><div class=\"legend-item\"><div class=\"color-spot case-two\"></div><span class=\"item-title\">Appeals Court cases</span></div><div class=\"legend-item\"><div class=\"color-spot dissent-one\"></div><span class=\"item-title\">Supreme Court dissents</span></div><div class=\"legend-item\"><div class=\"color-spot dissent-two\"></div><span class=\"item-title\">Appeals Court dissents</span></div></div></div><div class=\"col-sm-12 keyword-list\">Keywords: {{st.topicKeywords.join(', ')}}</div></div>");
}]);

angular.module("../../templates/topic-toc-container.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/topic-toc-container.tpl.jade",
    "<div ng-controller=\"TopicTocCtrl as toc\" class=\"toc-container\"><div class=\"toc-header\"><a name=\"popular\">&nbsp;</a><div class=\"title\">POPULAR TOPICS</div><div class=\"subtitle\">Click on a topic for more details</div></div><div class=\"row toc-content\"><div class=\"col-sm-12\"><div class=\"col-sm-6\"><ul ng-repeat=\"topicArray in toc.list track by $index\"><a href=\"#singletopic\" target=\"_self\"><li ng-if=\"$index &lt; 4\" ng-click=\"toc.viewTopicDetails(topicArray[0])\"><span class=\"topic-title\">{{topicArray[0]}} </span><span class=\"pull-right total-count\">{{topicArray[1][0]}}</span></li></a></ul></div><div class=\"col-sm-6\"><ul ng-repeat=\"topicArray in toc.list track by $index\"><a href=\"#singletopic\" target=\"_self\"><li ng-if=\"$index &gt;= 4 &amp;&amp; $index &lt; 8\" ng-click=\"toc.viewTopicDetails(topicArray[0])\"><span class=\"topic-title\">{{topicArray[0]}} </span><span class=\"pull-right total-count\">{{topicArray[1][0]}}</span></li></a></ul></div></div></div></div>");
}]);
