(function() {
  var templates_path;

  templates_path = "../../templates/";

  angular.module("CAPmodule", ["templates-main", "ui.router", "nvd3"]).config(function($stateProvider, $urlRouterProvider) {
    return $stateProvider.state("dashboard", {
      url: '',
      controller: "DashboardCtrl",
      templateUrl: templates_path + "dashboard.tpl.jade",
      resolve: {
        scrollTop: function() {
          return $('html, body').animate({
            scrollTop: 0
          });
        }
      }
    }).state("topics", {
      url: "/topics",
      templateUrl: templates_path + "topic.dashboard.tpl.jade",
      resolve: {
        setupTopics: function(TopicService) {
          return TopicService.init();
        },
        scrollTop: function() {
          return $('html, body').animate({
            scrollTop: 0
          });
        }
      }
    }).state("topics.states", {
      url: "/topics/:states",
      templateUrl: templates_path + "topic.dashboard.tpl.jade",
      resolve: {
        scrollTop: function() {
          return $('html, body').animate({
            scrollTop: 0
          });
        }
      }
    }).state("wordclouds", {
      url: "/wordclouds",
      templateUrl: templates_path + "wordclouds.tpl.jade",
      resolve: {
        scrollTop: function() {
          return $('html, body').animate({
            scrollTop: 0
          });
        }
      }
    }).state("ngrams", {
      url: "/ngrams",
      templateUrl: templates_path + "ngrams.tpl.jade",
      resolve: {
        scrollTop: function() {
          return $('html, body').animate({
            scrollTop: 0
          });
        }
      }
    }).state("limericks", {
      url: "/limericks",
      templateUrl: templates_path + "limericks.tpl.jade",
      resolve: {
        scrollTop: function() {
          return $('html, body').animate({
            scrollTop: 0
          });
        }
      }
    });
  });

}).call(this);

(function() {
  angular.module('CAPmodule').controller('DashboardCtrl', function($http, $state, progressService) {
    this.gototopics = function() {
      $state.go('topics');
    };
    this.gotowordclouds = function() {
      $state.go('wordclouds');
    };
    this.gotolimericks = function() {
      $state.go('limericks');
    };
    this.gotongrams = function() {
      $state.go('ngrams');
    };
  });

}).call(this);

(function() {
  angular.module('CAPmodule').controller('LimericksCtrl', function(LimerickService) {
    LimerickService.getList().then((function(_this) {
      return function() {
        return _this.generate();
      };
    })(this));
    this.generate = function() {
      return LimerickService.getLimerick().then((function(_this) {
        return function(res) {
          return _this.limerick = res.limerick;
        };
      })(this));
    };
  });

}).call(this);

(function() {
  angular.module('CAPmodule').controller('MainCtrl', function($state) {});

}).call(this);

(function() {
  angular.module('CAPmodule').controller('MapCtrl', function($rootScope, TopicService) {
    this.toggleRegions = function(searchByRegion) {
      return $rootScope.$broadcast('map.searchByRegion', searchByRegion);
    };
    this.toggleSelectAll = function() {
      return $rootScope.$broadcast('map.toggleSelectAll');
    };
    this.calculateStates = function() {
      return TopicService.getManyTopics();
    };
    this.reset = function() {
      return $rootScope.$broadcast('map.clearAll');
    };
  });

}).call(this);

