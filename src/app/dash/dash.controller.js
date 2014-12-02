'use strict';

angular.module('orienteerio').controller(
  'DashCtrl',
  function(myCourses,$scope) {
    $scope.courses = myCourses;
  }
);
