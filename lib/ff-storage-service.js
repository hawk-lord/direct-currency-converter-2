/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const FirefoxStorageServiceProvider = function() {
    "use strict";
    const {storage} = require("sdk/simple-storage");
    const init = (aDefaultEnabled, anExcludedDomains) => {
        console.log("aDefaultEnabled " + aDefaultEnabled);
        console.log("anExcludedDomains " + anExcludedDomains);
        console.log("storage.excludedDomains " + storage.excludedDomains);
        if (!storage.excludedDomains) {
            storage.excludedDomains = anExcludedDomains;
            console.log("storage.excludedDomains " + storage.excludedDomains);
        }
        console.log("storage.dccPrefs " + storage.dccPrefs);
        if (!storage.dccPrefs) {
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
            if (!storage.dccPrefs.customSymbols) {
                storage.dccPrefs.customSymbols = {};
            }
            if (!storage.dccPrefs.subUnitSeparator) {
                storage.dccPrefs.subUnitSeparator = ",";
            }
            if (storage.dccPrefs.enableOnStart === null || storage.dccPrefs.enableOnStart == null) {
                storage.dccPrefs.enableOnStart = true;
            }
            if (!storage.dccPrefs.quoteAdjustmentPercent) {
                storage.dccPrefs.quoteAdjustmentPercent = 0;
            }
            if (storage.dccPrefs.roundAmounts === null || storage.dccPrefs.roundAmounts == null) {
                storage.dccPrefs.roundAmounts = false;
            }
            if (storage.dccPrefs.separatePrice === null || storage.dccPrefs.separatePrice == null) {
                storage.dccPrefs.separatePrice = true;
            }
            if (storage.dccPrefs.showOriginalPrices === null || storage.dccPrefs.showOriginalPrices == null) {
                storage.dccPrefs.showOriginalPrices = true;
            }
            if (storage.dccPrefs.unitAfter === null || storage.dccPrefs.unitAfter == null) {
                storage.dccPrefs.unitAfter = true;
            }
            if (storage.dccPrefs.tempConvertUnits === null || storage.dccPrefs.tempConvertUnits == null) {
                storage.dccPrefs.tempConvertUnits = false;
            }
            if (!storage.dccPrefs.thousandSep) {
                storage.dccPrefs.thousandSep = ".";
            }
            if (!storage.dccPrefs.enabledCurrencies) {
                storage.dccPrefs.enabledCurrencies = aDefaultEnabled;
            }
            else {
                Object.keys(aDefaultEnabled).forEach(
                    function(key, index) {
                        if (!storage.dccPrefs.enabledCurrencies[key]) {
                            storage.dccPrefs.enabledCurrencies[key] = aDefaultEnabled[key];
                        }
                    }
                )
            }
        }
    };
    const resetSettings = () => {
        delete storage.dccPrefs;
        delete storage.excludedDomains;
    };
    return {
        init: init,
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
            if (storage.dccPrefs) {
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
        resetSettings: resetSettings
    };
};

if (typeof exports === "object") {
    exports.FirefoxStorageServiceProvider = FirefoxStorageServiceProvider;
}
