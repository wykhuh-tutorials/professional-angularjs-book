'use strict';


angular.module('stockDogApp')
  .directive('stkSignColor', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        // $observe()is a function of the $attrs object
        // $observe watches for changes in DOM valute
        attrs.$observe('stkSignColor', function (newValue) {
          // set color based on +/- number
          if (parseFloat(newValue) > 0) {
            element[0].style.color = 'Green';
          } else {
            element[0].style.color = 'Red';
          }
        });
      }
    };
  });
