/**
 * Created by per on 15-03-24.
 */

/**
 * Stereotype Information holder
 * @param aUrlProvider
 * @param aStorageService
 * @returns {{setConversionQuote: Function}}
 * @constructor
 */
const InformationHolder = function(aUrlProvider, aStorageService) {
    "use strict";
    const conversionQuotes = {};
    var numberOfReadCurrencies = 0;
    const setConversionQuote = function(aConvertFromCurrency, aQuote) {
        conversionQuotes[aConvertFromCurrency] = aQuote;
        numberOfReadCurrencies++;
        console.log(numberOfReadCurrencies);
    };
    return {
        setConversionQuote : setConversionQuote
    }
};

if (typeof exports === "object") {
    exports.InformationHolder = InformationHolder;
}
