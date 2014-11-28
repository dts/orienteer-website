angular.module('orienteerio').controller(
  'GpxFileUploadCtrl',function($scope,$http,$filter,$window,API,$state) {
    $scope.status = "";

    var FileUploadOptions = {
      dataType: 'json',
      beforeSend : function(xhr) {
        xhr.setRequestHeader('api-token',API.token());
      },
      done : function(e,response) {
        $scope.$apply(function() {
          if(response.result.error) {
            $scope.status = response.result.error;
          } else {
            $state.go('logged-in.course-detail',{ id : response.result.id });
          }
        });
//         ORM.courses.add(response.result,{ parse:true,merge:true });
      }
    };


    $scope.options = { url : "http://api.orienteer.io/upload_gpx",
    acceptFileTypes: /(\.|\/)(gpx)$/i };

    $('#fileupload').fileupload(FileUploadOptions);
  }
);
