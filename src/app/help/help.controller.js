angular.module('orienteerio').controller(
  'HelpCtrl',
  function($scope,$state,loggedInMemberId,$stateParams) {
    $scope.section = $stateParams.section || "index";
  }
);
