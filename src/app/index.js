'use strict';

angular.module(
  'orienteerio',
  ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 
   'ui.router','orienteer.services','orienteer.controllers',
   'blueimp.fileupload','orienteerFilters','leaflet-directive',
   'exceptionOverride'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('logged-in',{
        resolve : {
          logged_in_member_id : function($rootScope,Authorized,$state,API) {
            if(!Authorized()) {
              $state.go('login');
              return undefined;
            } else {
              var ret = API.member_id();
              return ret;
            }
          }
        },
        templateUrl: 'app/logged_in/logged_in.html',
        abstract: true
      })
      .state('logged-in.dash',{
        url: '/dash',
        templateUrl : 'app/dash/dash.html',
        controller: 'DashCtrl'
      })
      .state('logged-in.course',{
        url: '/course/:id',
        templateUrl: 'app/courses/show.html',
        controller: 'CourseShowCtrl',
        resolve : {
          leaderboard : function($stateParams,Leaderboard) {
            return Leaderboard.get({ id : $stateParams.id }).$promise;
          },
          checkpoints : function($stateParams,Checkpoints) {
            return Checkpoints.query({ course_id : $stateParams.id }).$promise;
          },
          course : function($stateParams,Courses) {
            return Courses.get({ id : $stateParams.id }).$promise;
          }
        }
      })
      .state('logged-in.course.edit',{
        url: '/course/:id/edit',
        templateUrl: 'app/courses/edit.html',
        controller: 'CourseEditCtrl'
      })
    ;

    $urlRouterProvider.otherwise('/');
  })
;

var Services = angular.module('orienteer.services',[]);
var Controllers = angular.module('orienteer.controllers',[]);

angular.module('exceptionOverride', []).factory('$exceptionHandler', function() {
  return function(exception, cause) {
    console.error(exception,cause);
  };
});
