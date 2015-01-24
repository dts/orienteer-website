'use strict';

angular.module('orienteerio').controller(
  'CourseRunCtrl',
  function($scope,$rootScope,$state,Courses,RunCheckpoints,$stateParams,Geolocation,$timeout,localStorage,API,$http,Flash,LeafletLayers,LeafletCheckpointHelpers) {

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
    });

    
    $scope.geolocation_supported = Geolocation.supported;
    
    function error(mac) {
      Flash.error(mac);
    }

    Courses.one($stateParams.id).get().then(function(c) { $scope.course = c; },function(c) { $scope.course = null; });
    
    var courseId = $stateParams.id;

    RunCheckpoints.getList({ course_id : courseId , run : true})
      .then(function(cps) {
        $scope.checkpoints = cps;
        $scope.map_checkpoints = LeafletCheckpointHelpers.toLeaflet(cps);
        $scope.bounds = LeafletCheckpointHelpers.boundsForCheckpoints(cps);
        $scope.loaded = true;
      },function(err) {
        $scope.checkpoints = null;
        $scope.message = "Error loading checkpoints"
      }
           );

    $scope.checking_in = false;
    $scope.message = null;

    function recalculate_distances() {
      _.each(
        $scope.checkpoints,
        function(cp) {
          cp.distance = Geolocation.kmBetween(cp,$scope.position);
        });
    }

    function closest_cp() {
      var closest;
      
      _.each($scope.checkpoints,
             function(cp) {
               if(!closest || cp.distance < closest.distance) {
                 closest = cp;
               }
             }
            );
      
      return closest;
    }
    
    function humanize_distance(kilometers) {
      return (Math.ceil(kilometers*100)*10)+"m";
    }

    function clear_messages() {
      $scope.message = null;
      $scope.message_type = null;
    }

    function update_network_messaging() {
      $scope.network_message = "";
      $scope.network_error = false;

      if($scope.saving) {
        $scope.network_message = "Saving progress...";
      }
      if($scope.saving_error) {
        $scope.network_error = true;
      }
    }
    
    window.save_progress = function save_progress() {
//      locallyStore($scope.course,$scope.checkpoints);
      if($scope.saving) {
        error("Already saving...");
        return;
      }

      $scope.saving = true;

      try {
      var r = $scope.checkpoints.customPOST(
        $scope.checkpoints,
        '',
        { course_id : courseId },
        {}
      ).then(
        function(blah) {
          $scope.checkpoints = blah;
          
          $scope.saving = false;
          update_network_messaging();
        },
        function(x) {
          $scope.saving = false;
          $scope.saving_error = x;
          update_network_messaging();
        }
      );

      update_network_messaging();
      } catch(x) {
        $scope.saving = false;
        throw x;
      }
      
      return r;
    }

    $scope.cp_class = function(cp) {
      var ret = "";
      if(cp.visited)
        ret += "visited ";
      if(cp.uploading)
        ret += "uploading ";
      return ret;
    };

    function locallyStop() {
      $scope.checkpoints.invalidate();
    }
    
    $scope.stop = function(confirmed) {
      if(confirmed) {
        $scope.stopping = true;
        $scope.stopping_error = null;

        save_progress().then(function() {
        return $http({
          method: 'POST',
          url: API.url('run_checkpoints/finish'),
          data: {
            course_id : courseId
          }
        });
        }).then(
          function(success) {
            locallyStop();
            
            $scope.stopping = false;
            $scope.stopping_error = null;

            $("#end-modal").foundation('reveal','close');
            $state.go('logged-in.course.show',{ id : courseId });
          },
          function(error) {
            $scope.stopping = false;
            $scope.stopping_error = "Error occurred while ending :(";
          }
        );
      } else {
        $('#end-modal').foundation('reveal','open');
      }
    }

    window.run_scope = $scope;
    $scope.check_in = function() {
      if($scope.checking_in) return;

      $scope.position_error = null;
      $scope.checking_in = true;
      clear_messages();
      
      Geolocation.getAccuratePosition()
      .then(
        function(position) {
          $scope.position = position;

          $timeout(clear_messages,8000);
          $scope.checking_in = false;
          
          try {
            recalculate_distances();
            var closest = closest_cp();
            
            if(closest) {
              if(closest.distance < 0.04) {
                if(closest.visited) {
                  $scope.message = "You have already visited "+closest.name;
                  $scope.message_type = "calm";
                } else {
                  closest.visited = true;
                  
                  closest.needs_saving = true;

                  $scope.message = "You visited "+closest.name;
                  $scope.message_type = "balanced";
                }

                closest.visits = closest.visits || [];
                closest.visits.push( new Date().toUTCString() )
              } else {
                $scope.message = "No dice.  You are "+humanize_distance(closest.distance)+" away.";
                $scope.message_type = "energized";
              }
            } else {
              $scope.message = "An error occured, try again?"
              $scope.message_type = "energized";
            }

            save_progress();
          } catch(x) {
            Flash.exception(x,"Error occurred during checkin.");
          }
          update_network_messaging();
        },
        function(error) {
          $scope.position_error = error;
          $scope.checking_in = false;
          
          save_progress();
        });

    };
  }

);
