angular.module('orienteerio').controller(
  'ProfileShowCtrl',
  function($scope,$stateParams,$state,Members,Courses) {
    Members.one($stateParams.id).get().then(
      function(member) {
        $scope.member = member;
      },
      function(error) {
        $scope.status = 'An error occurred :*(';
      }
    );
  }
);
