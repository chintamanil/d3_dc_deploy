(function() {
  angular.module('d3_data').controller('OrbitalCsvCtrl', function($scope, $location, $firebase) {
    var end, start;
    start = performance.now();
    $scope.chart = c3.generate({
      bindto: '#chart',
      data: {
        url: 'data/c3_test_data.csv'
      }
    });
    end = performance.now();
    console.log(end - start);
  });

}).call(this);
