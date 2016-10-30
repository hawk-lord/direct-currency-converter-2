
const MockQuotesService = function() {};
MockQuotesService.prototype.fetchQuotesFromTo = () => {};
MockQuotesService.prototype.fetchQuotesToFrom = () => {};
const mockQuotesService = new MockQuotesService();
const convertFromCurrencies = ["AFN"];
const convertToCurrency = "EUR";
const response1 = '"AFNEUR=X","AFN/EUR",0.0138,"10/11/2016","8:15pm",0.0138,0.0138';
const response2 = '"EURAFN=X","EUR/AFN",72.7000,"10/11/2016","8:15pm",72.7250,72.7000';

var convertFromCurrency = "";
var quote = 0;
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
        it("quote should be 0.0138", function() {
            assert.equal(quote, 0.0138);
        });
    });
});



