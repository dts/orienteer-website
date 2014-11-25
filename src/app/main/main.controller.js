'use strict';

angular.module('orienteerio')
  .controller('MainCtrl', function ($scope,API) {
    
    $scope.awesomeThings = [
      {
        'key': 'karma',
        'title': 'Karma',
        'url': 'http://karma-runner.github.io/',
        'description': 'Spectacular Test Runner for JavaScript.',
        'logo': 'karma.png'
      },
      {
        'key': 'protractor',
        'title': 'Protractor',
        'url': 'https://github.com/angular/protractor',
        'description': 'End to end test framework for AngularJS applications built on top of WebDriverJS.',
        'logo': 'protractor.png'
      },
      {
        'key': 'jquery',
        'title': 'jQuery',
        'url': 'http://jquery.com/',
        'description': 'jQuery is a fast, small, and feature-rich JavaScript library.',
        'logo': 'jquery.jpg'
      },
      {
        'key': 'foundation',
        'title': 'Foundation',
        'url': 'http://foundation.zurb.com/',
        'description': 'The most advanced responsive front-end framework in the world.',
        'logo': 'foundation.png'
      },
      {
        'key': 'node-sass',
        'title': 'Sass (Node)',
        'url': 'https://github.com/sass/node-sass',
        'description': 'Node.js binding to libsass, the C version of the popular stylesheet preprocessor, Sass.',
        'logo': 'node-sass.png'
      }
    ];

    angular.forEach($scope.awesomeThings, function(awesomeThing) {

      awesomeThing.rank = Math.random();

    });

  });

