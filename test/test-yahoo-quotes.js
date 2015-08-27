const YahooQuotesServiceProviderTest = AsyncTestCase("YahooQuotesServiceProviderTest");



YahooQuotesServiceProviderTest.prototype.test = (queue) => {
    "use strict";
    const yahooQuotesServiceProvider = new YahooQuotesServiceProvider(eventAggregator);
    const MockQuotesService = function() {};
    MockQuotesService.prototype.fetchQuotesFromTo = () => {};
    MockQuotesService.prototype.fetchQuotesToFrom = () => {};
    const yahooQuotesService = new MockQuotesService();
    const convertFromCurrencies = ["AFN"];
    const convertToCurrency = "EUR";
    yahooQuotesServiceProvider.loadQuotes(yahooQuotesService, convertFromCurrencies, convertToCurrency);

    var convertFromCurrency;
    var quote;
    queue.call("Step 1", function(){
        console.log("Step 1 log");
        const onQuoteReceived = function(eventArgs) {
            convertFromCurrency = eventArgs.convertFromCurrency;
            quote = eventArgs.quote;
        };
        eventAggregator.subscribe("quoteReceived", onQuoteReceived);
        const response1 = '{ "query": { "count": 1, "created": "2015-05-25T20:39:03Z", "lang": "en-US", "results": { "row": [ { "rate": "0.0151", "symbol": "AFNEUR=X" } ] } } }';
        yahooQuotesServiceProvider.quotesHandlerFromTo(response1);
        const response2 = '{ "query": { "count": 1, "created": "2015-05-25T20:39:03Z", "lang": "en-US", "results": { "row": [ { "rate": "66.2251", "symbol": "EURAFN=X" } ] } } }';
        yahooQuotesServiceProvider.quotesHandlerToFrom(response2);
    });

    queue.call("Step 2", function(){
        console.log("Step 2 log");
        assertEquals("", "AFN", convertFromCurrency);
        assertEquals("", 0.0151, quote);
    });

};

