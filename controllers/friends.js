var amigo = angular.module('amigo');

amigo.controller('Befriend', function($scope, $http) {

  $scope.befriend = function() {
    console.log('clicking befriend', $scope.friender, $scope.friendee);

    var idReq = function(username) {
      return {
        method: 'POST',
        url: '/api/getProfile',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          username: username
        }
      };
    };

    $http(idReq($scope.friender)).then(function(res) { // promise hell
      var frienderId = res.data[0].id; // we need the friender ID
      $http(idReq($scope.friendee)).then(function(res) {
        var friendeeId = res.data[0].id; // then the friendee ID
        console.log('user IDs', frienderId, friendeeId);
        var req = {
          method: 'POST',
          url: '/api/befriend',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            friender: frienderId,
            friendee: friendeeId
          }
        };
        // we must put this inside the promise in order to have access to the Id numbers
        $http(req).then(function(res) {
          $scope.befriend_response = 'Query sent';
        });
      });
    });
  };
  
});