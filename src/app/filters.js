'use strict';
(function() {
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

angular.module('orienteerFilters',[]).filter(
  'elapsed_time',function() {
    return function(seconds) {
      var hours = Math.floor(seconds / (60*60));
      seconds -= hours*60*60;
      var minutes = Math.floor(seconds / 60);
      seconds -= minutes*60;
      if(hours) { return hours+':'+pad(minutes,2)+':'+pad(seconds,2); }
      return pad(minutes,2)+':'+pad(seconds,2);
    };
  }
);
})();
