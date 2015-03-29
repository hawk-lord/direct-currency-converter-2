/*
 * © 2014 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Based on code from Simple Currency Converter
 * https://addons.mozilla.org/en-US/firefox/addon/simple-currency-converter/
 *
 * Module pattern is used.
 */
const DirectCurrencyConverter = (function() {
    // Show where the program begins!
    // console.log("---------------------------------------------------------------------------------------------");
    // destructuring
    const {grep} = require("./grep");
    // Event function from SOLID Javascript
    // http://aspiringcraftsman.com/series/solid-javascript/
    const Event = function(name) {
        this._handlers = [];
        this.name = name;
    };
    Event.prototype.addHandler = function(handler) {
        this._handlers.push(handler);
    };
    Event.prototype.removeHandler = function(handler) {
        for (var i = 0; i < this._handlers.length; i++) {
            if (this._handlers[i] == handler) {
                this._handlers.splice(i, 1);
                break;
            }
        }
    };
    Event.prototype.fire = function(eventArgs) {
        this._handlers.forEach(function(h) {
            h(eventArgs);
        });
    };
    const eventAggregator = (function() {
        const events = [];
        const getEvent = function(eventName) {
            return grep(events, function(event) {
                return event.name === eventName;
            })[0];
        };
        return {
            publish: function(eventName, eventArgs) {
                var event = getEvent(eventName);
                if (!event) {
                    event = new Event(eventName);
                    events.push(event);
                }
                event.fire(eventArgs);
            },
            subscribe: function(eventName, handler) {
                var event = getEvent(eventName);
                if (!event) {
                    event = new Event(eventName);
                    events.push(event);
                }
                event.addHandler(handler);
            }
        };
    })();
    const CustomTabObject = function() {
        "use strict";
        this.enabled = false;
        this.hasConvertedElements = false;
        this.workers = [];
    };
    // Stereotype Service provider
    // Named Function Expression
    const YahooQuotesServiceProvider = function() {
        "use strict";
        let convertToCurrency;
        let quoteQueriesFromTo;
        let quoteQueriesToFrom;
        let quotesFromTo;
        let quotesToFrom;
        const makeQuoteQuery = (aConvertFromCurrency) => {
            if (convertToCurrency === "gAu") {
                quoteQueriesFromTo.push(aConvertFromCurrency + "XAU" + "=X");
                quoteQueriesToFrom.push("XAU" + aConvertFromCurrency + "=X");
            }
            else {
                quoteQueriesFromTo.push(aConvertFromCurrency + convertToCurrency + "=X");
                quoteQueriesToFrom.push(convertToCurrency + aConvertFromCurrency + "=X");
            }
        };
        const quotesHandlerFromTo = (aResponse) => {
            try {
                const response = JSON.parse(aResponse.text);
                if (aResponse.status == "200") {
                    quotesFromTo = response.query.results.row;
                    if (quotesFromTo.length > 0 && quotesToFrom.length > 0) {
                        makeOneResponse();
                    }
                }
                else {
                }
            }
            catch(err) {
                // console.log("err " + err);
            }
        };
        const quotesHandlerToFrom = (aResponse) => {
            try {
                const response = JSON.parse(aResponse.text);
                if (aResponse.status == "200") {
                    quotesToFrom = response.query.results.row;
                    if (quotesFromTo.length > 0 && quotesToFrom.length > 0) {
                        makeOneResponse();
                    }
                }
                else {
                }
            }
            catch(err) {
                // console.log("err " + err);
            }
        };
        const gramsPerOunce = 31.1034768;
        // Since Yahoo quote response only has four decimals, we sometimes get imprecise quotes
        // In such cases, we use the inverse quote and invert it.
        const makeOneResponse = () => {
            quotesFromTo.forEach( (anElement, anIndex) => {
                // "USDEUR=X",0.7317
                let convertFromCurrency = anElement.symbol.substr(0, 3);
                let quote = anElement.rate;
                if (quote < 0.01) {
                    // "EURJPY=X",142.3186
                    convertFromCurrency = quotesToFrom[anIndex].symbol.substr(3, 3);
                    const reverseQuote = quotesToFrom[anIndex].rate;
                    quote = reverseQuote > 0 ? 1 / reverseQuote : 0;
                }
                if (convertToCurrency == "gAu") {
                    quote = quote * gramsPerOunce;
                }
                if (convertFromCurrency.length > 0) {
                    eventAggregator.publish("quoteReceived", {
                        convertFromCurrency: convertFromCurrency,
                        quote: quote
                    });
                }
            });
        };
        return {
            // http://finance.yahoo.com/d/quotes.csv?s=USDAUD=X&f=sl1
            // "USDAUD=X",1.1032
            // http://finance.yahoo.com/d/quotes.csv?s=USDAUD=X,USDEUR=X&f=sl1
            // "USDAUD=X",1.1166
            // "USDEUR=X",0.7357
            loadUserCountry: () => {
                const urlString = "http://freegeoip.net/json/";
                const {Request} = require("sdk/request");
                const request = Request({
                    url: urlString,
                    onComplete: (aResponse) => {
                        try {
                            const response = JSON.parse(aResponse.text);
                            if (aResponse.status == "200") {
                                informationHolder.setUserCountry(response.country_code);
                            }
                            else {
                                informationHolder.setUserCountry("GB");
                            }
                            // console.log("response.status " + response.status);
                        }
                        catch(err) {
                            // console.log("err " + err);
                            informationHolder.setUserCountry("CH");
                        }
                        // console.log("informationHolder.convertToCountry " + informationHolder.convertToCountry);
                        controller.loadQuotes();
                    }
                });
                if (informationHolder.convertToCountry === null || informationHolder.convertToCountry == null) {
                    request.get();
                }
                else {
                    controller.loadQuotes();
                }
            },
            loadQuotes: (aConvertFromCurrencies, aConvertToCurrency) => {
                quoteQueriesFromTo = [];
                quoteQueriesToFrom = [];
                quotesFromTo = [];
                quotesToFrom = [];
                convertToCurrency = aConvertToCurrency;
                aConvertFromCurrencies.forEach(makeQuoteQuery);
                const innerUrlStringFromTo = "http://download.finance.yahoo.com/d/quotes?s=" + quoteQueriesFromTo.join(",") + "&f=snl1d1t1ab";
                const innerUrlStringToFrom = "http://download.finance.yahoo.com/d/quotes?s=" + quoteQueriesToFrom.join(",") + "&f=snl1d1t1ab";
                const yqlFromTo = "select symbol, rate from csv where url='" + innerUrlStringFromTo + "' and columns='symbol,Name,rate,Date,Time,Ask,Bid'";
                const yqlToFrom = "select symbol, rate from csv where url='" + innerUrlStringToFrom + "' and columns='symbol,Name,rate,Date,Time,Ask,Bid'";
                const urlStringFromTo = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(yqlFromTo) + "&format=json";
                const urlStringToFrom = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(yqlToFrom) + "&format=json";
                const {Request} = require("sdk/request");
                const requestFromTo = Request({
                    url: urlStringFromTo,
                    onComplete: quotesHandlerFromTo
                });
                requestFromTo.get();
                // console.log("requestFromTo.get() " + urlStringFromTo);
                const requestToFrom = Request({
                    url: urlStringToFrom,
                    onComplete: quotesHandlerToFrom
                });
                requestToFrom.get();
                // Other method
//                let source = "USDEUR=X";
//                let url3 = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent('select * from yahoo.finance.quotes where symbol in ("' + source + '")') + "&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json";
//                let request3 = require("sdk/request").Request({
//                    url: url3,
//                    onComplete: function(resp) {console.log("---------------resp " + resp.text)}
//                });
//                request3.get();
            }
        };
    };
    //Stereotype Service provider
    const StorageServiceProvider = function() {
        const {storage} = require("sdk/simple-storage");
        return {
            init: (aDefaultEnabled) => {
                if (storage.excludedDomains == null) {
                    storage.excludedDomains = ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com"];
                }
                if (storage.dccPrefs == null) {
                    storage.dccPrefs = {
                        // convertToCurrency: "EUR",
                        // convertToCountry: "PL",
                        customSymbols: {},
                        subUnitSeparator: ",",
                        enableOnStart: true,
                        quoteAdjustmentPercent: 0,
                        roundAmounts: false,
                        separatePrice: true,
                        showOriginalPrices: true,
                        unitAfter: true,
                        tempConvertUnits: false,
                        thousandSep: ".",
                        enabledCurrencies: aDefaultEnabled
                    };
                }
                else {
                    //if (storage.dccPrefs.convertToCurrency == null) {
                    //    storage.dccPrefs.convertToCurrency = "EUR";
                    //}
                    //if (storage.dccPrefs.convertToCountry == null) {
                    //    storage.dccPrefs.convertToCountry = "CZ";
                    //}
                    if (storage.dccPrefs.customSymbols == null) {
                        storage.dccPrefs.customSymbols = {};
                    }
                    if (storage.dccPrefs.subUnitSeparator == null) {
                        storage.dccPrefs.subUnitSeparator = ",";
                    }
                    if (storage.dccPrefs.enableOnStart == null) {
                        storage.dccPrefs.enableOnStart = true;
                    }
                    if (storage.dccPrefs.quoteAdjustmentPercent == null) {
                        storage.dccPrefs.quoteAdjustmentPercent = 0;
                    }
                    if (storage.dccPrefs.roundAmounts == null) {
                        storage.dccPrefs.roundAmounts = false;
                    }
                    if (storage.dccPrefs.separatePrice == null) {
                        storage.dccPrefs.separatePrice = true;
                    }
                    if (storage.dccPrefs.showOriginalPrices == null) {
                        storage.dccPrefs.showOriginalPrices = true;
                    }
                    if (storage.dccPrefs.unitAfter == null) {
                        storage.dccPrefs.unitAfter = true;
                    }
                    if (storage.dccPrefs.tempConvertUnits == null) {
                        storage.dccPrefs.tempConvertUnits = false;
                    }
                    if (storage.dccPrefs.thousandSep == null) {
                        storage.dccPrefs.thousandSep = ".";
                    }
                    if (storage.dccPrefs.enabledCurrencies == null) {
                        storage.dccPrefs.enabledCurrencies = aDefaultEnabled;
                    }
                    else {
                        Object.keys(aDefaultEnabled).forEach(
                            function(key, index) {
                                if (storage.dccPrefs.enabledCurrencies[key] == null) {
                                    storage.dccPrefs.enabledCurrencies[key] = this[key];
                                }
                            }
                        )
                    }
                }
            },
            get convertToCurrency () {
                return storage.dccPrefs.convertToCurrency;
            },
            set convertToCurrency (aCurrency) {
                storage.dccPrefs.convertToCurrency = aCurrency;
            },
            get convertToCountry () {
                return storage.dccPrefs.convertToCountry;
            },
            set convertToCountry (aCountry) {
                storage.dccPrefs.convertToCountry = aCountry;
            },
            get customSymbols () {
                return storage.dccPrefs.customSymbols;
            },
            set customSymbols (aCustomSymbols) {
                storage.dccPrefs.customSymbols = aCustomSymbols;
            },
            get decimalSep () {
                return storage.dccPrefs.subUnitSeparator;
            },
            set decimalSep (aDecimalSep) {
                storage.dccPrefs.subUnitSeparator = aDecimalSep;
            },
            get enableOnStart () {
                if (storage.dccPrefs != null) {
                    return storage.dccPrefs.enableOnStart;
                }
                return true;
            },
            set enableOnStart (anEnableOnStart) {
                storage.dccPrefs.enableOnStart = anEnableOnStart;
            },
            get excludedDomains () {
                return storage.excludedDomains;
            },
            set excludedDomains (anExcludedDomains) {
                storage.excludedDomains = anExcludedDomains;
            },
            get enabledCurrencies () {
                return storage.dccPrefs.enabledCurrencies;
            },
            set enabledCurrencies (anEnabledCurrencies) {
                storage.dccPrefs.enabledCurrencies = anEnabledCurrencies;
            },
            //isFromCurrencyEnabled (aCurrency) {
            //    return storage.dccPrefs.enabledCurrencies[aCurrency];
            //},
            get quoteAdjustmentPercent () {
                return storage.dccPrefs.quoteAdjustmentPercent;
            },
            set quoteAdjustmentPercent (aQuoteAdjustmentPercent) {
                storage.dccPrefs.quoteAdjustmentPercent = aQuoteAdjustmentPercent;
            },
            get roundPrices () {
                return storage.dccPrefs.roundAmounts;
            },
            set roundPrices (aRoundPrices) {
                storage.dccPrefs.roundAmounts = aRoundPrices;
            },
            get separatePrice () {
                return storage.dccPrefs.separatePrice;
            },
            set separatePrice (aSeparatePrice) {
                storage.dccPrefs.separatePrice = aSeparatePrice;
            },
            get showOriginalPrices () {
                return storage.dccPrefs.showOriginalPrices;
            },
            set showOriginalPrices (aShowOriginalPrices) {
                storage.dccPrefs.showOriginalPrices = aShowOriginalPrices;
            },
            get unitAfter () {
                return storage.dccPrefs.unitAfter;
            },
            set unitAfter (aUnitAfter) {
                storage.dccPrefs.unitAfter = aUnitAfter;
            },
            get thousandSep () {
                return storage.dccPrefs.thousandSep;
            },
            set thousandSep (aThousandSep) {
                storage.dccPrefs.thousandSep = aThousandSep;
            },
            get tempConvertUnits () {
                return storage.dccPrefs.tempConvertUnits;
            },
            set tempConvertUnits (aTempConvertUnits) {
                storage.dccPrefs.tempConvertUnits = aTempConvertUnits;
            },
            //setFormat: function(aFormat) {
            //    storage.dccPrefs.subUnitSeparator = aFormat.subUnitSeparator;
            //    storage.dccPrefs.separatePrice = aFormat.isAmountUnitSeparated;
            //    storage.dccPrefs.unitAfter = aFormat.unitAfter;
            //    storage.dccPrefs.thousandSep = aFormat.thousandsSeparator;
            //},
            resetSettings: () => {
                delete storage.dccPrefs;
                delete storage.excludedDomains;
            }
        };
    };
    // Stereotype Information holder
    const InformationHolder = function(aUrlProvider, aStorageService) {
        const _ = require("sdk/l10n").get;
        let conversionEnabled = aStorageService.enableOnStart;
        let fromCurrencies = ["AFN", "AED", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SVC", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "UYI", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XOF", "XPD", "XPF", "XPT", "XSU", "XTS", "XUA", "XXX", "YER", "ZAR", "ZMW", "ZWL"];
        // Conversion is made in the following priority order
        // Normal default
        let defaultEnabled = {"CHF":true, "DKK":true, "EUR":true, "GBP":true, "ISK":true, "JPY":true, "NOK":true, "RUB":true, "SEK":true, "USD":true};
        // Test default
        // defaultEnabled = {"AFN":true, "AED":true, "ALL":true, "AMD":true, "ANG":true, "AOA":true, "ARS":true, "AUD":true, "AWG":true, "AZN":true, "BAM":true, "BBD":true, "BDT":true, "BGN":true, "BHD":true, "BIF":true, "BMD":true, "BND":true, "BOB":true, "BOV":true, "BRL":true, "BSD":true, "BTN":true, "BWP":true, "BYR":true, "BZD":true, "CAD":true, "CDF":true, "CHE":true, "CHF":true, "CHW":true, "CLF":true, "CLP":true, "CNY":true, "COP":true, "COU":true, "CRC":true, "CUC":true, "CUP":true, "CVE":true, "CZK":true, "DJF":true, "DKK":true, "DOP":true, "DZD":true, "EGP":true, "ERN":true, "ETB":true, "EUR":true, "FJD":true, "FKP":true, "GBP":true, "GEL":true, "GHS":true, "GIP":true, "GMD":true, "GNF":true, "GTQ":true, "GYD":true, "HKD":true, "HNL":true, "HRK":true, "HTG":true, "HUF":true, "IDR":true, "ILS":true, "INR":true, "IQD":true, "IRR":true, "ISK":true, "JMD":true, "JOD":true, "JPY":true, "KES":true, "KGS":true, "KHR":true, "KMF":true, "KPW":true, "KRW":true, "KWD":true, "KYD":true, "KZT":true, "LAK":true, "LBP":true, "LKR":true, "LRD":true, "LSL":true, "LTL":true, "LYD":true, "MAD":true, "MDL":true, "MGA":true, "MKD":true, "MMK":true, "MNT":true, "MOP":true, "MRO":true, "MUR":true, "MVR":true, "MWK":true, "MXN":true, "MXV":true, "MYR":true, "MZN":true, "NAD":true, "NGN":true, "NIO":true, "NOK":true, "NPR":true, "NZD":true, "OMR":true, "PAB":true, "PEN":true, "PGK":true, "PHP":true, "PKR":true, "PLN":true, "PYG":true, "QAR":true, "RON":true, "RSD":true, "RUB":true, "RWF":true, "SAR":true, "SBD":true, "SCR":true, "SDG":true, "SEK":true, "SGD":true, "SHP":true, "SLL":true, "SOS":true, "SRD":true, "SSP":true, "STD":true, "SVC":true, "SYP":true, "SZL":true, "THB":true, "TJS":true, "TMT":true, "TND":true, "TOP":true, "TRY":true, "TTD":true, "TWD":true, "TZS":true, "UAH":true, "UGX":true, "USD":true, "USN":true, "UYI":true, "UYU":true, "UZS":true, "VEF":true, "VND":true, "VUV":true, "WST":true, "XAF":true, "XAG":true, "XAU":true, "XBA":true, "XBB":true, "XBC":true, "XBD":true, "XCD":true, "XDR":true, "XOF":true, "XPD":true, "XPF":true, "XPT":true, "XSU":true, "XTS":true, "XUA":true, "XXX":true, "YER":true, "ZAR":true, "ZMW":true, "ZWL":true};
        // defaultEnabled = {"CHF":true, "DKK":true, "EUR":true, "GBP":true, "ISK":true, "JPY":true, "NOK":true, "RUB":true, "SEK":true, "USD":true, "AFN":true, "AED":true, "ALL":true, "AMD":true, "ANG":true, "AOA":true, "ARS":true, "AUD":true, "AWG":true, "AZN":true, "BAM":true, "BBD":true, "BDT":true, "BGN":true, "BHD":true, "BIF":true, "BMD":true, "BND":true, "BOB":true, "BOV":true, "BRL":true, "BSD":true, "BTN":true, "BWP":true, "BYR":true, "BZD":true, "CAD":true, "CDF":true, "CHE":true, "CHW":true, "CLF":true, "CLP":true, "CNY":true, "COP":true, "COU":true, "CRC":true, "CUC":true, "CUP":true, "CVE":true, "CZK":true, "DJF":true, "DOP":true, "DZD":true, "EGP":true, "ERN":true, "ETB":true, "FJD":true, "FKP":true, "GEL":true, "GHS":true, "GIP":true, "GMD":true, "GNF":true, "GTQ":true, "GYD":true, "HKD":true, "HNL":true, "HRK":true, "HTG":true, "HUF":true, "IDR":true, "ILS":true, "INR":true, "IQD":true, "IRR":true, "JMD":true, "JOD":true, "KES":true, "KGS":true, "KHR":true, "KMF":true, "KPW":true, "KRW":true, "KWD":true, "KYD":true, "KZT":true, "LAK":true, "LBP":true, "LKR":true, "LRD":true, "LSL":true, "LTL":true, "LYD":true, "MAD":true, "MDL":true, "MGA":true, "MKD":true, "MMK":true, "MNT":true, "MOP":true, "MRO":true, "MUR":true, "MVR":true, "MWK":true, "MXN":true, "MXV":true, "MYR":true, "MZN":true, "NAD":true, "NGN":true, "NIO":true, "NPR":true, "NZD":true, "OMR":true, "PAB":true, "PEN":true, "PGK":true, "PHP":true, "PKR":true, "PLN":true, "PYG":true, "QAR":true, "RON":true, "RSD":true, "RWF":true, "SAR":true, "SBD":true, "SCR":true, "SDG":true, "SGD":true, "SHP":true, "SLL":true, "SOS":true, "SRD":true, "SSP":true, "STD":true, "SVC":true, "SYP":true, "SZL":true, "THB":true, "TJS":true, "TMT":true, "TND":true, "TOP":true, "TRY":true, "TTD":true, "TWD":true, "TZS":true, "UAH":true, "UGX":true, "USN":true, "UYI":true, "UYU":true, "UZS":true, "VEF":true, "VND":true, "VUV":true, "WST":true, "XAF":true, "XAG":true, "XAU":true, "XBA":true, "XBB":true, "XBC":true, "XBD":true, "XCD":true, "XDR":true, "XOF":true, "XPD":true, "XPF":true, "XPT":true, "XSU":true, "XTS":true, "XUA":true, "XXX":true, "YER":true, "ZAR":true, "ZMW":true, "ZWL":true};
        let currencyNames = {};
        fromCurrencies.forEach((aCurrency) => {
            if (defaultEnabled[aCurrency] == undefined) {
                defaultEnabled[aCurrency] = false;
            }
            currencyNames[aCurrency] = _(aCurrency);
        });
        // console.log(currencyNames);
        let numberOfFromCurrencies = fromCurrencies.length;
        // Used for check if all currencies have been read
        let numberOfReadCurrencies = 0;
        const conversionQuotes = {};
        const country_currency = {"AX":"EUR","ALL":"USD","AF":"AFN","AL":"ALL","DZ":"DZD","AS":"USD","AD":"ADP","AO":"AON","AI":"XCD","AG":"XCD","AR":"ARS","AM":"AMD","AW":"AWG","AU":"AUD","AT":"EUR","AZ":"AZN","BS":"BSD","BH":"BHD","BD":"BDT","BB":"BBD","BY":"BYR","BE":"EUR","BZ":"BZD","BJ":"XOF","BM":"BMD","BT":"BTN","BO":"BOB","BA":"BAM","BW":"BWP","BR":"BRL","BN":"BND","BG":"BGN","BF":"XOF","BI":"BIF","KH":"KHR","CM":"XAF","CA":"CAD","CV":"CVE","KY":"KYD","CF":"XAF","TD":"XAF","CL":"CLP","CN":"CNY","CX":"AUD","CO":"COP","KM":"KMF","CG":"XAF","CD":"CDF","CK":"NZD","CR":"CRC","HR":"HRK","CU":"CUP","CY":"CYP","CZ":"CZK","DK":"DKK","DJ":"DJF","DM":"XCD","DO":"DOP","EC":"USD","EG":"EGP","SV":"SVC","GQ":"XAF","ER":"USD","ET":"ETB","FO":"DKK","FJ":"FJD","FI":"EUR","FR":"EUR","GF":"FRF","PF":"XPF","TF":"USD","GA":"XAF","GM":"GMD","GE":"GEL","DE":"EUR","GH":"GHS","GI":"GIP","GR":"EUR","GL":"DKK","GD":"XCD","GP":"FRF","GU":"USD","GT":"GTQ","GG":"USD","GN":"GNF","GW":"XAF","GY":"GYD","HT":"HTG","HN":"HNL","HK":"HKD","HU":"HUF","IS":"ISK","IN":"INR","ID":"IDR","IR":"IRR","IQ":"IQD","IE":"EUR","IL":"ILS","IT":"EUR","CI":"USD","JM":"JMD","JP":"JPY","JO":"JOD","KZ":"KZT","KE":"KES","KI":"AUD","KP":"KPW","KR":"KRW","KW":"KWD","KG":"KGS","LA":"LAK","LB":"LBP","LS":"LSL","LR":"LRD","LY":"LYD","LI":"CHF","LT":"LTL","LU":"EUR","MK":"MKD","MG":"MGF","MW":"MWK","MY":"MYR","MV":"MVR","ML":"XOF","MT":"MTL","MH":"USD","MQ":"FRF","MR":"MRO","MU":"MUR","MX":"MXN","FM":"USD","MD":"MDL","MC":"FRF","MN":"MNT","ME":"EUR","MS":"XCD","MA":"MAD","MZ":"MZN","MM":"MMK","NA":"NAD","NR":"AUD","NP":"NPR","NL":"EUR","AN":"ANG","NC":"XPF","NZ":"NZD","NI":"NIO","NE":"XOF","NG":"NGN","MP":"AUD","NO":"NOK","OM":"OMR","PK":"PKR","PW":"USD","PA":"PAB","PG":"PGK","PY":"PYG","PE":"PEN","PH":"PHP","PL":"PLN","PT":"EUR","PR":"USD","QA":"QAR","RE":"FRF","RO":"RON","RU":"RUB","RW":"USD","SH":"SHP","KN":"XCD","LC":"XCD","MF":"USD","PM":"FRF","VC":"XCD","WS":"WST","SM":"ITL","ST":"STD","SA":"SAR","SN":"XOF","RS":"RSD","SC":"SCR","SL":"SLL","SG":"SGD","SK":"SKK","SI":"EUR","SB":"SBD","SO":"SOS","ZA":"ZAR","ES":"EUR","LK":"LKR","SD":"SDD","SR":"SRG","SZ":"SZL","SE":"SEK","CH":"CHF","SY":"SYP","TW":"TWD","TJ":"RUB","TZ":"TZS","TH":"THB","TL":"USD","TG":"XOF","TO":"TOP","TT":"TTD","TN":"TND","TR":"TRY","TM":"TMT","TC":"USD","TV":"AUD","UG":"UGX","UA":"UAH","AE":"AED","GB":"GBP","US":"USD","UY":"UYU","UZ":"UZS","VU":"VUV","VE":"VEF","VN":"VND","VG":"GBP","VI":"USD","EH":"ESP","YE":"YER","ZM":"ZMW"};
        const country_format = {"AX":"3","AF":"0","AL":"5","DZ":"0","AS":"0","AD":"0","AO":"0","AI":"0","AG":"0","AR":"0","AM":"0","AW":"0","AU":"0","AT":"0","AZ":"3","BS":"0","BH":"0","BD":"0","BB":"0","BY":"1","BE":"0","BZ":"0","BJ":"0","BM":"0","BT":"0","BO":"0","BA":"0","BW":"0","BR":"0","BN":"0","BG":"4","BF":"0","BI":"0","KH":"0","CM":"0","CA":"0","CV":"0","KY":"0","CF":"0","TD":"0","CL":"0","CN":"0","CX":"0","CO":"0","KM":"0","CG":"0","CD":"0","CK":"0","CR":"0","HR":"0","CU":"0","CY":"0","CZ":"0","DK":"0","DJ":"0","DM":"0","DO":"0","EC":"0","EG":"0","SV":"0","GQ":"0","ER":"0","EE":"0","ET":"0","FO":"0","FJ":"0","FI":"3","FR":"1","GF":"0","PF":"0","TF":"0","GA":"0","GM":"0","GE":"0","DE":"2","GH":"0","GI":"0","GR":"0","GL":"0","GD":"0","GP":"0","GU":"0","GT":"0","GG":"0","GN":"0","GW":"0","GY":"0","HT":"0","HN":"0","HK":"0","HU":"0","IS":"0","IN":"0","ID":"0","IR":"0","IQ":"0","IE":"0","IL":"0","IT":"2","CI":"0","JM":"0","JP":"0","JO":"0","KZ":"0","KE":"0","KI":"0","KP":"0","KR":"0","KW":"0","KG":"0","LA":"0","LV":"0","LB":"0","LS":"0","LR":"0","LY":"0","LI":"0","LT":"0","LU":"0","MK":"0","MG":"0","MW":"0","MY":"0","MV":"0","ML":"0","MT":"0","MH":"0","MQ":"0","MR":"0","MU":"0","MX":"0","FM":"0","MD":"0","MC":"0","MN":"0","ME":"0","MS":"0","MA":"0","MZ":"0","MM":"0","NA":"0","NR":"0","NP":"0","NL":"1","AN":"0","NC":"0","NZ":"0","NI":"0","NE":"0","NG":"0","MP":"0","NO":"0","OM":"0","PK":"0","PW":"0","PA":"0","PG":"0","PY":"0","PE":"0","PH":"0","PL":"3","PT":"0","PR":"0","QA":"0","RE":"0","RO":"0","RU":"3","RW":"0","SH":"0","KN":"0","LC":"0","MF":"0","PM":"0","VC":"0","WS":"0","SM":"0","ST":"0","SA":"0","SN":"0","RS":"0","SC":"0","SL":"0","SG":"0","SK":"0","SI":"0","SB":"0","SO":"0","ZA":"0","ES":"2","LK":"0","SD":"0","SR":"0","SZ":"0","SE":"0","CH":"0","SY":"0","TW":"0","TJ":"3","TZ":"0","TH":"0","TL":"0","TG":"0","TO":"0","TT":"0","TN":"0","TR":"0","TM":"0","TC":"0","TV":"0","UG":"0","UA":"0","AE":"0","GB":"0","US":"0","UY":"0","UZ":"0","VU":"0","VE":"0","VN":"0","VG":"0","VI":"0","EH":"0","YE":"0","ZM":"0"};
        const formats = [];
      // format 0: ¤1,234.56
        formats.push({"unitAfter": false, "thousandsSeparator": ",", "subUnitSeparator": ".", "isAmountUnitSeparated": false});
      // format 1: ¤1 234,56
        formats.push({"unitAfter": true, "thousandsSeparator": " ", "subUnitSeparator": ",", "isAmountUnitSeparated": false});
      // format 2: 1.234,56 ¤
        formats.push({"unitAfter": true, "thousandsSeparator": ".", "subUnitSeparator": ",", "isAmountUnitSeparated": true});
      // format 3: 1 234,56 ¤
        formats.push({"unitAfter": true, "thousandsSeparator": " ", "subUnitSeparator": ",", "isAmountUnitSeparated": true});
      // format 4: 1 234.56 ¤
        formats.push({"unitAfter": true, "thousandsSeparator": " ", "subUnitSeparator": ".", "isAmountUnitSeparated": true});
      // format 5: 1.234,56¤
        formats.push({"unitAfter": true, "thousandsSeparator": ".", "subUnitSeparator": ",", "isAmountUnitSeparated": false});
        const currencySymbols = {
            "BGN" : "лв",
            "EUR" : "€",
            "GBP" : "£",
            "ILS" : "₪",
            "JPY" : "¥",
            "NGN" : "₦",
            "PHP" : "₱",
            "PLN" : "zł",
            "PYG" : "₲",
            "RUB" : "руб.",
            "THB" : "฿",
            "USD" : "$"
        };
        let quoteStrings = [];
        const makeQuoteStringCallback = (aConvertFromCurrency) => {
            const quote = conversionQuotes[aConvertFromCurrency];
            const conversionQuote = (parseFloat(quote)).toFixed(4);
            if (aConvertFromCurrency != aStorageService.convertToCurrency) {
                const quoteString = "1 " + aConvertFromCurrency + " = " + conversionQuote.replace(".", informationHolder.decimalSep) + " " + aStorageService.convertToCurrency;
                quoteStrings.push(quoteString);
            }
        };
        return {
            get conversionEnabled () {
                return conversionEnabled;
            },
            set conversionEnabled (aConversionEnabled) {
                conversionEnabled = aConversionEnabled;
            },
            //getConversionQuote (aConvertFromCurrency) {
            //    return conversionQuotes[aConvertFromCurrency];
            //},
            setConversionQuote : function (aConvertFromCurrency, quote) {
                conversionQuotes[aConvertFromCurrency] = quote;
                numberOfReadCurrencies++;
            },
            getConversionQuotes : function () {
                return conversionQuotes;
            },
            get convertToCurrency () {
                return aStorageService.convertToCurrency;
            },
            set convertToCurrency (aCurrency) {
                aStorageService.convertToCurrency = aCurrency;
            },
            //getConvertToCurrency () {
            //    return aStorageService.getConvertToCurrency();
            //},
            //setConvertToCurrency (aCurrency) {
            //    aStorageService.setConvertToCurrency(aCurrency);
            //},
            get convertToCountry () {
                return aStorageService.convertToCountry;
            },
            set convertToCountry (aCountry) {
                aStorageService.convertToCountry = aCountry;
            },
            getCurrencySymbols : function () {
                return currencySymbols;
            },
            get customSymbols () {
                return aStorageService.customSymbols;
            },
            set customSymbols (aCustomSymbols) {
                aStorageService.customSymbols = aCustomSymbols;
            },
            get decimalSep () {
                return aStorageService.decimalSep;
            },
            set decimalSep (aDecimalSep) {
                aStorageService.decimalSep = aDecimalSep;
            },
            getDefaultEnabled : function () {
                return defaultEnabled;
            },
            getCurrencyNames : function () {
                return currencyNames;
            },
            //getDisabledIcon () {
            //    return aUrlProvider.getUrl("images/currency-20-disabled.png");
            //},
            //getEnabledIcon () {
            //    return {
            //        "16": "images/1402781551_currency_exchange_1.png",
            //        "32": "images/1402781537_currency_exchange_1.png",
            //        "64": "images/1402781517_currency_exchange_1.png"
            //    };
            //},
            //getSettingsIcon () {
            //    return {
            //        "16": "images/1402782691_repair_cost.png",
            //        "32": "images/1402782677_repair_cost.png",
            //        "64": "images/1402782661_repair_cost.png"
            //    };
            //},
            get excludedDomains () {
                return aStorageService.excludedDomains;
            },
            set excludedDomains (anExcludedDomains) {
                aStorageService.excludedDomains = anExcludedDomains;
            },
            get enabledCurrencies () {
                return aStorageService.enabledCurrencies;
            },
            set enabledCurrencies (aEnabledCurrencies) {
                aStorageService.enabledCurrencies = aEnabledCurrencies;
            },
            getFromCurrencies : function () {
                return fromCurrencies;
            },
            //setFromCurrencies (aFromCurrencies) {
            //    fromCurrencies = aFromCurrencies;
            //},
            get enableOnStart () {
                return aStorageService.enableOnStart;
            },
            set enableOnStart (anEnableOnStart) {
                aStorageService.enableOnStart = anEnableOnStart;
            },
            get quoteAdjustmentPercent () {
                return aStorageService.quoteAdjustmentPercent;
            },
            set quoteAdjustmentPercent (aQuoteAdjustmentPercent) {
                aStorageService.quoteAdjustmentPercent = aQuoteAdjustmentPercent;
            },
            getQuoteString : function () {
                quoteStrings = [];
                fromCurrencies.forEach(makeQuoteStringCallback);
                return quoteStrings.join("; ");
            },
            get roundPrices () {
                return aStorageService.roundPrices;
            },
            set roundPrices (aRoundPrices) {
                aStorageService.roundPrices = aRoundPrices;
            },
            get separatePrice () {
                return aStorageService.separatePrice;
            },
            set separatePrice (aSeparatePrice) {
                aStorageService.separatePrice = aSeparatePrice;
            },
            get showOriginalPrices () {
                return aStorageService.showOriginalPrices;
            },
            set showOriginalPrices (aShowOriginalPrices) {
                aStorageService.showOriginalPrices = aShowOriginalPrices;
            },
            get unitAfter () {
                return aStorageService.unitAfter;
            },
            set unitAfter (aUnitAfter) {
                aStorageService.unitAfter = aUnitAfter;
            },
            get tempConvertUnits () {
                return aStorageService.tempConvertUnits;
            },
            set tempConvertUnits (aTempConvertUnits) {
                aStorageService.tempConvertUnits = aTempConvertUnits;
            },
            get thousandSep () {
                return aStorageService.thousandSep;
            },
            set thousandSep (aThousandSep) {
                aStorageService.thousandSep = aThousandSep;
            },
            setUserCountry: function(aUserCountry) {
                aStorageService.convertToCountry = aUserCountry;
                aStorageService.convertToCurrency = country_currency[aUserCountry];
                // console.log(aStorageService.convertToCurrency);
                const formatNumber = country_format[aUserCountry];
                aStorageService.format = formats[formatNumber];
                // console.log(aStorageService.format);
            },
            isAllCurrenciesRead: function() {
                return numberOfReadCurrencies >= numberOfFromCurrencies;
            },
            resetReadCurrencies: function() {
                numberOfReadCurrencies = 0;
            },
            resetSettings: function() {
                aStorageService.resetSettings();
            }
        };
    };
    const makeContentScriptParams = function(aTab, anInformationHolder) {
        const contentScriptParams = {};
        contentScriptParams.conversionQuotes = anInformationHolder.getConversionQuotes();
        contentScriptParams.convertToCurrency = anInformationHolder.convertToCurrency;
        contentScriptParams.convertToCountry = anInformationHolder.convertToCountry;
        contentScriptParams.currencySymbols = anInformationHolder.getCurrencySymbols();
        contentScriptParams.customSymbols = anInformationHolder.customSymbols;
        contentScriptParams.subUnitSeparator = anInformationHolder.decimalSep;
        contentScriptParams.enableOnStart = anInformationHolder.enableOnStart;
        contentScriptParams.excludedDomains = anInformationHolder.excludedDomains;
        contentScriptParams.enabledCurrencies = anInformationHolder.enabledCurrencies;
        contentScriptParams.quoteAdjustmentPercent = anInformationHolder.quoteAdjustmentPercent;
        contentScriptParams.roundAmounts = anInformationHolder.roundPrices;
        contentScriptParams.separatePrice = anInformationHolder.separatePrice;
        contentScriptParams.showOriginalPrices = anInformationHolder.showOriginalPrices;
        contentScriptParams.unitAfter = anInformationHolder.unitAfter;
        contentScriptParams.tempConvertUnits = anInformationHolder.tempConvertUnits;
        contentScriptParams.thousandSep = anInformationHolder.thousandSep;
        if (aTab != null && typeof aTab.isEnabled != "undefined")  {
            contentScriptParams.isEnabled = aTab.isEnabled;
        }
        else {
            contentScriptParams.isEnabled = anInformationHolder.conversionEnabled;
        }
        contentScriptParams.currencyNames = anInformationHolder.getCurrencyNames();
        return contentScriptParams;
    };
    const parseContentScriptParams = function(aContentScriptParams, anInformationHolder) {
        anInformationHolder.convertToCurrency = aContentScriptParams.convertToCurrency;
        anInformationHolder.convertToCountry = aContentScriptParams.convertToCountry;
        anInformationHolder.customSymbols = aContentScriptParams.customSymbols;
        anInformationHolder.decimalSep = aContentScriptParams.subUnitSeparator;
        anInformationHolder.enableOnStart = aContentScriptParams.enableOnStart;
        anInformationHolder.excludedDomains = aContentScriptParams.excludedDomains;
        anInformationHolder.enabledCurrencies = aContentScriptParams.enabledCurrencies;
        anInformationHolder.quoteAdjustmentPercent = aContentScriptParams.quoteAdjustmentPercent;
        anInformationHolder.roundPrices = aContentScriptParams.roundAmounts;
        anInformationHolder.separatePrice = aContentScriptParams.separatePrice;
        anInformationHolder.showOriginalPrices = aContentScriptParams.showOriginalPrices;
        anInformationHolder.unitAfter = aContentScriptParams.unitAfter;
        anInformationHolder.tempConvertUnits = aContentScriptParams.tempConvertUnits;
        anInformationHolder.thousandSep = aContentScriptParams.thousandSep;
    };
    const ContentScriptInterface = function(aUrlProvider, anInformationHolder) {
        const attachHandler = (aWorker) => {
            const finishedTabProcessingHandler = (aHasConvertedElements) => {
                try {
                    if (aWorker.tab.customTabObject == null) {
                        aWorker.tab.customTabObject = new CustomTabObject();
                    }
                    aWorker.tab.customTabObject.isEnabled = anInformationHolder.conversionEnabled;
                    aWorker.tab.customTabObject.workers.push(aWorker);
                    aWorker.tab.customTabObject.hasConvertedElements = aHasConvertedElements;
                }
                catch(err) {
                    // console.log("ContentScriptInterface: " + err);
                }
            };
            aWorker.port.emit("updateSettings", makeContentScriptParams(aWorker.tab, anInformationHolder));
            aWorker.port.on("finishedTabProcessing", finishedTabProcessingHandler);
        };
        const {PageMod} = require("sdk/page-mod");
        PageMod({
            include: "*",
            contentScriptFile: [aUrlProvider.getUrl("common/dcc-regexes.js"), aUrlProvider.getUrl("common/dcc-content.js"), aUrlProvider.getUrl("dcc-firefox-content-adapter.js")],
            contentScriptWhen: "ready",
            attachTo: ["existing", "top", "frame"],
            onAttach: attachHandler
        });
    };
    const TabsInterface = function(aUrlProvider, anInformationHolder) {
        const tabs = require("sdk/tabs");
        let isRegisteredToTabsEvents = false;
        let settingsWorker = null;
        let testPageWorker = null;
        return {
            getSettingsTab: function() {
                return settingsWorker.settingsTab;
            },
            toggleConversion: (aStatus) => {
                if (tabs.activeTab.customTabObject != null) {
                    tabs.activeTab.customTabObject.isEnabled = aStatus;
                    anInformationHolder.conversionEnabled = aStatus;
                    const sendEnabledStatus = (aWorker) => {
                        if (aWorker.tab != null) {
                            const status = {};
                            status.isEnabled = aStatus;
                            status.hasConvertedElements = tabs.activeTab.customTabObject.hasConvertedElements;
                            try {
                                aWorker.port.emit("sendEnabledStatus", status);
                            }
                            catch(err) {
                                // To hide "Error: The page is currently hidden and can no longer be used until it is visible again."
                                // console.log("TabsInterface: " + err);
                            }
                        }
                    };
                    tabs.activeTab.customTabObject.workers.map(sendEnabledStatus);
                     // after first click the tab will have for sure the converted elements
                    tabs.activeTab.customTabObject.hasConvertedElements = true;
                }
            },
            showSettingsTab: () => {
                const isOpen = settingsWorker != null && settingsWorker.settingsTab != null;
                if (!isOpen) {
                     //index.html is settings page, it must be called index so that navigation buttons will be hidden
                    tabs.open({url: aUrlProvider.getUrl("settings.html")});
                }
                else {
                    settingsWorker.settingsTab.activate();
                }
            },
            showTestTab: () => {
                const isOpen = testPageWorker != null && testPageWorker.testTab != null;
                if (!isOpen) {
                    tabs.open({url: aUrlProvider.getUrl("common/prices.html")});
                }
                else {
                    testPageWorker.testPageTab.activate();
                }
            },
            registerToTabsEvents: () => {
                const setTabs = (aTab) => {
                    if (aTab.url === "resource://dcc-at-joint-dot-ax/direct-currency-converter-2/data/settings.html") {
                        settingsWorker = aTab.attachToPage({contentScriptFile: [aUrlProvider.getUrl("common/jquery-2.1.3.min.js"), aUrlProvider.getUrl("common/jquery-ui-1.11.2.min.js"), aUrlProvider.getUrl("common/dcc-settings.js"), aUrlProvider.getUrl("dcc-firefox-settings-adapter.js")]});
                        settingsWorker.port.emit("showSettings", makeContentScriptParams(aTab, anInformationHolder));
                        settingsWorker.port.on("saveSettings", (aContentScriptParams) => {
                            eventAggregator.publish("saveSettings", {
                                contentScriptParams: aContentScriptParams
                            });
                        });
                        settingsWorker.port.on("resetSettings", () => {
                            eventAggregator.publish("resetSettings");
                        });
                        settingsWorker.settingsTab = aTab;
                    }
                    else if (aTab.url === "resource://dcc-at-joint-dot-ax/direct-currency-converter-2/data/common/prices.html") {
                        testPageWorker = aTab.attachToPage({contentScriptFile: [aUrlProvider.getUrl("common/dcc-regexes.js"), aUrlProvider.getUrl("common/dcc-content.js"), aUrlProvider.getUrl("dcc-firefox-content-adapter.js")]});
                        const finishedTabProcessingHandler = (aHasConvertedElements) => {
                            try {
                                if (testPageWorker.tab.customTabObject == null) {
                                    testPageWorker.tab.customTabObject = new CustomTabObject();
                                }
                                testPageWorker.tab.customTabObject.isEnabled = anInformationHolder.conversionEnabled;
                                testPageWorker.tab.customTabObject.workers.push(testPageWorker);
                                testPageWorker.tab.customTabObject.hasConvertedElements = aHasConvertedElements;
                            }
                            catch(err) {
                                // console.log("registerToTabsEvents: " + err);
                            }
                        };
                        testPageWorker.port.emit("updateSettings", makeContentScriptParams(testPageWorker.tab, anInformationHolder));
                        testPageWorker.port.on("finishedTabProcessing", finishedTabProcessingHandler);
                        testPageWorker.testPageTab = aTab;
                    }
                    else if (aTab.customTabObject == null) {
                        aTab.customTabObject = new CustomTabObject();
                        aTab.customTabObject.isEnabled = anInformationHolder.conversionEnabled;
                        // To set toggle button
                        eventAggregator.publish("toggleConversion", anInformationHolder.conversionEnabled);
                    }
                    if (aTab.customTabObject != null) {
                        let i = aTab.customTabObject.workers.length;
                        while (i--) {
                            const worker = aTab.customTabObject.workers[i];
                            if (worker.tab == null) {
                                aTab.customTabObject.workers.splice(i, 1);
                            }
                        }
                    }
                };
                const releaseTabs = (aTab) => {
                    if (settingsWorker != null && settingsWorker.settingsTab != null) {
                        if (settingsWorker.settingsTab.title == aTab.title) {
                            settingsWorker.settingsTab = null;
                        }
                        else {
                            aTab.customTabObject = null;
                        }
                    }
                    else {
                        aTab.customTabObject = null;
                    }
                };
                if (!isRegisteredToTabsEvents) {
                    tabs.on("activate", () => {
                        if (tabs.activeTab.customTabObject !== undefined) {
                            tabs.activeTab.customTabObject.isEnabled = anInformationHolder.conversionEnabled;
                        }
                        eventAggregator.publish("tabActivated", {
                            tab: tabs.activeTab
                        });
                    });
                    tabs.on("ready", setTabs);
                    tabs.on("close", releaseTabs);
                    isRegisteredToTabsEvents = true;
                }
            }
        };
    };
    //
    const BarsInterface = function(aUrlProvider, anInformationHolder) {
        const _ = require("sdk/l10n").get;
        const {ToggleButton} = require("sdk/ui");
        // Settings panel
        const handleChange = (aState) => {
            if (aState.checked) {
                toolsPanel.show({
                    position: toolsButton
                });
            }
        };
        const handleHide = () => {
            toolsButton.state('window', {checked: false});
        };
        const {Panel} = require("sdk/panel");
        const toolsPanel = Panel({
            width: 400,
            height: 200,
            contentURL: urlProvider.getUrl("panel.html"),
            contentStyleFile: urlProvider.getUrl("panel-style.css"),
            onHide: handleHide
        });
        toolsPanel.port.on("showSettingsTab", () => {
            eventAggregator.publish("showSettingsTab");
            toolsPanel.hide();
        });
        toolsPanel.port.on("showTestTab", () => {
            eventAggregator.publish("showTestTab");
            toolsPanel.hide();
        });
        const toolsIcon = {
            "16": "./images/1402782691_repair_cost.png",
            "32": "./images/1402782677_repair_cost.png",
            "64": "./images/1402782661_repair_cost.png"
        };
        const toolsButton = ToggleButton({
            checked: false,
            id: "direct-currency-converter-action-button",
            label: _("Open settings"),
            icon: toolsIcon,
            onChange: handleChange
        });
        const conversionIcon = {
            "16": "./images/1402781551_currency_exchange_1.png",
            "32": "./images/1402781537_currency_exchange_1.png",
            "64": "./images/1402781517_currency_exchange_1.png"
        };
        const conversionButton = ToggleButton({
            checked: false,
            id: "direct-currency-converter-toggle-button",
            label: _("Toggle currency conversion"),
            icon: conversionIcon,
            onClick: (aState) => {
                eventAggregator.publish("toggleConversion", aState.checked);
            }
        });
        return {
            setBars: (anEnabled) => {
                    if (conversionButton.checked != anEnabled) {
                        conversionButton.checked = anEnabled;
                    }
                    anInformationHolder.conversionEnabled = anEnabled;
            },
            setIconsEnabled: () => {
                toolsButton.label = _("Open settings") + "\n" + anInformationHolder.getQuoteString();
            }
        };
    };
    //Stereotype Controller
    const Controller = function(anEventAggregator) {
        anEventAggregator.subscribe("quoteReceived", (eventArgs) => {
            informationHolder.setConversionQuote(eventArgs.convertFromCurrency, eventArgs.quote);
            if (informationHolder.isAllCurrenciesRead()) {
                new ContentScriptInterface(urlProvider, informationHolder);
                barsInterface.setIconsEnabled();
            }
        });
        anEventAggregator.subscribe("saveSettings", (eventArgs) => {
            const reloadQuotes = informationHolder.convertToCurrency != eventArgs.contentScriptParams.convertToCurrency;
            informationHolder.resetReadCurrencies();
            parseContentScriptParams(eventArgs.contentScriptParams, informationHolder);
            tabsInterface.getSettingsTab().close();
            if (reloadQuotes) {
                controller.loadQuotes();
            }
        });
        anEventAggregator.subscribe("resetSettings", () => {
            informationHolder.resetSettings();
            tabsInterface.getSettingsTab().close();
            storageService.init(informationHolder.getDefaultEnabled());
        });
        anEventAggregator.subscribe("tabActivated", (eventArgs) => {
            if (eventArgs.tab.customTabObject != null) {
                tabsInterface.toggleConversion(eventArgs.tab.customTabObject.isEnabled);
                barsInterface.setBars(eventArgs.tab.customTabObject.isEnabled);
            }
            else {
            }
        });
        anEventAggregator.subscribe("toggleConversion", (eventArgs) => {
            tabsInterface.toggleConversion(eventArgs);
            barsInterface.setBars(eventArgs);
        });
        anEventAggregator.subscribe("showSettingsTab", () => {
            tabsInterface.showSettingsTab();
        });
        anEventAggregator.subscribe("showTestTab", () => {
            tabsInterface.showTestTab();
        });
        this.loadStorage = () => {
            storageService.init(informationHolder.getDefaultEnabled());
        };
        this.loadUserCountryAndQuotes = () => {
            quotesService.loadUserCountry();
        };
        this.loadQuotes = () => {
            quotesService.loadQuotes(informationHolder.getFromCurrencies(), informationHolder.convertToCurrency);
        };
    };
    const urlProvider = require("./urlProvider");
    const quotesService = new YahooQuotesServiceProvider();
    const storageService = new StorageServiceProvider();
    const informationHolder = new InformationHolder(urlProvider, storageService);
    const tabsInterface = new TabsInterface(urlProvider, informationHolder);
    const barsInterface = new BarsInterface(urlProvider, informationHolder);
    const controller = new Controller(eventAggregator);
    const sp = require("sdk/simple-prefs");
    sp.on("DCCPreferences", (e) => {
        eventAggregator.publish("showSettingsTab");
    });
    controller.loadStorage();
    controller.loadUserCountryAndQuotes();
    tabsInterface.registerToTabsEvents();
})();
// End namespace

// Test stuff
const DirectCurrencyConverterTest = (function() {
    const system = require("sdk/system");
    if (system.staticArgs.urlString != null) {
        const tabs = require("sdk/tabs");
        tabs.open(system.staticArgs.urlString);
    }
})();


