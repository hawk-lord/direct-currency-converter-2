/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
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
    var _convertToCurrency = "EUR";
    var _convertToCountry = "AX";
    const _customSymbols = {};
    const fromCurrencies = ["AFN", "AED", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SVC", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "UYI", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XOF", "XPD", "XPF", "XPT", "XSU", "XTS", "XUA", "XXX", "YER", "ZAR", "ZMW", "ZWL"];
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
    var _decimalSep = ",";
    var _enableOnStart = true;
    const _excludedDomains = ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com"];
    const defaultEnabled = {"CHF":true, "DKK":true, "EUR":true, "GBP":true, "ISK":true, "JPY":true, "NOK":true, "RUB":true, "SEK":true, "USD":true};
    var _quoteAdjustmentPercent = 0;
    var _roundPrices = false;
    var _separatePrice = true;
    var _showOriginalPrices = true;
    var _unitAfter = true;
    var _tempConvertUnits = true;
    var _thousandSep = " ";
    var _conversionEnabled = true;
    const _currencyNames = {};
    fromCurrencies.forEach((aCurrency) => {
        if (defaultEnabled[aCurrency] == undefined) {
            defaultEnabled[aCurrency] = false;
        }
        _currencyNames[aCurrency] = aCurrency;
    });
    const _enabledCurrencies = defaultEnabled;

    const getConversionQuotes = function() {
        return conversionQuotes;
    };
    const setConversionQuote = function(aConvertFromCurrency, aQuote) {
        conversionQuotes[aConvertFromCurrency] = aQuote;
        numberOfReadCurrencies++;
        console.log(numberOfReadCurrencies);
    };
    const getCurrencySymbols = function() {
        return currencySymbols;
    };
    const getCurrencyNames = function () {
        return _currencyNames;
    };
    const getFromCurrencies = function () {
        return fromCurrencies;
    };
    const isAllCurrenciesRead = function() {
        return numberOfReadCurrencies >= fromCurrencies.length;
    };
    return {
        getConversionQuotes: getConversionQuotes,
        setConversionQuote: setConversionQuote,
        convertToCurrency: _convertToCurrency,
        convertToCountry: _convertToCountry,
        getCurrencySymbols: getCurrencySymbols,
        customSymbols: _customSymbols,
        decimalSep: _decimalSep,
        enableOnStart: _enableOnStart,
        excludedDomains: _excludedDomains,
        enabledCurrencies: _enabledCurrencies,
        quoteAdjustmentPercent: _quoteAdjustmentPercent,
        roundPrices: _roundPrices,
        separatePrice: _separatePrice,
        showOriginalPrices: _showOriginalPrices,
        unitAfter: _unitAfter,
        tempConvertUnits: _tempConvertUnits,
        thousandSep:  _thousandSep,
        conversionEnabled : _conversionEnabled,
        getCurrencyNames: getCurrencyNames,
        getFromCurrencies: getFromCurrencies,
        isAllCurrenciesRead: isAllCurrenciesRead
    }
};

if (typeof exports === "object") {
    exports.InformationHolder = InformationHolder;
}
