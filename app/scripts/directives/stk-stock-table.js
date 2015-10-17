'use strict';

angular.module('stockDogApp')
  .directive('stkStockTable', function () {
    return {
      templateUrl: 'views/templates/stock-table.html',
      restrict: 'E',
      // isolate scope.
      // bind watch-list object passed into the directive's DOM element
      // to the directive.
      scope: {
        watchlist: '='
      },
      // controler serves ast the api for the directive.
      // anything bound to this will serve as the api that child directives can use
      controller: function ($scope) {
        var rows = [];

        $scope.$watch('showPercent', function (showPercent) {
          if (showPercent) {
            _.each(rows, function(row) {
              row.showPercent = showPercent;
            });
          }
        });

        this.addRow = function (row) {
          rows.push(row);
        };

        this.removeRow = function (row) {
          _.remove(rows, row);
        };
      },
      // common to use link for DOM manipulation.
      // intialize showPercent. expose removeStock()
      link: function ($scope) {
        $scope.showPercent = false;
        $scope.removeStock = function (stock) {
          $scope.watchlist.removeStock(stock);
        };
      }
    };
  });
