'use strict';

angular.module('orienteerio').controller(
  'DashCtrl',
  function($scope,Courses,_,leafletBoundsHelpers,LeafletLayers,$timeout) {
    $scope.markers = [];
    $scope.defaults = { scrollWheelZoom : false };
    $scope.layers = { baselayers: LeafletLayers };
    $scope.bounds = {};
    $scope.center = {};

    function min(a,b) { return a>b?b:a; }

    function bigChange(bounds_1,bounds_2) {
      if(!bounds_1 || !bounds_2) return true;
      
      var dw = Math.abs(bounds_1.w - bounds_2.w);
      var de = Math.abs(bounds_1.e - bounds_2.e);
      var ds = Math.abs(bounds_1.s - bounds_2.s);
      var dn = Math.abs(bounds_1.n - bounds_2.n);

      var oldWidth = Math.abs(bounds_1.e - bounds_1.w);
      var oldHeight = Math.abs(bounds_1.n - bounds_1.n);
      var newWidth = Math.abs(bounds_2.e - bounds_2.w);
      var newHeight = Math.abs(bounds_2.n - bounds_2.n);
      
      var minWidth = min(oldWidth,newWidth);
      var minHeight = min(oldHeight,newHeight);
      
      // if any part of the bounds has changed more than 10% of that dimension, it's a big bounds change:
      return (dw > minWidth/10 || de > minWidth/10 || ds > minHeight/10 || dn>minHeight/10);
    }
    
    var last_bounds;
    $scope.$watch('bounds',function() {
      if($scope.fetching) return;
      
      var b = $scope.bounds;
      var sw = b.southWest;
      var ne = b.northEast;
      
      var search_hash = {
        bounds : {
          w : sw.lng,
          e : ne.lng,
          s : sw.lat,
          n : ne.lat
        }
      }

      if(bigChange(last_bounds,search_hash.bounds)) {
        last_bounds = search_hash.bounds;
        updateBoundsForResults = false;
        getNewCourses(search_hash);
      }
    });

    var updateBoundsForResults = false;
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

      if(updateBoundsForResults)
        $scope.bounds = leafletBoundsHelpers.createBoundsFromArray([[n,e],[s,w]]);
    }

    var newCoursePromise = null;
    function getNewCourses(hash) {
      $scope.fetching = true;
      // save two references to the promise, so that when we request a
      // new set, we effectively cancel the older request:
      var p = newCoursePromise = Courses.getList(hash);
      newCoursePromise.then(
        function(courses) {
          if(newCoursePromise != p) return;
          
          $scope.courses = courses;
          update_markers();

          // delay the fetching-false thing until things have settled,
          // including bounds on the map.
          $timeout(function() { $scope.fetching = false; },400);
        },
        function(error) {
          if(newCoursePromise != p) return;
          
          $scope.fetching = false;
          $scope.error = error;
        }
      );
    };

    updateBoundsForResults = true;
    getNewCourses({ near : "request_location" });
  }
);
