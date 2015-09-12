var amigo = angular.module('amigo');

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

// amigo.controller('Ctrl', function($scope, $filter, $http) {
//   $scope.acts = [];

//   $scope.saveAct = function(activity, id) {

//     var req = {
//       method: 'POST',
//       url: '/api/addActivity',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       data: {
//         activity: activity,
//         userTripId: id
//       }
//     };

//     $http(req).then(function(res) {
//       $scope.getActivities();
//     });
//   };

//   $scope.getActivities = function() {
//     var req = {
//       method: 'GET',
//       url: 'api/getActivities',
//     };

//     $http(req).then(function(res) {
//       $scope.acts = res.data;
//     });
//   }

//   // remove activity
//   $scope.removeAct = function(index) {
//     $scope.acts.splice(index, 1);
//   };

//   // add activity
//   $scope.addAct = function() {
//     $scope.inserted = {
//       id: $scope.acts.length+1,
//       name: ''
//     };
//     $scope.acts.push($scope.inserted);
//   };

//   $scope.getActivities();
// });
