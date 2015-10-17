'use strict';

angular.module('stockDogApp')
  .controller('MainCtrl', function ($scope, $location, WatchlistService) {
    // populate watchlists for dynamic nav links
    $scope.watchlists = WatchlistService.query();

    // use $location.path() as a $watch expression to figure out current route.
    // when $location.path() changes, callback will update $scope.activeView
    $scope.$watch(function () {
      return $location.path();
    }, function (path) {
      if (_.contains(path, 'watchlist')) {
        $scope.activeView = 'watchlist';
      } else {
        $scope.activeView = 'dashboard';
      }
    });
  });
