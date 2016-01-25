(function() {
  var templates_path;

  templates_path = "../../templates/";

  angular.module('myApp', ['templates-main', 'ui.router', 'nvd3']).config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    console.log("in config, woo");
    $stateProvider.state('dashboard', {
      controller: 'DashboardCtrl',
      views: {
        '@': {
          templateUrl: templates_path + "dashboard.tpl.jade"
        },
        'main-toc@dashboard': {
          templateUrl: templates_path + "main-toc.tpl.jade"
        },
        'topic-toc-container@dashboard': {
          templateUrl: templates_path + "topic-toc-container.tpl.jade"
        },
        'single-topic@dashboard': {
          templateUrl: templates_path + "single-topic.tpl.jade"
        },
        'multi-topics@dashboard': {
          templateUrl: templates_path + "multi-topics.tpl.jade"
        }
      }
    });
  });

}).call(this);

(function() {
  angular.module('myApp').controller('DashboardCtrl', function($http) {
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
  angular.module('myApp').controller('MainCtrl', function($state) {
    $state.go("dashboard");
  });

}).call(this);

(function() {
  angular.module('myApp').controller('MultiTopicCtrl', function($window, TopicService, GraphService) {
    var defaults, topicsExist;
    this.topics = {};
    this.currentTopics = [];
    topicsExist = false;
    this.graph = GraphService.lineGraph;
    defaults = GraphService.defaults;
    this.time = angular.copy(GraphService.defaults.time);
    this.setupTopics = function() {
      var ref, results, t, val;
      if (topicsExist) {
        return;
      }
      ref = TopicService.topics;
      results = [];
      for (t in ref) {
        val = ref[t];
        this.topics[t] = {
          selected: false
        };
        results.push(topicsExist = true);
      }
      return results;
    };
    this.renderMultiTopicGraph = function(topic) {
      var index;
      index = this.currentTopics.indexOf(topic);
      if (this.topics[topic].selected && index < 0) {
        this.currentTopics.push(topic);
      } else if (!this.topics[topic].selected && index > -1) {
        this.currentTopics.splice(index, 1);
      }
      return TopicService.getSeveralTopics(this.currentTopics).then((function(_this) {
        return function(response) {
          _this.topicsData = response.data;
          return _this.parseTopicData();
        };
      })(this));
    };
    this.toggleTopic = function(topic) {
      this.topics[topic].selected = !this.topics[topic].selected;
      return this.renderMultiTopicGraph(topic);
    };
    this.parseTopicData = function() {
      var allTopics, c, data, i, ref, ref1, ref2, singleTopicData, topicName, val, year;
      data = this.topicsData;
      allTopics = [];
      c = 0;
      for (topicName in data) {
        val = data[topicName];
        singleTopicData = {
          values: [],
          key: topicName,
          color: defaults.colors[c],
          area: false,
          strokeWidth: 1,
          classed: 'line-graph'
        };
        for (year = i = ref = this.time.min, ref1 = this.time.max; ref <= ref1 ? i <= ref1 : i >= ref1; year = ref <= ref1 ? ++i : --i) {
          singleTopicData.values.push({
            x: year,
            y: ((ref2 = val[year]) != null ? ref2[0] : void 0) || 0
          });
        }
        allTopics.push(singleTopicData);
        c++;
      }
      this.generateBarChart(allTopics);
      return this.graph.api.refresh();
    };
    this.generateBarChart = (function(_this) {
      return function(data) {
        return _this.graph.data = data;
      };
    })(this);
  });

}).call(this);

(function() {
  angular.module('myApp').controller('TopicCtrl', function($scope, TopicService, GraphService) {
    var defaults;
    this.time = angular.copy(GraphService.defaults.time);
    this.graph = GraphService.multiBarChart;
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
          _this.topicData = response.data.data;
          _this.parseTopicData();
          return _this.parseTopicKeywords(response.data.keywords);
        };
      })(this), function(response) {
        return console.log("something went wrong");
      });
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
      return this.topicKeywords = keywords;
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
  angular.module('myApp').controller('TopicTocCtrl', function(TopicService) {
    TopicService.getList().then((function(_this) {
      return function(response) {
        return _this.list = response.data;
      };
    })(this), function() {
      return console.log("uh oh!");
    });
    this.viewTopicDetails = function(topic) {
      return TopicService.currentTopic = topic;
    };
  });

}).call(this);

