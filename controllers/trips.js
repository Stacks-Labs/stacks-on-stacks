var amigo = angular.module('amigo', []);

amigo.controller('MakeTrips', function($scope, $http) {

  $scope.makeTrip = function() {

    console.log('clicking makeTrip', $scope.destination);

    var req = {
      method: 'POST',
      url: '/api/createTrip',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        destination: $scope.destination,
        start: $scope.start.toJSON().slice(0, 10),
        end: $scope.end.toJSON().slice(0, 10)
      }
    };
    $http(req).then(function(res) {
      $scope.response = 'Query sent';
      var newReq = {
        method: 'POST',
        url: '/api/createUserTrip',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          trip_id: res.data[0]
        }
      }

      $http(newReq).then(function() {
        $scope.response = 'Second query sent';
      });
    });
  };
});


amigo.controller('GetTrips', function($scope, $http) {

  $scope.getTrips = function() {

    console.log('clicking getTrips', $scope.username);

    var req = {
      method: 'POST',
      url: '/api/getTrips',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        username: $scope.username
      }
    };
    $http(req).then(function(res) {
      $scope.trips = res.data;
    });
  };
});