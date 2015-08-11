/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const DirectCurrencyConverter = (function() {
    "use strict";
    const defaultExcludedDomains = ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com"];
    const defaultEnabledCurrencies = {"SEK":true, "CHF":true, "DKK":true, "EUR":true, "GBP":true, "ISK":true, "JPY":true, "NOK":true, "RUB":true, "USD":true};
    const eventAggregator = require("./dcc-common-lib/eventAggregator");
    const {Localisation} = require("./ff-l10n");
    const localisation = new Localisation();
    const _ = localisation._;
    const {FirefoxFreegeoipServiceProvider} = require("./ff-freegeoip-service");
    const ffGeoService = new FirefoxFreegeoipServiceProvider();
    const {FreegeoipServiceProvider} = require("./dcc-common-lib/freegeoip-service");
    const geoService = new FreegeoipServiceProvider();
    const {FirefoxYahooQuotesServiceProvider} = require("./ff-yahoo-quotes-service");
    const ffYahooQuotesService = new FirefoxYahooQuotesServiceProvider();
    const {YahooQuotesServiceProvider} = require("./dcc-common-lib/yahoo-quotes");
    const yahooQuotesService = new YahooQuotesServiceProvider(eventAggregator);
    const {FirefoxStorageServiceProvider} = require("./ff-storage-service");
    const ffFirefoxStorageServiceProvider = new FirefoxStorageServiceProvider();
    ffFirefoxStorageServiceProvider.init(defaultEnabledCurrencies, defaultExcludedDomains);
    const currencyData = require("./dcc-common-lib/currencyData.json");
    const currencySymbols = require("./dcc-common-lib/currencySymbols.json");
    /**
     * All currency codes in ISO 4217
     * @type {string[]}
     */
    const iso4217Currencies = require("./dcc-common-lib/iso4217Currencies.json");
    const regionFormats = require("./dcc-common-lib/regionFormats.json");
    const {InformationHolder} = require("./dcc-common-lib/informationHolder");
    const informationHolder = new InformationHolder(defaultEnabledCurrencies, defaultExcludedDomains, ffFirefoxStorageServiceProvider, currencyData, currencySymbols, iso4217Currencies, regionFormats, _);
    const {FirefoxContentInterface} = require("./ff-contentInterface");
    const contentInterface = new FirefoxContentInterface(informationHolder);
    const {SmChromeInterface} = require("./sm-chromeInterface");
    const chromeInterface = new SmChromeInterface();
    const {ParseContentScriptParams} = require("./dcc-common-lib/parseContentScriptParams");
    eventAggregator.subscribe("quotesFromTo", (eventArgs) => {
        // console.log("subscribe quotesFromTo");
        yahooQuotesService.quotesHandlerFromTo(eventArgs);
    });
    eventAggregator.subscribe("quotesToFrom", (eventArgs) => {
        // console.log("subscribe quotesToFrom");
        yahooQuotesService.quotesHandlerToFrom(eventArgs);
    });
    var watchingForPages = false;
    eventAggregator.subscribe("quoteReceived", (eventArgs) => {
        // console.log("subscribe quoteReceived " + eventArgs.quote);
        informationHolder.setConversionQuote(eventArgs.convertFromCurrency, eventArgs.quote);
        if (informationHolder.isAllCurrenciesRead()) {
            // console.log("isAllCurrenciesRead");
            if (!watchingForPages) {
                contentInterface.watchForPages();
                watchingForPages = true;
            }
            chromeInterface.setConversionButtonState(informationHolder.conversionEnabled);
            chromeInterface.setToolsButtonText(informationHolder.getQuoteString());
            // contentInterface.registerToTabsEvents();
        }
    });
    // console.log("convertToCountry " + informationHolder.convertToCountry);

    eventAggregator.subscribe("countryReceived", (countryCode) => {
        informationHolder.convertToCountry = countryCode;
        yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getFromCurrencies(), informationHolder.convertToCurrency);
    });

    geoService.loadUserCountry(ffGeoService);

    eventAggregator.subscribe("toggleConversion", (eventArgs) => {
        contentInterface.toggleConversion(eventArgs);
    });
    eventAggregator.subscribe("showSettingsTab", () => {
        // console.log("subscribe showSettingsTab");
        contentInterface.showSettingsTab();
    });
    eventAggregator.subscribe("showTestTab", () => {
        // console.log("subscribe showTestTab");
        contentInterface.showTestTab();
    });
    eventAggregator.subscribe("saveSettings", (eventArgs) => {
        // console.log("subscribe saveSettings");
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
        // console.log("subscribe resetSettings");
        informationHolder.resetSettings();
        informationHolder.resetReadCurrencies();
        contentInterface.closeSettingsTab();
        geoService.loadUserCountry(ffGeoService);
    });
    const sp = require("sdk/simple-prefs");
    sp.on("DCCPreferences", (e) => {
        eventAggregator.publish("showSettingsTab");
    });
})();

const DirectCurrencyConverterTest = (function() {
    const system = require("sdk/system");
//    if (system.staticArgs.urlString) {
        const tabs = require("sdk/tabs");
//        tabs.open(system.staticArgs.urlString);
//    }
})();
