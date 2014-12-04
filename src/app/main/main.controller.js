'use strict';

angular.module('orienteerio')
  .controller('MainCtrl', function (authCheck,$state) {
    if(authCheck()) {
      $state.go('logged-in.dash');
    }
  });

