'use strict';

angular.module('stockDogApp')
  .controller('WatchlistCtrl', function ($scope, $routeParams, $modal, WatchlistService, CompanyService) {

    // initializations
    $scope.companies = CompanyService.query();
    $scope.watchlist = WatchlistService.query($routeParams.listId);
    $scope.stocks = $scope.watchlist.stocks;
    $scope.newStock = {};

    var addStockModal = $modal({
      scope: $scope,
      template: 'views/templates/addstock-modal.html',
      show: false
    });

    // show modal
    $scope.showStockModal = function () {
      addStockModal.$promise.then(addStockModal.show);
    }

    $scope.addStock = function () {
      // calls  WatchlistService WatchlistModel addStock()
      $scope.watchlist.addStock({
        listId: $routeParams.listId,
        // newStock is bound to the form
        company: $scope.newStock.company,
        shares: $scope.newStock.shares
      });
      // hide modal
      addStockModal.hide();
      // clear form
      $scope.newStock = {};
    };

  });
