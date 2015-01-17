'use strict';
//(function()
//{
  angular.module('orienteer.services').factory(
    'Flash',
    function($rootScope,$window) {
      function flash(type,message) {
        try {
          $rootScope.error.flash(type,message);
        } catch(x) {
          console.error("flashing failed: ",x);
        }
      }
      return window.Flash = {
        error : function(string) {
          console.error(string);
          flash('alert',string);
        },
        rootException : function(exception) {
          try {
            flash('alert','Fatal Exception: '+exception.toLocaleString());
            console.error(exeption);
          } catch(x) {
            console.error("FATAL EXCEPTION DURING EXCEPTION HANDLING!!! WHOA!!! ",exception);
          }
        },
        exception : function(the_exception) {
          try {
            flash('alert',"Exception: "+the_exception.toLocaleString());
            
            console.error(the_exception);
          } catch(x) {
            // worst thing ever: exception during exception handling.
            // Now what?
          }
        }
      };
    }
  );
//})();
