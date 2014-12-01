angular.module('orienteerio').controller(
  'CourseShowCtrl',
  function($state,course,$scope,$stateParams,leaderboard,
           leafletBoundsHelpers,checkpoints,API,
           CaltopoPrintConverter,logged_in_member_id,LeafletLayers)
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
      checkpoints: checkpoints,
      member_id : logged_in_member_id,
      editable : (course.member_id == logged_in_member_id)
    });

    var n = Number(course.bounds.n);
    var e = Number(course.bounds.e);
    var s = Number(course.bounds.s);
    var w = Number(course.bounds.w);

    $scope.bounds = leafletBoundsHelpers.createBoundsFromArray(
      [ [ n,e ] , [ s,w ]]
    );
    
    $scope.edit = function() {
      $state.go('logged-in.course.edit',{ id : $scope.course.id });
    }
    
    $scope.print = function() {
      $('form.printit input').val(JSON.stringify(CaltopoPrintConverter($scope.checkpoints)));
      $('form.printit').submit();
    }
    
  }
);
    
