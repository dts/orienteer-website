angular.module('orienteerio')
.controller('AuthenticationCtrl',function($scope,API) {
  $scope.username = API.saved_username();
  $scope.password = "";
  $scope.sign_up = false;

  $scope.log_in = function() {

  }
  
  $scope.sign_up = function() {

  }

  $scope.show_sign_up = function() {
    $scope.sign_up = true;
  }
}
);
