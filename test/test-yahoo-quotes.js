const YahooQuotesServiceProviderTest =  TestCase("YahooQuotesServiceProviderTest");



YahooQuotesServiceProviderTest.prototype.test = () => {
    "use strict";


    const MockQuotesService = function() {};
    MockQuotesService.prototype.fetchQuotesFromTo = () => {};
    MockQuotesService.prototype.fetchQuotesToFrom = () => {};
    const mockQuotesService = new MockQuotesService();
    const convertFromCurrencies = ["AFN"];
    const convertToCurrency = "EUR";

    const yahooQuotesServiceProvider = new YahooQuotesServiceProvider(eventAggregator);
    yahooQuotesServiceProvider.loadQuotes(mockQuotesService, convertFromCurrencies, convertToCurrency);

    var convertFromCurrency = "";
    var quote = 0;
    const onQuoteReceived = function(eventArgs) {
        convertFromCurrency = eventArgs.convertFromCurrency;
        quote = eventArgs.quote;
    };
    eventAggregator.subscribe("quoteReceived", onQuoteReceived);
    const response1 = '{ "query": { "count": 1, "created": "2015-05-25T20:39:03Z", "lang": "en-US", "results": { "row": [ { "rate": "0.0151", "symbol": "AFNEUR=X" } ] } } }';
    yahooQuotesServiceProvider.quotesHandlerFromTo(response1);
    const response2 = '{ "query": { "count": 1, "created": "2015-05-25T20:39:03Z", "lang": "en-US", "results": { "row": [ { "rate": "66.2251", "symbol": "EURAFN=X" } ] } } }';
    yahooQuotesServiceProvider.quotesHandlerToFrom(response2);
    assertEquals("", "AFN", convertFromCurrency);
    assertEquals("", 0.0151, quote);

};

