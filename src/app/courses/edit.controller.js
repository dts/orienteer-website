angular.module('orienteerio').controller(
  'CourseEditCtrl',function($state,Courses,$scope,$stateParams,Leaderboard,leafletBoundsHelpers,Checkpoints,API,Authorize)
  {
    angular.extend($scope, {
      loaded : false,
      bounds: {},
      center: {},
      layers: {
        baselayers: {
          osm: {
            name: 'OpenStreetMap',
            type: 'xyz',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            layerOptions: {
              subdomains: ['a', 'b', 'c'],
              attribution: '© OpenStreetMap contributors',
              continuousWorld: true
            }
          },
          caltopo: {
            name: "CalTopo",
            type:"xyz",
            url: 'http://s3-us-west-1.amazonaws.com/caltopo/topo/{z}/{x}/{y}.png',
            layerOptions: {
              attribution: 'CalTopo'
            }
          }
        }
      },
      Defaults: {
        scrollWheelZoom: false
      },
      events: {
        map: {
          enable: ['click'],
          logic: 'emit'
        }
      }
    });
    
    $scope.$on('leafletDirectiveMap.click',function(event,args) {
      if($scope.click_to_create) {
        $scope.checkpoints.push( { message : '', focus: true, draggable: true,
                                   lat: args.leafletEvent.latlng.lat,
                                   lng: args.leafletEvent.latlng.lng
                                 }
                               );
      }
    }
              );

    $scope.focused_checkpoint = function() {
      return _.find($scope.checkpoints,function(cp) { return cp.focus; });
    }
    $scope.delete_focused = function() {
      var focused = $scope.focused_checkpoint();
      var index = $scope.checkpoints.indexOf(focused);
      $scope.checkpoints.splice(index,1);
    }
    
    $scope.save = function() {
      
    }
    $scope.member_id = API.member_id();

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
                     draggable: true,
                     message : cp.name 
                   };
          }
        );
      }
    );

  }
);
