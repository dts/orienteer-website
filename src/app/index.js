'use strict';

var API_URI = "http://api.orienteer.io/api/";
// /* alert('using localhost API'); */ API_URI = "http://localhost:3003/api/";

angular.module(
  'orienteerio',
  ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 
   'ui.router','orienteer.services','orienteer.controllers','orienteer.directives',
   'blueimp.fileupload','orienteerFilters','leaflet-directive',
   'exceptionOverride','restangular','ordinal'])
  .config(function ($stateProvider, $urlRouterProvider) {
/*    */
    
    function passErrorPromise(promise) {
      return promise.then(function(success) { return success; },
                          function(error) { return { error : error }; });
    }
    
    $stateProvider
      .state('start',{
        url: '/',
        template: 'loading...'
      })
      .state('login', {
        url: '/splash',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('logged-in',{
        resolve : {
          loggedInMemberId : function($rootScope,authCheck,$state,API) {
            var ret = API.memberId();
            return ret;
          }

        },
        controller: 'LoggedInCtrl',
        templateUrl: 'app/logged_in/logged_in.html',
        abstract: true
      })
      .state('logged-in.dash',{
        url: '/dash',
        templateUrl : 'app/dash/dash.html',
        controller: 'DashCtrl'
      })
      .state('logged-in.create-course',{
        templateUrl : 'app/courses/create.html',
        controller: 'CourseCreateCtrl',
        url: '/courses/create'
      })
      .state('logged-in.profile',{
        url: '/member/:id',
        templateUrl: 'app/profile/show.html',
        controller: 'ProfileShowCtrl'
      })
      .state('logged-in.course',{
        abstract: true,
        url: '/course/:id',
        template: '<ui-view ></ui-view>',
        resolve : {
          checkpoints : function($stateParams,Checkpoints) {
            return passErrorPromise(Checkpoints.getList({ 'course_id' : $stateParams.id })).then(function(blah) { return blah; });
          },
          course : function($stateParams,Courses) {
            return passErrorPromise(Courses.one($stateParams.id).get()).then(function(blah) { return blah; });
          }
        }
      })
      .state('logged-in.course.show',{
        templateUrl: 'app/courses/show.html',
        controller: 'CourseShowCtrl',
        url: '/show',
        resolve: {
          leaderboard : function($stateParams,Leaderboard) {
            return passErrorPromise(Leaderboard.get({ id : $stateParams.id }).$promise);
          }
        }
      })
      .state('logged-in.course.edit',{
        url: '/edit',
        templateUrl: 'app/courses/edit.html',
        controller: 'CourseEditCtrl'
      })
      .state('logged-in.course.run',{
        url: '/run',
        templateUrl: 'app/courses/run.html',
        controller: 'CourseRunCtrl'
      })

      .state('logged-in.settings',{
        url: '/settings',
        templateUrl: 'app/settings/settings.html',
        controller: 'SettingsCtrl'
      })

      .state('logged-in.help',{
        url: '/help',
        templateUrl: 'app/help/help.html',
        controller: 'HelpCtrl'
      })

      .state('logged-in.help-section',{
        url: '/help/:section',
        templateUrl: 'app/help/help.html',
        controller: 'HelpCtrl'
      })
    ;

    $urlRouterProvider.otherwise('/');
  })
;
angular.module('orienteer.services',[]);
angular.module('orienteer.controllers',[]);
angular.module('orienteer.directives',[]);
// ugly hack to make jQuery work and strict mode stfu.
angular.module('orienteerio').factory('ApiUri',function() { return API_URI; });
angular.module('orienteerio').factory('$',function($window) { return $window.$; });
angular.module('orienteerio').factory('_',function($window) { return $window._; });
angular.module('orienteerio').factory('alert',function($window) { return $window.alert; });
angular.module('orienteerio').factory('localStorage',function($window) { return $window.localStorage; });
angular.module('orienteerio').factory('navigator',function($window) { return $window.navigator; });
angular.module('orienteerio').factory('trackJs',function($window) { return $window.trackJs; });
angular.module('exceptionOverride', []).factory('$exceptionHandler', function() {
  return function(exception, cause) {
    try {
      window.Flash.exception(exception);
    } catch(x) {
      console.error(exception,cause);
      if(typeof trackJs != 'undefined')
        window.trackJs.track(x);
    }
    if(typeof trackJs != 'undefined')
      trackJs.track(exception);
    else
      console.error(exception);
  };
});

angular.module('orienteerio').run(function($rootScope,$state,$location,authCheck) {
  $rootScope.$on('$stateChangeSuccess',function(e,toState,toParams,fromState,fromParams) {
    localStorage.setItem('last_state',JSON.stringify({ name : toState.name , params : toParams }));
  });
  
  $rootScope.$on("$stateChangeStart",function(e,toState,toParams,fromState,fromParams) {
    if(toState.name === 'start') {
      if(!authCheck()) {
        e.preventDefault();
        $state.go('login');
        return;
      }
      // app is launching at the 'nowhere' state.  If we have a
      // reasonable state to go to, go there.
      var last_state = JSON.parse(localStorage.getItem('last_state'));
      if(last_state && last_state.name) {
        e.preventDefault();
        $state.go(last_state.name,last_state.params);
        return;
      } else {
        e.preventDefault();
        $state.go('logged-in.dash');
        return;
      }
    }
    
    var isLogin = toState.name === "login";
    if(isLogin)
      return;
    
    if(!authCheck()) {
      e.preventDefault();
      $state.go('login');
    }
  });
})
