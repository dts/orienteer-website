'use strict';

angular.module(
  'orienteerio',
  ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 
   'ui.router','orienteer.services','orienteer.controllers','orienteer.directives',
   'blueimp.fileupload','orienteerFilters','leaflet-directive',
   'exceptionOverride','restangular'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('logged-in',{
        resolve : {
          loggedInMemberId : function($rootScope,authCheck,$state,API) {
            if(!authCheck()) {
              $state.go('login');
              return undefined;
            } else {
              var ret = API.memberId();
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
        controller: 'DashCtrl',
        resolve : {
          myCourses : function(Courses,loggedInMemberId) {
            return Courses.getList({ 'member_id' : loggedInMemberId });
          }
        }
      })
      .state('logged-in.course',{
        abstract: true,
        url: '/course/:id',
        template: '<ui-view ></ui-view>',
        resolve : {
          leaderboard : function($stateParams,Leaderboard) {
            return Leaderboard.get({ id : $stateParams.id }).$promise;
          },
          checkpoints : function($stateParams,Checkpoints) {
            return Checkpoints.getList({ 'course_id' : $stateParams.id });
          },
          course : function($stateParams,Courses) {
            return Courses.one($stateParams.id).get();
          }
        }
      })
      .state('logged-in.course.show',{
        templateUrl: 'app/courses/show.html',
        controller: 'CourseShowCtrl',
        url: '/show',
      })
      .state('logged-in.course.edit',{
        url: '/edit',
        templateUrl: 'app/courses/edit.html',
        controller: 'CourseEditCtrl'
      })
    ;

    $urlRouterProvider.otherwise('/');
  })
;
angular.module('orienteer.services',[]);
angular.module('orienteer.controllers',[]);
angular.module('orienteer.directives',[]);
// ugly hack to make jQuery work and strict mode stfu.
angular.module('orienteerio').factory('$',function($window) { return $window.$; });
angular.module('orienteerio').factory('_',function($window) { return $window._; });
angular.module('orienteerio').factory('alert',function($window) { return $window.alert; });
angular.module('orienteerio').factory('localStorage',function($window) { return $window.localStorage; });
angular.module('orienteerio').factory('navigator',function($window) { return $window.navigator; });
angular.module('exceptionOverride', []).factory('$exceptionHandler', function() {
  return function(exception, cause) {
    console.error(exception,cause);
  };
});
