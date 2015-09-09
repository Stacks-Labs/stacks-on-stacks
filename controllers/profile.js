var amigo = angular.module('amigo');

amigo.controller('AddProfile', function($scope, $http) {

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