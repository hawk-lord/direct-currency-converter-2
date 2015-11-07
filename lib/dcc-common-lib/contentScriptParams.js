/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const ContentScriptParams = function(aTab, anInformationHolder) {
    "use strict";
    this.conversionQuotes = anInformationHolder.getConversionQuotes();
    this.convertToCurrency = anInformationHolder.convertToCurrency;
    this.convertToCountry = anInformationHolder.convertToCountry;
    this.currencySymbols = anInformationHolder.getCurrencySymbols();
    this.customSymbols = anInformationHolder.customSymbols;
    this.monetarySeparatorSymbol = anInformationHolder.monetarySeparatorSymbol;
    this.enableOnStart = anInformationHolder.enableOnStart;
    this.excludedDomains = anInformationHolder.excludedDomains;
    this.convertFroms = anInformationHolder.convertFroms;
    this.quoteAdjustmentPercent = anInformationHolder.quoteAdjustmentPercent;
    this.roundAmounts = anInformationHolder.roundPrices;
    this.currencySpacing = anInformationHolder.currencySpacing;
    this.showOriginalPrices = anInformationHolder.showOriginalPrices;
    this.showOriginalCurrencies = anInformationHolder.showOriginalCurrencies;
    this.showTooltip = anInformationHolder.showTooltip;
    this.beforeCurrencySymbol = anInformationHolder.beforeCurrencySymbol;
    this.tempConvertUnits = anInformationHolder.tempConvertUnits;
    this.monetaryGroupingSeparatorSymbol = anInformationHolder.monetaryGroupingSeparatorSymbol;
    if (aTab && typeof aTab.isEnabled != "undefined")  {
        this.isEnabled = aTab.isEnabled;
    }
    else {
        this.isEnabled = anInformationHolder.conversionEnabled;
    }
    this.currencyNames = anInformationHolder.getCurrencyNames();
};

if (typeof exports === "object") {
    exports.ContentScriptParams = ContentScriptParams;
}
