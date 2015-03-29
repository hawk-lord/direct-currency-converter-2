/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Module pattern is used.
 */
const DirectCurrencyConverter = (function() {
    "use strict";
    const eventAggregator = require("./eventAggregator");
    const {FirefoxFreegeoipServiceProvider} = require("./ff-freegeoip-service");
    const ffGeoService = new FirefoxFreegeoipServiceProvider();
    const {FreegeoipServiceProvider} = require("./freegeoip-service");
    const geoService = new FreegeoipServiceProvider();
    const {FirefoxYahooQuotesServiceProvider} = require("./ff-yahoo-quotes-service");
    const ffYahooQuotesService = new FirefoxYahooQuotesServiceProvider();
    const {YahooQuotesServiceProvider} = require("./yahoo-quotes");
    const yahooQuotesService = new YahooQuotesServiceProvider(eventAggregator);
    const {InformationHolder} = require("./informationHolder");
    const informationHolder = new InformationHolder();
    const urlProvider = require("./urlProvider");
    const {ContentInterface} = require("./contentInterface");
    const contentInterface = new ContentInterface(urlProvider, informationHolder);
    const {ChromeInterface} = require("./chromeInterface");
    const chromeInterface = new ChromeInterface();
    // Placeholders
    // var convertToCountry = informationHolder.convertToCountry;
    var convertToCountry = null;
    var toCurrency = informationHolder.convertToCurrency;
    eventAggregator.subscribe("quotesFromTo", yahooQuotesService.quotesHandlerFromTo);
    eventAggregator.subscribe("quotesToFrom", yahooQuotesService.quotesHandlerToFrom);
    eventAggregator.subscribe("quoteReceived", (eventArgs) => {
        console.log("quoteReceived " + eventArgs.quote);
        informationHolder.setConversionQuote(eventArgs.convertFromCurrency, eventArgs.quote);
        if (informationHolder.isAllCurrenciesRead()) {
            console.log("isAllCurrenciesRead");
            contentInterface.attach();
            chromeInterface.setConversionButtonState(informationHolder.conversionEnabled);
            chromeInterface.setToolsButtonText(informationHolder.getQuoteString());
        }
    });
    if (convertToCountry === null || convertToCountry == null) {
        geoService.loadUserCountry(ffGeoService, convertToCountry);
        eventAggregator.subscribe("countryReceived", (countryCode) => {
            console.log("countryCode " + countryCode);
            convertToCountry = countryCode;
            // TODO publish country
            // controller.loadQuotes();
            yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getFromCurrencies(), toCurrency);
        });
    }
    else {
        // TODO publish country
        yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getFromCurrencies(), toCurrency);
    }

})();
