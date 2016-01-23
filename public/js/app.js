(function() {
  angular.module('myApp', ['templates-main', 'ui.router', 'nvd3']).config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    console.log("in config, woo");
    $stateProvider.state('dashboard', {
      controller: 'DashboardCtrl',
      views: {
        '@': {
          templateUrl: '../../templates/dashboard.tpl.jade'
        },
        'single-topic@dashboard': {
          templateUrl: '../../templates/single-topic.tpl.jade'
        },
        'multi-topics@dashboard': {
          templateUrl: '../../templates/multi-topics.tpl.jade'
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
  angular.module('myApp').controller('MultiTopicCtrl', function($http) {
    return this.renderMultiTopicGraph = function() {};
  });

}).call(this);

(function() {
  angular.module('myApp').controller('TopicCtrl', function($http, TopicService) {
    var defaults;
    this.minYear = 2005;
    this.maxYear = 2014;
    this.getTopicData = function(topic) {
      topic = topic || 'fraud';
      return TopicService.getSingleTopic(topic).then((function(_this) {
        return function(response) {
          _this.topicData = response.data;
          return _this.parseTopicData();
        };
      })(this), function(response) {
        return console.log("something went wrong");
      });
    };
    this.getTopicData();
    defaults = {
      minYear: this.minYear,
      maxYear: this.maxYear,
      keys: {
        case_counts: "Local Cases",
        SC_counts: "SC Cases",
        dissent_counts: "Local Dissents",
        SC_dissent_counts: "SC Dissents"
      }
    };
    this.parseTopicData = function(min, max) {
      var allCounts, data, i, ref, ref1, ref2, ref3, ref4, ref5, year;
      data = this.topicData;
      allCounts = [
        {
          key: defaults.keys.case_counts,
          values: []
        }, {
          key: defaults.keys.SC_counts,
          values: []
        }, {
          key: defaults.keys.dissent_counts,
          values: []
        }, {
          key: defaults.keys.SC_dissent_counts,
          values: []
        }
      ];
      for (year = i = ref = this.minYear, ref1 = this.maxYear; ref <= ref1 ? i <= ref1 : i >= ref1; year = ref <= ref1 ? ++i : --i) {
        allCounts[0].values.push([year, ((ref2 = data[year]) != null ? ref2[0] : void 0) || 0]);
        allCounts[1].values.push([year, ((ref3 = data[year]) != null ? ref3[1] : void 0) || 0]);
        allCounts[2].values.push([year, -1 * ((ref4 = data[year]) != null ? ref4[2] : void 0) || 0]);
        allCounts[3].values.push([year, -1 * ((ref5 = data[year]) != null ? ref5[3] : void 0) || 0]);
      }
      this.generateBarChart(allCounts);
      return this.api.refresh();
    };
    this.config = {
      visible: true,
      extended: false,
      disabled: false,
      refreshDataOnly: true,
      deepWatchOptions: true,
      deepWatchData: true,
      deepWatchDataDepth: 1,
      debounce: 10
    };
    this.generateBarChart = (function(_this) {
      return function(topicData) {
        _this.data = topicData;
        return _this.options = {
          color: defaults.colors,
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
        };
      };
    })(this);
  });

}).call(this);

(function() {
  angular.module('myApp').directive('singleTopicChart', function() {
    var obj;
    return obj = {
      scope: {
        min: '=',
        max: '='
      },
      link: function(scope) {
        console.log("getting min max", scope.min, scope.max);
      }
    };
  });

}).call(this);

(function() {
  angular.module('myApp').service("TopicService", function($http) {
    var obj;
    console.log("HELLO");
    return obj = {
      getSingleTopic: function(topic) {
        return $http({
          method: 'GET',
          url: "/topic/" + topic
        });
      },
      getSeveralTopics: function(topics) {
        return $http({
          method: 'GET',
          url: "/topics/",
          params: {
            topics: JSON.stringify(topics)
          }
        });
      }
    };
  });

}).call(this);
;angular.module('templates-main', ['../../templates/dashboard.tpl.jade', '../../templates/multi-topics.tpl.jade', '../../templates/single-topic.tpl.jade']);

angular.module("../../templates/dashboard.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/dashboard.tpl.jade",
    "<div ng-controller=\"DashboardCtrl\" class=\"dashboard-container\"><div class=\"dashboard-title-container\"><img src=\"../assets/img/logo-medium.svg\" class=\"ftl-logo img-responsive\"><h1 class=\"text-center\">CALIFORNIA CASES</h1><h4 class=\"text-center\">Explore common case topics</h4></div><img src=\"../assets/img/mountains.png\" class=\"mountains img-responsive\"><div class=\"dashboard-toc-container\"></div><div ui-view=\"single-topic\"></div><div ui-view=\"multi-topics\"></div></div>");
}]);

angular.module("../../templates/multi-topics.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/multi-topics.tpl.jade",
    "<div ng-controller=\"MultiTopicCtrl as mt\" class=\"multi-topics-container\"><form class=\"multi-topic-form\"><label>FIRST TOPIC</label><input ng-model=\"mt.firstTopic\"><label>SECOND TOPIC</label><input ng-model=\"mt.secondTopic\"><button type=\"submit\" ng-click=\"mt.renderMultiTopicGraph()\">SUBMIT</button></form></div>");
}]);

angular.module("../../templates/single-topic.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/single-topic.tpl.jade",
    "<div ng-controller=\"TopicCtrl as st\" class=\"single-topic-container\"><form class=\"single-topic-form\"><label>FROM</label><input type=\"number\" min=\"1850\" ng-model=\"st.minYear\" ng-max=\"st.maxYear\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"><label>TO</label><input type=\"number\" max=\"2015\" ng-min=\"st.minYear\" ng-model=\"st.maxYear\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"></form><nvd3 options=\"st.options\" data=\"st.data\" config=\"st.config\" api=\"st.api\"></nvd3></div>");
}]);
