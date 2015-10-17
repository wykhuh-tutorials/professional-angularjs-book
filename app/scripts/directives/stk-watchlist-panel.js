'use strict';

angular.module('stockDogApp')
  // register directive and inject dependenices
  .directive('stkWatchlistPanel',
    function ($location, $modal, $routeParams, $route, WatchlistService) {
    // returns an object containing configuration options and a link()
    return {
      templateUrl: 'views/templates/watchlist-panel.html',
      restrict: 'E',
      // isolating directives scope so that anything attached to the scope
      // is available only within the context of this directive.
      scope: {},
      // directive’s scope variables are initialized
      link: function ($scope) {
        // initialize variables

        // watchlist is bound to the form inputs
        $scope.watchlist = {};

        var addListModal = $modal({
          scope: $scope,
          template: 'views/templates/addlist-modal.html',
          show: false
        });

        // bind model from service to this directive $scope.
        // grab all lists from local storage and send them the the view.
        // called once on page load.
        $scope.watchlists = WatchlistService.query();

        // display addlist modal
        $scope.showModal = function () {
          addListModal.$promise.then(addListModal.show);
        };

        // create new list from fields in modal
        $scope.createList = function () {
          WatchlistService.save($scope.watchlist);
          addListModal.hide();
          // clear form
          $scope.watchlist = {};
        };

        // delete desired lsit and redirect to home
        $scope.deleteList = function (list) {
          WatchlistService.remove(list);
          $location.path('/');
        };

        // current list when showing one list
        $scope.currentList = $routeParams.listId;

        // redirect to one list
        $scope.gotoList = function (listId) {
          $location.path('watchlist/' + listId);
        };

      }
    };
  });
