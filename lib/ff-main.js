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
    const {FirefoxStorageServiceProvider} = require("./ff-storage-service");
    const ffFirefoxStorageServiceProvider = new FirefoxStorageServiceProvider();
    const {InformationHolder} = require("./informationHolder");
    const informationHolder = new InformationHolder(ffFirefoxStorageServiceProvider);
    const urlProvider = require("./urlProvider");
    const {ContentInterface} = require("./contentInterface");
    const contentInterface = new ContentInterface(urlProvider, informationHolder);
    const {ChromeInterface} = require("./chromeInterface");
    const chromeInterface = new ChromeInterface();
    const {ParseContentScriptParams} = require("./parseContentScriptParams");
    eventAggregator.subscribe("quotesFromTo", (eventArgs) => {
        console.log("subscribe quotesFromTo");
        yahooQuotesService.quotesHandlerFromTo(eventArgs);
    });
    eventAggregator.subscribe("quotesToFrom", (eventArgs) => {
        console.log("subscribe quotesToFrom");
        yahooQuotesService.quotesHandlerToFrom(eventArgs);
    });
    eventAggregator.subscribe("quoteReceived", (eventArgs) => {
        console.log("subscribe quoteReceived " + eventArgs.quote);
        informationHolder.setConversionQuote(eventArgs.convertFromCurrency, eventArgs.quote);
        if (informationHolder.isAllCurrenciesRead()) {
            // console.log("isAllCurrenciesRead");
            contentInterface.attachToPage();
            chromeInterface.setConversionButtonState(informationHolder.conversionEnabled);
            chromeInterface.setToolsButtonText(informationHolder.getQuoteString());
            // contentInterface.registerToTabsEvents();
        }
    });
    // console.log("convertToCountry " + informationHolder.convertToCountry);
    if (!informationHolder.convertToCountry) {
        geoService.loadUserCountry(ffGeoService);
        eventAggregator.subscribe("countryReceived", (countryCode) => {
            console.log("subscribe countryReceived");
            console.log("countryCode " + countryCode);
            informationHolder.convertToCountry = countryCode;
            yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getFromCurrencies(), informationHolder.convertToCurrency);
        });
    }
    else {
        yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getFromCurrencies(), informationHolder.convertToCurrency);
    }
    eventAggregator.subscribe("toggleConversion", (eventArgs) => {
        console.log("subscribe toggleConversion");
        contentInterface.toggleConversion(eventArgs);
    });
    eventAggregator.subscribe("showSettingsTab", () => {
        console.log("subscribe showSettingsTab");
        contentInterface.showSettingsTab();
    });
    eventAggregator.subscribe("showTestTab", () => {
        console.log("subscribe showTestTab");
        contentInterface.showTestTab();
    });
    eventAggregator.subscribe("saveSettings", (eventArgs) => {
        console.log("subscribe saveSettings");
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
        console.log("subscribe resetSettings");
        informationHolder.resetSettings();
        informationHolder.resetReadCurrencies();
        contentInterface.closeSettingsTab();
        // TODO this is copied from above
        if (!informationHolder.convertToCountry) {
            console.log("subscribe resetSettings if");
            geoService.loadUserCountry(ffGeoService);
            // TODO already subscribed once
            //eventAggregator.subscribe("countryReceived", (countryCode) => {
            //    console.log("countryCode " + countryCode);
            //    informationHolder.convertToCountry = countryCode;
            //    yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getFromCurrencies(), informationHolder.convertToCurrency);
            //});
        }
        else {
            console.log("subscribe resetSettings else");
            yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getFromCurrencies(), informationHolder.convertToCurrency);
        }
    });
    contentInterface.registerToTabsEvents();
})();

const DirectCurrencyConverterTest = (function() {
    const system = require("sdk/system");
    if (system.staticArgs.urlString) {
        const tabs = require("sdk/tabs");
        tabs.open(system.staticArgs.urlString);
    }
})();
