/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

/**
 *
 * @param aMainLanguage
 * @param aBeforeCurrencySymbol
 * @param aCurrencySpacing
 * @param aMonetarySeparatorSymbol
 * @param aMonetaryGroupingSeparatorSymbol
 * @constructor
 */
const RegionFormat = function(aMainLanguage, aBeforeCurrencySymbol, aCurrencySpacing, aMonetarySeparatorSymbol, aMonetaryGroupingSeparatorSymbol) {
    const mainLanguage = aMainLanguage;
    // true = #,##0.00 ¤
    const beforeCurrencySymbol = aBeforeCurrencySymbol;
    const currencySpacing = aCurrencySpacing;
    const monetarySeparatorSymbol = aMonetarySeparatorSymbol;
    const monetaryGroupingSeparatorSymbol = aMonetaryGroupingSeparatorSymbol;
};

if (typeof exports === "object") {
    exports.RegionFormat = RegionFormat;
}

