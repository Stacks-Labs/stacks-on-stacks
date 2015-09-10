
var geocoder = new google.maps.Geocoder();

var getCoordinates = function(address, callback) {
 var coordinates;
 geocoder.geocode({address: address}, function(results, status) {
   var coord_obj = results[0].geometry.location;
   coordinates = [coord_obj.G, coord_obj.K]; // coord_obj.G = Latitude, coord_obj.K = Longitude
   callback(coordinates);
 })
}

var amigo = angular.module('amigo', []);

amigo.controller('MakeTrips', function($scope, $http) {

  $scope.makeTrip = function() {

    console.log('clicking makeTrip', $scope.destination);

    getCoordinates($scope.destination, function(coor){
      var req = {
        method: 'POST',
        url: '/api/createTrip',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          destination: $scope.destination,
          geocode_latitude: coor[0],
          geocode_longitude: coor[1],
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
        console.log(res.data)

        $http(newReq).then(function() {
          $scope.response = 'Second query sent';
        });
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

amigo.controller('GetTripsByTime', function($scope, $http) {

  $scope.getTripsByTime = function() {

    console.log('clicking getTrips', $scope.start, $scope.end);

    var req = {
      method: 'POST',
      url: '/api/getTripsByTime',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        start: $scope.start,
        end: $scope.end
      }
    };
    $http(req).then(function(res) {
      $scope.trips = res.data;
    });
  };
});