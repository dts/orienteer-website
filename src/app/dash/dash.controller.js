'use strict';

angular.module('orienteerio').controller(
  'DashCtrl',
  function($scope,Courses,_,leafletBoundsHelpers,LeafletLayers) {
    $scope.markers = [];
    $scope.layers = { baselayers: LeafletLayers };
    $scope.bounds = {};
    $scope.center = {};
    
    function update_markers() {
      var n,e,s,w;
      
      $scope.markers = _.map(
        $scope.courses,
        function(course) {
          var lat = Number(course['center_latitude']);
          var lng = Number(course['center_longitude']);

          if(_.isUndefined(n) || lat > n) {
            n = lat;
          }
          if(_.isUndefined(s) || lat < s) {
            s = lat;
          }
          if(_.isUndefined(e) || lng > e) {
            e = lng;
          }
          if(_.isUndefined(w) || lng < w) {
            w = lng;
          }
            
          return { lat : lat,
                   lng : lng,
                   message: course.name };
        }
      );

      $scope.bounds = leafletBoundsHelpers.createBoundsFromArray([[n,e],[s,w]]);
    }
    
    function getNewCourses(hash) {
      $scope.fetching = true;
      Courses.getList(hash).then(
        function(courses) {
          $scope.fetching = false;
          $scope.courses = courses;
          update_markers();
        },
        function(error) {
          $scope.fetching = false;
          $scope.error = error;
        }
      );
    };
    
    getNewCourses({ near : "request_location" });
  }
);
