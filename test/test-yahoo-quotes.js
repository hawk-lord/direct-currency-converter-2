YahooQuotesServiceProviderTest = TestCase("YahooQuotesServiceProviderTest");

/**
 * Using var instead of let :-(
 * @type {{publish, subscribe}}
 */
const eventAggregator = (function() {
    "use strict";
    const grep = function grep( elems, callback, inv ) {
        "use strict";
        var retVal,
            ret = [],
            i = 0,
            length = elems.length;
        inv = !!inv;
        // Go through the array, only saving the items
        // that pass the validator function
        for ( ; i < length; i++ ) {
            retVal = !!callback( elems[ i ], i );
            if ( inv !== retVal ) {
                ret.push( elems[ i ] );
            }
        }
        return ret;
    };
    const Event = function(name) {
        "use strict";
        this._handlers = [];
        this.name = name;
    };
    Event.prototype.addHandler = function(handler) {
        this._handlers.push(handler);
    };
    Event.prototype.removeHandler = function(handler) {
        for (var i = 0; i < this._handlers.length; i++) {
            if (this._handlers[i] == handler) {
                this._handlers.splice(i, 1);
                break;
            }
        }
    };
    Event.prototype.fire = function(eventArgs) {
        this._handlers.forEach(function(h) {
            h(eventArgs);
        });
    };
    const events = [];
    const getEvent = function(eventName) {
        return grep(events, function(event) {
            return event.name === eventName;
        })[0];
    };
    return {
        publish: function(eventName, eventArgs) {
            var event = getEvent(eventName);
            if (!event) {
                event = new Event(eventName);
                events.push(event);
            }
            event.fire(eventArgs);
        },
        subscribe: function(eventName, handler) {
            var event = getEvent(eventName);
            if (!event) {
                event = new Event(eventName);
                events.push(event);
            }
            event.addHandler(handler);
        }
    };
})();



YahooQuotesServiceProviderTest.prototype.test = () => {
    "use strict";
    const yahooQuotesServiceProvider = new YahooQuotesServiceProvider();
    const YahooQuotesService = function() {};
    YahooQuotesService.prototype.fetchQuotesFromTo = () => {};
    YahooQuotesService.prototype.fetchQuotesToFrom = () => {};
    const yahooQuotesService = new YahooQuotesService(eventAggregator);
    const convertFromCurrencies = ["AFN"];
    const convertToCurrency = "EUR";
    yahooQuotesServiceProvider.loadQuotes(yahooQuotesService, convertFromCurrencies, convertToCurrency);
    const response1 = '{ "query": { "count": 1, "created": "2015-05-25T20:39:03Z", "lang": "en-US", "results": { "row": [ { "rate": "0.0151", "symbol": "AFNEUR=X" } ] } } }';
    yahooQuotesServiceProvider.quotesHandlerFromTo(response1);
    const response2 = '{ "query": { "count": 1, "created": "2015-05-25T20:39:03Z", "lang": "en-US", "results": { "row": [ { "rate": "66.2251", "symbol": "EURAFN=X" } ] } } }';
    yahooQuotesServiceProvider.quotesHandlerToFrom(response2);

};

