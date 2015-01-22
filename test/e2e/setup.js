module.exports = function(browser) {
  browser.addMockModule('orienteerio-mocks',function() {
    angular.module('orienteerio-mocks',[]).factory('ApiUri',function() { return 'http://api.orienteer.io:3002/api/'; });
  });
};
