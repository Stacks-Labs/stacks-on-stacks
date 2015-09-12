var amigo = angular.module('amigo', ['ngRoute', 'xeditable']);

amigo.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

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