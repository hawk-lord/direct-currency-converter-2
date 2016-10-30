/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const DirectCurrencyConverter = (function() {
    "use strict";
    const {storage} = require("sdk/simple-storage");
    const {Panel} = require("sdk/panel");
    const {ToggleButton} = require("sdk/ui");
    const {PageMod} = require("sdk/page-mod");
    const {ContentScriptParams} = require("./dcc-common-lib/contentScriptParams");
    const tabs = require("sdk/tabs");
    const {Request} = require("sdk/request");
    const defaultExcludedDomains = ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com"];
    const eventAggregator = require("./dcc-common-lib/eventAggregator");
    const {Localisation} = require("./ff-l10n");
    const localisation = new Localisation();
    const _ = localisation._;
    const {FirefoxFreegeoipServiceProvider} = require("./ff-freegeoip-service");
    const ffGeoServiceFreegeoip = new FirefoxFreegeoipServiceProvider(Request, eventAggregator);
    const {FreegeoipServiceProvider} = require("./dcc-common-lib/freegeoip-service");
    const geoServiceFreegeoip = new FreegeoipServiceProvider();
    // alternative to Freegeoip
    const {FirefoxNekudoServiceProvider} = require("./ff-nekudo-service");
    const ffGeoServiceNekudo = new FirefoxNekudoServiceProvider(Request, eventAggregator);
    const {NekudoServiceProvider} = require("./dcc-common-lib/nekudo-service");
    const geoServiceNekudo = new NekudoServiceProvider();
    //
    const {FirefoxYahooQuotesServiceProvider} = require("./ff-yahoo-quotes-service");
    const ffYahooQuotesService = new FirefoxYahooQuotesServiceProvider();
    const {YahooQuotesServiceProvider} = require("./dcc-common-lib/yahoo-quotes");
    const yahooQuotesService = new YahooQuotesServiceProvider(eventAggregator);
    const iso4217Currencies = require("./dcc-common-lib/iso4217Currencies.json");
    const {FirefoxStorageServiceProvider} = require("./ff-storage-service");
    const ffFirefoxStorageServiceProvider = new FirefoxStorageServiceProvider(storage);
    ffFirefoxStorageServiceProvider.init(iso4217Currencies, defaultExcludedDomains);
    const currencyData = require("./dcc-common-lib/currencyData.json");
    const currencySymbols = require("./dcc-common-lib/currencySymbols.json");
    const regionFormats = require("./dcc-common-lib/regionFormats.json");
    const convertFroms = ffFirefoxStorageServiceProvider.convertFroms;
    const {InformationHolder} = require("./dcc-common-lib/informationHolder");
    const informationHolder = new InformationHolder(ffFirefoxStorageServiceProvider, currencyData, currencySymbols, convertFroms, regionFormats, _);
    const {FirefoxContentInterface} = require("./ff-contentInterface");
    const contentInterface = new FirefoxContentInterface(informationHolder, PageMod, ContentScriptParams, tabs, eventAggregator);
    const {FirefoxChromeInterface} = require("./ff-chromeInterface");
    const chromeInterface = new FirefoxChromeInterface(_, Panel, ToggleButton, eventAggregator);
    const {ParseContentScriptParams} = require("./dcc-common-lib/parseContentScriptParams");
    eventAggregator.subscribe("quotesFromTo", (eventArgs) => {
        yahooQuotesService.quotesHandlerFromTo(eventArgs);
    });
    eventAggregator.subscribe("quotesToFrom", (eventArgs) => {
        yahooQuotesService.quotesHandlerToFrom(eventArgs);
    });
    chromeInterface.setConversionButtonState(informationHolder.conversionEnabled);
    contentInterface.watchForPages();
    eventAggregator.subscribe("quoteReceived", (eventArgs) => {
        informationHolder.setConversionQuote(eventArgs.convertFromCurrencyName, eventArgs.quote);
        if (informationHolder.isAllCurrenciesRead()) {
            chromeInterface.setConversionButtonState(informationHolder.conversionEnabled);
            chromeInterface.setToolsButtonText(informationHolder.getQuoteString());
            contentInterface.watchForPages();
        }
    });

    eventAggregator.subscribe("countryReceivedFreegeoip", (countryCode) => {
        if (countryCode !== "") {
            informationHolder.convertToCountry = countryCode;
            yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getConvertFroms(), informationHolder.convertToCurrency);
        }
        else {
            geoServiceNekudo.loadUserCountry(ffGeoServiceNekudo);
        }
    });

    eventAggregator.subscribe("countryReceivedNekudo", (countryCode) => {
        if (countryCode !== "") {
            informationHolder.convertToCountry = countryCode;
        }
        else {
            informationHolder.convertToCountry = "CH";
        }
        yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getConvertFroms(), informationHolder.convertToCurrency);
    });

    if (!informationHolder.convertToCountry) {
        geoServiceFreegeoip.loadUserCountry(ffGeoServiceFreegeoip);
    }
    else {
        yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getConvertFroms(), informationHolder.convertToCurrency);
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
            yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getConvertFroms(),
                informationHolder.convertToCurrency);
        }
    });
    eventAggregator.subscribe("resetQuotes", () => {
        informationHolder.resetReadCurrencies();
        yahooQuotesService.loadQuotes(ffYahooQuotesService, informationHolder.getConvertFroms(),
            informationHolder.convertToCurrency);
    });
    eventAggregator.subscribe("resetSettings", () => {
        informationHolder.resetSettings(iso4217Currencies);
        informationHolder.resetReadCurrencies();
        contentInterface.closeSettingsTab();
        // geoService.loadUserCountry(ffGeoService);
        geoServiceFreegeoip.loadUserCountry(ffGeoServiceFreegeoip);
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
