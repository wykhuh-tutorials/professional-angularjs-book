'use strict';

angular.module('stockDogApp')
  .service('QuoteService', function QuoteService($http, $interval) {
    var stocks = [];
    var BASE = 'http://query.yahooapis.com/v1/public/yql';

    // update stock mode with data from quotes
    var update = function (quotes) {
      console.log(quotes);

      if (quotes.length === stocks.length) {
        _.each(quotes, function(quote, idx) {
          var stock = stocks[idx];
          stock.lastPrice = parseFloat(quote.LastTradePriceOnly);
          stock.change = quote.Change;
          stock.percentChange = quote.ChangeinPercent;
          stock.marketVaule = stock.shares * stock.lastPrice;
          stock.dayChange = stock.shares * parseFloat(stock.change);
          stock.save();
        });
      }
    };

    // helper functions to manage which stocks to get quotes for
    this.register = function (stock) {
      stocks.push(stock);
    };

    this.deregister = function(stock) {
      _.remove(stocks, stock);
    };

    this.clear = function () {
      stocks = [];
    };

    // connect with YAHOO to fetch quotes
    this.fetch = function () {
      var symbols = _.reduce(stocks, function (symbols, stock) {
        symbols.push(stock.company.symbol);
        return symbols;
      }, []);

      // create url
      var query = encodeURIComponent('select * from yahoo.finance.quotes ' +
        'where symbol in (\'' + symbols.join(',') + '\')');
      var url = BASE + '?' + 'q=' + query + '&format=json&diagnostics=true' +
        '&env=http://datatables.org/alltables.env';

      // connect with yahoo api
      $http.jsonp(url + '&callback=JSON_CALLBACK')
        .success(function (data) {
          if (data.query.count) {
            var quotes = data.query.count > 1 ?
              data.query.results.quote : [data.query.results.quote];
            update(quotes);
          }
        })
        .error(function (data) {
          console.log(data);
        });
    };

    // [4] Used to fetch new quote data every  hour
    $interval(this.fetch, 1000 * 60 * 60);
  });
