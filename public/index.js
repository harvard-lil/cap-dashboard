angular.module('app', []).controller('MainCtrl', function($http) {
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
  $http({
    method: 'GET',
    url: '/topic/custody'
  }).then((function(_this) {
    return function(response) {
      var parsedData;
      parsedData = _this.parseTopicData(response.data);
      return _this.generateBarChart(parsedData);
    };
  })(this), function(response) {
    return console.log("something bad");
  });
  this.parseTopicData = function(data) {
    var allCounts, i, ref, ref1, ref2, ref3, ref4, ref5, year;
    allCounts = {
      case_counts: [],
      SC_counts: [],
      dissent_counts: [],
      SC_dissent_counts: []
    };
    for (year = i = ref = defaults.minYear, ref1 = defaults.maxYear; ref <= ref1 ? i <= ref1 : i >= ref1; year = ref <= ref1 ? ++i : --i) {
      allCounts.case_counts.push(((ref2 = data[year]) != null ? ref2[0] : void 0) || 0);
      allCounts.SC_counts.push(((ref3 = data[year]) != null ? ref3[1] : void 0) || 0);
      allCounts.dissent_counts.push(((ref4 = data[year]) != null ? ref4[2] : void 0) || 0);
      allCounts.SC_dissent_counts.push(((ref5 = data[year]) != null ? ref5[3] : void 0) || 0);
    }
    return allCounts;
  };
  return this.generateBarChart = function(topicData) {
    var barChartData, count, ctx, d, i, ref, ref1, results, val;
    barChartData = {
      labels: (function() {
        results = [];
        for (var i = ref = defaults.minYear, ref1 = defaults.maxYear; ref <= ref1 ? i <= ref1 : i >= ref1; ref <= ref1 ? i++ : i--){ results.push(i); }
        return results;
      }).apply(this),
      datasets: []
    };
    for (d in topicData) {
      val = topicData[d];
      count = {};
      count.fillColor = defaults.colors[d];
      count.strokeColor = defaults.colors[d];
      count.highlightFill = 'rgba(220,220,220,1)';
      count.highlightStroke = 'rgba(220,220,220,1)';
      count.data = topicData[d];
      barChartData.datasets.push(count);
    }
    ctx = document.getElementById("canvas").getContext("2d");
    return window.myBar = new Chart(ctx).Bar(barChartData, {
      responsive: true
    });
  };
});
