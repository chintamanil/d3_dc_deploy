(function() {
  angular.module('d3_data').directive('generalFooter', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/general_footer.html'
    };
  });

}).call(this);
