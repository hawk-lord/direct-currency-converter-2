
const MockQuotesService = function() {};
MockQuotesService.prototype.fetchQuotesFromTo = () => {};
MockQuotesService.prototype.fetchQuotesToFrom = () => {};
const mockQuotesService = new MockQuotesService();
const convertFromCurrencies = ["AFN"];
const convertToCurrency = "EUR";
const r1 = {
    query: {
        count: 1,
        created: "2015-05-25T20:39:03Z",
        lang: "en-US",
        results: {
            row: [ {
                rate: 0.0151,
                symbol: "AFNEUR=X"
            } ]
        }
    }
};
const r2 = {
    query: {
        count: 1,
        created: "2015-05-25T20:39:03Z",
        lang: "en-US",
        results: {
            row: [ {
                rate: 66.2251,
                symbol: "EURAFN=X"
            } ]
        }
    }
};
const response1 = JSON.stringify(r1);
const response2 = JSON.stringify(r2);

let convertFromCurrency = "";
let quote = 0;
const onQuoteReceived = function(eventArgs) {
    convertFromCurrency = eventArgs.convertFromCurrencyName;
    quote = eventArgs.quote;
};
// Needed!
eventAggregator.subscribe("quoteReceived", onQuoteReceived);

describe("YahooQuotesServiceProvider", function() {
    const yahooQuotesServiceProvider = new YahooQuotesServiceProvider(eventAggregator);
    describe("#quotesHandlers()", function() {
        yahooQuotesServiceProvider.loadQuotes(mockQuotesService, convertFromCurrencies, convertToCurrency);
        yahooQuotesServiceProvider.quotesHandlerFromTo(response1);
        yahooQuotesServiceProvider.quotesHandlerToFrom(response2);
        it("currency should be AFN", function() {
            assert.equal(convertFromCurrency, "AFN");
        });
        it("quote should be 0.0151", function() {
            assert.equal(quote, 0.0151);
        });
    });
});



