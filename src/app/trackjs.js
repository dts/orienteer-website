angular.module('orienteerio').factory('trackJs',function($window) {
  function carefully_call(fn_name) {
    return function() {
      try {
        return $window.trackJs[fn_name].apply($window.trackJs,arguments);
      } catch(x) {
        console.log("(NOTRACKJS): ",x,arguments);
      }
    };
  }
  
  return {
    configure : carefully_call('configure'),
    track : carefully_call('track'),
    attempt : function(fn,context/*,args ... */) {
      if($window.trackJs) $window.trackJs.attempt.apply($window.trackJs,arguments);
      else {
        try {
          return fn.apply(context,Array.prototype.slice.call(arguments,2))
        } catch(x) {
          console.error("(NOTRACKJS) Calling fn failed: ",x);
        }
      }
    }
  }
}
);
