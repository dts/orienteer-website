angular.module('orienteerio').controller(
  'CourseShowCtrl',
  function($state,course,$scope,$stateParams,leaderboard,
           CourseBoundsConverter,checkpoints,API,
           CaltopoPrintConverter,logged_in_member_id,LeafletLayers,
           LeafletCheckpointHelpers
          )
  {
    angular.extend($scope, {
      bounds: {},
      center: {},
      defaults: {
        scrollWheelZoom: false
      },
      layers: { baselayers: LeafletLayers },
      leaderboard : leaderboard,
      course : course,
      checkpoints: LeafletCheckpointHelpers.toLeaflet(checkpoints),
      member_id : logged_in_member_id,
      editable : (course.member_id == logged_in_member_id)
    });

    $scope.bounds = CourseBoundsConverter(course);
    
    $scope.edit = function() {
      $state.go('logged-in.course.edit',{ id : $scope.course.id });
    }
    
    $scope.print = function() {
      $('form.printit input').val(JSON.stringify(CaltopoPrintConverter($scope.checkpoints)));
      $('form.printit').submit();
    }
    
  }
);
    
