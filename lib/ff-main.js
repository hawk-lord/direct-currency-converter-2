/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
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
    const {ParseContentScriptParams} = require("./parseContentScriptParams");
    // TODO change this
    // let convertToCountry = informationHolder.convertToCountry;
    let convertToCountry = null;
    let toCurrency = informationHolder.convertToCurrency;
    eventAggregator.subscribe("quotesFromTo", yahooQuotesService.quotesHandlerFromTo);
    eventAggregator.subscribe("quotesToFrom", yahooQuotesService.quotesHandlerToFrom);
    eventAggregator.subscribe("quoteReceived", (eventArgs) => {
        // console.log("quoteReceived " + eventArgs.quote);
        informationHolder.setConversionQuote(eventArgs.convertFromCurrency, eventArgs.quote);
        if (informationHolder.isAllCurrenciesRead()) {
            // console.log("isAllCurrenciesRead");
            contentInterface.attachToPage();
            chromeInterface.setConversionButtonState(informationHolder.conversionEnabled);
            chromeInterface.setToolsButtonText(informationHolder.getQuoteString());
            contentInterface.registerToTabsEvents();
        }
    });
    if (convertToCountry === null || convertToCountry == null) {
        geoService.loadUserCountry(ffGeoService, convertToCountry);
        eventAggregator.subscribe("countryReceived", (countryCode) => {
            // console.log("countryCode " + countryCode);
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
    eventAggregator.subscribe("toggleConversion", (eventArgs) => {
        contentInterface.toggleConversion(eventArgs);
    });
    eventAggregator.subscribe("showSettingsTab", () => {
        contentInterface.showSettingsTab();
    });
    eventAggregator.subscribe("showTestTab", () => {
        contentInterface.showTestTab();
    });
    eventAggregator.subscribe("saveSettings", (eventArgs) => {
        const toCurrencyChanged = informationHolder.convertToCurrency != eventArgs.contentScriptParams.convertToCurrency;
        informationHolder.resetReadCurrencies();
        new ParseContentScriptParams(eventArgs.contentScriptParams, informationHolder);
        contentInterface.closeSettingsTab();
        if (toCurrencyChanged) {
            // controller.loadQuotes();
            yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getFromCurrencies(),
                informationHolder.convertToCurrency);
        }
    });
    eventAggregator.subscribe("resetSettings", () => {
        informationHolder.resetSettings();
        contentInterface.closeSettingsTab();
        // storageService.init(informationHolder.getDefaultEnabled());
    });

})();
