'use strict';

angular.module('stockDogApp')
  // registers this service with the top-level AngularJS application
  .service('WatchlistService', function WatchlistService() {
    // Helper: Load watchlists from localStorage
    var loadModel = function () {
      var model = {
        watchlists: localStorage['StockDog.watchlists'] ? JSON.parse(localStorage['StockDog.watchlists']) : [],
        nextId: localStorage['StockDog.nextId'] ? parseInt(localStorage['StockDog.nextId']) : 0
      };
      return model;
    };

    // Helper: Save watchlists to localStorage
    var saveModel = function () {
      localStorage['StockDog.watchlists'] = JSON.stringify(Model.watchlists);
      localStorage['StockDog.nextId'] = Model.nextId;
    };

    // Helper: Use lodash to find a watchlist with given ID
    var findById = function (listId) {
      return _.find(Model.watchlists, function (watchlist) {
        return watchlist.id === parseInt(listId);
      });
    };

    // Return all watchlists or find by given ID
    this.query = function (listId) {
      if (listId) {
        console.log('return one watchlists');
        return findById(listId);
      } else {
        console.log('return all watchlists');
        return Model.watchlists;
      }
    };

    // Save a new watchlist to watchlists model
    this.save = function (watchlist) {
      watchlist.id = Model.nextId++;
      console.log('before save', Model.watchlists);
      // add new list to in-memory Model.watchlist.
      Model.watchlists.push(watchlist);
      // save new list to local storage
      saveModel();
      console.log('after save', Model.watchlists);
    };

    // Remove given watchlist from watchlists model
    this.remove = function (watchlist) {
      console.log('before delete', Model.watchlists);
      // remove list from in-memory Model.watchlist.
      _.remove(Model.watchlists, function (list) {
        return list.id === watchlist.id;
      });
      // save new list to local storage
      saveModel();
      console.log('after delete', Model.watchlists);
    };

    // Initialize Model for this singleton service
    var Model = loadModel();
  });
