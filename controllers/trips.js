var geocoder = new google.maps.Geocoder();

var getCoordinates = function(address, callback) {
  var coordinates;
  geocoder.geocode({
    address: address
  }, function(results, status) {
    var coord_obj = results[0].geometry.location;
    coordinates = [coord_obj.G, coord_obj.K]; // coord_obj.G = Latitude, coord_obj.K = Longitude
    callback(coordinates);
  });
};

var amigo = angular.module('amigo');

amigo.controller('MakeTrips', function($scope, $http) {

  $scope.makeTrip = function() {

    var activities = $scope.activities.split(',');

    for (var i = 0; i < activities.length; i++) {
      if (activities[i].charAt(0) === ' ') {
        activities[i] = activities[i].slice(1);
      }
    }

    getCoordinates($scope.destination, function(coor) {
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
          end: $scope.end.toJSON().slice(0, 10),
        }
      };
      $http(req).then(function(res) {
        $scope.response = 'Query sent';
        var UTReq = {
          method: 'POST',
          url: '/api/createUserTrip',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            trip_id: res.data[0],
            media: $scope.tripPic
          }
        };

        $http(UTReq).then(function(res) {
          $scope.response +=
            ' Second query (users.trips) sent';

          for (var i = 0; i < activities.length; i++) {
            var interestReq = {
              method: 'POST',
              url: '/api/addActivity',
              headers: {
                'Content-Type': 'application/json'
              },
              data: {
                users_trips_id: res.data[0],
                activity: activities[i]
              }
            };
            $http(interestReq).then(function() {
              $scope.response +=
                ' act' + i;
            });
          }
        });
      });
    });
  };
});


amigo.controller('GetMyTrips', function($scope, $http) {

  $scope.getMyTrips = function (){
    var req = {
      method: 'POST',
      url: '/api/getMyTrips',
      headers: {
        'Content-Type': 'application/json'
      },
    };
    $http(req).then(function(res) {
      $scope.trips = res.data;
    });
  }

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

// Below is the conflicting version. These are redundant
// but the trips view needs them right now.
amigo.controller('tripsCtrl', function($scope, $http) {
  console.log("tripsCtrl");
  $scope.makeTrip = function() {

    console.log('clicking makeTrip', $scope.destination, $scope.start.toJSON().slice(0,10), $scope.end.toJSON().slice(0,10));

    var req = {
      method: 'POST',
      url: '/api/createTrip',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        destination: $scope.destination,
          start: $scope.start.toJSON().slice(0,10),
          end: $scope.end.toJSON().slice(0,10)
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
  $scope.addProfile = function() {

    console.log('clicking AddProfile', $scope.profile);

    var req = {
      method: 'POST',
      url: '/api/addProfile',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        profile: $scope.profile
      }
    };
    $http(req).then(function(res) {
      $scope.response = 'Query sent';
    });

  };
});
