angular.module('orienteerio').controller(
  'LoggedInCtrl',
  function($state,$scope,API,$rootScope) {
    $scope.state = $state;
    $scope.top_level_states = [
      { state : 'logged-in.dash',
        name : 'Dash' },
      { state : 'logged-in.profile({ id : '+API.memberId()+' })',
        name : 'Profile' },
      { state : 'logged-in.create-course',
        name : 'New Course' },
      { state : 'logged-in.settings',
        name : 'Settings' }
    ];
    $scope.close = function() {
      $('.off-canvas-wrap').foundation('offcanvas','hide','move-right');
    };
    
    $scope.toggle_menu = function() {
      $('.off-canvas-wrap').foundation('offcanvas','toggle','move-right');
    };
  }
);
