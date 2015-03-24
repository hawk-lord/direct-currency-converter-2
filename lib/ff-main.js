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
    // Placeholders
    var convertToCountry = "SE";
    var convertToCountry = null;
    eventAggregator.subscribe("quotesFromTo", yahooQuotesService.quotesHandlerFromTo);
    eventAggregator.subscribe("quotesToFrom", yahooQuotesService.quotesHandlerToFrom);
    eventAggregator.subscribe("quoteReceived", (eventArgs) => {
        console.log("quoteReceived " + eventArgs.quote);
        informationHolder.setConversionQuote(eventArgs.convertFromCurrency, eventArgs.quote);
        /*
        if (informationHolder.isAllCurrenciesRead()) {
            new ContentScriptInterface(urlProvider, informationHolder);
            barsInterface.setIconsEnabled();
        }
*/
    });
    if (convertToCountry === null || convertToCountry == null) {
        geoService.loadUserCountry(ffGeoService, convertToCountry);
        eventAggregator.subscribe("countryReceived", (countryCode) => {
            console.log("countryCode " + countryCode);
            convertToCountry = countryCode;
            // TODO publish country
            // controller.loadQuotes();
            let fromCurrencies = ["AFN", "AED", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SVC", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "UYI", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XOF", "XPD", "XPF", "XPT", "XSU", "XTS", "XUA", "XXX", "YER", "ZAR", "ZMW", "ZWL"];
            yahooQuotesService.loadQuotes(ffYahooQuotesService, fromCurrencies, "NOK");
        });
    }
    else {
        // TODO publish country
    }

})();
