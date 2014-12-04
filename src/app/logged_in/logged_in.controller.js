angular.module('orienteerio').controller(
  'LoggedInCtrl',
  function($state,$scope) {
    $scope.state = $state;
    $scope.top_level_states = [
      { state : 'logged-in.dash',
        name : 'Dash' },
      { state : 'logged-in.create-course',
        name : 'New Course' },
      { state : 'logged-in.settings',
        name : 'Settings' }
    ];
  }
);
