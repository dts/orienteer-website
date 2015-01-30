'use strict';
(function() {
  var FB_APP_ID = '650359281697625';
  
  var initializedOpenFb = false;
angular.module('orienteerio')
  .controller(
    'ExternalAuthController',
    function($scope,API,$state,localStorage,$window) {
      if(initializedOpenFb === false) {
        $window.openFB.init(
          { appId : FB_APP_ID,
            tokenStore : localStorage
          }
        );
        
        initializedOpenFb = true;
      }

        
      function fbLoginCallback(userData) {
        if(userData.status === 'connected') {
          // U R in!
          $scope.status = 'Facebook says OK, logging in...';
          API.loginWithFacebook(userData.authResponse.token).then(
            function() {
              $state.go('logged-in.dash');
            },
            function(err) {
              $scope.status = err.description;
            }
          );
        } else { 
          $scope.status = 'Facebook denied login: '+JSON.stringify(userData);
        }
      }

      var oauth_tmp = localStorage.getItem('oauth_cb_tmp');
      localStorage.removeItem('oauth_cb_tmp');

      if(oauth_tmp) {
        $window.openFB.oauthCallback(oauth_tmp);
        $window.openFB.getLoginStatus(fbLoginCallback);
      }
      
      $scope.useFacebook = function() {
        $window.openFB.login(fbLoginCallback,{ scope : 'public_profile,email' });
      };
    }
  );
    })();
