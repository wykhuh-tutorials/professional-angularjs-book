'use strict';

angular.module('stockDogApp')
  .controller('DashboardCtrl', function ($scope, WatchlistService, QuoteService) {
    // initializers
    var unregisterHandlers = [];
    $scope.watchlists = WatchlistService.query();
    $scope.cssStyle = 'height:300px';
    var formatters = {
      number: [
        {
          columnNum: 1,
          prefix: '$'
        }
      ]
    };

    // Helper: Update chart objects
    var updateCharts = function () {
      // Donut chart
      var donutChart = {
        type: 'PieChart',
        displayed: true,
        data: [['Watchlist', 'Market Value']],
        options: {
          title: 'Market Value by Watchlist',
          legend: 'none',
          pieHole: 0.4
        },
        formatters: formatters
      };
      // Column chart
      var columnChart = {
        type: 'ColumnChart',
        displayed: true,
        data: [['Watchlist', 'Change', { role: 'style' }]],
        options: {
          title: 'Day Change by Watchlist',
          legend: 'none',
          animation: {
            duration: 1500,
            easing: 'linear'
          }
        },
        formatters: formatters
      };

      // push data onto both chart objects
      _.each($scope.watchlists, function(watchlist){
        donutChart.data.push([watchlist.name, watchlist.marketValue]);
        columnChart.data.push([watchlist.name, watchlist.dayChange,
          watchlist.dayChange < 0 ? 'Red' : 'Green']);
      });

      // attach charts to scope
      $scope.donutChart = donutChart;
      $scope.columnChart = columnChart;
    };

    // helper to reset controller state
    var reset = function () {
      // clear all tracked stocks fromQuoteService
      QuoteService.clear();

      // register each stock for each watchlist
      _.each($scope.watchlists, function(watchlist) {
        _.each(watchlist.stocks, function(stock) {
          QuoteService.register(stock);
        });
      });

      // unregister existing $watch listners
      _.each(unregisterHandlers, function(unregister) {
        unregister();
      });

      // register new $watch listeners
      _.each($scope.watchlists, function(watchlist) {
        var unregister = $scope.$watch(function() {
          return watchlist.marketValue;
        }, function (){
          recalculate();
        });
        unregisterHandlers.push(unregister);
      });
    };

    // compute new total MarketValue and DayChange
    var recalculate = function () {
      $scope.marketValue = 0;
      $scope.dayChange = 0;

      // $watch for changes in marketValue and dayChange
      _.each($scope.watchlists, function(watchlist){
        $scope.marketValue += watchlist.marketValue ? watchlist.marketValue : 0;
        $scope.dayChange += watchlist.dayChange ? watchlist.dayChange : 0;
      });
      // redraw charts with new data
      updateCharts();
    };

    // watch for adding/deleting watchlists
    // when watchlist are added/deleted, rebuild the controller's entire state
    $scope.$watch('watchlists.length', function(){
      reset();
    });

  });
