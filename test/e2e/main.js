'use strict';

var setup = require('./setup');

describe('suite',function() {
beforeEach(function () {
  setup(browser);
  browser.get('http://localhost:3000/index.html');
});

describe('Signing Up', function () {
  it('should sign up', function () {
    element(by.buttonText('Sign Up!')).click();
    element(by.model('data.username')).sendKeys('tester@orienteer.io');
    element(by.model('data.password')).sendKeys('asdfasdf');
    element(by.model('data.fname')).sendKeys('Joe');
    element(by.model('data.lname')).sendKeys('Tester');
    element(by.buttonText('Sign Up')).click();
    element(by.cssContainingText('a','Settings')).click();
    element(by.buttonText('Log out')).click();
  });
});

  describe('courses',function() {
    beforeEach(function() {
      element(by.model('data.username')).sendKeys('tester@orienteer.io');
      element(by.model('data.password')).sendKeys('asdfasdf');
      element(by.buttonText('Log In')).click();
    });

    afterEach(function() {
      element(by.cssContainingText('a','Settings')).click();
      element(by.buttonText('Log out')).click();
    });

  it('should allow the creation of courses',
     function() {
       element(by.css('leaflet.full-image')).evaluate('bounds').
         then(function(x) {
           console.log("x: ",x);
         });
     }
    );
});
});
