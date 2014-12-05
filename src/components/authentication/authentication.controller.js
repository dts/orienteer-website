'use strict';

angular.module('orienteerio')
.controller('AuthenticationCtrl',function($scope,API,$state) {
  $scope.data = {
    username: API.savedUsername(),
    password: '',
    fname: '',
    lname: ''
  };

  $scope.dataErrors = {

  };

  $scope.signingUp = false;

  $scope.logIn = function() {
    $scope.dataErrors = {};
    $scope.status = '';

    API.login($scope.data.username,$scope.data.password).then(
      function() {
        $state.go('logged-in.dash');
      },
      function(error) {
        $scope.status = error.description;
        $scope.dataErrors = error.validationErrors;
      }
    );
  };
  
  $scope.signUp = function() {
    $scope.dataErrors = {};
    $scope.status = '';

    API.signUp($scope.data).then(
      function() {
        $state.go('logged-in.dash');
      },
      function(error) {
        $scope.status = error.description;
        $scope.dataErrors = error.validationErrors;
      }
    );
  };

  $scope.showSignUp = function() {
    $scope.signingUp = true;
  };
  $scope.hideSignUp = function() {
    $scope.signingUp = false;
  };
}
);
