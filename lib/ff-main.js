/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const DirectCurrencyConverter = (function() {
    "use strict";
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
    const currencyData = require("./dcc-common-lib/currencyData.json");
    const currencySymbols = require("./dcc-common-lib/currencySymbols.json");
    /**
     * All currency codes in ISO 4217
     * @type {string[]}
     */
    const iso4217Currencies = require("./dcc-common-lib/iso4217Currencies.json");
    const regionFormats = require("./dcc-common-lib/regionFormats.json");
    const {InformationHolder} = require("./dcc-common-lib/informationHolder");
    const informationHolder = new InformationHolder(ffFirefoxStorageServiceProvider, currencyData, currencySymbols, iso4217Currencies, regionFormats, _);
    const {FirefoxContentInterface} = require("./ff-contentInterface");
    const contentInterface = new FirefoxContentInterface(informationHolder);
    const {FirefoxChromeInterface} = require("./ff-chromeInterface");
    const chromeInterface = new FirefoxChromeInterface();
    const {ParseContentScriptParams} = require("./dcc-common-lib/parseContentScriptParams");
    eventAggregator.subscribe("quotesFromTo", (eventArgs) => {
        // console.log("subscribe quotesFromTo");
        yahooQuotesService.quotesHandlerFromTo(eventArgs);
    });
    eventAggregator.subscribe("quotesToFrom", (eventArgs) => {
        // console.log("subscribe quotesToFrom");
        yahooQuotesService.quotesHandlerToFrom(eventArgs);
    });
    eventAggregator.subscribe("quoteReceived", (eventArgs) => {
        // console.log("subscribe quoteReceived " + eventArgs.quote);
        informationHolder.setConversionQuote(eventArgs.convertFromCurrency, eventArgs.quote);
        if (informationHolder.isAllCurrenciesRead()) {
            // console.log("isAllCurrenciesRead");
            contentInterface.watchForPages();
            chromeInterface.setConversionButtonState(informationHolder.conversionEnabled);
            chromeInterface.setToolsButtonText(informationHolder.getQuoteString());
            // contentInterface.registerToTabsEvents();
        }
    });
    // console.log("convertToCountry " + informationHolder.convertToCountry);
    if (!informationHolder.convertToCountry) {
        geoService.loadUserCountry(ffGeoService);
        eventAggregator.subscribe("countryReceived", (countryCode) => {
            // console.log("subscribe countryReceived");
            // console.log("countryCode " + countryCode);
            informationHolder.convertToCountry = countryCode;
            yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getFromCurrencies(), informationHolder.convertToCurrency);
        });
    }
    else {
        yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getFromCurrencies(), informationHolder.convertToCurrency);
    }
    eventAggregator.subscribe("toggleConversion", (eventArgs) => {
        // console.log("subscribe toggleConversion");
        //var number = 123456.789;
        //const inf = new Intl.NumberFormat('da-DK', { style: 'currency', currencyDisplay: 'symbol', currency: 'DKK' });
        //console.log(inf.format(number));
        //const dojo = require("./dojo.js.uncompressed");
        //const id = dojo.getPlatformDefaultId();
        //console.log(id);
        /*
            function(cldrMonetary){
                    // the ISO 4217 currency code for Euro:
                    var iso = "EUR";
                    // get monetary data:
                    var cldrMonetaryData = cldrMonetary.getData(iso);

                    // print out places:
                    console.log("Places: " + cldrMonetaryData.places);

                    // print out round:
                    //dom.byId("round").innerHTML = "Round: " + cldrMonetaryData.round;
            });
            */
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
        // TODO this is copied from above
        if (!informationHolder.convertToCountry) {
            // console.log("subscribe resetSettings if");
            geoService.loadUserCountry(ffGeoService);
            // TODO already subscribed once
            //eventAggregator.subscribe("countryReceived", (countryCode) => {
            //    console.log("countryCode " + countryCode);
            //    informationHolder.convertToCountry = countryCode;
            //    yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getFromCurrencies(), informationHolder.convertToCurrency);
            //});
        }
        else {
            // console.log("subscribe resetSettings else");
            yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getFromCurrencies(), informationHolder.convertToCurrency);
        }
    });
})();

const DirectCurrencyConverterTest = (function() {
    const system = require("sdk/system");
    if (system.staticArgs.urlString) {
        const tabs = require("sdk/tabs");
        tabs.open(system.staticArgs.urlString);
    }
})();
