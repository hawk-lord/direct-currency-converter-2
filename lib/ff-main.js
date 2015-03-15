/**
 * Firefox specific
 */
const DirectCurrencyConverter = (function() {
    "use strict";
    const eventAggregator = require("./eventAggregator");
    const {FirefoxFreegeoipServiceProvider} = require("./ff-freegeoip-service");
    const ffGeoService = new FirefoxFreegeoipServiceProvider();
    const {FreegeoipServiceProvider} = require("./freegeoip-service");
    const geoService = new FreegeoipServiceProvider();
    const {YahooQuotesServiceProvider} = require("./yahoo-quotes");
    const quotesService = new YahooQuotesServiceProvider();
    var convertToCountry = "SE";
    var convertToCountry = null;
    if (convertToCountry === null || convertToCountry == null) {
        geoService.loadUserCountry(ffGeoService, convertToCountry);
        eventAggregator.subscribe("countryReceived", (countryCode) => {
            console.log("countryCode " + countryCode);
        });
    }
    quotesService.loadQuotes();
})();
