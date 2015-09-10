var app = angular.module("app", ["xeditable"]);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

  app.controller('Ctrl', function($scope) {
    $scope.user = {
      name: '',
      currentTrips: 'Costa Rica',
      pastTrips: 'New York',
      age: '27',
      gender: 'female',
      aboutMe: 'I am a badass',
      email: '',
      interests: 'Cooking and food stuffs'
    };
    //***********Updates Database on user change*******//
    $scope.updateUser = function() {
      return $http.post('/addProfile', $scope.user);
    };

    //*****vaildate remote********//
    app.controller('ValidateRemoteCtrl', function($scope, $http, $q) {
    $scope.user = {
      name: 'awesome user'
    };

    $scope.checkName = function(data) {
      var d = $q.defer();
      $http.post('/checkName', {value: data}).success(function(res) {
        res = res || {};
        if(res.status === 'ok') { // {status: "ok"}
          d.resolve()
        } else { // {status: "error", msg: "Username should be `awesome`!"}
          d.resolve(res.msg)
        }
      }).error(function(e){
        d.reject('Server error!');
      });
      return d.promise;
    };
  });
});