(function() {
  angular.module('myApp').service('GraphService', function() {
    var colors, obj;
    colors = ["#0075FF", "#2F2F2F", "#D9D9D9", "#D2E7FF", "#ECA633", "#78B6FF", "#7ED321"];
    return obj = {
      defaults: {
        time: {
          min: 1850,
          max: 2000
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
              axisLabel: 'counts',
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
      }
    };
  });

}).call(this);

(function() {
  angular.module('myApp').service("TopicService", function($http) {
    var obj;
    return obj = {
      currentTopic: "Water Rights",
      topics: [],
      getList: function() {
        return $http({
          method: 'GET',
          url: "/topics/list"
        }).then((function(_this) {
          return function(response) {
            _this.topics = response.data;
            console.log("setting topics:", _this.topics);
            return response;
          };
        })(this));
      },
      getSingleTopic: function(topic) {
        return $http({
          method: 'GET',
          url: "/topic/" + topic
        });
      },
      getSeveralTopics: function(topics) {
        var jsonTopic;
        jsonTopic = JSON.stringify(topics);
        return $http({
          method: 'GET',
          url: "/topics/",
          params: {
            topics: jsonTopic
          }
        });
      }
    };
  });

}).call(this);
;angular.module('templates-main', ['../../templates/dashboard.tpl.jade', '../../templates/main-toc.tpl.jade', '../../templates/multi-topics.tpl.jade', '../../templates/single-topic.tpl.jade', '../../templates/topic-toc-container.tpl.jade']);

angular.module("../../templates/dashboard.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/dashboard.tpl.jade",
    "<div ng-controller=\"DashboardCtrl\" class=\"dashboard-container\"><div class=\"dashboard-title-container\"><div class=\"ftl-logo\"></div><h1 class=\"text-center\">CALIFORNIA CASES</h1><h4 class=\"text-center\">Explore common case topics in California<br><span class=\"blue-text\">from 1850 – 2014</span></h4></div><div ui-view=\"main-toc\" class=\"meta-container\"></div><div ui-view=\"topic-toc-container\" class=\"meta-container\"></div><div ui-view=\"single-topic\" class=\"meta-container\"></div><div ui-view=\"multi-topics\" class=\"meta-container\"></div></div>");
}]);

angular.module("../../templates/main-toc.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/main-toc.tpl.jade",
    "<div class=\"main-toc-container\"><div class=\"section-icon\"></div><div class=\"row\"><div class=\"col-sm-12 text-center\"><div class=\"col-sm-4\"><div class=\"title\">POPULAR TOPICS</div><div class=\"description\">TOP CASE TOPICS IN LOCAL\n" +
    "AND STATE COURTS\n" +
    "FROM 1850 TO 2014</div><a href=\"#popular\"><div class=\"arrow-icon\"></div></a></div><div class=\"col-sm-4\"><div class=\"title\">TOPIC IN DETAIL</div><div class=\"description\">EXPLORE A SINGLE TOPIC\n" +
    "IN DETAIL OVER TIME. SEE\n" +
    "DISSENT VOTES IN \n" +
    "LOCAL AND STATE COURTS</div><a href=\"#singletopic\"><div class=\"arrow-icon\"></div></a></div><div class=\"col-sm-4\"><div class=\"title\">COMPARE TOPICS</div><div class=\"description\">COMPARE DIFFERENT \n" +
    "TOPICS OVER TIME\n" +
    "SOMETHING ELSE</div><a href=\"#multitopics\"><div class=\"arrow-icon\"></div></a></div></div></div></div>");
}]);

