/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

/**
 *
 * @param aContentScriptParams
 * @param anInformationHolder
 * @constructor
 */
const ParseContentScriptParams = function(aContentScriptParams, anInformationHolder) {
    "use strict";
    anInformationHolder.convertToCurrency = aContentScriptParams.convertToCurrency;
    anInformationHolder.convertToCountry = aContentScriptParams.convertToCountry;
    anInformationHolder.customSymbols = aContentScriptParams.customSymbols;
    anInformationHolder.monetarySeparatorSymbol = aContentScriptParams.monetarySeparatorSymbol;
    anInformationHolder.enableOnStart = aContentScriptParams.enableOnStart;
    anInformationHolder.excludedDomains = aContentScriptParams.excludedDomains;
    anInformationHolder.convertFroms = aContentScriptParams.convertFroms;
    anInformationHolder.quoteAdjustmentPercent = aContentScriptParams.quoteAdjustmentPercent;
    anInformationHolder.roundPrices = aContentScriptParams.roundAmounts;
    anInformationHolder.currencySpacing = aContentScriptParams.currencySpacing;
    anInformationHolder.showOriginalPrices = aContentScriptParams.showOriginalPrices;
    anInformationHolder.showOriginalCurrencies = aContentScriptParams.showOriginalCurrencies;
    anInformationHolder.showTooltip = aContentScriptParams.showTooltip;
    anInformationHolder.beforeCurrencySymbol = aContentScriptParams.beforeCurrencySymbol;
    anInformationHolder.tempConvertUnits = aContentScriptParams.tempConvertUnits;
    anInformationHolder.monetaryGroupingSeparatorSymbol = aContentScriptParams.monetaryGroupingSeparatorSymbol;
};

if (typeof exports === "object") {
    exports.ParseContentScriptParams = ParseContentScriptParams;
}
