var amigo = angular.module('amigo');

amigo.controller('WriteBlog', function($scope, $http) {

  $scope.publishBlog = function() {
    console.log('clicking publishBlog', $scope.sender,
      $scope.subject, $scope.body);

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

    $http(idReq($scope.author)).then(function(res) { // promise hell
      var authorId = res.data[0].id; // we need the friender ID
      var req = {
        method: 'POST',
        url: '/api/publishBlog',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          author_id: authorId,
          subject: $scope.subject,
          body: $scope.body,
        }
      };
      // we must put this inside the promise in order to have access to the Id numbers
      $http(req).then(function(res) {
        $scope.debug_response = 'Query sent';
      });
    });
  };
});

// next is getblogs