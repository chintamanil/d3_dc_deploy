(function() {
  angular.module("d3_data").controller("D3jsCtrl", function($scope) {
    return d3.csv("ndx.csv", function(data) {
      var all, dateFormat, ndx, numberFormat, s;
      dateFormat = d3.time.format("%m/%d/%Y");
      numberFormat = d3.format(".2f");
      s = $scope;
      s.colorbrewer = colorbrewer;
      data.forEach(function(d) {
        d.dd = dateFormat.parse(d.date);
        d.month = d3.time.month(d.dd);
        d.close = +d.close;
        return d.open = +d.open;
      });
      ndx = s.ndx = crossfilter(data);
      all = s.all = ndx.groupAll();
      s.yearlyDimension = ndx.dimension(function(d) {
        return d3.time.year(d.dd).getFullYear();
      });
      s.yearlyPerformanceGroup = s.yearlyDimension.group().reduce(function(p, v) {
        ++p.count;
        p.absGain += v.close - v.open;
        p.fluctuation += Math.abs(v.close - v.open);
        p.sumIndex += (v.open + v.close) / 2;
        p.avgIndex = p.sumIndex / p.count;
        p.percentageGain = (p.absGain / p.avgIndex) * 100;
        p.fluctuationPercentage = (p.fluctuation / p.avgIndex) * 100;
        return p;
      }, function(p, v) {
        --p.count;
        p.absGain -= v.close - v.open;
        p.fluctuation -= Math.abs(v.close - v.open);
        p.sumIndex -= (v.open + v.close) / 2;
        p.avgIndex = p.sumIndex / p.count;
        p.percentageGain = (p.absGain / p.avgIndex) * 100;
        p.fluctuationPercentage = (p.fluctuation / p.avgIndex) * 100;
        return p;
      }, function() {
        return {
          count: 0,
          absGain: 0,
          fluctuation: 0,
          fluctuationPercentage: 0,
          sumIndex: 0,
          avgIndex: 0,
          percentageGain: 0
        };
      });
      s.dateDimension = ndx.dimension(function(d) {
        return d.dd;
      });
      s.moveMonths = ndx.dimension(function(d) {
        return d.month;
      });
      s.monthlyMoveGroup = s.moveMonths.group().reduceSum(function(d) {
        return Math.abs(d.close - d.open);
      });
      s.volumeByMonthGroup = s.moveMonths.group().reduceSum(function(d) {
        return d.volume / 500000;
      });
      s.indexAvgByMonthGroup = s.moveMonths.group().reduce(function(p, v) {
        ++p.days;
        p.total += (v.open + v.close) / 2;
        p.avg = Math.round(p.total / p.days);
        return p;
      }, function(p, v) {
        --p.days;
        p.total -= (v.open + v.close) / 2;
        p.avg = (p.days ? Math.round(p.total / p.days) : 0);
        return p;
      }, function() {
        return {
          days: 0,
          total: 0,
          avg: 0
        };
      });
      s.gainOrLoss = ndx.dimension(function(d) {
        if (d.open > d.close) {
          return "Loss";
        } else {
          return "Gain";
        }
      });
      s.gainOrLossGroup = s.gainOrLoss.group();
      s.fluctuation = ndx.dimension(function(d) {
        return Math.round((d.close - d.open) / d.open * 100);
      });
      s.fluctuationGroup = s.fluctuation.group();
      s.quarter = ndx.dimension(function(d) {
        var month;
        month = d.dd.getMonth();
        if (month <= 2) {
          return "Q1";
        } else if (month > 3 && month <= 5) {
          return "Q2";
        } else if (month > 5 && month <= 8) {
          return "Q3";
        } else {
          return "Q4";
        }
      });
      s.quarterGroup = s.quarter.group().reduceSum(function(d) {
        return d.volume;
      });
      s.dayOfWeek = ndx.dimension(function(d) {
        var day, name;
        day = d.dd.getDay();
        name = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return day + "." + name[day];
      });
      s.dayOfWeekGroup = s.dayOfWeek.group();
      s.gainOrLossChartLabel = function(d) {
        if (this.hasFilter() && !this.hasFilter(d.key)) {
          return d.key + "(0%)";
        }
        return d.key + "(" + Math.floor(d.value / all.value() * 100) + "%)";
      };
      s.bubbleChartOptions = {
        colorAccessor: function(d) {
          return d.value.absGain;
        },
        keyAccessor: function(p) {
          return p.value.absGain;
        },
        valueAccessor: function(p) {
          return p.value.percentageGain;
        },
        radiusValueAccessor: function(p) {
          return p.value.fluctuationPercentage;
        },
        label: function(p) {
          return p.key;
        },
        title: function(p) {
          return [p.key, "Index Gain: " + numberFormat(p.value.absGain), "Index Gain in Percentage: " + numberFormat(p.value.percentageGain) + "%", "Fluctuation / Index Ratio: " + numberFormat(p.value.fluctuationPercentage) + "%"].join("\n");
        }
      };
      s.fluctuationChartOptions = {
        filterPrinter: function(filters) {
          var filter;
          filter = filters[0];
          s = "";
          s += numberFormat(filter[0]) + "% -> " + numberFormat(filter[1]) + "%";
          return s;
        }
      };
      s.fluctuationChartPostSetupChart = function(c) {
        c.xAxis().tickFormat(function(v) {
          return v + "%";
        });
        return c.yAxis().ticks(5);
      };
      s.moveChartOptions = {
        valueAccessor: function(d) {
          return d.value.avg;
        },
        title: function(d) {
          var value;
          value = (d.value.avg ? d.value.avg : d.value);
          if (isNaN(value)) {
            value = 0;
          }
          return dateFormat(d.key) + "\n" + numberFormat(value);
        }
      };
      s.moveChartPostSetupChart = function(c) {
        c.stack(s.monthlyMoveGroup, "Monthly Index Move", function(d) {
          return d.value;
        });
        return c.group(s.indexAvgByMonthGroup, "Monthly Index Average");
      };
      s.dayOfWeekPostSetupChart = function(c) {
        return c.label(function(d) {
          return d.key.split(".")[1];
        }).title(function(d) {
          return d.value;
        }).xAxis().ticks(4);
      };
      s.tableGroup = function(d) {
        var format;
        format = d3.format("02d");
        return d.dd.getFullYear() + "/" + format(d.dd.getMonth() + 1);
      };
      s.tablePostSetupChart = function(c) {
        return c.columns([
          function(d) {
            return d.date;
          }, function(d) {
            return numberFormat(d.open);
          }, function(d) {
            return numberFormat(d.close);
          }, function(d) {
            return numberFormat(d.close - d.open);
          }, function(d) {
            return d.volume;
          }
        ]).sortBy(function(d) {}, d.dd).order(d3.ascending).renderlet(function(table) {
          return table.selectAll(".dc-table-group").classed("info", true);
        });
      };
      s.resetAll = function() {
        dc.filterAll();
        return dc.redrawAll();
      };
      return $scope.$apply();
    });
  });

}).call(this);
