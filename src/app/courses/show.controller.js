'use strict';
/*jshint -W069 */
angular.module('orienteerio').controller(
  'CourseShowCtrl',
  function($state,course,$scope,$stateParams,leaderboard,
           courseBoundsConverter,checkpoints,API,
           caltopoPrintConverter,loggedInMemberId,LeafletLayers,
           LeafletCheckpointHelpers,$
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
      memberId : loggedInMemberId,
      editable : (course['member_id'] === loggedInMemberId)
    });

    $scope.bounds = courseBoundsConverter(course);
    
    $scope.edit = function() {
      $state.go('logged-in.course.edit',{ id : $scope.course.id });
    };

    $scope.run = function() {
      $state.go('logged-in.course.run',{ id : $scope.course.id });
    }
    
    $scope.print = function() {
      $('form.printit input').val(JSON.stringify(caltopoPrintConverter($scope.checkpoints)));
      $('form.printit').submit();
    };
    
  }
);
    
