angular.module('orienteerio').controller(
  'CourseCreateCtrl',function($scope,$state,Courses,API) {
    $scope.creating = true;
    
    Courses.post({ member_id : API.memberId() , name : "Unnamed Course" })
      .then(
        function(course) {
          $scope.creating = false;
          $scope.status = "Created.";

          $state.go('logged-in.course.edit',{ id : course.id });
        },
        function(error) {
          $scope.creating = false;
          $scope.status = "Error creating course :(.  Check your net connection and try again?";
        });
  }
);