angular.module("../../templates/multi-topics.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/multi-topics.tpl.jade",
    "<div ng-controller=\"MultiTopicCtrl as mt\" class=\"multi-topics-container\"><div class=\"multi-topic-header\"><div class=\"title\">COMPARE TOPICS</div></div><br><form ng-if=\"mt.currentTopics.length\" class=\"date-form\"><label>Showing data from </label><input type=\"number\" min=\"1850\" ng-model=\"mt.time.min\" ng-max=\"mt.time.max\" ng-blur=\"mt.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; mt.parseTopicData()\"><label>to</label><input type=\"number\" max=\"2015\" ng-min=\"mt.time.min\" ng-model=\"mt.time.max\" ng-blur=\"mt.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; mt.parseTopicData()\"></form><button ng-click=\"(mt.showMenu = !mt.showMenu) &amp;&amp; mt.setupTopics()\" class=\"regular-btn btn show-menu\">ADD OR REMOVE A TOPIC</button><div ng-if=\"mt.showMenu\" class=\"dropdown-topic-menu\"><ul ng-repeat=\"(topic,val) in mt.topics\"><li ng-click=\"mt.toggleTopic(topic)\" ng-class=\"{'selected':val.selected}\" class=\"single-topic\">{{ topic }}</li></ul></div><a name=\"multitopics\"></a><nvd3 ng-if=\"mt.currentTopics.length\" options=\"mt.graph.options\" data=\"mt.graph.data\" config=\"mt.graph.config\" api=\"mt.graph.api\" class=\"multi-topic-graph\"></nvd3></div>");
}]);

angular.module("../../templates/single-topic.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/single-topic.tpl.jade",
    "<div ng-controller=\"TopicCtrl as st\" class=\"single-topic-container\"><div class=\"section-divider\"><div class=\"border-gray\"></div><div class=\"section-icon\"></div></div><div class=\"row\"><div class=\"col-sm-12\"><div ng-if=\"st.topicKeywords\" class=\"single-topic-header\"><div class=\"title\"><span>{{st.currentTopic}} </span><span class=\"blue-text\">DETAILS</span></div><h4>KEYWORDS</h4><div class=\"subtitle\"><div ng-repeat=\"keyword in st.topicKeywords track by $index\" class=\"keyword-container\"><span class=\"keyword\">{{keyword}}</span></div></div></div></div></div><br><form ng-if=\"st.currentTopic\" class=\"date-form\"><label>Showing data from </label><input type=\"number\" min=\"1850\" ng-model=\"st.time.min\" ng-max=\"st.time.max\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"><label>to</label><input type=\"number\" max=\"2015\" ng-min=\"st.time.min\" ng-model=\"st.time.max\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"></form><a name=\"singletopic\">&nbsp;</a><nvd3 options=\"st.graph.options\" data=\"st.graph.data\" config=\"st.graph.config\" api=\"st.graph.api\"></nvd3></div>");
}]);

angular.module("../../templates/topic-toc-container.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/topic-toc-container.tpl.jade",
    "<div ng-controller=\"TopicTocCtrl as toc\" class=\"toc-container\"><div class=\"toc-hr\"><div class=\"section-icon\"></div></div><div class=\"toc-header\"><a name=\"popular\">&nbsp;</a><div class=\"title\">POPULAR TOPICS</div><div class=\"subtitle\">Track keyword hits as our database grows.</div></div><div class=\"row toc-content\"><div class=\"col-sm-12\"><div class=\"col-sm-6\"><ul ng-repeat=\"(topic, total) in toc.list track by $index\"><a href=\"#topic\"><li ng-if=\"$index &lt; 4\" ng-click=\"toc.viewTopicDetails(topic)\"><span class=\"topic-title\">{{topic}} </span><span class=\"pull-right total-count\">{{total[0]}}</span></li></a></ul></div><div class=\"col-sm-6\"><ul ng-repeat=\"(topic, total) in toc.list track by $index\"><a href=\"#topic\"><li ng-if=\"$index &gt;= 4 &amp;&amp; $index &lt; 8\" ng-click=\"toc.viewTopicDetails(topic)\"><span class=\"topic-title\">{{topic}} </span><span class=\"pull-right total-count\">{{total[0] + total[1]}}</span></li></a></ul></div></div></div></div>");
}]);
