'use strict';

angular.module('stockDogApp')
  // registers this service with the top-level AngularJS application
  .service('WatchlistService', function WatchlistService() {

    // add helper methods to Stocks
    var StockModel = {
      save: function () {
        var watchlist = findById(this.listId);
        watchlist.recalculate();
        saveModel();
      }
    };

    // add helper methods to deal with the stocks in Watchlists
    var WatchlistModel = {

      addStock: function (stock) {
        var existingStock = _.find(this.stocks, function (s) {
          return s.company.symbol === stock.company.symbol;
        });

        if (existingStock) {
          existingStock.shares += stock.shares;
        } else {

          // Assigns own properties of source object(s) to the destination object
          _.extend(stock, StockModel);
          this.stocks.push(stock);

          console.log('after extend', stock, StockModel);
        }
        this.recalculate();
        saveModel();
      },

      removeStock: function (stock) {
        _.remove(this.stocks, function (s) {
          return s.company.symbol === stock.company.symbol;
        });
        this.recalculate();
        saveModel();
      },

      recalculate: function () {
        var calcs = _.reduce(this.stocks, function (calcs, stock) {
          calcs.shares += stock.shares;
          calcs.marketValue += stock.marketValue;
          calcs.dayChange += stock.dayChange;
          return calcs;
        }, { shares: 0, marketValue: 0, dayChange: 0 });

        this.shares = calcs.shares;
        this.marketValue = calcs.marketValue;
        this.dayChange = calcs.dayChange;
      }
    };


    // Helper: Load watchlists from localStorage
    var loadModel = function () {
      var model = {
        watchlists: localStorage['StockDog.watchlists'] ?
          JSON.parse(localStorage['StockDog.watchlists']) : [],
        nextId: localStorage['StockDog.nextId'] ?
          parseInt(localStorage['StockDog.nextId']) : 0
      };
      _.each(model.watchlists, function (watchlist) {
        // adds WatchlistModel methods to watchlist
        _.extend(watchlist, WatchlistModel);
        _.each(watchlist.stocks, function (stock) {
          // adds StockModel methods to stock
          _.extend(stock, StockModel);
        });
      });

      return model;
    };

    // Helper: Save watchlists to localStorage
    var saveModel = function () {
      // functions on the models are not stored in local storage.
      // JSON.stringify will return undefined when given a function.
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
      console.log('before save', Model.watchlists);

      watchlist.id = Model.nextId++;
      watchlist.stocks = [];
      _.extend(watchlist, WatchlistModel);
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
