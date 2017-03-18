/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const YahooQuotesServiceProvider = function(anEventAggregator) {
    "use strict";
    const eventAggregator = anEventAggregator;
    let convertToCurrency;
    let quoteQueriesFromTo = [];
    let quoteQueriesToFrom = [];
    let quotesFromTo = [];
    let quotesToFrom = [];
    const gramsPerOunce = 31.1034768;
    // Since Yahoo quote response only has four decimals, we sometimes get imprecise quotes
    // In such cases, we use the inverse quote and invert it.
    const makeOneResponse = () => {
        quotesFromTo.forEach((aRow, anIndex) => {
            // "USDEUR=X",0.7317
            const fromToRow = aRow.split(",");
            if (fromToRow.length < 2) {
                return;
            }
            let convertFromCurrency = fromToRow[0].substr(1, 3);
            let quote = parseFloat(fromToRow[2]);
            if (quote < 0.01) {
                // "EURJPY=X",142.3186
                const toFromRow = quotesToFrom[anIndex].split(",");
                if (toFromRow.length < 2) {
                    return;
                }
                convertFromCurrency = toFromRow[0].substr(4, 3);
                const reverseQuote = toFromRow[2];
                quote = reverseQuote > 0 ? 1 / reverseQuote : 0;
            }
            if (convertToCurrency == "gAu") {
                quote = quote * gramsPerOunce;
            }
            if (convertFromCurrency.length > 0) {
                eventAggregator.publish("quoteReceived", {
                    convertFromCurrencyName: convertFromCurrency,
                    quote: quote
                });
            }
        });
    };
    const quotesHandlerFromTo = (aResponse) => {
        try {
            quotesFromTo = aResponse.split("\n");
            if (quotesFromTo.length > 0 && quotesToFrom.length > 0) {
                makeOneResponse();
            }
        }
        catch(err) {
            console.error("err " + err);
        }
    };
    const quotesHandlerToFrom = (aResponse) => {
        try {
            quotesToFrom = aResponse.split("\n");
            if (quotesFromTo.length > 0 && quotesToFrom.length > 0) {
                makeOneResponse();
            }
        }
        catch(err) {
            console.error("err " + err);
        }
    };
    const makeQuoteQuery = (aConvertFromCurrency) => {
        if (convertToCurrency === "gAu") {
            quoteQueriesFromTo.push(aConvertFromCurrency + "XAU" + "=X");
            quoteQueriesToFrom.push("XAU" + aConvertFromCurrency + "=X");
        }
        else {
            quoteQueriesFromTo.push(aConvertFromCurrency.isoName + convertToCurrency + "=X");
            quoteQueriesToFrom.push(convertToCurrency + aConvertFromCurrency.isoName + "=X");
        }
    };
    const loadQuotes = (aYahooQuotesService, aConvertFroms, aConvertToCurrency) => {
        convertToCurrency = aConvertToCurrency;
        quotesFromTo = [];
        quotesToFrom = [];
        quoteQueriesFromTo = [];
        quoteQueriesToFrom = [];
        aConvertFroms.forEach(makeQuoteQuery);
        const innerUrlStringFromTo = "http://download.finance.yahoo.com/d/quotes?s=" + quoteQueriesFromTo.join(",") + "&f=snl1d1t1ab";
        const innerUrlStringToFrom = "http://download.finance.yahoo.com/d/quotes?s=" + quoteQueriesToFrom.join(",") + "&f=snl1d1t1ab";
        aYahooQuotesService.fetchQuotesFromTo(innerUrlStringFromTo);
        aYahooQuotesService.fetchQuotesToFrom(innerUrlStringToFrom);
    };
    return {
        loadQuotes: loadQuotes,
        quotesHandlerFromTo: quotesHandlerFromTo,
        quotesHandlerToFrom: quotesHandlerToFrom
    };
};

if (typeof exports === "object") {
    exports.YahooQuotesServiceProvider = YahooQuotesServiceProvider;
}


