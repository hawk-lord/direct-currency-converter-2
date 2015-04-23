/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

const RegionFormat = function(aMainLanguage, aBeforeCurrencySymbol, aCurrencySpacing, aMonetarySeparatorSymbol, aMonetaryGroupingSeparatorSymbol) {
    const mainLanguage = aMainLanguage;
    // true = #,##0.00 ¤
    const beforeCurrencySymbol = aBeforeCurrencySymbol;
    const currencySpacing = aCurrencySpacing;
    const monetarySeparatorSymbol = aMonetarySeparatorSymbol;
    const monetaryGroupingSeparatorSymbol = aMonetaryGroupingSeparatorSymbol;
};
const regionFormats = {};
//regionFormats["all others"] = new RegionFormat("", false, " ", ".", ",");
regionFormats["af"] = new RegionFormat("fa", false, "", ".", ",");
regionFormats["ax"] = new RegionFormat("sv", true, " ", ",", " ");
regionFormats["al"] = new RegionFormat("sq", true, " ", ",", " ");
regionFormats["dz"] = new RegionFormat("ar", false, " ", ",", ".");
regionFormats["as"] = new RegionFormat("sm", false, " ", ".", ",");
regionFormats["ad"] = new RegionFormat("ca", true, " ", ",", ".");
regionFormats["ao"] = new RegionFormat("pt", false, "", ",", ".");
regionFormats["ai"] = new RegionFormat("en", false, "", ".", ",");
regionFormats["aq"] = new RegionFormat("", false, " ", ".", ",");
regionFormats["ag"] = new RegionFormat("en", false, "", ".", ",");
regionFormats["ar"] = new RegionFormat("es", true, " ", ",", ".");
regionFormats["am"] = new RegionFormat("hy", true, " ", ",", ".");
regionFormats["aw"] = new RegionFormat("nl", false, " ", ",", ".");
regionFormats["ac"] = new RegionFormat("en", false, "", ".", ",");
regionFormats["au"] = new RegionFormat("en", false, "", ".", ",");
regionFormats["at"] = new RegionFormat("de", false, " ", ",", ".");
regionFormats["az"] = new RegionFormat("az", false, " ", ",", ".");
//    regionFormats[""] = new RegionFormat("", , "", "", "");
