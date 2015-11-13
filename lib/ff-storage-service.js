/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const FirefoxStorageServiceProvider = function(aRequired) {
    "use strict";
    const storage = aRequired;
    const init = (aConvertFroms, anExcludedDomains) => {
        if (!storage.excludedDomains) {
            storage.excludedDomains = anExcludedDomains;
        }
        if (!storage.dccPrefs) {
            storage.dccPrefs = {
                customSymbols: {},
                enableOnStart: true,
                quoteAdjustmentPercent: 0,
                roundAmounts: false,
                showOriginalPrices: false,
                showOriginalCurrencies: false,
                showTooltip: true,
                beforeCurrencySymbol: true,
                currencySpacing: " ",
                monetarySeparatorSymbol: ",",
                monetaryGroupingSeparatorSymbol: ".",
                tempConvertUnits: false,
                convertFroms: aConvertFroms,
                showDccToolsButton: true,
                showDccConversionButton: true
            };
        }
        else {
            if (!storage.dccPrefs.customSymbols) {
                storage.dccPrefs.customSymbols = {};
            }
            if (!storage.dccPrefs.monetarySeparatorSymbol) {
                storage.dccPrefs.monetarySeparatorSymbol = ",";
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
            // Apparently storage empty string is "!"
            if ("string" !== typeof storage.dccPrefs.currencySpacing) {
                storage.dccPrefs.currencySpacing = " ";
            }
            if (storage.dccPrefs.showOriginalPrices === null || storage.dccPrefs.showOriginalPrices == null) {
                storage.dccPrefs.showOriginalPrices = false;
            }
            if (storage.dccPrefs.showOriginalCurrencies === null || storage.dccPrefs.showOriginalCurrencies == null) {
                storage.dccPrefs.showOriginalCurrencies = false;
            }
            if (storage.dccPrefs.showTooltip === null || storage.dccPrefs.showTooltip == null) {
                storage.dccPrefs.showTooltip = true;
            }
            if (storage.dccPrefs.beforeCurrencySymbol === null || storage.dccPrefs.beforeCurrencySymbol == null) {
                storage.dccPrefs.beforeCurrencySymbol = true;
            }
            if (storage.dccPrefs.tempConvertUnits === null || storage.dccPrefs.tempConvertUnits == null) {
                storage.dccPrefs.tempConvertUnits = false;
            }
            if (storage.dccPrefs.showDccToolsButton === null || storage.dccPrefs.showDccToolsButton == null) {
                storage.dccPrefs.showDccToolsButton = true;
            }
            if (storage.dccPrefs.showDccConversionButton === null || storage.dccPrefs.showDccConversionButton == null) {
                storage.dccPrefs.showDccConversionButton = true;
            }
            if (!storage.dccPrefs.monetaryGroupingSeparatorSymbol) {
                storage.dccPrefs.monetaryGroupingSeparatorSymbol = ".";
            }
            if (!storage.dccPrefs.convertFroms) {
                storage.dccPrefs.convertFroms = aConvertFroms;
            }
            else {
                for (var currency of aConvertFroms) {
                    var found = false;
                    for (var storedCurrency of storage.dccPrefs.convertFroms) {
                        if (currency.isoName === storedCurrency.isoName) {
                            found = true;
                            break;
                        }
                    }
                    if (!found){
                        storage.dccPrefs.convertFroms.push(currency);
                    }
                }
            }
            storage.dccPrefs.enabledCurrencies = null;
        }
    };
    const resetSettings = (aConvertFroms) => {
        storage.dccPrefs = {
            convertToCurrency: null,
            convertToCountry: null,
            customSymbols: {},
            enableOnStart: true,
            quoteAdjustmentPercent: 0,
            roundAmounts: false,
            showOriginalPrices: false,
            showOriginalCurrencies: false,
            showTooltip: true,
            beforeCurrencySymbol: true,
            currencySpacing: " ",
            monetarySeparatorSymbol: ",",
            monetaryGroupingSeparatorSymbol: ".",
            tempConvertUnits: false,
            convertFroms: aConvertFroms
        };
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
        get monetarySeparatorSymbol () {
            return storage.dccPrefs.monetarySeparatorSymbol;
        },
        set monetarySeparatorSymbol (aMonetarySeparatorSymbol) {
            storage.dccPrefs.monetarySeparatorSymbol = aMonetarySeparatorSymbol;
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
        get convertFroms () {
            return storage.dccPrefs.convertFroms;
        },
        set convertFroms (anEnabledCurrencies) {
            storage.dccPrefs.convertFroms = anEnabledCurrencies;
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
        get currencySpacing () {
            return storage.dccPrefs.currencySpacing;
        },
        set currencySpacing (aCurrencySpacing) {
            storage.dccPrefs.currencySpacing = aCurrencySpacing;
        },
        get showOriginalPrices () {
            return storage.dccPrefs.showOriginalPrices;
        },
        set showOriginalPrices (aShowOriginalPrices) {
            storage.dccPrefs.showOriginalPrices = aShowOriginalPrices;
        },
        get showOriginalCurrencies () {
            return storage.dccPrefs.showOriginalCurrencies;
        },
        set showOriginalCurrencies (aShowOriginalCurrencies) {
            storage.dccPrefs.showOriginalCurrencies = aShowOriginalCurrencies;
        },
        get showTooltip () {
            return storage.dccPrefs.showTooltip;
        },
        set showTooltip (aShowTooltip) {
            storage.dccPrefs.showTooltip = aShowTooltip;
        },
        get beforeCurrencySymbol () {
            return storage.dccPrefs.beforeCurrencySymbol;
        },
        set beforeCurrencySymbol (aBeforeCurrencySymbol) {
            storage.dccPrefs.beforeCurrencySymbol = aBeforeCurrencySymbol;
        },
        get monetaryGroupingSeparatorSymbol () {
            return storage.dccPrefs.monetaryGroupingSeparatorSymbol;
        },
        set monetaryGroupingSeparatorSymbol (aMonetaryGroupingSeparatorSymbol) {
            storage.dccPrefs.monetaryGroupingSeparatorSymbol = aMonetaryGroupingSeparatorSymbol;
        },
        get tempConvertUnits () {
            return storage.dccPrefs.tempConvertUnits;
        },
        set tempConvertUnits (aTempConvertUnits) {
            storage.dccPrefs.tempConvertUnits = aTempConvertUnits;
        },
        setEnabledCurrency(aCurrency, anEnabled) {
            var found = false;
            for (var storedCurrency of storage.dccPrefs.convertFroms) {
                if (aCurrency.isoName === storedCurrency.isoName) {
                    found = true;
                    aCurrency.enabled = anEnabled;
                    break;
                }
            }
            if (!found){
                storage.dccPrefs.convertFroms.push({isoName: currency, enabled: anEnabled});
            }
        },
        get showDccToolsButton () {
            return storage.dccPrefs.showDccToolsButton;
        },
        set showDccToolsButton (aShowDccToolsButton) {
            storage.dccPrefs.showDccToolsButton = aShowDccToolsButton;
        },
        get showDccConversionButton () {
            return storage.dccPrefs.showDccConversionButton;
        },
        set showDccConversionButton (aShowDccConversionButton) {
            storage.dccPrefs.showDccConversionButton = aShowDccConversionButton;
        },
        resetSettings: resetSettings
    };
};

if (typeof exports === "object") {
    exports.FirefoxStorageServiceProvider = FirefoxStorageServiceProvider;
}