(function() {
  angular.module('CAPmodule').controller('MultiTopicCtrl', function($window, TopicService, GraphService) {
    var addLegendItem, addTopic, defaults, init, lineChartData, removeLegendItem, removeTopic, topicsExist;
    this.topics = {};
    this.currentTopics = [];
    topicsExist = false;
    this.graph = GraphService.lineGraph();
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
  angular.module('CAPmodule').controller('NgramsCtrl', function(NgramsService, GraphService) {
    this.words = '';
    this.graph = GraphService.lineGraph();
    this.graph.options.chart.yAxis.tickFormat = d3.format('1');
    this.findWords = function() {
      var words;
      if (!this.words) {
        return;
      }
      words = this.words.split(/[ ,]+/);
      return NgramsService.getWords(words).then((function(_this) {
        return function(response) {
          _this.data = response.result;
          return _this.generateChart(_this.data);
        };
      })(this));
    };
    this.generateChart = (function(_this) {
      return function(data) {
        var ngrams, ref;
        ngrams = GraphService.parseNgramData(data);
        if (ngrams['ERROR']) {
          _this.error = ngrams['ERROR'];
        } else {
          delete _this.error;
        }
        if (!ngrams) {
          return;
        }
        _this.graph.data = ngrams;
        if ((ref = _this.graph.api) != null) {
          ref.refresh();
        }
        _this.showGraph = true;
      };
    })(this);
  });

}).call(this);

(function() {
  angular.module('CAPmodule').controller('ProgressCtrl', function(progressService) {
    var self;
    self = this;
  });

}).call(this);

(function() {
  angular.module('CAPmodule').controller('ProgressNumbersCtrl', function(progressService) {
    var d, getNum, getNumbers, numbersToRequest, self;
    this.numbers = {};
    d = new Date('2018');
    this.numbers.date = "03/01/17";
    numbersToRequest = ['percentComplete', 'pagesProcessed', 'volumesProcessed', 'metadataComplete', 'metadataCompleteChange', 'volumesProcessedChange', 'pagesProcessedChange'];
    self = this;
    getNum = function(num) {
      return progressService.getNumber(num).then(function(res) {
        return self.numbers[res.name] = res.total;
      });
    };
    getNumbers = function() {
      var i, len, num, results;
      results = [];
      for (i = 0, len = numbersToRequest.length; i < len; i++) {
        num = numbersToRequest[i];
        results.push(getNum(num));
      }
      return results;
    };
    setInterval((function() {
      return getNumbers();
    }), 6000);
    setInterval((function() {
      return getNum('casesProcessed');
    }), 3000);
    getNumbers();
    getNum('casesProcessed');
  });

}).call(this);

(function() {
  angular.module('CAPmodule').controller('ProgressOverviewCtrl', function(progressService) {
    var getNumbers, numbersToRequest, self;
    self = this;
    this.complete = {};
    numbersToRequest = ['percentComplete'];
    getNumbers = function() {
      var i, len, num, results;
      results = [];
      for (i = 0, len = numbersToRequest.length; i < len; i++) {
        num = numbersToRequest[i];
        results.push(progressService.getNumber(num).then(function(res) {
          return self.complete[res.name] = parseInt(res.total);
        }));
      }
      return results;
    };
    setInterval(function() {
      return getNumbers();
    }, 60000);
    getNumbers();
  });

}).call(this);

(function() {
  angular.module('CAPmodule').controller('TopicCtrl', function($scope, TopicService, GraphService) {
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
  angular.module('CAPmodule').controller('TopicDashboardCtrl', function($http, $state) {
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
  angular.module('CAPmodule').controller('TopicTocCtrl', function(TopicService) {
    this.list = TopicService.topTopics;
    this.viewTopicDetails = function(topic) {
      return TopicService.currentTopic = topic;
    };
  });

}).call(this);

(function() {
  angular.module('CAPmodule').controller('WordcloudsCtrl', function(WordcloudService) {
    this.states = [];
    WordcloudService.getAvailableStates().then((function(_this) {
      return function(res) {
        return _this.states = res;
      };
    })(this));
    this.selectState = function(state) {
      this.currentState = state;
      return WordcloudService.getWordclouds(state).then((function(_this) {
        return function(images) {
          return _this.images = images;
        };
      })(this));
    };
    this.currentState = 'California';
    this.selectState(this.currentState);
  });

}).call(this);

(function() {
  angular.module('CAPmodule').directive('alignMiddle', function() {
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
  angular.module('CAPmodule').directive('clickOff', function($window) {
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
  angular.module('CAPmodule').directive('dotdotdot', function() {
    var obj;
    return obj = {
      template: "<span class=\"dot dot-one\"></span>\n<span class=\"dot dot-two\"></span>\n<span class=\"dot dot-three\"></span>",
      restrict: 'A',
      scope: {
        showIf: "="
      },
      link: function(scope, element, attrs) {}
    };
  });

}).call(this);

(function() {
  angular.module('CAPmodule').directive('usamap', function($compile, $rootScope, regionAndStateService) {
    return {
      templateUrl: 'assets/img/usa-simple.svg',
      restrict: 'A',
      link: function(scope, element, attrs) {
        var usamap;
        usamap = element.find('.usa-map');
        $rootScope.$on('map.clearAll', function() {
          regionAndStateService.clearAll();
          return usamap.removeClass('search-by-state').removeClass('search-by-region').removeClass('select-all');
        });
        $rootScope.$on('map.toggleSelectAll', function() {
          regionAndStateService.selectAll = !regionAndStateService.selectAll;
          if (regionAndStateService.selectAll) {
            usamap.removeClass('search-by-region').removeClass('search-by-state');
          }
          return usamap.toggleClass('select-all');
        });
        return $rootScope.$on('map.searchByRegion', function(elem, searchByRegion) {
          scope.searchByRegion = searchByRegion;
          scope.toggleRegion = function(el) {
            var regionElement, regionName;
            regionElement = angular.element(el.parent());
            regionName = el.attr('region');
            regionElement.toggleClass('active');
            return regionAndStateService.toggleRegion(regionName);
          };
          if (searchByRegion) {
            usamap.addClass('search-by-region').removeClass('search-by-state').removeClass('select-all').find('.state').on('click', function(evt) {
              var el;
              el = angular.element(this);
              return scope.toggleRegion(el);
            });
            return element.find('.state').removeClass('selected');
          } else {
            usamap.addClass('search-by-state').removeClass('search-by-region').removeClass('select-all');
            return regionAndStateService.clearRegions();
          }
        });
      }
    };
  }).directive('stateElement', function($compile, $window, regionAndStateService) {
    var obj;
    obj = {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var stateName, usamap;
        stateName = element.attr('title');
        usamap = angular.element('.usa-map');
        element.on('click', function() {
          var idx;
          if (usamap.hasClass('search-by-state')) {
            element.toggleClass('selected');
            if (element.hasClass('selected')) {
              return regionAndStateService.states.push(stateName);
            } else {
              idx = regionAndStateService.states.indexOf(stateName);
              return regionAndStateService.states.splice(idx, 1);
            }
          }
        });
        element.removeAttr("state-element");
        return $compile(element)(scope);
      }
    };
    return obj;
  });

}).call(this);

(function() {
  angular.module('CAPmodule').filter('mapcolor', function() {
    return function(input) {
      var b, g;
      b = 255 - Math.floor(input * 255);
      g = Math.floor(input * 255);
      return "rgba(255," + g + "," + b + ",1)";
    };
  });

}).call(this);

(function() {
  angular.module('CAPmodule').service('DefaultsService', function() {
    var obj;
    obj = {
      colors: ["#0075FF", "#D9D9D9", "#D2E7FF", "#ECA633", "#78B6FF", "#7ED321"],
      time: {
        min: 1850,
        max: 2014
      },
      scrollTop: function() {
        return $('html, body').animate({
          scrollTop: 0
        }, 'slow');
      }
    };
    return obj;
  });

}).call(this);

(function() {
  angular.module('CAPmodule').service('GraphService', function(TopicService, DefaultsService) {
    var newLineDataObj, newLineGraph, obj;
    newLineDataObj = function(key) {
      return {
        values: [],
        key: key,
        area: false,
        strokeWidth: 1,
        classed: 'line-graph'
      };
    };
    newLineGraph = function() {
      return {
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
      };
    };
    return obj = {
      defaults: {
        time: DefaultsService.time,
        colors: DefaultsService.colors
      },
      lineGraph: function() {
        return newLineGraph();
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
      parseNgramData: function(data) {
        var all_words, count, count_per_year, single_word_result, tmp_results, totals, val, word, year;
        count_per_year = {};
        tmp_results = {};
        all_words = [];
        for (word in data) {
          val = data[word];
          if (word === 'ERROR') {
            all_words['ERROR'] = val;
            continue;
          }
          totals = val['total_country'];
          single_word_result = newLineDataObj(word);
          for (year in totals) {
            count = totals[year];
            single_word_result.values.push({
              x: parseInt(year),
              y: count
            });
          }
          all_words.push(single_word_result);
        }
        return all_words;
      },
      parseLineChartData: function(data, timeRange) {
        var i, percent, ref, ref1, singleTopicData, topicName, val, value, year;
        for (topicName in data) {
          val = data[topicName];
          singleTopicData = newLineDataObj(topicName);
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
  angular.module('CAPmodule').service('LimerickService', function($http) {
    return {
      getLimerick: function() {
        return $http({
          method: 'GET',
          url: '/limerick'
        }).then(function(response) {
          return response.data;
        });
      },
      getList: function() {
        return $http({
          method: 'GET',
          url: '/limerick/all'
        }).then(function(response) {
          return response.data.limerick;
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('CAPmodule').service('NgramsService', function($http) {
    return {
      getWords: function(words) {
        return $http({
          method: 'GET',
          url: "/ngrams",
          params: {
            words: words
          }
        }).then(function(response) {
          return response.data;
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('CAPmodule').service("progressService", function($http) {
    var obj;
    return obj = {
      getNumber: function(requestedNumber) {
        return $http({
          method: 'GET',
          url: "/progress/" + requestedNumber
        }).then(function(res) {
          return res.data;
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('CAPmodule').service("regionDictionaryService", function() {
    var regions;
    regions = {
      new_england: ['maine', 'new_hampshire', 'vermont', 'massachusetts', 'rhode_island', 'connecticut'],
      middle_atlantic: ['new_york', 'pennsylvania', 'new_jersey'],
      east_north_central: ['wisconsin', 'michigan', 'illinois', 'indiana', 'ohio'],
      west_north_central: ['north_dakota', 'south_dakota', 'nebraska', 'kansas', 'minnesota', 'iowa', 'missouri'],
      south_atlantic: ['delaware', 'maryland', 'district_of_columbia', 'virginia', 'west_virginia', 'north_carolina', 'south_carolina', 'georgia', 'florida'],
      east_south_central: ['kentucky', 'tennessee', 'mississippi', 'alabama'],
      west_south_central: ['oklahoma', 'texas', 'arkansas', 'louisiana'],
      mountain: ['idaho', 'montana', 'wyoming', 'nevada', 'utah', 'colorado', 'arizona', 'new_mexico,'],
      pacific: ['alaska', 'washington', 'oregon', 'california', 'hawaii']
    };
    return regions;
  });

}).call(this);

(function() {
  angular.module('CAPmodule').service('regionAndStateService', function(regionDictionaryService) {
    var obj;
    return obj = {
      states: [],
      regions: {
        new_england: false,
        mountain: false,
        west_north_central: false,
        east_north_central: false,
        east_south_central: false,
        south_atlantic: false,
        middle_atlantic: false,
        pacific: false
      },
      toggleRegion: function(region) {
        return this.regions[region] = !this.regions[region];
      },
      clearRegions: function() {
        var key, ref, results, val;
        ref = this.regions;
        results = [];
        for (key in ref) {
          val = ref[key];
          results.push(this.regions[key] = false);
        }
        return results;
      },
      selectAll: false,
      getListOfStates: function() {
        var i, len, ref, region, statesList, val;
        if (this.selectAll) {
          return;
        }
        if (this.states.length) {
          return this.states;
        }
        statesList = [];
        ref = this.regions;
        for (val = i = 0, len = ref.length; i < len; val = ++i) {
          region = ref[val];
          if (this.regions[region]) {
            statesList.push(regionDictionaryService.region);
          }
        }
        return statesList;
      },
      clearAll: function() {
        this.clearRegions();
        this.states = [];
        return this.selectAll = false;
      }
    };
  });

}).call(this);

(function() {
  angular.module('CAPmodule').service("TopicService", function($http, $stateParams, regionAndStateService) {
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
        var jsonTopic, statesList;
        statesList = regionAndStateService.getListOfStates();
        jsonTopic = JSON.stringify(topics);
        return $http({
          method: 'GET',
          url: "/topics/",
          params: {
            topics: jsonTopic,
            states: statesList
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

(function() {
  angular.module('CAPmodule').service('WordcloudService', function($http) {
    return {
      getAvailableStates: function() {
        return $http({
          method: 'GET',
          url: '/wordclouds/list-states'
        }).then(function(response) {
          return response.data.states;
        });
      },
      getWordclouds: function(state) {
        return $http({
          method: 'GET',
          url: "/wordclouds/" + state
        }).then(function(response) {
          return response.data.images;
        });
      }
    };
  });

}).call(this);
;angular.module('templates-main', ['../../templates/dashboard.tpl.jade', '../../templates/limericks.tpl.jade', '../../templates/main-toc.tpl.jade', '../../templates/map.tpl.jade', '../../templates/multi-topics.tpl.jade', '../../templates/ngrams.tpl.jade', '../../templates/progress.numbers.tpl.jade', '../../templates/progress.overview.tpl.jade', '../../templates/progress.tpl.jade', '../../templates/projects.tpl.jade', '../../templates/single-topic.tpl.jade', '../../templates/topic-toc-container.tpl.jade', '../../templates/topic.dashboard.tpl.jade', '../../templates/wordclouds.tpl.jade']);

angular.module("../../templates/dashboard.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/dashboard.tpl.jade",
    "<div ng-controller=\"DashboardCtrl as dashboard\" class=\"dashboard-container\"><div class=\"dashboard-title-container\"><img src=\"./assets/img/logo-medium-blue.svg\" class=\"ftl-logo\"><h1 class=\"text-center\"> <span>CASELAW ACCESS PROJECT </span></h1><h4 class=\"text-center\">See our progress live!<br><span class=\"blue-text\"> <a href=\"http://librarylab.law.harvard.edu/projects/caselaw-access-project\" target=\"_blank\" class=\"read-more\">Or read more about the project...</a></span></h4></div><div class=\"mountain-container\"><img src=\"../assets/img/mountains.png\" class=\"mountains img-responsive\"></div><div class=\"meta-container col-sm-12 black-container\"><div ng-controller=\"ProgressNumbersCtrl as pnc\" class=\"progress-numbers-container container-generic\"><div class=\"header\"><a name=\"popular\">&nbsp;</a><div class=\"title\">PROJECT PROGRESS</div><div class=\"subtitle\">Watch the numbers go up and up</div></div><div class=\"col-centered-small\"><div class=\"col-sm-12 col-centered\"><div class=\"col-sm-4\"><div class=\"col-sm-10 col-centered\"></div><div class=\"small-subtitle\">PERCENT COMPLETE</div><div ng-show=\"!pnc.numbers.percentComplete\" class=\"progressdots\"><span class=\"dot dot-one\"></span><span class=\"dot dot-two\"></span><span class=\"dot dot-three\"></span></div><div class=\"number big-text\">{{ pnc.numbers.percentComplete }}%</div></div><div class=\"col-sm-4\"><div class=\"col-sm-10 col-centered\"></div><div class=\"small-subtitle\">ESTIMATED SCANNING COMPLETION DATE</div><div class=\"number\">{{ pnc.numbers.date }}</div></div><div class=\"col-sm-4\"><div class=\"col-sm-10 col-centered\"></div><div class=\"small-subtitle\">METADATA COMPLETE</div><dotdotdot ng-show=\"!pnc.numbers.metadataComplete\" class=\"progressdots\"></dotdotdot><div class=\"number\">{{ pnc.numbers.metadataComplete |  number : fractionSize }}</div></div></div></div><div class=\"col-centered-small\"><div class=\"col-sm-12 col-centered\"><div class=\"col-sm-4\"><div class=\"col-sm-10 col-centered\"></div><div class=\"small-subtitle\">TOTAL PAGES PROCESSED</div><div ng-show=\"!pnc.numbers.pagesProcessed\" class=\"progressdots\"><span class=\"dot dot-one\"></span><span class=\"dot dot-two\"></span><span class=\"dot dot-three\"></span></div><div class=\"number\">{{ pnc.numbers.pagesProcessed | number : fractionSize }}</div></div><div class=\"col-sm-4\"><div class=\"col-sm-10 col-centered\"></div><div class=\"small-subtitle\">TOTAL VOLUMES PROCESSED</div><div ng-show=\"!pnc.numbers.volumesProcessed\" class=\"progressdots\"><span class=\"dot dot-one\"></span><span class=\"dot dot-two\"></span><span class=\"dot dot-three\"></span></div><div class=\"number\">{{ pnc.numbers.volumesProcessed |  number : fractionSize }}</div></div><div class=\"col-sm-4\"><div class=\"col-sm-10 col-centered\"></div><div class=\"small-subtitle\">TOTAL CASES PROCESSED</div><div class=\"number\">{{ pnc.numbers.casesProcessed |  number : fractionSize }}</div></div></div></div></div></div><div class=\"meta-container col-sm-12\"><div ng-controller=\"DashboardCtrl as d\" class=\"container-generic\"><div class=\"header blue-text\"><div class=\"title\">DATA EXPLORATIONS</div><div class=\"subtitle blue-text\">TAKE A LOOK AT SOME OF THE THINGS  YOU CAN DO WITH THE DATA</div></div><div style=\"padding:0px 0px 80px;\" class=\"row\"><div class=\"col-sm-6 col-centered content\"><div class=\"col-sm-3\"><a ng-click=\"d.gotowordclouds()\" class=\"no-underline\"> <div class=\"button-round button-round-blue\">WORD CLOUDS</div></a></div><div class=\"col-sm-3\"><a ng-click=\"d.gototopics()\" class=\"no-underline\"> <div class=\"button-round button-round-blue\">TOPIC MAPPER</div></a></div><div class=\"col-sm-3\"><a ng-click=\"d.gotolimericks()\" class=\"no-underline\"> <div class=\"button-round button-round-blue\">LIMERICKS</div></a></div><div class=\"col-sm-3\"><a ng-click=\"d.gotongrams()\" class=\"no-underline\"><div class=\"button-round button-round-blue\">WORD FREQUENCY</div></a></div></div></div></div></div></div>");
}]);

angular.module("../../templates/limericks.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/limericks.tpl.jade",
    "<div ng-controller=\"LimericksCtrl as lc\" class=\"wordclouds-container\"><div style=\"background-color:#F6F6F1;\" class=\"wordclouds-title-container\"><a href=\"/\"><img src=\"./assets/img/logo-medium-blue.svg\" class=\"ftl-logo\"></a><h1 class=\"text-center\"> <span>CASELAW ACCESS PROJECT </span></h1><h4 class=\"text-center\">RANDOM LAW LIMERICK<br><span class=\"blue-text\"> <a href=\"http://librarylab.law.harvard.edu/projects/caselaw-access-project\" target=\"_blank\" class=\"read-more\">read more...</a></span></h4></div><div class=\"container-generic limerick-container\"><div class=\"container\"><div class=\"col col-centered\"><button style=\"margin-top: 10px;\" ng-click=\"lc.generate()\" class=\"big-push-button\">GENERATE ANOTHER!</button></div><ul ng-if=\"lc.limerick\" class=\"content col-centered col-sm-6\"><li ng-repeat=\"line in lc.limerick\" class=\"limerick-line\"> \n" +
    "{{line}}</li></ul></div></div></div>");
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

angular.module("../../templates/map.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/map.tpl.jade",
    "<div ng-controller=\"MapCtrl as mc\" class=\"progress-container\"><div class=\"progress-title-container\"><button ng-click=\"mc.toggleRegions(false)\">EXPLORE BY STATE</button><button ng-click=\"mc.toggleRegions(true)\">EXPLORE BY REGION</button><button ng-click=\"mc.toggleSelectAll()\">SELECT ALL</button><div usamap></div><button ng-click=\"mc.calculateStates()\">GO</button><button ng-click=\"mc.reset()\">RESET</button></div></div>");
}]);

angular.module("../../templates/multi-topics.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/multi-topics.tpl.jade",
    "<div ng-controller=\"MultiTopicCtrl as mt\" class=\"multi-topics-container\"><div class=\"col-sm-12\"><div class=\"topic-header\"><a name=\"multitopics\"></a><div class=\"title\"> <span>COMPARE TOPICS </span><span>FROM </span><span><input type=\"number\" min=\"1800\" ng-model=\"mt.time.min\" ng-max=\"mt.time.max\" ng-blur=\"mt.reloadTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; mt.reloadTopicData()\"></span><span>TO </span><span> <input type=\"number\" max=\"2015\" ng-min=\"mt.time.min\" ng-model=\"mt.time.max\" ng-blur=\"mt.reloadTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; mt.reloadTopicData()\"></span></div></div></div><div class=\"col-sm-2 topic-menu\"><ul><li ng-click=\"mt.reset()\" ng-disable=\"mt.topics.length === 0\" class=\"single-topic\">RESET</li><li ng-click=\"mt.toggleTopic(topic)\" ng-class=\"{'selected':val.selected}\" ng-repeat=\"(topic,val) in mt.topics\" data-show=\"show\" class=\"single-topic\">{{ topic }}</li></ul></div><div class=\"col-sm-10\"><nvd3 options=\"mt.graph.options\" data=\"mt.graph.data\" config=\"mt.graph.config\" api=\"mt.graph.api\" class=\"multi-topic-graph\"></nvd3><div class=\"topic-legend-container multi-topic-legend col-sm-12\"><div class=\"topic-legend-content\"></div></div></div></div>");
}]);

angular.module("../../templates/ngrams.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/ngrams.tpl.jade",
    "<div ng-controller=\"NgramsCtrl as nc\" class=\"wordclouds-container\"><div class=\"wordclouds-title-container container-generic-tan\"><a href=\"/\"><img src=\"./assets/img/logo-medium-blue.svg\" class=\"ftl-logo\"></a><h1 class=\"text-center\"> <span>CASELAW ACCESS PROJECT </span></h1><h4 class=\"text-center\">EXPLORE THE WORDS!<br><span class=\"blue-text\"> <a href=\"http://librarylab.law.harvard.edu/projects/caselaw-access-project\" target=\"_blank\" class=\"read-more\">read more...</a></span></h4></div><div ng-if=\"nc.error\" class=\"container alert alert-warning\"><ul class=\"col-sm-8 col-centered\"><li style=\"float: left;\" ng-repeat=\"error in nc.error track by $index\">\"{{error.toUpperCase()}}\" &nbsp;<span ng-if=\"($index &gt; -1) &amp;&amp; ($index &lt; nc.error.length - 1)\">AND &nbsp; </span></li><span style=\"float:left;\" ng-if=\"nc.error.length &gt; 1\">WERE NOT FOUND</span><span style=\"float:left;\" ng-if=\"nc.error.length == 1\">WAS NOT FOUND</span></ul></div><div class=\"container-generic\"><form class=\"ngram-input-container col-sm-10 col-centered\"><input ng-submit=\"nc.findWords()\" ng-model=\"nc.words\" class=\"ngram-input col-sm-10\"><div class=\"col-sm-2\"><button ng-click=\"nc.findWords()\" class=\"ngram-button btn-default btn\">SEARCH</button></div><div class=\"nrgams-instructions col-sm-12\">We don't store common words or ones shorter than three characters</div></form>\n" +
    "<div class=\"container\"><div ng-if=\"nc.graph.data.length\" class=\"col-sm-10 col-centered\"><nvd3 options=\"nc.graph.options\" data=\"nc.graph.data\" config=\"nc.graph.config\" api=\"nc.graph.api\" class=\"ngram single-topic-graph\"></nvd3></div></div></div></div>");
}]);

angular.module("../../templates/progress.numbers.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/progress.numbers.tpl.jade",
    "<div ng-controller=\"ProgressNumbersCtrl as pnc\" class=\"progress-numbers-container container-generic\"><div class=\"header\"><a name=\"popular\">&nbsp;</a><div class=\"title\">PROJECT PROGRESS</div><div class=\"subtitle\">Watch the numbers go up and up</div></div><div class=\"col-centered-small\"><div class=\"col-sm-12 col-centered\"><div class=\"col-sm-4\"><div class=\"col-sm-10 col-centered\"></div><div class=\"small-subtitle\">PERCENT COMPLETE</div><div ng-show=\"!pnc.numbers.percentComplete\" class=\"progressdots\"><span class=\"dot dot-one\"></span><span class=\"dot dot-two\"></span><span class=\"dot dot-three\"></span></div><div class=\"number big-text\">{{ pnc.numbers.percentComplete }}%</div></div><div class=\"col-sm-4\"><div class=\"col-sm-10 col-centered\"></div><div class=\"small-subtitle\">ESTIMATED SCANNING COMPLETION DATE</div><div class=\"number\">{{ pnc.numbers.date }}</div></div><div class=\"col-sm-4\"><div class=\"col-sm-10 col-centered\"></div><div class=\"small-subtitle\">METADATA COMPLETE</div><dotdotdot ng-show=\"!pnc.numbers.metadataComplete\" class=\"progressdots\"></dotdotdot><div class=\"number\">{{ pnc.numbers.metadataComplete |  number : fractionSize }}</div></div></div></div><div class=\"col-centered-small\"><div class=\"col-sm-12 col-centered\"><div class=\"col-sm-4\"><div class=\"col-sm-10 col-centered\"></div><div class=\"small-subtitle\">TOTAL PAGES PROCESSED</div><div ng-show=\"!pnc.numbers.pagesProcessed\" class=\"progressdots\"><span class=\"dot dot-one\"></span><span class=\"dot dot-two\"></span><span class=\"dot dot-three\"></span></div><div class=\"number\">{{ pnc.numbers.pagesProcessed | number : fractionSize }}</div></div><div class=\"col-sm-4\"><div class=\"col-sm-10 col-centered\"></div><div class=\"small-subtitle\">TOTAL VOLUMES PROCESSED</div><div ng-show=\"!pnc.numbers.volumesProcessed\" class=\"progressdots\"><span class=\"dot dot-one\"></span><span class=\"dot dot-two\"></span><span class=\"dot dot-three\"></span></div><div class=\"number\">{{ pnc.numbers.volumesProcessed |  number : fractionSize }}</div></div><div class=\"col-sm-4\"><div class=\"col-sm-10 col-centered\"></div><div class=\"small-subtitle\">TOTAL CASES PROCESSED</div><div class=\"number\">{{ pnc.numbers.casesProcessed |  number : fractionSize }}</div></div></div></div></div>");
}]);

angular.module("../../templates/progress.overview.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/progress.overview.tpl.jade",
    "<div ng-controller=\"ProgressOverviewCtrl as overview\" class=\"container-generic container-overview col-sm-12\"><div class=\"header\"><a name=\"popular\">&nbsp;</a><div class=\"title\">AT A GLANCE</div></div><div class=\"col-sm-8 col-centered\"><div class=\"progressbar col-sm-12\"><div ng-style=\"{'width':overview.complete.percentComplete+ '%'}\" class=\"progressbar-active\"></div></div><div class=\"overview-subtitle\">PERCENT COMPLETE<span class=\"pull-right percent-num\">{{overview.complete.percentComplete}}%</span></div></div></div>");
}]);

angular.module("../../templates/progress.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/progress.tpl.jade",
    "<div ng-controller=\"DashboardCtrl\" class=\"progress-container\"><div class=\"progress-title-container\"><img src=\"./assets/img/logo-medium-blue.svg\" class=\"ftl-logo\"><h1 class=\"text-center\"> <span class=\"blue-text\">FTL </span><span>TOPIC EXPLORER</span></h1><h4 class=\"text-center\">Explore topics and trends in California law<br><span class=\"blue-text\"> <a href=\"http://librarylab.law.harvard.edu/projects/caselaw-access-project\" target=\"_blank\" class=\"read-more\">read more...</a></span></h4></div><div class=\"mountain-container\"><img src=\"../assets/img/mountains.png\" class=\"mountains img-responsive\"></div></div>");
}]);

angular.module("../../templates/projects.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/projects.tpl.jade",
    "<div ng-controller=\"DashboardCtrl as d\" class=\"container-generic\"><div class=\"header blue-text\"><div class=\"title\">DATA EXPLORATIONS</div><div class=\"subtitle blue-text\">TAKE A LOOK AT SOME OF THE THINGS  YOU CAN DO WITH THE DATA</div></div><div style=\"padding:0px 0px 80px;\" class=\"row\"><div class=\"col-sm-6 col-centered content\"><div class=\"col-sm-3\"><a ng-click=\"d.gotowordclouds()\" class=\"no-underline\"> <div class=\"button-round button-round-blue\">WORD CLOUDS</div></a></div><div class=\"col-sm-3\"><a ng-click=\"d.gototopics()\" class=\"no-underline\"> <div class=\"button-round button-round-blue\">TOPIC MAPPER</div></a></div><div class=\"col-sm-3\"><a ng-click=\"d.gotolimericks()\" class=\"no-underline\"> <div class=\"button-round button-round-blue\">LIMERICKS</div></a></div><div class=\"col-sm-3\"><a ng-click=\"d.gotongrams()\" class=\"no-underline\"><div class=\"button-round button-round-blue\">WORD FREQUENCY</div></a></div></div></div></div>");
}]);

angular.module("../../templates/single-topic.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/single-topic.tpl.jade",
    "<div ng-controller=\"TopicCtrl as st\" class=\"single-topic-container\"><div class=\"containter\"><div class=\"col-sm-12\"><div ng-if=\"st.currentTopic\" class=\"topic-header\"><a name=\"singletopic\">&nbsp;</a><div class=\"title\"><span>{{st.currentTopic}}</span><span> FROM </span><span><input type=\"number\" min=\"1800\" ng-model=\"st.time.min\" ng-max=\"st.time.max\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"></span><span> </span> TO <span><input type=\"number\" max=\"2015\" ng-min=\"st.time.min\" ng-model=\"st.time.max\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"></span></div></div></div><div class=\"col-sm-2 topic-menu\"><ul><li ng-repeat=\"(topic,val) in st.topics\" ng-click=\"st.changeCurrentTopic(topic)\" ng-class=\"{'selected':st.currentTopic == topic}\" class=\"single-topic\">{{ topic }}</li></ul></div><div class=\"col-sm-10\"><nvd3 ng-if=\"st.graph.data\" options=\"st.graph.options\" data=\"st.graph.data\" config=\"st.graph.config\" api=\"st.graph.api\" class=\"single-topic-graph\"></nvd3><div class=\"topic-legend-container\"><div class=\"topic-legend-content\"><div class=\"legend-item\"><div class=\"color-spot case-one\"></div><span class=\"item-title\">Supreme Court cases</span></div><div class=\"legend-item\"><div class=\"color-spot case-two\"></div><span class=\"item-title\">Appeals Court cases</span></div><div class=\"legend-item\"><div class=\"color-spot dissent-one\"></div><span class=\"item-title\">Supreme Court dissents</span></div><div class=\"legend-item\"><div class=\"color-spot dissent-two\"></div><span class=\"item-title\">Appeals Court dissents</span></div></div></div><div class=\"keyword-list\">Keywords: {{st.topicKeywords.join(', ')}}</div></div></div></div>");
}]);

angular.module("../../templates/topic-toc-container.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/topic-toc-container.tpl.jade",
    "<div ng-controller=\"TopicTocCtrl as toc\" class=\"toc-container col-sm-12\"><div class=\"container\"><div class=\"toc-header\"><a name=\"popular\">&nbsp;</a><div class=\"title\">POPULAR TOPICS</div><div class=\"subtitle\">Click on a topic for more details</div></div><div class=\"col-sm-12\"><div class=\"col-sm-6\"><ul ng-repeat=\"topicArray in toc.list track by $index\"><a href=\"#singletopic\" target=\"_self\"><li ng-if=\"$index &lt; 4\" ng-click=\"toc.viewTopicDetails(topicArray[0])\"><span class=\"topic-title\">{{topicArray[0]}} </span><span class=\"pull-right total-count\">{{topicArray[1][0]}}</span></li></a></ul></div><div class=\"col-sm-6\"><ul ng-repeat=\"topicArray in toc.list track by $index\"><a href=\"#singletopic\" target=\"_self\"><li ng-if=\"$index &gt;= 4 &amp;&amp; $index &lt; 8\" ng-click=\"toc.viewTopicDetails(topicArray[0])\"><span class=\"topic-title\">{{topicArray[0]}} </span><span class=\"pull-right total-count\">{{topicArray[1][0]}}</span></li></a></ul></div></div></div></div>");
}]);

angular.module("../../templates/topic.dashboard.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/topic.dashboard.tpl.jade",
    "<div ng-controller=\"TopicDashboardCtrl\" class=\"topic-container\"><div style=\"background-color:#F6F6F1;\" class=\"topic-title-container\"><a href=\"/\"><img src=\"./assets/img/logo-medium-blue.svg\" class=\"ftl-logo\"></a><h1 class=\"text-center\"> <span>CASELAW ACCESS PROJECT </span></h1><h4 class=\"text-center\">Explore topics and trends in <span>California </span><span>law</span><br><span class=\"blue-text\"> <a href=\"http://librarylab.law.harvard.edu/projects/caselaw-access-project\" target=\"_blank\" class=\"read-more\">read more...</a></span></h4></div><div class=\"meta-container col-sm-12\"><div ng-controller=\"TopicTocCtrl as toc\" class=\"toc-container col-sm-12\"><div class=\"container\"><div class=\"toc-header\"><a name=\"popular\">&nbsp;</a><div class=\"title\">POPULAR TOPICS</div><div class=\"subtitle\">Click on a topic for more details</div></div><div class=\"col-sm-12\"><div class=\"col-sm-6\"><ul ng-repeat=\"topicArray in toc.list track by $index\"><a href=\"#singletopic\" target=\"_self\"><li ng-if=\"$index &lt; 4\" ng-click=\"toc.viewTopicDetails(topicArray[0])\"><span class=\"topic-title\">{{topicArray[0]}} </span><span class=\"pull-right total-count\">{{topicArray[1][0]}}</span></li></a></ul></div><div class=\"col-sm-6\"><ul ng-repeat=\"topicArray in toc.list track by $index\"><a href=\"#singletopic\" target=\"_self\"><li ng-if=\"$index &gt;= 4 &amp;&amp; $index &lt; 8\" ng-click=\"toc.viewTopicDetails(topicArray[0])\"><span class=\"topic-title\">{{topicArray[0]}} </span><span class=\"pull-right total-count\">{{topicArray[1][0]}}</span></li></a></ul></div></div></div></div></div><div class=\"section-divider col-sm-12\"><div class=\"border-gray\"></div><div class=\"section-icon icon-bar-chart\"></div></div><div class=\"meta-container col-sm-12\"><div ng-controller=\"TopicCtrl as st\" class=\"single-topic-container\"><div class=\"containter\"><div class=\"col-sm-12\"><div ng-if=\"st.currentTopic\" class=\"topic-header\"><a name=\"singletopic\">&nbsp;</a><div class=\"title\"><span>{{st.currentTopic}}</span><span> FROM </span><span><input type=\"number\" min=\"1800\" ng-model=\"st.time.min\" ng-max=\"st.time.max\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"></span><span> </span> TO <span><input type=\"number\" max=\"2015\" ng-min=\"st.time.min\" ng-model=\"st.time.max\" ng-blur=\"st.parseTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; st.parseTopicData()\"></span></div></div></div><div class=\"col-sm-2 topic-menu\"><ul><li ng-repeat=\"(topic,val) in st.topics\" ng-click=\"st.changeCurrentTopic(topic)\" ng-class=\"{'selected':st.currentTopic == topic}\" class=\"single-topic\">{{ topic }}</li></ul></div><div class=\"col-sm-10\"><nvd3 ng-if=\"st.graph.data\" options=\"st.graph.options\" data=\"st.graph.data\" config=\"st.graph.config\" api=\"st.graph.api\" class=\"single-topic-graph\"></nvd3><div class=\"topic-legend-container\"><div class=\"topic-legend-content\"><div class=\"legend-item\"><div class=\"color-spot case-one\"></div><span class=\"item-title\">Supreme Court cases</span></div><div class=\"legend-item\"><div class=\"color-spot case-two\"></div><span class=\"item-title\">Appeals Court cases</span></div><div class=\"legend-item\"><div class=\"color-spot dissent-one\"></div><span class=\"item-title\">Supreme Court dissents</span></div><div class=\"legend-item\"><div class=\"color-spot dissent-two\"></div><span class=\"item-title\">Appeals Court dissents</span></div></div></div><div class=\"keyword-list\">Keywords: {{st.topicKeywords.join(', ')}}</div></div></div></div></div><div class=\"section-divider col-sm-12\"><div class=\"border-gray\"></div><div class=\"section-icon icon-line-chart\"></div></div><div class=\"meta-container col-sm-12\"><div ng-controller=\"MultiTopicCtrl as mt\" class=\"multi-topics-container\"><div class=\"col-sm-12\"><div class=\"topic-header\"><a name=\"multitopics\"></a><div class=\"title\"> <span>COMPARE TOPICS </span><span>FROM </span><span><input type=\"number\" min=\"1800\" ng-model=\"mt.time.min\" ng-max=\"mt.time.max\" ng-blur=\"mt.reloadTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; mt.reloadTopicData()\"></span><span>TO </span><span> <input type=\"number\" max=\"2015\" ng-min=\"mt.time.min\" ng-model=\"mt.time.max\" ng-blur=\"mt.reloadTopicData()\" ng-keyup=\"$event.keyCode == 13 &amp;&amp; mt.reloadTopicData()\"></span></div></div></div><div class=\"col-sm-2 topic-menu\"><ul><li ng-click=\"mt.reset()\" ng-disable=\"mt.topics.length === 0\" class=\"single-topic\">RESET</li><li ng-click=\"mt.toggleTopic(topic)\" ng-class=\"{'selected':val.selected}\" ng-repeat=\"(topic,val) in mt.topics\" data-show=\"show\" class=\"single-topic\">{{ topic }}</li></ul></div><div class=\"col-sm-10\"><nvd3 options=\"mt.graph.options\" data=\"mt.graph.data\" config=\"mt.graph.config\" api=\"mt.graph.api\" class=\"multi-topic-graph\"></nvd3><div class=\"topic-legend-container multi-topic-legend col-sm-12\"><div class=\"topic-legend-content\"></div></div></div></div></div></div>");
}]);

angular.module("../../templates/wordclouds.tpl.jade", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../../templates/wordclouds.tpl.jade",
    "<div ng-controller=\"WordcloudsCtrl as wc\" class=\"wordclouds-container\"><div class=\"container-generic-tan\"><a href=\"/\" class=\"container-title-logo\"><img src=\"./assets/img/logo-medium-blue.svg\" class=\"ftl-logo\"></a><h1 class=\"text-center\"> <span>CASELAW ACCESS PROJECT </span></h1><h4 class=\"text-center\">Explore the wordclouds!<br><span class=\"blue-text\"> <a href=\"http://librarylab.law.harvard.edu/projects/caselaw-access-project\" target=\"_blank\" class=\"read-more\">read more...</a></span></h4></div><div class=\"container-generic\"><div class=\"col-sm-4\"><div style=\"margin-bottom: 30px; position: relative;\" class=\"btn-group col-centered\"><span ng-if=\"wc.currentState\" data-toggle=\"dropdown\"><button type=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-default dropdown-toggle\">{{wc.currentState.toUpperCase()}} WORDCLOUDS</button></span><span ng-if=\"!wc.currentState\" data-toggle=\"dropdown\"><button type=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-default dropdown-toggle\">SELECT A STATE</button></span><ul class=\"dropdown-menu\"><li ng-repeat=\"state in wc.states\"> <a ng-click=\"wc.selectState(state)\">{{state}}</a></li></ul></div></div><div class=\"col-sm-12\"><ul><li ng-repeat=\"image in wc.images\" class=\"col-sm-4 wordcloud-item\"><label ng-if=\"image.indexOf('totals') &gt; -1\" class=\"col-sm-12\">{{image.substr(image.length - 10)}}</label><label ng-if=\"image.indexOf('totals') &lt; 0\" class=\"col-sm-12\">{{image.substr(image.length - 8)}}</label><a href=\"{{image}}\" class=\"col-sm-12\"><img src=\"{{image}}\" class=\"col-sm-12 wordcloud-images\"></a></li></ul></div></div></div>");
}]);
