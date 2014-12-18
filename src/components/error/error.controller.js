angular.module('orienteerio').controller(
  'ErrorCtrl',
  function($scope,$rootScope) {
    function reset() {
      $scope.fullPageError = false;
      $scope.message = null;
      $scope.message_sub = false;
    }

    $rootScope.$on(
      '$stateChangeStart',
      function(event,toState,toParams,fromState,fromParams) {
        reset();
      }
    );

    reset();
    
    $scope.not_found = function() {
      $scope.fullPageError = true;
      $scope.message = "Not Found";
      $scope.message_sub =  "You're offline (or we are, oops!) or it doesn't exist.";
    }

    $rootScope.error = $scope;
  }
);
