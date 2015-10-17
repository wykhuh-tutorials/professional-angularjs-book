'use strict';

// ' +123.123 '
var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

angular.module('stockDogApp')
  // $sce - Strict Contextual Escaping service. sanitize user input before
   // updating the view’s HTML
  .directive('contenteditable', function ($sce) {
    return {
      restrict: 'A',
      // Get a hold of ngModelController to advantage of Angular’s bidirectional
       // data binding to trigger updates to the rest of the table based
       // on the user’s modification
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ngModelCtrl) {
        // do nothing if no ng-model
        if (!ngModelCtrl) { return; }

        // specify how ngModelCtrl should update the ui
        ngModelCtrl.$render = function () {
          element.html($sce.getTrustedHtml(ngModelCtrl.$viewValue));
        };

        // read html value and write data to model or reset the view
        var read = function () {
          var value = element.html();
          // if input is not  a number, update the view with the previous value
          if (attrs.type === 'number' && !NUMBER_REGEXP.test(value)) {
            ngModelCtrl.$render();
          // if input is a number, call $setViewValue, which invlies $render and
          // kicks off $parsers pipeline
          } else {
            ngModelCtrl.$setViewValue(value);
          }
        };

        // add custom parser-based input type that only works on numbers.
        // apply parsers to $modelValue
        if (attrs.type === 'number') {
          ngModelCtrl.$parsers.push(function(value){
            // parses the $viewValue into a number so that ngModel can
            // update the $modelValue
            return parseFloat(value);
          });
        }

        // listen for blur, keyup, and change events to invoke read()
        element.on('blur keyup change', function(){
          scope.$apply(read);
        });

      }
    };
  });
