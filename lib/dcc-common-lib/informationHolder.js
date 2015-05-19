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
 * @param aCurrencySymbols
 * @param anIso4217Currencies
 * @param aRegionFormats
 * @param _
 * @returns {{conversionEnabled, conversionEnabled, convertToCountry, convertToCountry, convertToCurrency, convertToCurrency, getConversionQuotes: Function, setConversionQuote: Function, getCurrencySymbols: Function, customSymbols, customSymbols, monetarySeparatorSymbol, monetarySeparatorSymbol, excludedDomains, excludedDomains, enabledCurrencies, enabledCurrencies, enableOnStart, enableOnStart, quoteAdjustmentPercent, quoteAdjustmentPercent, roundPrices, roundPrices, currencySpacing, currencySpacing, showOriginalPrices, showOriginalPrices, beforeCurrencySymbol, beforeCurrencySymbol, tempConvertUnits, tempConvertUnits, monetaryGroupingSeparatorSymbol, monetaryGroupingSeparatorSymbol, getCurrencyNames: Function, getFromCurrencies: Function, isAllCurrenciesRead: Function, getQuoteString: Function, resetReadCurrencies: Function, resetSettings: Function}}
 * @constructor
 */
const InformationHolder = function(aStorageService, aCurrencyData, aCurrencySymbols, anIso4217Currencies, aRegionFormats, _) {
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
     * Domains that should not be converted.
     * TODO use in PageMod instead
     * @type {string[]}
     * @private
     */
    const _excludedDomains = ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com"];
    const defaultEnabledCurrencies = {"SEK":true, "CHF":true, "DKK":true, "EUR":true, "GBP":true, "ISK":true, "JPY":true, "NOK":true, "RUB":true, "USD":true};
    aStorageService.init(defaultEnabledCurrencies, _excludedDomains);
    var conversionEnabled = aStorageService.enableOnStart;
    const _currencyNames = {};
    anIso4217Currencies.forEach(function(aCurrency) {
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
        return aCurrencySymbols;
    };
    const getCurrencyNames = function () {
        return _currencyNames;
    };
    const getFromCurrencies = function () {
        return anIso4217Currencies;
    };
    const isAllCurrenciesRead = function() {
        return numberOfReadCurrencies >= anIso4217Currencies.length;
    };
    const makeQuoteString = function(aConvertFromCurrency) {
        const quote = conversionQuotes[aConvertFromCurrency];
        const conversionQuote = (parseFloat(quote)).toFixed(4);
        if (aConvertFromCurrency != aStorageService.convertToCurrency) {
            const quoteString = "1 " + aConvertFromCurrency + " = " + conversionQuote.replace(".", aStorageService.monetarySeparatorSymbol) + " " + aStorageService.convertToCurrency;
            quoteStrings.push(quoteString);
        }
    };
    const getQuoteString = function () {
        quoteStrings = [];
        anIso4217Currencies.forEach(makeQuoteString);
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
            //const {RegionFormat} = require("./RegionFormat");
            const regionFormat = aRegionFormats[aCountry.toLowerCase()];
            aStorageService.monetarySeparatorSymbol = regionFormat.monetarySeparatorSymbol;
            aStorageService.currencySpacing = regionFormat.currencySpacing;
            aStorageService.monetaryGroupingSeparatorSymbol = regionFormat.monetaryGroupingSeparatorSymbol;
            aStorageService.beforeCurrencySymbol = regionFormat.beforeCurrencySymbol;
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
        get monetarySeparatorSymbol () {
            return aStorageService.monetarySeparatorSymbol;
        },
        set monetarySeparatorSymbol (aMonetarySeparatorSymbol) {
            aStorageService.monetarySeparatorSymbol = aMonetarySeparatorSymbol;
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
        get currencySpacing () {
            return aStorageService.currencySpacing;
        },
        set currencySpacing (aCurrencySpacing) {
            aStorageService.currencySpacing = aCurrencySpacing;
        },
        get showOriginalPrices () {
            return aStorageService.showOriginalPrices;
        },
        set showOriginalPrices (aShowOriginalPrices) {
            aStorageService.showOriginalPrices = aShowOriginalPrices;
        },
        get beforeCurrencySymbol () {
            return aStorageService.beforeCurrencySymbol;
        },
        set beforeCurrencySymbol (aBeforeCurrencySymbol) {
            aStorageService.beforeCurrencySymbol = aBeforeCurrencySymbol;
        },
        get tempConvertUnits () {
            return aStorageService.tempConvertUnits;
        },
        set tempConvertUnits (aTempConvertUnits) {
            aStorageService.tempConvertUnits = aTempConvertUnits;
        },
        get monetaryGroupingSeparatorSymbol () {
            return aStorageService.monetaryGroupingSeparatorSymbol;
        },
        set monetaryGroupingSeparatorSymbol (aMonetaryGroupingSeparatorSymbol) {
            aStorageService.monetaryGroupingSeparatorSymbol = aMonetaryGroupingSeparatorSymbol;
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
