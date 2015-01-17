angular.module('orienteerio').controller(
  'ErrorCtrl',
  function($scope,$rootScope) {
    $scope.flashes = [];

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

    $scope.flash = function(type,message) {
      $scope.flashes.push( { classes : type , message : message } );
    }

    reset();
    
    $scope.close_flash = function(flash) {
      var index = $scope.flashes.indexOf(flash);
      $scope.flashes.splice(index,1);
    }
    
    $scope.not_found = function() {
      $scope.fullPageError = true;
      $scope.message = "Not Found";
      $scope.message_sub =  "You're offline (or we are, oops!) or it doesn't exist.";
    }

    $rootScope.error = $scope;
  }
);
