/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

/**
 * Stereotype Information holder
 *
 * @param aStorageService
 * @param aCurrencyData
 * @param _
 * @returns {{conversionEnabled, conversionEnabled, convertToCountry, convertToCountry, convertToCurrency, convertToCurrency, getConversionQuotes: Function, setConversionQuote: Function, getCurrencySymbols: Function, customSymbols, customSymbols, decimalSep, decimalSep, excludedDomains, excludedDomains, enabledCurrencies, enabledCurrencies, enableOnStart, enableOnStart, quoteAdjustmentPercent, quoteAdjustmentPercent, roundPrices, roundPrices, separatePrice, separatePrice, showOriginalPrices, showOriginalPrices, unitAfter, unitAfter, tempConvertUnits, tempConvertUnits, thousandSep, thousandSep, getCurrencyNames: Function, getFromCurrencies: Function, isAllCurrenciesRead: Function, getQuoteString: Function, resetReadCurrencies: Function, resetSettings: Function}}
 * @constructor
 */
const InformationHolder = function(aStorageService, aCurrencyData, _) {
    "use strict";
    const conversionQuotes = {};
    const findCurrency = function(aCountry) {
        const regions = aCurrencyData.region;
        // TODO Default currency
        var foundCurrency = "GBP";
        const findCurrentCurrency = function(aCurrency){
            // console.log(aCurrency);
            // console.log(aCurrency["@iso4217"]);
            if (!aCurrency["@to"]) {
                if (aCurrency["@tender"] !== "false") {
                    // console.log(aCurrency["@iso4217"]);
                    foundCurrency = aCurrency["@iso4217"];
                    return true;
                }
            }
        };
        const found = Object.keys(regions).some(function(regionKey) {
            if (aCountry === regions[regionKey]["@iso3166"]) {
                const currencies = regions[regionKey]["currency"];
                if (Array.isArray(currencies)) {
                    // console.log(currencies);
                    return currencies.some(findCurrentCurrency);
                }
                else {
                    findCurrentCurrency(currencies);
                }
            }
            return false;
        });
        return foundCurrency;
    };
    var numberOfReadCurrencies = 0;
    /**
     * All currency codes in ISO 4217
     * @type {string[]}
     */
    const iso4217Currencies = require("./iso4217Currencies.json");
    /**
     * Symbols defined in Unicode
     * http://www.fileformat.info/info/unicode/category/Sc/list.htm
     * @type {{AFN: string, AMD: string, ARS: string, AUD: string, AZN: string, BBD: string, BDT: string, BMD: string, BND: string, BRL: string, BSD: string, BZD: string, CAD: string, CLP: string, CNY: string, COP: string, CRC: string, CUC: string, CUP: string, CVE: string, DOP: string, EUR: string, FJD: string, FKP: string, GBP: string, GHS: string, GIP: string, GYD: string, HKD: string, ILS: string, INR: string, IRR: string, JMD: string, JPY: string, KHR: string, KPW: string, KRW: string, KYD: string, KZT: string, LAK: string, LKR: string, LRD: string, MNT: string, MOP: string, MUR: string, MXN: string, NAD: string, NGN: string, NIO: string, NZD: string, PHP: string, PKR: string, PYG: string, RUB: string, SAR: string, SBD: string, SGD: string, SHP: string, SVC: string, THB: string, TOP: string, TRY: string, TTD: string, TWD: string, UAH: string, USD: string, UYU: string, VND: string, WST: string, XCD: string}}
     */
    const currencySymbols = require("./currencySymbols.json");
    /**
     * Domains that should not be converted.
     * TODO use in PageMod instead
     * @type {string[]}
     * @private
     */
    const _excludedDomains = ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com"];
    const defaultEnabledCurrencies = {"CHF":true, "DKK":true, "EUR":true, "GBP":true, "ISK":true, "JPY":true, "NOK":true, "RUB":true, "SEK":true, "USD":true};
    aStorageService.init(defaultEnabledCurrencies, _excludedDomains);
    var conversionEnabled = aStorageService.enableOnStart;
    const _currencyNames = {};
    iso4217Currencies.forEach((aCurrency) => {
        if (!defaultEnabledCurrencies[aCurrency]) {
            defaultEnabledCurrencies[aCurrency] = false;
        }
        _currencyNames[aCurrency] = _(aCurrency);
    });
    var quoteStrings = [];

    const getConversionQuotes = function() {
        return conversionQuotes;
    };
    const setConversionQuote = function(aConvertFromCurrency, aQuote) {
        conversionQuotes[aConvertFromCurrency] = aQuote;
        numberOfReadCurrencies++;
        // console.log(numberOfReadCurrencies);
    };
    const getCurrencySymbols = function() {
        return currencySymbols;
    };
    const getCurrencyNames = function () {
        return _currencyNames;
    };
    const getFromCurrencies = function () {
        return iso4217Currencies;
    };
    const isAllCurrenciesRead = function() {
        return numberOfReadCurrencies >= iso4217Currencies.length;
    };
    const makeQuoteString = (aConvertFromCurrency) => {
        const quote = conversionQuotes[aConvertFromCurrency];
        const conversionQuote = (parseFloat(quote)).toFixed(4);
        if (aConvertFromCurrency != aStorageService.convertToCurrency) {
            const quoteString = "1 " + aConvertFromCurrency + " = " + conversionQuote.replace(".", aStorageService.decimalSep) + " " + aStorageService.convertToCurrency;
            quoteStrings.push(quoteString);
        }
    };
    const getQuoteString = function () {
        quoteStrings = [];
        iso4217Currencies.forEach(makeQuoteString);
        return quoteStrings.join("; ");
    };
    const resetReadCurrencies = function() {
        numberOfReadCurrencies = 0;
    };
    const resetSettings = function() {
        aStorageService.resetSettings();
        aStorageService.init(defaultEnabledCurrencies, _excludedDomains);
    };

    return {
        get conversionEnabled () {
            return conversionEnabled;
        },
        set conversionEnabled (aConversionEnabled) {
            conversionEnabled = aConversionEnabled;
        },
        get convertToCountry () {
            return aStorageService.convertToCountry;
        },
        set convertToCountry (aCountry) {
            aStorageService.convertToCountry = aCountry;
            const regionFormats = require("./regionFormats.json");
            //const {RegionFormat} = require("./RegionFormat");
            const regionFormat = regionFormats[aCountry.toLowerCase()];
            aStorageService.decimalSep = regionFormat.monetarySeparatorSymbol;
            aStorageService.separatePrice = regionFormat.currencySpacing !== "";
            aStorageService.thousandSep = regionFormat.monetaryGroupingSeparatorSymbol;
            aStorageService.unitAfter = regionFormat.beforeCurrencySymbol;
            if (!aStorageService.convertToCurrency) {
                aStorageService.convertToCurrency = findCurrency(aCountry);
            }
        },
        get convertToCurrency () {
            return aStorageService.convertToCurrency;
        },
        set convertToCurrency (aCurrency) {
            aStorageService.convertToCurrency = aCurrency;
        },
        getConversionQuotes: getConversionQuotes,
        setConversionQuote: setConversionQuote,
        getCurrencySymbols: getCurrencySymbols,
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
        getCurrencyNames: getCurrencyNames,
        getFromCurrencies: getFromCurrencies,
        isAllCurrenciesRead: isAllCurrenciesRead,
        getQuoteString: getQuoteString,
        resetReadCurrencies: resetReadCurrencies,
        resetSettings: resetSettings
    }
};

if (typeof exports === "object") {
    exports.InformationHolder = InformationHolder;
}
