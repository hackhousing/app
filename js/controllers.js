'use strict';

/* Controllers */

module.exports = function(controllers) {
  controllers.controller('SplashController', ['$scope', '$http', function($scope, $http) {
  }]);


  controllers.controller('LtrController', ['$scope', '$http', '$route', '$location', function($scope, $http, $route, $location) {

    $scope.addLtr = function() {
      var newLtr = {name: $scope.name, phone: $scope.phone, email: $scope.email, magi: $scope.magi};
      $http.post('/api/ltrs', newLtr)
      .success(function(data, status, headers, config) {
        console.log('success: ' + data);
      })
      .error(function(data, status, headers, config) {
        console.log('fail: ' + data);
      });
      $scope.name = '';
      $scope.phone = '';
      $scope.email = '';
      $scope.magi = '';
    }

    }]);


  controllers.controller('LtlController', function() {
    //manage acct contents
  });

};
