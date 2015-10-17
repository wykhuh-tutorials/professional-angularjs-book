'use strict';

angular.module('stockDogApp')
  .directive('stkStockRow', function ($timeout, QuoteService) {
    return {
      // Use as an attribute
      restrict: 'A',
      // require stkStockTable controller
      //  ^ prefix instructs directive to search for controllers on its parent scopes
      require: '^stkStockTable',
      scope: {
        stock: '=',
        isLast: '='
      },

      // required controller is the last parameter of the link function
      link: function ($scope, element, attrs, stockTableCtrl) {
        // create tooltip for stock-row
        element.tooltip({
          placement: 'left',
          title: $scope.stock.company.name
        });

        // add this row to the TableCtrl
        stockTableCtrl.addRow($scope);

        // register this stock with QuoteService when directive is created
        QuoteService.register($scope.stock);

        // deregister stock with QuoteServe when directive is destroyed
        $scope.$on('$destroy', function(){
          stockTableCtrl.removeRow($scope);
          QuoteService.deregister($scope.stock);
        });

        // if this is the last stock-row, fetch the quotes
        if ($scope.isLast) {
          $timeout(QuoteService.fetch);
        }

        // watch for changes in shares and recalculare
        $scope.$watch('stock.shares', function(){
          $scope.stock.marketValue = $scope.stock.shares * $scope.stock.lastPrice;
          $scope.stock.dayChange = $scope.stock.shares * parseFloat($scope.stock.change);
          $scope.stock.save();
        });
      }
    };
  });
