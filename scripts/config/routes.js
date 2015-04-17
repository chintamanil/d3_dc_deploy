(function() {
  angular.module("d3_data").config(function($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
      templateUrl: "views/main.html",
      controller: "MainCtrl"
    });
    $routeProvider.when("/c3js", {
      templateUrl: "views/c3js.html",
      controller: "GraphCtrl"
    });
    $routeProvider.when("/dcjs", {
      templateUrl: "views/dcjs.html",
      controller: "D3jsCtrl"
    });
    $routeProvider.when("/nvd3", {
      templateUrl: "views/nvd3.html",
      controller: "Nvd3Ctrl"
    });
    $routeProvider.when("/orbcsv", {
      templateUrl: "views/orbital_csv.html",
      controller: "OrbitalCsvCtrl"
    });
    return $routeProvider.when("/orbcsv2", {
      templateUrl: "views/orbital_csv2.html",
      controller: "OrbitalCsvCtrl2"
    }).otherwise({
      redirectTo: "/"
    });
  });

}).call(this);
