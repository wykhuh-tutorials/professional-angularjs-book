'use strict';

angular.module('stockDogApp')
  .directive('stkSignFade', function ($animate) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var oldVal = null;
        // user $observe to watch for changes on atrrs values
        attrs.$observe('stkSignFade', function(newVal){
          if (oldVal && oldVal === newVal) { return; }

          var oldPrice = parseFloat(oldVal);
          var newPrice = parseFloat(newVal);
          oldVal = newVal;

          // add the appropriate direction class;
          // remove class after animation is done
          if(oldPrice && newPrice) {
            var direction = newPrice - oldPrice > 0 ? 'up' : 'down';
            // $animate takes an element, class name, and callback function as a parameter,
            $animate.addClass(element, 'change-' + direction, function (){
              $animate.removeClass(element, 'change-' + direction);
            });
          }
        });
      }
    };
  });
