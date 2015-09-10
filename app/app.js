var amigo = angular.module('amigo', ['ngRoute']);

amigo.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/trips', {
        templateUrl: 'views/trips.html',
        controller: 'tripsCtrl'
      }).
      otherwise({
        redirectTo: '/trips'
      });
  }]);