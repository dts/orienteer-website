angular.module('orienteerio').controller(
  'CourseShowCtrl',function($state,Courses,$scope,$stateParams,Leaderboard,leafletBoundsHelpers,Checkpoints,API,Authorize)
  {
    angular.extend($scope, {
      loaded : false,
      bounds: {},
      center: {},
      defaults: {
        scrollWheelZoom: false
      }
    });
    $scope.edit = function() {
      $state.go('course-edit',{ id : $scope.course.id });
    }
    $scope.member_id = API.member_id();
    $scope.leaderboard = Leaderboard.get( { id : $stateParams.id });
    var course = $scope.course = Courses.get( { id : $stateParams.id },function() {
      $scope.editable = (course.member_id == API.member_id());
      var n = Number(course.bounds.n);
      var e = Number(course.bounds.e);
      var s = Number(course.bounds.s);
      var w = Number(course.bounds.w);

      $scope.bounds = leafletBoundsHelpers.createBoundsFromArray(
        [ [ n,e ] , [ s,w ]]
      );
    });

    var net_checkpoints = Checkpoints.query( 
      { course_id : $stateParams.id },
      function() {
        $scope.loaded = true;
        $scope.checkpoints = _.map(
          net_checkpoints,
          function(cp) {
            return { lat : Number(cp.latitude),
                     lng : Number(cp.longitude),
                     focus: false,
                     draggable: false,
                     message : cp.name 
                   };
          }
        );
      }
    );
  }
);
    
