var amigo = angular.module('amigo', []);

amigo.controller('MakeTrips', function($scope, $http) {

  $scope.makeTrip = function() {

    console.log('clicking makeTrip', $scope.destination);

    var req = {
      method: 'POST',
      url: '/api/createTrip',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        destination: $scope.destination,
        start: $scope.start,
        end: $scope.end
      }
    };
    $http(req).then(function(res) {
      $scope.response = 'Query sent';
          console.log('http(req)then', $scope.destination);
    });

  };
});