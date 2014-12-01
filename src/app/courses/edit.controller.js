angular.module('orienteerio').controller(
  'CourseEditCtrl',
  function($state,course,$scope,$stateParams,leaderboard,
           leafletBoundsHelpers,checkpoints,API,LeafletLayers,
           leafletMarkersHelpers,LeafletCheckpointHelpers,
           CheckpointIcons,$timeout,
           logged_in_member_id)
  {
    var RemoveIcon = {
      type: 'awesomeMarker',
      icon: 'android-close',
      prefix: 'ion',
      extraClasses: 'icon',
      markerColor: 'red'
    };
    
    var NormalIcon = {
      type: 'awesomeMarker',
      icon: 'flag',
      prefix: 'ion',
      extraClasses: 'icon',
      markerColor: 'blue'
    };

    var leaflet_ct = 1;
    function to_leaflet(cp) {
      return ;
    };

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
      member_id : logged_in_member_id,
    });

    $scope.checkpoints = LeafletCheckpointHelpers.toLeaflet(checkpoints);
    
    $scope.$on('leafletDirectiveMap.click',function(event,args) {
      if($scope.click_to_create) {
        $scope.checkpoints.push( { message : '', focus: true, draggable: true,
                                   lat: args.leafletEvent.latlng.lat,
                                   lng: args.leafletEvent.latlng.lng,
                                   icon: CheckpointIcons.added
                                 }
                               );
      }
    }
              );

    $scope.focused_checkpoint = function() {
      var ret = _.find($scope.checkpoints,function(cp) { return cp.focus; });
      console.log("Focused checkpoing? ",ret);
      return ret;
    };
    $scope.delete_focused = function() {
      var focused = $scope.focused_checkpoint();

      focused.removed = true;
      focused.icon = RemoveIcon;
      focused.focus = true;
    }
    $scope.replace_focused = function() {
      var focused = $scope.focused_checkpoint();
      focused.removed = false;
      focused.icon = NormalIcon;

      focused.focus = true;
    }
  
    
    $scope.save = function() {
      LeafletCheckpointHelpers.fromLeaflet(
        $scope.checkpoints,
        checkpoints
      );
      
      checkpoints.save().then(
        function() {
          $scope.checkpoints = [];

          $timeout(function() {
            $scope.checkpoints = LeafletCheckpointHelpers.toLeaflet(checkpoints);
          },100);
        },
        function() {
          alert("Error saving checkpoints :(");
          console.log("Error saving checkpoints ",arguments);
        }
      );
    }
    $scope.member_id = API.member_id();

    var n = Number(course.bounds.n);
    var e = Number(course.bounds.e);
    var s = Number(course.bounds.s);
    var w = Number(course.bounds.w);

    $scope.bounds = leafletBoundsHelpers.createBoundsFromArray(
      [ [ n,e ] , [ s,w ]]
    );
  }
);
