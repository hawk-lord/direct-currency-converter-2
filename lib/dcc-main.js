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
    "use strict";
    // Show where the program begins!
    console.log("---------------------------------------------------------------------------------------------");
    // destructuring
    const grep = require("./grep").grep;
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
    // Stereotype Service provider
    // Named Function Expression
    const YahooQuotesServiceProvider = function() {
        var convertToCurrency;
        var quoteQueriesFromTo;
        var quoteQueriesToFrom;
        var quotesFromTo;
        var quotesToFrom;
        const makeQuoteQuery = function(aConvertFromCurrency, anIndex, anArray) {
            if (convertToCurrency === "gAu") {
                quoteQueriesFromTo.push(aConvertFromCurrency + "XAU" + "=X");
                quoteQueriesToFrom.push("XAU" + aConvertFromCurrency + "=X");
            }
            else {
                quoteQueriesFromTo.push(aConvertFromCurrency + convertToCurrency + "=X");
                quoteQueriesToFrom.push(convertToCurrency + aConvertFromCurrency + "=X");
            }
        };
        const quotesHandlerFromTo = function(aResponse) {
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
                console.log("err " + err);
            };
            // console.log("aResponse.status " + aResponse.status);
        };
        const quotesHandlerToFrom = function(aResponse) {
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
                console.log("err " + err);
            };
            // console.log("aResponse.status " + aResponse.status);
        };
        const gramsPerOunce = 31.1034768;
        // Since Yahoo quote response only has four decimals, we sometimes get imprecise quotes
        // In such cases, we use the inverse quote and invert it.
        const makeOneResponse = function() {
            quotesFromTo.forEach(function(anElement, anIndex, anArray){
                // "USDEUR=X",0.7317
                var convertFromCurrency = anElement.symbol.substr(0, 3);
                var quote = anElement.rate;
                if (quote < 0.01) {
                    // "EURJPY=X",142.3186
                    convertFromCurrency = quotesToFrom[anIndex].symbol.substr(3, 3);
                    var reverseQuote = quotesToFrom[anIndex].rate;
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
            loadUserCountry2: function() {
                const urlString = "http://freegeoip.net/json/";
                const Request = require("sdk/request").Request;
                const request = Request({
                    url: urlString,
                    onComplete: function(aResponse) {
                        try {
                            const response = JSON.parse(aResponse.text);
                            if (response.status == "200") {
                                informationHolder.setUserCountry(response.country_code);
                            }
                            else {
                                informationHolder.setUserCountry("AX");
                            }
                            // console.log("response.status " + response.status);
                        }
                        catch(err) {
                            console.log("err " + err);
                            informationHolder.setUserCountry("AX");
                        }
                        controller.loadQuotes();
                    }
                });
                // console.log("request.get() " + urlString);
                request.get();
            },
            loadQuotes: function(aConvertFromCurrencies, aConvertToCurrency) {
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
                const Request = require("sdk/request").Request;
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
//                var source = "USDEUR=X";
//                var url3 = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent('select * from yahoo.finance.quotes where symbol in ("' + source + '")') + "&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json";
//                var request3 = require("sdk/request").Request({
//                    url: url3,
//                    onComplete: function(resp) {console.log("---------------resp " + resp.text)}
//                });
//                request3.get();
            }
        };
    };
    //Stereotype Service provider
    const StorageServiceProvider = function() {
        const storage = require("sdk/simple-storage").storage;
        return {
            init: function(aDefaultEnabled) {
                if (storage.excludedDomains == null) {
                    storage.excludedDomains = ["images.google.com"];
                }
                if (storage.dccPrefs == null) {
                    storage.dccPrefs = {
                        convertToCurrency: "EUR",
                        convertToCountry: "AX",
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
                        enabledCurrencies: aDefaultEnabled,
                    };
                }
                else {
                    if (storage.dccPrefs.convertToCurrency == null) {
                        storage.dccPrefs.convertToCurrency = "EUR";
                    }
                    if (storage.dccPrefs.convertToCountry == null) {
                        storage.dccPrefs.convertToCountry = "AX";
                    }
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
                        if (storage.dccPrefs.enabledCurrencies.AED == null) {
                            storage.dccPrefs.enabledCurrencies.AED = aDefaultEnabled.AED;
                        }
                        if (storage.dccPrefs.enabledCurrencies.ALL == null) {
                            storage.dccPrefs.enabledCurrencies.ALL = aDefaultEnabled.ALL;
                        }
                        if (storage.dccPrefs.enabledCurrencies.AMD == null) {
                            storage.dccPrefs.enabledCurrencies.AMD = aDefaultEnabled.AMD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.ANG == null) {
                            storage.dccPrefs.enabledCurrencies.ANG = aDefaultEnabled.ANG;
                        }
                        if (storage.dccPrefs.enabledCurrencies.AOA == null) {
                            storage.dccPrefs.enabledCurrencies.AOA = aDefaultEnabled.ADA;
                        }
                        if (storage.dccPrefs.enabledCurrencies.ARS == null) {
                            storage.dccPrefs.enabledCurrencies.ARS = aDefaultEnabled.ARS;
                        }
                        if (storage.dccPrefs.enabledCurrencies.AUD == null) {
                            storage.dccPrefs.enabledCurrencies.AUD = aDefaultEnabled.AUD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.AWG == null) {
                            storage.dccPrefs.enabledCurrencies.AWG = aDefaultEnabled.AWG;
                        }
                        if (storage.dccPrefs.enabledCurrencies.AZN == null) {
                            storage.dccPrefs.enabledCurrencies.AZN = aDefaultEnabled.AZN;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BAM == null) {
                            storage.dccPrefs.enabledCurrencies.BAM = aDefaultEnabled.BAM;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BBD == null) {
                            storage.dccPrefs.enabledCurrencies.BBD = aDefaultEnabled.BBD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BDT == null) {
                            storage.dccPrefs.enabledCurrencies.BDT = aDefaultEnabled.BDT;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BGN == null) {
                            storage.dccPrefs.enabledCurrencies.BGN = aDefaultEnabled.BGN;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BHD == null) {
                            storage.dccPrefs.enabledCurrencies.BHD = aDefaultEnabled.BHD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BIF == null) {
                            storage.dccPrefs.enabledCurrencies.BIF = aDefaultEnabled.BIF;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BMD == null) {
                            storage.dccPrefs.enabledCurrencies.BMD = aDefaultEnabled.BMD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BND == null) {
                            storage.dccPrefs.enabledCurrencies.BND = aDefaultEnabled.BND;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BOB == null) {
                            storage.dccPrefs.enabledCurrencies.BOB = aDefaultEnabled.BOB;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BOV == null) {
                            storage.dccPrefs.enabledCurrencies.BOV = aDefaultEnabled.BOV;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BRL == null) {
                            storage.dccPrefs.enabledCurrencies.BRL = aDefaultEnabled.BRL;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BSD == null) {
                            storage.dccPrefs.enabledCurrencies.BSD = aDefaultEnabled.BSD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BTN == null) {
                            storage.dccPrefs.enabledCurrencies.BTN = aDefaultEnabled.BTN;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BWP == null) {
                            storage.dccPrefs.enabledCurrencies.BWP = aDefaultEnabled.BWP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BYR == null) {
                            storage.dccPrefs.enabledCurrencies.BYR = aDefaultEnabled.BYR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.BZD == null) {
                            storage.dccPrefs.enabledCurrencies.BZD = aDefaultEnabled.BZD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.CAD == null) {
                            storage.dccPrefs.enabledCurrencies.CAD = aDefaultEnabled.CAD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.CDF == null) {
                            storage.dccPrefs.enabledCurrencies.CDF = aDefaultEnabled.CDF;
                        }
                        if (storage.dccPrefs.enabledCurrencies.CHE == null) {
                            storage.dccPrefs.enabledCurrencies.CHE = aDefaultEnabled.CHE;
                        }
                        if (storage.dccPrefs.enabledCurrencies.CHF == null) {
                            storage.dccPrefs.enabledCurrencies.CHF = aDefaultEnabled.CHF;
                        }
                        if (storage.dccPrefs.enabledCurrencies.CHW == null) {
                            storage.dccPrefs.enabledCurrencies.CHW = aDefaultEnabled.CHW;
                        }
                        if (storage.dccPrefs.enabledCurrencies.CLF == null) {
                            storage.dccPrefs.enabledCurrencies.CLF = aDefaultEnabled.CLF;
                        }
                        if (storage.dccPrefs.enabledCurrencies.CLP == null) {
                            storage.dccPrefs.enabledCurrencies.CLP = aDefaultEnabled.CLP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.CNY == null) {
                            storage.dccPrefs.enabledCurrencies.CNY = aDefaultEnabled.CNY;
                        }
                        if (storage.dccPrefs.enabledCurrencies.COP == null) {
                            storage.dccPrefs.enabledCurrencies.COP = aDefaultEnabled.COP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.COU == null) {
                            storage.dccPrefs.enabledCurrencies.COU = aDefaultEnabled.COU;
                        }
                        if (storage.dccPrefs.enabledCurrencies.CRC == null) {
                            storage.dccPrefs.enabledCurrencies.CRC = aDefaultEnabled.CRC;
                        }
                        if (storage.dccPrefs.enabledCurrencies.CUC == null) {
                            storage.dccPrefs.enabledCurrencies.CUC = aDefaultEnabled.CUC;
                        }
                        if (storage.dccPrefs.enabledCurrencies.CUP == null) {
                            storage.dccPrefs.enabledCurrencies.CUP = aDefaultEnabled.CUP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.CVE == null) {
                            storage.dccPrefs.enabledCurrencies.CVE = aDefaultEnabled.CVE;
                        }
                        if (storage.dccPrefs.enabledCurrencies.CZK == null) {
                            storage.dccPrefs.enabledCurrencies.CZK = aDefaultEnabled.CZK;
                        }
                        if (storage.dccPrefs.enabledCurrencies.DJF == null) {
                            storage.dccPrefs.enabledCurrencies.DJF = aDefaultEnabled.DJF;
                        }
                        if (storage.dccPrefs.enabledCurrencies.DKK == null) {
                            storage.dccPrefs.enabledCurrencies.DKK = aDefaultEnabled.DKK;
                        }
                        if (storage.dccPrefs.enabledCurrencies.DOP == null) {
                            storage.dccPrefs.enabledCurrencies.DOP = aDefaultEnabled.DOP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.DZD == null) {
                            storage.dccPrefs.enabledCurrencies.DZD = aDefaultEnabled.DZD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.EGP == null) {
                            storage.dccPrefs.enabledCurrencies.EGP = aDefaultEnabled.EGP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.ERN == null) {
                            storage.dccPrefs.enabledCurrencies.ERN = aDefaultEnabled.ERN;
                        }
                        if (storage.dccPrefs.enabledCurrencies.ETB == null) {
                            storage.dccPrefs.enabledCurrencies.ETB = aDefaultEnabled.ETB;
                        }
                        if (storage.dccPrefs.enabledCurrencies.EUR == null) {
                            storage.dccPrefs.enabledCurrencies.EUR = aDefaultEnabled.EUR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.FJD == null) {
                            storage.dccPrefs.enabledCurrencies.FJD = aDefaultEnabled.FJD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.FKP == null) {
                            storage.dccPrefs.enabledCurrencies.FKP = aDefaultEnabled.FKP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.GBP == null) {
                            storage.dccPrefs.enabledCurrencies.GBP = aDefaultEnabled.GBP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.GEL == null) {
                            storage.dccPrefs.enabledCurrencies.GEL = aDefaultEnabled.GEL;
                        }
                        if (storage.dccPrefs.enabledCurrencies.GHS == null) {
                            storage.dccPrefs.enabledCurrencies.GHS = aDefaultEnabled.GHS;
                        }
                        if (storage.dccPrefs.enabledCurrencies.GIP == null) {
                            storage.dccPrefs.enabledCurrencies.GIP = aDefaultEnabled.GIP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.GMD == null) {
                            storage.dccPrefs.enabledCurrencies.GMD = aDefaultEnabled.GMD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.GNF == null) {
                            storage.dccPrefs.enabledCurrencies.GNF = aDefaultEnabled.GNF;
                        }
                        if (storage.dccPrefs.enabledCurrencies.GTQ == null) {
                            storage.dccPrefs.enabledCurrencies.GTQ = aDefaultEnabled.GTQ;
                        }
                        if (storage.dccPrefs.enabledCurrencies.GYD == null) {
                            storage.dccPrefs.enabledCurrencies.GYD = aDefaultEnabled.GYD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.HKD == null) {
                            storage.dccPrefs.enabledCurrencies.HKD = aDefaultEnabled.HKD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.HNL == null) {
                            storage.dccPrefs.enabledCurrencies.HNL = aDefaultEnabled.HNL;
                        }
                        if (storage.dccPrefs.enabledCurrencies.HRK == null) {
                            storage.dccPrefs.enabledCurrencies.HRK = aDefaultEnabled.HRK;
                        }
                        if (storage.dccPrefs.enabledCurrencies.HTG == null) {
                            storage.dccPrefs.enabledCurrencies.HTG = aDefaultEnabled.HTG;
                        }
                        if (storage.dccPrefs.enabledCurrencies.HUF == null) {
                            storage.dccPrefs.enabledCurrencies.HUF = aDefaultEnabled.HUF;
                        }
                        if (storage.dccPrefs.enabledCurrencies.IDR == null) {
                            storage.dccPrefs.enabledCurrencies.IDR = aDefaultEnabled.IDR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.ILS == null) {
                            storage.dccPrefs.enabledCurrencies.ILS = aDefaultEnabled.ILS;
                        }
                        if (storage.dccPrefs.enabledCurrencies.INR == null) {
                            storage.dccPrefs.enabledCurrencies.INR = aDefaultEnabled.INR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.IQD == null) {
                            storage.dccPrefs.enabledCurrencies.IQD = aDefaultEnabled.IQD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.IRR == null) {
                            storage.dccPrefs.enabledCurrencies.IRR = aDefaultEnabled.IRR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.ISK == null) {
                            storage.dccPrefs.enabledCurrencies.ISK = aDefaultEnabled.ISK;
                        }
                        if (storage.dccPrefs.enabledCurrencies.JMD == null) {
                            storage.dccPrefs.enabledCurrencies.JMD = aDefaultEnabled.JMD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.JOD == null) {
                            storage.dccPrefs.enabledCurrencies.JOD = aDefaultEnabled.JOD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.JPY == null) {
                            storage.dccPrefs.enabledCurrencies.JPY = aDefaultEnabled.JPY;
                        }
                        if (storage.dccPrefs.enabledCurrencies.KES == null) {
                            storage.dccPrefs.enabledCurrencies.KES = aDefaultEnabled.KES;
                        }
                        if (storage.dccPrefs.enabledCurrencies.KGS == null) {
                            storage.dccPrefs.enabledCurrencies.KGS = aDefaultEnabled.KGS;
                        }
                        if (storage.dccPrefs.enabledCurrencies.KHR == null) {
                            storage.dccPrefs.enabledCurrencies.KHR = aDefaultEnabled.KHR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.KMF == null) {
                            storage.dccPrefs.enabledCurrencies.KMF = aDefaultEnabled.KMF;
                        }
                        if (storage.dccPrefs.enabledCurrencies.KPW == null) {
                            storage.dccPrefs.enabledCurrencies.KPW = aDefaultEnabled.KPW;
                        }
                        if (storage.dccPrefs.enabledCurrencies.KRW == null) {
                            storage.dccPrefs.enabledCurrencies.KRW = aDefaultEnabled.KRW;
                        }
                        if (storage.dccPrefs.enabledCurrencies.KWD == null) {
                            storage.dccPrefs.enabledCurrencies.KWD = aDefaultEnabled.KWD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.KYD == null) {
                            storage.dccPrefs.enabledCurrencies.KYD = aDefaultEnabled.KYD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.KZT == null) {
                            storage.dccPrefs.enabledCurrencies.KZT = aDefaultEnabled.KZT;
                        }
                        if (storage.dccPrefs.enabledCurrencies.LAK == null) {
                            storage.dccPrefs.enabledCurrencies.LAK = aDefaultEnabled.LAK;
                        }
                        if (storage.dccPrefs.enabledCurrencies.LBP == null) {
                            storage.dccPrefs.enabledCurrencies.LBP = aDefaultEnabled.LBP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.LKR == null) {
                            storage.dccPrefs.enabledCurrencies.LKR = aDefaultEnabled.LKR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.LRD == null) {
                            storage.dccPrefs.enabledCurrencies.LRD = aDefaultEnabled.LRD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.LSL == null) {
                            storage.dccPrefs.enabledCurrencies.LSL = aDefaultEnabled.LSL;
                        }
                        if (storage.dccPrefs.enabledCurrencies.LTL == null) {
                            storage.dccPrefs.enabledCurrencies.LTL = aDefaultEnabled.LTL;
                        }
                        if (storage.dccPrefs.enabledCurrencies.LYD == null) {
                            storage.dccPrefs.enabledCurrencies.LYD = aDefaultEnabled.LYD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MAD == null) {
                            storage.dccPrefs.enabledCurrencies.MAD = aDefaultEnabled.MAD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MDL == null) {
                            storage.dccPrefs.enabledCurrencies.MDL = aDefaultEnabled.MDL;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MGA == null) {
                            storage.dccPrefs.enabledCurrencies.MGA = aDefaultEnabled.MGA;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MKD == null) {
                            storage.dccPrefs.enabledCurrencies.MKD = aDefaultEnabled.MKD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MMK == null) {
                            storage.dccPrefs.enabledCurrencies.MMK = aDefaultEnabled.MMK;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MNT == null) {
                            storage.dccPrefs.enabledCurrencies.MNT = aDefaultEnabled.MNT;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MOP == null) {
                            storage.dccPrefs.enabledCurrencies.MOP = aDefaultEnabled.MOP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MRO == null) {
                            storage.dccPrefs.enabledCurrencies.MRO = aDefaultEnabled.MRO;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MUR == null) {
                            storage.dccPrefs.enabledCurrencies.MUR = aDefaultEnabled.MUR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MVR == null) {
                            storage.dccPrefs.enabledCurrencies.MVR = aDefaultEnabled.MVR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MWK == null) {
                            storage.dccPrefs.enabledCurrencies.MWK = aDefaultEnabled.MWK;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MXN == null) {
                            storage.dccPrefs.enabledCurrencies.MXN = aDefaultEnabled.MXN;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MXV == null) {
                            storage.dccPrefs.enabledCurrencies.MXV = aDefaultEnabled.MXV;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MYR == null) {
                            storage.dccPrefs.enabledCurrencies.MYR = aDefaultEnabled.MYR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.MZN == null) {
                            storage.dccPrefs.enabledCurrencies.MZN = aDefaultEnabled.MZN;
                        }
                        if (storage.dccPrefs.enabledCurrencies.NAD == null) {
                            storage.dccPrefs.enabledCurrencies.NAD = aDefaultEnabled.NAD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.NGN == null) {
                            storage.dccPrefs.enabledCurrencies.NGN = aDefaultEnabled.NGN;
                        }
                        if (storage.dccPrefs.enabledCurrencies.NIO == null) {
                            storage.dccPrefs.enabledCurrencies.NIO = aDefaultEnabled.NIO;
                        }
                        if (storage.dccPrefs.enabledCurrencies.NOK == null) {
                            storage.dccPrefs.enabledCurrencies.NOK = aDefaultEnabled.NOK;
                        }
                        if (storage.dccPrefs.enabledCurrencies.NPR == null) {
                            storage.dccPrefs.enabledCurrencies.NPR = aDefaultEnabled.NPR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.NZD == null) {
                            storage.dccPrefs.enabledCurrencies.NZD = aDefaultEnabled.NZD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.OMR == null) {
                            storage.dccPrefs.enabledCurrencies.OMR = aDefaultEnabled.OMR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.PAB == null) {
                            storage.dccPrefs.enabledCurrencies.PAB = aDefaultEnabled.PAB;
                        }
                        if (storage.dccPrefs.enabledCurrencies.PEN == null) {
                            storage.dccPrefs.enabledCurrencies.PEN = aDefaultEnabled.PEN;
                        }
                        if (storage.dccPrefs.enabledCurrencies.PGK == null) {
                            storage.dccPrefs.enabledCurrencies.PGK = aDefaultEnabled.PGK;
                        }
                        if (storage.dccPrefs.enabledCurrencies.PHP == null) {
                            storage.dccPrefs.enabledCurrencies.PHP = aDefaultEnabled.PHP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.PKR == null) {
                            storage.dccPrefs.enabledCurrencies.PKR = aDefaultEnabled.PKR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.PLN == null) {
                            storage.dccPrefs.enabledCurrencies.PLN = aDefaultEnabled.PLN;
                        }
                        if (storage.dccPrefs.enabledCurrencies.PYG == null) {
                            storage.dccPrefs.enabledCurrencies.PYG = aDefaultEnabled.PYG;
                        }
                        if (storage.dccPrefs.enabledCurrencies.QAR == null) {
                            storage.dccPrefs.enabledCurrencies.QAR = aDefaultEnabled.QAR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.RON == null) {
                            storage.dccPrefs.enabledCurrencies.RON = aDefaultEnabled.RON;
                        }
                        if (storage.dccPrefs.enabledCurrencies.RSD == null) {
                            storage.dccPrefs.enabledCurrencies.RSD = aDefaultEnabled.RSD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.RUB == null) {
                            storage.dccPrefs.enabledCurrencies.RUB = aDefaultEnabled.RUB;
                        }
                        if (storage.dccPrefs.enabledCurrencies.RWF == null) {
                            storage.dccPrefs.enabledCurrencies.RWF = aDefaultEnabled.RWF;
                        }
                        if (storage.dccPrefs.enabledCurrencies.SAR == null) {
                            storage.dccPrefs.enabledCurrencies.SAR = aDefaultEnabled.SAR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.SBD == null) {
                            storage.dccPrefs.enabledCurrencies.SBD = aDefaultEnabled.SBD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.SCR == null) {
                            storage.dccPrefs.enabledCurrencies.SCR = aDefaultEnabled.SCR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.SDG == null) {
                            storage.dccPrefs.enabledCurrencies.SDG = aDefaultEnabled.SDG;
                        }
                        if (storage.dccPrefs.enabledCurrencies.SEK == null) {
                            storage.dccPrefs.enabledCurrencies.SEK = aDefaultEnabled.SEK;
                        }
                        if (storage.dccPrefs.enabledCurrencies.SGD == null) {
                            storage.dccPrefs.enabledCurrencies.SGD = aDefaultEnabled.SGD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.SHP == null) {
                            storage.dccPrefs.enabledCurrencies.SHP = aDefaultEnabled.SHP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.SLL == null) {
                            storage.dccPrefs.enabledCurrencies.SLL = aDefaultEnabled.SLL;
                        }
                        if (storage.dccPrefs.enabledCurrencies.SOS == null) {
                            storage.dccPrefs.enabledCurrencies.SOS = aDefaultEnabled.SOS;
                        }
                        if (storage.dccPrefs.enabledCurrencies.SRD == null) {
                            storage.dccPrefs.enabledCurrencies.SRD = aDefaultEnabled.SRD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.SSP == null) {
                            storage.dccPrefs.enabledCurrencies.SSP = aDefaultEnabled.SSP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.STD == null) {
                            storage.dccPrefs.enabledCurrencies.STD = aDefaultEnabled.STD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.SVC == null) {
                            storage.dccPrefs.enabledCurrencies.SVC = aDefaultEnabled.SVC;
                        }
                        if (storage.dccPrefs.enabledCurrencies.SYP == null) {
                            storage.dccPrefs.enabledCurrencies.SYP = aDefaultEnabled.SYP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.SZL == null) {
                            storage.dccPrefs.enabledCurrencies.SZL = aDefaultEnabled.SZL;
                        }
                        if (storage.dccPrefs.enabledCurrencies.THB == null) {
                            storage.dccPrefs.enabledCurrencies.THB = aDefaultEnabled.THB;
                        }
                        if (storage.dccPrefs.enabledCurrencies.TJS == null) {
                            storage.dccPrefs.enabledCurrencies.TJS = aDefaultEnabled.TJS;
                        }
                        if (storage.dccPrefs.enabledCurrencies.TMT == null) {
                            storage.dccPrefs.enabledCurrencies.TMT = aDefaultEnabled.TMT;
                        }
                        if (storage.dccPrefs.enabledCurrencies.TND == null) {
                            storage.dccPrefs.enabledCurrencies.TND = aDefaultEnabled.TND;
                        }
                        if (storage.dccPrefs.enabledCurrencies.TOP == null) {
                            storage.dccPrefs.enabledCurrencies.TOP = aDefaultEnabled.TOP;
                        }
                        if (storage.dccPrefs.enabledCurrencies.TRY == null) {
                            storage.dccPrefs.enabledCurrencies.TRY = aDefaultEnabled.TRY;
                        }
                        if (storage.dccPrefs.enabledCurrencies.TTD == null) {
                            storage.dccPrefs.enabledCurrencies.TTD = aDefaultEnabled.TTD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.TWD == null) {
                            storage.dccPrefs.enabledCurrencies.TWD = aDefaultEnabled.TWD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.TZS == null) {
                            storage.dccPrefs.enabledCurrencies.TZS = aDefaultEnabled.TZS;
                        }
                        if (storage.dccPrefs.enabledCurrencies.UAH == null) {
                            storage.dccPrefs.enabledCurrencies.UAH = aDefaultEnabled.UAH;
                        }
                        if (storage.dccPrefs.enabledCurrencies.UGX == null) {
                            storage.dccPrefs.enabledCurrencies.UGX = aDefaultEnabled.UGX;
                        }
                        if (storage.dccPrefs.enabledCurrencies.USD == null) {
                            storage.dccPrefs.enabledCurrencies.USD = aDefaultEnabled.USD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.USN == null) {
                            storage.dccPrefs.enabledCurrencies.USN = aDefaultEnabled.USN;
                        }
                        if (storage.dccPrefs.enabledCurrencies.UYI == null) {
                            storage.dccPrefs.enabledCurrencies.UYI = aDefaultEnabled.UYI;
                        }
                        if (storage.dccPrefs.enabledCurrencies.UYU == null) {
                            storage.dccPrefs.enabledCurrencies.UYU = aDefaultEnabled.UYU;
                        }
                        if (storage.dccPrefs.enabledCurrencies.UZS == null) {
                            storage.dccPrefs.enabledCurrencies.UZS = aDefaultEnabled.UZS;
                        }
                        if (storage.dccPrefs.enabledCurrencies.VEF == null) {
                            storage.dccPrefs.enabledCurrencies.VEF = aDefaultEnabled.VEF;
                        }
                        if (storage.dccPrefs.enabledCurrencies.VND == null) {
                            storage.dccPrefs.enabledCurrencies.VND = aDefaultEnabled.VND;
                        }
                        if (storage.dccPrefs.enabledCurrencies.VUV == null) {
                            storage.dccPrefs.enabledCurrencies.VUV = aDefaultEnabled.VUV;
                        }
                        if (storage.dccPrefs.enabledCurrencies.WST == null) {
                            storage.dccPrefs.enabledCurrencies.WST = aDefaultEnabled.WST;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XAF == null) {
                            storage.dccPrefs.enabledCurrencies.XAF = aDefaultEnabled.XAF;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XAG == null) {
                            storage.dccPrefs.enabledCurrencies.XAG = aDefaultEnabled.XAG;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XAU == null) {
                            storage.dccPrefs.enabledCurrencies.XAU = aDefaultEnabled.XAU;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XBA == null) {
                            storage.dccPrefs.enabledCurrencies.XBA = aDefaultEnabled.XBA;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XBB == null) {
                            storage.dccPrefs.enabledCurrencies.XBB = aDefaultEnabled.XBB;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XBC == null) {
                            storage.dccPrefs.enabledCurrencies.XBC = aDefaultEnabled.XBC;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XBD == null) {
                            storage.dccPrefs.enabledCurrencies.XBD = aDefaultEnabled.XBD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XCD == null) {
                            storage.dccPrefs.enabledCurrencies.XCD = aDefaultEnabled.XCD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XDR == null) {
                            storage.dccPrefs.enabledCurrencies.XDR = aDefaultEnabled.XDR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XOF == null) {
                            storage.dccPrefs.enabledCurrencies.XOF = aDefaultEnabled.XOF;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XPD == null) {
                            storage.dccPrefs.enabledCurrencies.XPD = aDefaultEnabled.XPD;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XPF == null) {
                            storage.dccPrefs.enabledCurrencies.XPF = aDefaultEnabled.XPF;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XPT == null) {
                            storage.dccPrefs.enabledCurrencies.XPT = aDefaultEnabled.XPT;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XSU == null) {
                            storage.dccPrefs.enabledCurrencies.XSU = aDefaultEnabled.XSU;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XTS == null) {
                            storage.dccPrefs.enabledCurrencies.XTS = aDefaultEnabled.XTS;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XUA == null) {
                            storage.dccPrefs.enabledCurrencies.XUA = aDefaultEnabled.XUA;
                        }
                        if (storage.dccPrefs.enabledCurrencies.XXX == null) {
                            storage.dccPrefs.enabledCurrencies.XXX = aDefaultEnabled.XXX;
                        }
                        if (storage.dccPrefs.enabledCurrencies.YER == null) {
                            storage.dccPrefs.enabledCurrencies.YER = aDefaultEnabled.YER;
                        }
                        if (storage.dccPrefs.enabledCurrencies.ZAR == null) {
                            storage.dccPrefs.enabledCurrencies.ZAR = aDefaultEnabled.ZAR;
                        }
                        if (storage.dccPrefs.enabledCurrencies.ZMW == null) {
                            storage.dccPrefs.enabledCurrencies.ZMW = aDefaultEnabled.ZMW;
                        }
                        if (storage.dccPrefs.enabledCurrencies.ZWL == null) {
                            storage.dccPrefs.enabledCurrencies.ZWL = aDefaultEnabled.ZWL;
                        }
                    }
                }
            },
            getConvertToCurrency: function() {
                return storage.dccPrefs.convertToCurrency;
            },
            setConvertToCurrency: function(aCurrency) {
                storage.dccPrefs.convertToCurrency = aCurrency;
            },
            getConvertToCountry: function() {
                return storage.dccPrefs.convertToCountry;
            },
            setConvertToCountry: function(aCountry) {
                storage.dccPrefs.convertToCountry = aCountry;
            },
            getCustomSymbols: function() {
                return storage.dccPrefs.customSymbols;
            },
            setCustomSymbols: function(aCustomSymbols) {
                storage.dccPrefs.customSymbols = aCustomSymbols;
            },
            getDecimalSep: function() {
                return storage.dccPrefs.subUnitSeparator;
            },
            setDecimalSep: function(aDecimalSep) {
                storage.dccPrefs.subUnitSeparator = aDecimalSep;
            },
            isEnableOnStart: function() {
                if (storage.dccPrefs != null) {
                    return storage.dccPrefs.enableOnStart;
                }
                return true;
            },
            setEnableOnStart: function(anEnableOnStart) {
                storage.dccPrefs.enableOnStart = anEnableOnStart;
            },
            getExcludedDomains: function() {
                return storage.excludedDomains;
            },
            setExcludedDomains: function(anExcludedDomains) {
                storage.excludedDomains = anExcludedDomains;
            },
            getEnabledCurrencies: function() {
                return storage.dccPrefs.enabledCurrencies;
            },
            setEnabledCurrencies: function(anEnabledCurrencies) {
                storage.dccPrefs.enabledCurrencies = anEnabledCurrencies;
            },
            isFromCurrencyEnabled: function(aCurrency) {
                return storage.dccPrefs.enabledCurrencies[aCurrency];
            },
            getQuoteAdjustmentPercent: function() {
                return storage.dccPrefs.quoteAdjustmentPercent;
            },
            setQuoteAdjustmentPercent: function(aQuoteAdjustmentPercent) {
                storage.dccPrefs.quoteAdjustmentPercent = aQuoteAdjustmentPercent;
            },
            isRoundPrices: function() {
                return storage.dccPrefs.roundAmounts;
            },
            setRoundPrices: function(aRoundPrices) {
                storage.dccPrefs.roundAmounts = aRoundPrices;
            },
            isSeparatePrice: function() {
                return storage.dccPrefs.separatePrice;
            },
            setSeparatePrice: function(aSeparatePrice) {
                storage.dccPrefs.separatePrice = aSeparatePrice;
            },
            isShowOriginalPrices: function() {
                return storage.dccPrefs.showOriginalPrices;
            },
            setShowOriginalPrices: function(aShowOriginalPrices) {
                storage.dccPrefs.showOriginalPrices = aShowOriginalPrices;
            },
            getUnitAfter: function() {
                return storage.dccPrefs.unitAfter;
            },
            setUnitAfter: function(aUnitAfter) {
                storage.dccPrefs.unitAfter = aUnitAfter;
            },
            getThousandSep: function() {
                return storage.dccPrefs.thousandSep;
            },
            setThousandSep: function(aThousandSep) {
                storage.dccPrefs.thousandSep = aThousandSep;
            },
            getTempConvertUnits: function() {
                return storage.dccPrefs.tempConvertUnits;
            },
            setTempConvertUnits: function(aTempConvertUnits) {
                storage.dccPrefs.tempConvertUnits = aTempConvertUnits;
            },
            setFormat: function(aFormat) {
                storage.dccPrefs.subUnitSeparator = aFormat.subUnitSeparator;
                storage.dccPrefs.separatePrice = aFormat.isAmountUnitSeparated;
                storage.dccPrefs.unitAfter = aFormat.unitAfter;
                storage.dccPrefs.thousandSep = aFormat.thousandsSeparator;
            },
            resetSettings: function() {
                delete storage.dccPrefs;
                delete storage.excludedDomains;
            }
        };
    };
    // Stereotype Information holder
    const InformationHolder = function(aUrlProvider, aStorageService) {
        const _ = require("sdk/l10n").get;
        var conversionEnabled = aStorageService.isEnableOnStart();
        var fromCurrencies = ["AFN", "AED", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SVC", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "UYI", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XOF", "XPD", "XPF", "XPT", "XSU", "XTS", "XUA", "XXX", "YER", "ZAR", "ZMW", "ZWL"];
        // Conversion is made in the following priority order
        // Normal default
        var defaultEnabled = {"CHF":true, "DKK":true, "EUR":true, "GBP":true, "ISK":true, "JPY":true, "NOK":true, "RUB":true, "SEK":true, "USD":true};
        // Test default
        // defaultEnabled = {"AFN":true, "AED":true, "ALL":true, "AMD":true, "ANG":true, "AOA":true, "ARS":true, "AUD":true, "AWG":true, "AZN":true, "BAM":true, "BBD":true, "BDT":true, "BGN":true, "BHD":true, "BIF":true, "BMD":true, "BND":true, "BOB":true, "BOV":true, "BRL":true, "BSD":true, "BTN":true, "BWP":true, "BYR":true, "BZD":true, "CAD":true, "CDF":true, "CHE":true, "CHF":true, "CHW":true, "CLF":true, "CLP":true, "CNY":true, "COP":true, "COU":true, "CRC":true, "CUC":true, "CUP":true, "CVE":true, "CZK":true, "DJF":true, "DKK":true, "DOP":true, "DZD":true, "EGP":true, "ERN":true, "ETB":true, "EUR":true, "FJD":true, "FKP":true, "GBP":true, "GEL":true, "GHS":true, "GIP":true, "GMD":true, "GNF":true, "GTQ":true, "GYD":true, "HKD":true, "HNL":true, "HRK":true, "HTG":true, "HUF":true, "IDR":true, "ILS":true, "INR":true, "IQD":true, "IRR":true, "ISK":true, "JMD":true, "JOD":true, "JPY":true, "KES":true, "KGS":true, "KHR":true, "KMF":true, "KPW":true, "KRW":true, "KWD":true, "KYD":true, "KZT":true, "LAK":true, "LBP":true, "LKR":true, "LRD":true, "LSL":true, "LTL":true, "LYD":true, "MAD":true, "MDL":true, "MGA":true, "MKD":true, "MMK":true, "MNT":true, "MOP":true, "MRO":true, "MUR":true, "MVR":true, "MWK":true, "MXN":true, "MXV":true, "MYR":true, "MZN":true, "NAD":true, "NGN":true, "NIO":true, "NOK":true, "NPR":true, "NZD":true, "OMR":true, "PAB":true, "PEN":true, "PGK":true, "PHP":true, "PKR":true, "PLN":true, "PYG":true, "QAR":true, "RON":true, "RSD":true, "RUB":true, "RWF":true, "SAR":true, "SBD":true, "SCR":true, "SDG":true, "SEK":true, "SGD":true, "SHP":true, "SLL":true, "SOS":true, "SRD":true, "SSP":true, "STD":true, "SVC":true, "SYP":true, "SZL":true, "THB":true, "TJS":true, "TMT":true, "TND":true, "TOP":true, "TRY":true, "TTD":true, "TWD":true, "TZS":true, "UAH":true, "UGX":true, "USD":true, "USN":true, "UYI":true, "UYU":true, "UZS":true, "VEF":true, "VND":true, "VUV":true, "WST":true, "XAF":true, "XAG":true, "XAU":true, "XBA":true, "XBB":true, "XBC":true, "XBD":true, "XCD":true, "XDR":true, "XOF":true, "XPD":true, "XPF":true, "XPT":true, "XSU":true, "XTS":true, "XUA":true, "XXX":true, "YER":true, "ZAR":true, "ZMW":true, "ZWL":true};
        // defaultEnabled = {"BGN":true};
        var currencyNames = {};
        fromCurrencies.forEach(function(aCurrency){
            if (defaultEnabled[aCurrency] == undefined) {
                defaultEnabled[aCurrency] = false;
            }
            currencyNames[aCurrency] = _(aCurrency);
        });
        // console.log(currencyNames);
        var numberOfFromCurrencies = fromCurrencies.length;
        // Used for check if all currencies have been read
        var numberOfReadCurrencies = 0;
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
        var quoteStrings = [];
        const makeQuoteStringCallback = function(aConvertFromCurrency, anIndex, anArray) {
            const quote = conversionQuotes[aConvertFromCurrency];
            const conversionQuote = (parseFloat(quote)).toFixed(4);
            if (aConvertFromCurrency != aStorageService.getConvertToCurrency()) {
                const quoteString = "1 " + aConvertFromCurrency + " = " + conversionQuote.replace(".", informationHolder.getDecimalSep()) + " " + aStorageService.getConvertToCurrency();
                quoteStrings.push(quoteString);
            }
        };
        return {
            isConversionEnabled: function() {
                return conversionEnabled;
            },
            setConversionEnabled: function(aConversionEnabled) {
                conversionEnabled = aConversionEnabled;
            },
            getConversionQuote: function(aConvertFromCurrency) {
                return conversionQuotes[aConvertFromCurrency];
            },
            setConversionQuote: function(aConvertFromCurrency, quote) {
                conversionQuotes[aConvertFromCurrency] = quote;
                numberOfReadCurrencies++;
            },
            getConversionQuotes: function() {
                return conversionQuotes;
            },
            getConvertToCurrency: function() {
                return aStorageService.getConvertToCurrency();
            },
            setConvertToCurrency: function(aCurrency) {
                aStorageService.setConvertToCurrency(aCurrency);
            },
            getConvertToCountry: function() {
                return aStorageService.getConvertToCountry();
            },
            setConvertToCountry: function(aCountry) {
                aStorageService.setConvertToCountry(aCountry);
            },
            getCurrencySymbols: function() {
                return currencySymbols;
            },
            getCustomSymbols: function() {
                return aStorageService.getCustomSymbols();
            },
            setCustomSymbols: function(aCustomSymbols) {
                aStorageService.setCustomSymbols(aCustomSymbols);
            },
            getDecimalSep: function() {
                return aStorageService.getDecimalSep();
            },
            setDecimalSep: function(aDecimalSep) {
                aStorageService.setDecimalSep(aDecimalSep);
            },
            getDefaultEnabled: function() {
                return defaultEnabled;
            },
            getCurrencyNames: function() {
                return currencyNames;
            },
            getDisabledIcon: function() {
                return aUrlProvider.getUrl("images/currency-20-disabled.png");
            },
            getEnabledIcon: function() {
                return {
                    "16": "images/1402781551_currency_exchange_1.png",
                    "32": "images/1402781537_currency_exchange_1.png",
                    "64": "images/1402781517_currency_exchange_1.png"
                };
            },
            getSettingsIcon: function() {
                return {
                    "16": "images/1402782691_repair_cost.png",
                    "32": "images/1402782677_repair_cost.png",
                    "64": "images/1402782661_repair_cost.png"
                };
            },
            getExcludedDomains: function() {
                return aStorageService.getExcludedDomains();
            },
            setExcludedDomains: function(anExcludedDomains) {
                aStorageService.setExcludedDomains(anExcludedDomains);
            },
            getEnabledCurrencies: function() {
                return aStorageService.getEnabledCurrencies();
            },
            setEnabledCurrencies: function(aEnabledCurrencies) {
                aStorageService.setEnabledCurrencies(aEnabledCurrencies);
            },
            getFromCurrencies: function() {
                return fromCurrencies;
            },
            setFromCurrencies: function(aFromCurrencies) {
                fromCurrencies = aFromCurrencies;
            },
            isEnableOnStart: function() {
                return aStorageService.isEnableOnStart();
            },
            setEnableOnStart: function(anEnableOnStart) {
                aStorageService.setEnableOnStart(anEnableOnStart);
            },
            getQuoteAdjustmentPercent: function() {
                return aStorageService.getQuoteAdjustmentPercent();
            },
            setQuoteAdjustmentPercent: function(aQuoteAdjustmentPercent) {
                aStorageService.setQuoteAdjustmentPercent(aQuoteAdjustmentPercent);
            },
            getQuoteString: function() {
                quoteStrings = [];
                fromCurrencies.forEach(makeQuoteStringCallback);
                return quoteStrings.join("; ");
            },
            isRoundPrices: function() {
                return aStorageService.isRoundPrices();
            },
            setRoundPrices: function(aRoundPrices) {
                aStorageService.setRoundPrices(aRoundPrices);
            },
            isSeparatePrice: function() {
                return aStorageService.isSeparatePrice();
            },
            setSeparatePrice: function(aSeparatePrice) {
                aStorageService.setSeparatePrice(aSeparatePrice);
            },
            isShowOriginalPrices: function() {
                return aStorageService.isShowOriginalPrices();
            },
            setShowOriginalPrices: function(aShowOriginalPrices) {
                aStorageService.setShowOriginalPrices(aShowOriginalPrices);
            },
            getUnitAfter: function() {
                return aStorageService.getUnitAfter();
            },
            setUnitAfter: function(aUnitAfter) {
                aStorageService.setUnitAfter(aUnitAfter);
            },
            getTempConvertUnits: function() {
                return aStorageService.getTempConvertUnits();
            },
            setTempConvertUnits: function(aTempConvertUnits) {
                aStorageService.setTempConvertUnits(aTempConvertUnits);
            },
            getThousandSep: function() {
                return aStorageService.getThousandSep();
            },
            setThousandSep: function(aThousandSep) {
                aStorageService.setThousandSep(aThousandSep);
            },
            setUserCountry: function(aUserCountry) {
                aStorageService.setConvertToCurrency(country_currency[aUserCountry]);
                const formatNumber = country_format[aUserCountry];
                const format = formats[formatNumber];
                aStorageService.setFormat(format);
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
        contentScriptParams.convertToCurrency = anInformationHolder.getConvertToCurrency();
        contentScriptParams.convertToCountry = anInformationHolder.getConvertToCountry();
        contentScriptParams.currencySymbols = anInformationHolder.getCurrencySymbols();
        contentScriptParams.customSymbols = anInformationHolder.getCustomSymbols();
        contentScriptParams.subUnitSeparator = anInformationHolder.getDecimalSep();
        contentScriptParams.enableOnStart = anInformationHolder.isEnableOnStart();
        contentScriptParams.excludedDomains = anInformationHolder.getExcludedDomains();
        contentScriptParams.enabledCurrencies = anInformationHolder.getEnabledCurrencies();
        contentScriptParams.quoteAdjustmentPercent = anInformationHolder.getQuoteAdjustmentPercent();
        contentScriptParams.roundAmounts = anInformationHolder.isRoundPrices();
        contentScriptParams.separatePrice = anInformationHolder.isSeparatePrice();
        contentScriptParams.showOriginalPrices = anInformationHolder.isShowOriginalPrices();
        contentScriptParams.unitAfter = anInformationHolder.getUnitAfter();
        contentScriptParams.tempConvertUnits = anInformationHolder.getTempConvertUnits();
        contentScriptParams.thousandSep = anInformationHolder.getThousandSep();
        if (aTab != null && typeof aTab.isEnabled != "undefined")  {
            contentScriptParams.isEnabled = aTab.isEnabled;
        }
        else {
            contentScriptParams.isEnabled = anInformationHolder.isConversionEnabled();
        }
        contentScriptParams.currencyNames = anInformationHolder.getCurrencyNames();
        return contentScriptParams;
    };
    const parseContentScriptParams = function(aContentScriptParams, anInformationHolder) {
        anInformationHolder.setConvertToCurrency(aContentScriptParams.convertToCurrency);
        anInformationHolder.setConvertToCountry(aContentScriptParams.convertToCountry);
        anInformationHolder.setCustomSymbols(aContentScriptParams.customSymbols);
        anInformationHolder.setDecimalSep(aContentScriptParams.subUnitSeparator);
        anInformationHolder.setEnableOnStart(aContentScriptParams.enableOnStart);
        anInformationHolder.setExcludedDomains(aContentScriptParams.excludedDomains);
        anInformationHolder.setEnabledCurrencies(aContentScriptParams.enabledCurrencies);
        anInformationHolder.setQuoteAdjustmentPercent(aContentScriptParams.quoteAdjustmentPercent);
        anInformationHolder.setRoundPrices(aContentScriptParams.roundAmounts);
        anInformationHolder.setSeparatePrice(aContentScriptParams.separatePrice);
        anInformationHolder.setShowOriginalPrices(aContentScriptParams.showOriginalPrices);
        anInformationHolder.setUnitAfter(aContentScriptParams.unitAfter);
        anInformationHolder.setTempConvertUnits(aContentScriptParams.tempConvertUnits);
        anInformationHolder.setThousandSep(aContentScriptParams.thousandSep);
    };
    const ContentScriptInterface = function(aUrlProvider, anInformationHolder) {
        // console.log("new ContentScriptInterface ");
        this.attachHandler = function(aWorker) {
            // console.log("attachHandler");
            this.finishedTabProcessingHandler = function(aHasConvertedElements) {
                try {
                    if (aWorker.tab.customTabObject == null) {
                        aWorker.tab.customTabObject = {};
                        aWorker.tab.customTabObject.workers = [];
                    }
                    aWorker.tab.customTabObject.isEnabled = anInformationHolder.isConversionEnabled();
                    aWorker.tab.customTabObject.workers.push(aWorker);
                    aWorker.tab.customTabObject.hasConvertedElements = aHasConvertedElements;
                }
                catch(err) {
                    console.log("ContentScriptInterface: " + err);
                }
            };
            aWorker.port.emit("updateSettings", makeContentScriptParams(aWorker.tab, anInformationHolder));
            aWorker.port.on("finishedTabProcessing", this.finishedTabProcessingHandler);
        };
        const PageMod = require("sdk/page-mod").PageMod;
        PageMod({
            include: "*",
            contentScriptFile: [aUrlProvider.getUrl("dcc-regexes.js"), aUrlProvider.getUrl("dcc-content.js")],
            contentScriptWhen: "ready",
            attachTo: ["existing", "top", "frame"],
            onAttach: this.attachHandler
        });
    };
    const TabsInterface = function(aUrlProvider, anInformationHolder) {
        const tabs = require("sdk/tabs");
        var isRegisteredToTabsEvents = false;
        // var settingsTab = null;
        var settingsWorker = null;
        return {
            getSettingsTab: function() {
                return settingsWorker.settingsTab;
            },
            toggleConversion: function(aStatus) {
                if (tabs.activeTab.customTabObject != null) {
                    tabs.activeTab.customTabObject.isEnabled = aStatus;
                    anInformationHolder.setConversionEnabled(aStatus);
                    const sendEnabledStatus = function(aWorker) {
                        if (aWorker.tab != null) {
                            const status = {};
                            status.isEnabled = aStatus;
                            status.hasConvertedElements = tabs.activeTab.customTabObject.hasConvertedElements;
                            try {
                                aWorker.port.emit("sendEnabledStatus", status);
                            }
                            catch(err) {
                                // To hide "Error: The page is currently hidden and can no longer be used until it is visible again."
                                console.log("TabsInterface: " + err);
                            }
                        }
                    };
                    tabs.activeTab.customTabObject.workers.map(sendEnabledStatus);
                     // after first click the tab will have for sure the converted elements
                    tabs.activeTab.customTabObject.hasConvertedElements = true;
                }
            },
            showSettingsTab: function(anEvent) {
                // console.log("showSettingsTab");
                // console.log("settingsWorker " + settingsWorker);
                const isOpen = settingsWorker != null && settingsWorker.settingsTab != null;
                if (settingsWorker != null) {
                    // console.log("settingsWorker.settingsTab " + settingsWorker.settingsTab);
                }
                if (!isOpen) {
                    // console.log("isNotOpen");
                     //index.html is settings page, it must be called index so that navigation buttons will be hidden
                    tabs.open({url: aUrlProvider.getUrl("index.html")});
                }
                else {
                    // console.log("isOpen");
                    // settingsWorker.port.emit("showSettings", makeContentScriptParams(settingsWorker.settingsTab, anInformationHolder));
                    settingsWorker.settingsTab.activate();
                }
            },
            registerToTabsEvents: function() {
                const setTabs = function(aTab) {
                    // console.log("aTab.url: " + aTab.url);
                    if (aTab.url === "resource://jid1-ep6btq0bhcevya-at-jetpack/direct-currency-converter/data/index.html") {
                        // Already open settings tab
                        settingsWorker = aTab.attach({contentScriptFile: [aUrlProvider.getUrl("jquery-2.1.1.min.js"), aUrlProvider.getUrl("jquery-ui-1.10.4.min.js"), aUrlProvider.getUrl("dcc-options.js")]});
                        settingsWorker.port.emit("showSettings", makeContentScriptParams(aTab, anInformationHolder));
                        settingsWorker.port.on("saveSettings", function(aContentScriptParams) {
                            eventAggregator.publish("saveSettings", {
                                contentScriptParams: aContentScriptParams
                            });
                        });
                        settingsWorker.port.on("resetSettings", function() {
                            eventAggregator.publish("resetSettings");
                        });
                        settingsWorker.settingsTab = aTab;
                    }
                    else if (aTab.customTabObject == null) {
                        aTab.customTabObject = {};
                        aTab.customTabObject.workers = [];
                        aTab.customTabObject.isEnabled = anInformationHolder.isConversionEnabled();
                        aTab.customTabObject.hasConvertedElements = false;
                        // To set toggle button
                        eventAggregator.publish("toggleConversion", anInformationHolder.isConversionEnabled());
                    }
                    if (aTab.customTabObject != null) {
                        var i = aTab.customTabObject.workers.length;
                        while (i--) {
                            const worker = aTab.customTabObject.workers[i];
                            if (worker.tab == null) {
                                aTab.customTabObject.workers.splice(i, 1);
                            }
                        }
                    }
                };
                const releaseTabs = function(aTab) {
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
                    tabs.on("activate", function() {
                        if (tabs.activeTab.customTabObject !== undefined) {
                            tabs.activeTab.customTabObject.isEnabled = anInformationHolder.isConversionEnabled();
                        };
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
        const ActionButton = require("sdk/ui").ActionButton;
        const actionButton = ActionButton({
            id: "direct-currency-converter-action-button",
            label: _("Open settings"),
            icon: {
                    "16": "./images/1402782691_repair_cost.png",
                    "32": "./images/1402782677_repair_cost.png",
                    "64": "./images/1402782661_repair_cost.png"
                },
            onClick: function(state) {
                // console.log("You clicked label '" + state.label + "'");
                eventAggregator.publish("right-click");
            }
        });
        /* Essay
        const handleChange = function(state) {
            if (state.checked) {
                panel.show({
                    position: toggleButton
                });
            }
        };
        const handleHide = function() {
            toggleButton.state('window', {checked: false});
        };
        const Panel = require("sdk/panel").Panel;
        const panel = Panel({
            width: 600,
            height: 600,
            contentURL: urlProvider.getUrl("index.html"),
            onHide: handleHide
        });
        */
        const ToggleButton = require("sdk/ui").ToggleButton;
        const toggleButton = ToggleButton({
            checked: false,
            id: "direct-currency-converter-toggle-button",
            label: _("Toggle currency conversion"),
            icon: {
                    "16": "./images/1402781551_currency_exchange_1.png",
                    "32": "./images/1402781537_currency_exchange_1.png",
                    "64": "./images/1402781517_currency_exchange_1.png"
                },
            // onChange: handleChange
            onClick: function(state) {
                // console.log("You clicked '" + state.label + "'");
                eventAggregator.publish("toggleConversion", state.checked);
            }
        });
        return {
            setBars: function(anEnabled) {
                    if (toggleButton.checked != anEnabled) {
                        toggleButton.checked = anEnabled;
                    }
                    anInformationHolder.setConversionEnabled(anEnabled);
            },
            setIconsEnabled: function() {
                actionButton.label = _("Open settings") + "\n" + anInformationHolder.getQuoteString();
            }
        };
    };
    //Stereotype Controller
    const Controller = function(anEventAggregator) {
        anEventAggregator.subscribe("quoteReceived", function(eventArgs) {
            informationHolder.setConversionQuote(eventArgs.convertFromCurrency, eventArgs.quote);
            if (informationHolder.isAllCurrenciesRead()) {
                new ContentScriptInterface(urlProvider, informationHolder);
                barsInterface.setIconsEnabled();
            }
        });
        anEventAggregator.subscribe("saveSettings", function(eventArgs) {
            const reloadQuotes = informationHolder.getConvertToCurrency() != eventArgs.contentScriptParams.convertToCurrency;
            informationHolder.resetReadCurrencies();
            parseContentScriptParams(eventArgs.contentScriptParams, informationHolder);
            tabsInterface.getSettingsTab().close();
            if (reloadQuotes) {
                controller.loadQuotes();
            }
        });
        anEventAggregator.subscribe("resetSettings", function(eventArgs) {
            informationHolder.resetSettings();
            tabsInterface.getSettingsTab().close();
            storageService.init(informationHolder.getDefaultEnabled());
        });
        anEventAggregator.subscribe("tabActivated", function(eventArgs) {
            if (eventArgs.tab.customTabObject != null) {
                tabsInterface.toggleConversion(eventArgs.tab.customTabObject.isEnabled);
                barsInterface.setBars(eventArgs.tab.customTabObject.isEnabled);
            }
            else {
            }
        });
        anEventAggregator.subscribe("toggleConversion", function(eventArgs) {
            tabsInterface.toggleConversion(eventArgs);
            barsInterface.setBars(eventArgs);
        });
        anEventAggregator.subscribe("right-click", function(eventArgs) {
            tabsInterface.showSettingsTab();
        });
        this.loadStorage = function() {
            storageService.init(informationHolder.getDefaultEnabled());
        };
        this.loadUserCountryAndQuotes = function() {
            quotesService.loadUserCountry2();
        };
        this.loadQuotes = function() {
            quotesService.loadQuotes(informationHolder.getFromCurrencies(), informationHolder.getConvertToCurrency());
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
    sp.on("DCCPreferences", function(e){
        eventAggregator.publish("right-click");
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


