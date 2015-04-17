(function() {
  angular.module('d3_data').directive('generalNavigation', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/general_header.html'
    };
  });

}).call(this);
