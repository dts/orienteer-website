'use strict';

angular.module('orienteerio').controller(
  'CourseRunCtrl',
  function($scope,$rootScope,$state,course,RunCheckpoints,$stateParams,Geolocation,$timeout,localStorage,API,$http) {
    $scope.geolocation_supported = !!Geolocation;

    $scope.course = course;
    $scope.checkpoints = RunCheckpoints.query({ course_id : course.id , run : true},cps_downloaded);
    $scope.checking_in = false;
    $scope.message = null;

    var saved;
    try { saved = locallyFetch(course); }
    catch(x) { console.log("Error loading backed-up course: ",x); }

    function cps_downloaded() {
      if(saved) {
        var savedCheckpoints = saved.checkpoints;
        var savedCourse = saved.course;

        if(savedCourse.id == $scope.course.id) {
          _.each(
            $scope.checkpoints,function(cp) {
              var saved_cp = _.find(savedCheckpoints,function(saved_cp) { return saved_cp.id == cp.id; });
              
              // upgrade to visited if saved:
              cp.visited = cp.visited || saved_cp.visited;
            }
          );
        }
      }
    }
    
    function recalculate_distances() {
      _.each(
        $scope.checkpoints,
        function(cp) {
          cp.distance = Geolocation.kmBetween(cp,$scope.position.coords);
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
      var total_saving = _.filter($scope.checkpoints,function(cp) { return cp.saving; }).length;
      var total_errors = _.filter($scope.checkpoints,function(cp) { return cp.upload_error; }).length;

      if(total_saving || total_errors) {
        $scope.network_activity = true;
        $scope.network_error = !!total_errors;
        $scope.network_message = "Saving "+total_saving+" visits.";
      } else {
        $scope.network_message = null;
        $scope.network_error = false;
        $scope.network_activity = false;
      }
    }

    function locallyStop() {
      var id = "currentRun_"+API.token()+"_"+course.id;
      localStorage.removeItem(id);
    }
    
    function locallyStore(course,checkpoints) {
      var id = "currentRun_"+API.token()+"_"+course.id;
      var hash = { course : course , checkpoints : checkpoints };
      localStorage.setItem(id,JSON.stringify(hash));
    }

    function locallyFetch(course) {
      var id = "currentRun_"+API.token()+"_"+course.id;
      return JSON.parse(localStorage.getItem(id));
    }
    
    function save_progress() {
      locallyStore($scope.course,$scope.checkpoints);
      
      _.each($scope.checkpoints,function(cp) {
               if(cp.needs_saving) {
                 cp.saving = true;
                 cp.upload_error = null;

                 cp.$save().then(
                   function() {
                     cp.saving = false;
                     cp.needs_saving = false;
                     update_network_messaging();
                   },
                   function(x) {
                     cp.saving = false;
                     cp.upload_error = x;
                     update_network_messaging();
                   }
                 );
               }
             });
      
      update_network_messaging();
    }

    $scope.cp_class = function(cp) {
      var ret = "";
      if(cp.visited)
        ret += "visited ";
      if(cp.uploading)
        ret += "uploading ";
      return ret;
    };

    $scope.stop = function(confirmed) {
      if(confirmed) {
        $scope.stopping = true;
        $scope.stopping_error = null;

        $http({
          method: 'POST',
          url: API.url('run_checkpoints/finish'),
          data: {
            course_id : course.id
          }
        }).then(
          function(success) {
            locallyStop();
            
            $scope.stopping = false;
            $scope.stopping_error = null;

            $("#end-modal").foundation('reveal','close');
            $state.go('logged-in.course.show',{ id : course.id });
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

    $scope.check_in = function() {
      if($scope.checking_in) return;

      $scope.position_error = null;
      $scope.checking_in = true;
      clear_messages();

      Geolocation.getAccuratePosition()
      .then(
        function(position) {
          $scope.position = position;
          
          recalculate_distances();
          var closest = closest_cp();
          
          if(closest.distance < 0.03) {
            if(closest.visited) {
              $scope.message = "You have already visited "+closest.name;
              $scope.message_type = "calm";
            } else {
              closest.visited = true;
              closest.needs_saving = true;

              $scope.message = "You visited "+closest.name;
              $scope.message_type = "balanced";
            }
            
            save_progress();
          } else {
            $scope.message = "No dice.  You are "+humanize_distance(closest.distance)+" away.";
            $scope.message_type = "energized";
          }
          
          update_network_messaging();
          $timeout(clear_messages,8000);
          
          $scope.checking_in = false;
        },
        function(error) {
          $scope.position_error = error;
          $scope.checking_in = false;
        });

    };
  }

);
