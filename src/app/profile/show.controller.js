angular.module('orienteerio').controller(
  'ProfileShowCtrl',
  function($scope,$stateParams,$state,Members,Courses,Runs) {
    Members.one($stateParams.id).get().then(
      function(member) {
        $scope.member = member;
      },
      function(error) {
        $scope.status = 'An error occurred :*(';
      }
    );

    Courses.getList( { member_id : $stateParams.id } ).then(
      function(courses) {
        $scope.courses = courses;
      },
      function(error) {
        $scope.status = 'An error occurred :*(';
      }
    );

    Runs.getList( { runner_id : $stateParams.id , runner_type : 'Member' } ).then(
      function(runs) {
        $scope.runs = runs;
      },
      function(error) {
        $scope.status = 'An error occurred :*(';
      }
    );
  }
);
