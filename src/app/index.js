'use strict';

angular.module('orienteerio', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router','orienteer.services','orienteer.controllers','blueimp.fileupload'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('dash',{
        url: '/dash',
        templateUrl : 'app/dash/dash.html',
        controller: 'DashCtrl'
      })
      .state('course-detail',{
        url: '/course/:id',
        templateUrl: 'app/courses/show.html',
        controller: 'CourseCtrl'
      });
    ;

    $urlRouterProvider.otherwise('/');
  })
;

var Services = angular.module('orienteer.services',[]);
var Controllers = angular.module('orienteer.controllers',[]);
