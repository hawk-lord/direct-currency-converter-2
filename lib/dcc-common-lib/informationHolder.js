/*
 * © Per Johansson
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
 * @param aConvertFroms
 * @param aRegionFormats
 * @param _
 * @returns {{conversionEnabled, conversionEnabled, convertToCountry, convertToCountry, convertToCurrency, convertToCurrency, getConversionQuotes: Function, setConversionQuote: Function, getCurrencySymbols: Function, customSymbols, customSymbols, monetarySeparatorSymbol, monetarySeparatorSymbol, excludedDomains, excludedDomains, enabledCurrencies, enabledCurrencies, enableOnStart, enableOnStart, quoteAdjustmentPercent, quoteAdjustmentPercent, roundPrices, roundPrices, currencySpacing, currencySpacing, showOriginalPrices, showOriginalPrices, beforeCurrencySymbol, beforeCurrencySymbol, tempConvertUnits, tempConvertUnits, monetaryGroupingSeparatorSymbol, monetaryGroupingSeparatorSymbol, getCurrencyNames: Function, getConvertFroms: Function, isAllCurrenciesRead: Function, getQuoteString: Function, resetReadCurrencies: Function, resetSettings: Function}}
 * @constructor
 */
const InformationHolder = function(aStorageService, aCurrencyData, aCurrencySymbols, aConvertFroms, aRegionFormats, _) {
    "use strict";
    const conversionQuotes = {
        "inch": 25.4,
        "kcal": 4.184,
        "nmi": 1.852,
        "mile": 1.602,
        "mil": 10,
        "knots": 1.852,
        "hp": 0.73549875
    };
    const findCurrency = function(aCountry) {
        const regions = aCurrencyData.region;
        // TODO Default currency
        let foundCurrency = "GBP";
        const findCurrentCurrency = function(aCurrency){
            if (!aCurrency["@to"]) {
                if (aCurrency["@tender"] !== "false") {
                    foundCurrency = aCurrency["@iso4217"];
                    return true;
                }
            }
        };
        const found = Object.keys(regions).some(function(regionKey) {
            if (aCountry === regions[regionKey]["@iso3166"]) {
                const currencies = regions[regionKey]["currency"];
                if (Array.isArray(currencies)) {
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
    let numberOfReadCurrencies = 0;
    let conversionEnabled = aStorageService.enableOnStart;
    const _currencyNames = {};
    aConvertFroms.forEach(function(aCurrency) {
        _currencyNames[aCurrency.isoName] = _(aCurrency.isoName);
    });
    let quoteStrings = [];

    const getConversionQuotes = function() {
        return conversionQuotes;
    };
    const setConversionQuote = function(aConvertFromCurrencyName, aQuote) {
        conversionQuotes[aConvertFromCurrencyName] = aQuote;
        numberOfReadCurrencies++;
    };
    const getCurrencySymbols = function() {
        return aCurrencySymbols;
    };
    const getCurrencyNames = function () {
        return _currencyNames;
    };
    const getConvertFroms = function () {
        return aConvertFroms;
    };
    const isAllCurrenciesRead = function() {
        return numberOfReadCurrencies >= aConvertFroms.length;
    };
    const makeQuoteString = function(aConvertFromCurrency) {
        if (aConvertFromCurrency.isoName != aStorageService.convertToCurrency) {
            const quote = parseFloat(conversionQuotes[aConvertFromCurrency.isoName]);
            if (isNaN(quote)) {
                const quoteString = "1 " + aConvertFromCurrency.isoName + " = - " + aStorageService.convertToCurrency;
                quoteStrings.push(quoteString);
            }
            else {
                const conversionQuote = quote.toFixed(4);
                const quoteString = "1 " + aConvertFromCurrency.isoName + " = " + conversionQuote.replace(".", aStorageService.monetarySeparatorSymbol) + " " + aStorageService.convertToCurrency;
                quoteStrings.push(quoteString);
            }
        }
    };
    const getQuoteString = function () {
        quoteStrings = [];
        aConvertFroms.forEach(makeQuoteString);
        return quoteStrings.join("; ");
    };
    const resetReadCurrencies = function() {
        numberOfReadCurrencies = 0;
    };
    const resetSettings = function(iso4217Currencies) {
        aStorageService.resetSettings(iso4217Currencies);
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
            const regionFormat = aRegionFormats[aCountry.toLowerCase()];
            if (regionFormat) {
                if (!aStorageService.monetarySeparatorSymbol) {
                    aStorageService.monetarySeparatorSymbol = regionFormat.monetarySeparatorSymbol;
                }
                if ("string" !== typeof aStorageService.currencySpacing) {
                    aStorageService.currencySpacing = regionFormat.currencySpacing;
                }
                if (!aStorageService.monetaryGroupingSeparatorSymbol) {
                    aStorageService.monetaryGroupingSeparatorSymbol = regionFormat.monetaryGroupingSeparatorSymbol;
                }
                if (aStorageService.beforeCurrencySymbol === null || aStorageService.beforeCurrencySymbol == null) {
                    aStorageService.beforeCurrencySymbol = regionFormat.beforeCurrencySymbol;
                }
                if (!aStorageService.convertToCurrency) {
                    aStorageService.convertToCurrency = findCurrency(aCountry);
                }
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
        get convertFroms () {
            return aStorageService.convertFroms;
        },
        set convertFroms (aConvertFroms) {
            aStorageService.convertFroms = aConvertFroms;
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
        get showOriginalCurrencies () {
            return aStorageService.showOriginalCurrencies;
        },
        set showOriginalCurrencies (aShowOriginalCurrencies) {
            aStorageService.showOriginalCurrencies = aShowOriginalCurrencies;
        },
        get showTooltip () {
            return aStorageService.showTooltip;
        },
        set showTooltip (aShowTooltip) {
            aStorageService.showTooltip = aShowTooltip;
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
        get showDccToolsButton () {
            return aStorageService.showDccToolsButton;
        },
        set showDccToolsButton (aShowDccToolsButton) {
            aStorageService.showDccToolsButton = aShowDccToolsButton;
        },
        get showDccConversionButton () {
            return aStorageService.showDccConversionButton;
        },
        set showDccConversionButton (aShowDccConversionButton) {
            aStorageService.showDccConversionButton = aShowDccConversionButton;
        },
        getCurrencyNames: getCurrencyNames,
        getConvertFroms: getConvertFroms,
        isAllCurrenciesRead: isAllCurrenciesRead,
        getQuoteString: getQuoteString,
        resetReadCurrencies: resetReadCurrencies,
        resetSettings: resetSettings
    }
};

if (typeof exports === "object") {
    exports.InformationHolder = InformationHolder;
}
