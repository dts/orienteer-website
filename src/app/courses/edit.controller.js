'use strict';

angular.module('orienteerio').controller(
  'CourseEditCtrl',
  function($state,course,$scope,$stateParams,leaderboard,
           courseBoundsConverter,checkpoints,API,LeafletLayers,
           leafletMarkersHelpers,LeafletCheckpointHelpers,
           CheckpointIcons,$timeout,
           loggedInMemberId,_,alert)
  {
    angular.extend($scope, {
      loaded : false,
      bounds: {},
      center: {},
      defaults: {
        scrollWheelZoom: false
      },
      layers:  {
        baselayers: LeafletLayers
      },
      events : {
        map : {
          enable : ['click','popupopen'],
          logic: 'emit'
        }
      },
      leaderboard : leaderboard,
      course : course,
      memberId : loggedInMemberId,
    });
    $scope.bounds = (courseBoundsConverter)(course);
    $scope.checkpoints = LeafletCheckpointHelpers.toLeaflet(checkpoints);
    
    $scope.$on('leafletDirectiveMap.click',function(event,args) {
      if($scope.clickToCreate) {
        $scope.checkpoints.push( { message : '', focus: true, draggable: true,
                                   lat: args.leafletEvent.latlng.lat,
                                   lng: args.leafletEvent.latlng.lng,
                                   icon: CheckpointIcons.added
                                 }
                               );
      }
    }
              );

    $scope.focusedCheckpoint = function() {
      var ret = _.find($scope.checkpoints,function(cp) { return cp.focus; });
      console.log('Focused checkpoing? ',ret);
      return ret;
    };
    $scope.deleteFocused = function() {
      var focused = $scope.focusedCheckpoint();

      focused.removed = true;
      focused.icon = CheckpointIcons.removed;
      focused.focus = true;
    };
    $scope.replaceFocused = function() {
      var focused = $scope.focusedCheckpoint();
      focused.removed = false;
      focused.icon = CheckpointIcons.normal;

      focused.focus = true;
    };

    $scope.remove = function() {
      if(confirm("Are you sure?")) {
        $scope.course.remove().then(
          function() {
            $state.go('logged-in.dash');
          },
          function(error) {
            alert("An error occurred while trying to delete that course...");
          }
        );
      }
    }
    
    $scope.save = function() {
      LeafletCheckpointHelpers.fromLeaflet(
        $scope.checkpoints,
        checkpoints
      );
      
      course.save().then(
        function() {
          checkpoints.save().then(
            function() {
              $scope.checkpoints = [];
              
              $timeout(function() {
                $scope.checkpoints = LeafletCheckpointHelpers.toLeaflet(checkpoints);
              },100);
            },
            function() {
              alert('Error saving checkpoints :(');
              console.log('Error saving checkpoints ',arguments);
            }
          );
        },function() {
          alert('Error saving course :(');
          console.log('Error saving course: ',arguments);
        });
    };
  }
);
