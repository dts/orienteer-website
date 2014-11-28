angular.module('orienteerio')
.controller('AuthenticationCtrl',function($scope,API,$state) {
  $scope.data = {
    username: API.saved_username(),
    password: "",
    fname: "",
    lname: ""
  };

  $scope.data_errors = {

  };

  $scope.signing_up = false;

  $scope.log_in = function() {
    $scope.data_errors = {};
    $scope.status = "";

    API.login($scope.data.username,$scope.data.password).then(
      function() {
        $state.go('logged-in.dash');
      },
      function(error) {
        $scope.status = error.description;
        $scope.data_errors = error.validation_errors;
      }
    );
  }
  
  $scope.sign_up = function() {
    $scope.data_errors = {};
    $scope.status = "";

    API.sign_up($scope.data).then(
      function() {
        $state.go('logged-in.dash');
      },
      function(error) {
        $scope.status = error.description;
        $scope.data_errors = error.validation_errors;
      }
    )
  }

  $scope.show_sign_up = function() {
    $scope.signing_up = true;
  }
}
);
