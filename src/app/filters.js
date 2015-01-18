'use strict';
(function() {
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

  function limit_digits(string,num) {
    var m = string.match(/^(.*?)\.(.*?)$/);
    if(!m) return string;

    var whole = m[1];
    var digits = m[2]

    return whole+"."+digits.substring(0,num)    
  }
angular.module('orienteerFilters',[]).filter(
  'elapsed_time',function() {
    return function(seconds) {
      var hours = Math.floor(seconds / (60*60));
      seconds -= hours*60*60;
      var minutes = Math.floor(seconds / 60);
      seconds -= minutes*60;
      var padded_secs = limit_digits(pad(seconds,2),1);
      var padded_mins = pad(minutes,2)
      if(hours) { return hours+':'+padded_mins+':'+padded_secs; }
      return padded_mins+':'+padded_secs;
    };
  }
);
})();
