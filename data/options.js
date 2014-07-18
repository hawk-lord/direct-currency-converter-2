/*
 * © 2014 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Based on code from Simple Currency Converter
 * https://addons.mozilla.org/en-US/firefox/addon/simple-currency-converter/
 *
 * Module pattern is used.
 */
const DirectCurrencySettings = (function() {
    "use strict";
    jQuery(document).ready(function() {
        jQuery("#enabledCurrencies, #disabledCurrencies" ).sortable({
            connectWith: ".connectedSortable"
        }).disableSelection();
        jQuery("#convert_to_currency").change(function() {
            const currencyCountry = jQuery(this).val();
            convertToCurrency = currencyCountry.substr(0, 3);
            console.log("convertToCurrency : " + convertToCurrency);
            convertToCountry = currencyCountry.substr(-2);
            console.log("convertToCountry : " + convertToCountry);
            onCurrencyChange(convertToCurrency);
        });
        jQuery("#custom_symbol").change(function() {
            customSymbols[convertToCurrency] = jQuery(this).val();
            jQuery("#preview_left").html(jQuery(this).val());
            jQuery("#preview_right").html(jQuery(this).val());
        });
        jQuery("#custom_symbol_reset-button").click(function() {
            customSymbols = {};
            onCurrencyChange(convertToCurrency);
        });
        jQuery("#decimal_separator").change(function() {
            subUnitSeparator = jQuery(this).val();
            jQuery("#preview_decimal").html(subUnitSeparator);
        });
        jQuery("#enable_conversion").change(function() {
            const val = jQuery(this).is(":checked");
            enableOnStart = val;
        });
        jQuery("#adjustment_percentage").change(function() {
            quoteAdjustmentPercent = jQuery(this).val();
        });
        jQuery("#always_round").change(function() {
            const val = jQuery(this).is(":checked");
            roundAmounts = val;
        });
        jQuery("#separate_price").change(function() {
            separatePrice = jQuery(this).is(":checked");
            onSeparatePriceChange(separatePrice);
        });
        jQuery("#show_original_prices").change(function() {
            const val = jQuery(this).is(":checked");
            showOriginalPrices = val;
        });
        jQuery("#unitAfter").change(function() {
            unitAfter = jQuery(this).is(":checked");
            onUnitAfterChange(unitAfter);
        });
        jQuery("#unitBefore").change(function() {
            unitAfter = !jQuery(this).is(":checked");
            onUnitAfterChange(unitAfter);
        });
        jQuery("#temp_convert_units").change(function() {
            const val = jQuery(this).is(":checked");
            tempConvertUnits = val;
        });
        jQuery("#thousands_separator").change(function() {
            thousandSep = jQuery(this).val();
            jQuery("#preview_thousand").html(thousandSep);
        });
        jQuery("#save-button").click(function() {
            const customSymbol = jQuery("#custom_symbol").val();
            if (customSymbol !== null && customSymbol !== "") {
                customSymbols[convertToCurrency] = customSymbol;
            }
            const excludedTextAreaString = jQuery("#excluded_domains").val();
            var excludedLines = excludedTextAreaString.replace(/\r\n/g, "\n").split("\n");
            // remove empty entries
            excludedLines = jQuery.grep(excludedLines, function(n){ return(n); });
            if (excludedLines === null || excludedLines[0] === "") {
                excludedLines = [];
            }
            excludedDomains = excludedLines;
            enabledCurrencies = {};
            var listItems = jQuery("#enabledCurrencies li");
            listItems.each(function(index, element) {
                enabledCurrencies[jQuery(this).text()] = true;
            });
            listItems = jQuery("#disabledCurrencies li");
            listItems.each(function(index, element) {
                enabledCurrencies[jQuery(this).text()] = false;
            });
            const contentScriptParams = {};
            contentScriptParams.convertToCurrency = convertToCurrency;
            contentScriptParams.convertToCountry = convertToCountry;
            contentScriptParams.customSymbols = customSymbols;
            contentScriptParams.subUnitSeparator = subUnitSeparator;
            contentScriptParams.enableOnStart = enableOnStart;
            contentScriptParams.excludedDomains = excludedDomains;
            contentScriptParams.enabledCurrencies = enabledCurrencies;
            contentScriptParams.quoteAdjustmentPercent = quoteAdjustmentPercent;
            contentScriptParams.roundAmounts = roundAmounts;
            contentScriptParams.separatePrice = separatePrice;
            contentScriptParams.showOriginalPrices = showOriginalPrices;
            contentScriptParams.unitAfter = unitAfter;
            contentScriptParams.tempConvertUnits = tempConvertUnits;
            contentScriptParams.thousandSep = thousandSep;
            self.port.emit("saveSettings", contentScriptParams);
        });
        jQuery("#reset-button").click(function() {
            self.port.emit("resetSettings");
        });
    });
    var convertToCurrency = null;
    var convertToCountry = null;
    var currencySymbols = {};
    var customSymbols = {};
    var subUnitSeparator = null;
    var enableOnStart = null;
    var excludedDomains = [];
    var enabledCurrencies = {};
    var quoteAdjustmentPercent = null;
    var roundAmounts = null;
    var separatePrice = null;
    var showOriginalPrices = null;
    var unitAfter = true;
    var tempConvertUnits = null;
    var thousandSep = null;
    const setUIFromPreferences = function() {
        jQuery("#convert_to_currency").val(convertToCurrency + "_" + convertToCountry);
        onCurrencyChange(convertToCurrency);
        jQuery("#custom_symbol").val(customSymbols[convertToCurrency]);
        jQuery("#decimal_separator").val(subUnitSeparator);
        jQuery("#preview_decimal").html(subUnitSeparator);
        jQuery("#enable_conversion").prop("checked", enableOnStart);
        const excludedText = excludedDomains.join("\n").replace(/\n/g, "\r\n");
        jQuery("#excluded_domains").val(excludedText);
        for (var currency in enabledCurrencies) {
            if (enabledCurrencies[currency]) {
                jQuery("#enabledCurrencies").append(jQuery(document.createElement("li")).attr({
                        id: currency
                }).append(currency));
            }
            else {
                jQuery("#disabledCurrencies").append(jQuery(document.createElement("li")).attr({
                        id: currency
                }).append(currency));
            }
        }
        jQuery("#adjustment_percentage").val(quoteAdjustmentPercent);
        jQuery("#always_round").prop("checked", roundAmounts);
        jQuery("#separate_price").prop("checked", separatePrice);
        onSeparatePriceChange(separatePrice);
        jQuery("#show_original_prices").prop("checked", showOriginalPrices);
        console.log("unitAfter " + unitAfter);
        jQuery("#unitAfter").prop("checked", unitAfter);
        jQuery("#unitBefore").prop("checked", !unitAfter);
        onUnitAfterChange(unitAfter);
        jQuery("#separate_price").prop("checked", separatePrice);
        jQuery("#temp_convert_units").prop("checked", tempConvertUnits);
        jQuery("#preview_thousand").html(thousandSep);
    };
    const onCurrencyChange = function(val) {
        jQuery("#custom_symbol").val(customSymbols[val]);
        const allCurrencySymbols = jQuery.extend({}, currencySymbols, customSymbols);
        if (val in allCurrencySymbols) {
            val = allCurrencySymbols[val];
        }
        jQuery("#preview_left").html(val);
        jQuery("#preview_right").html(val);
    };
    const onSeparatePriceChange = function(val) {
        if (val) {
            if (unitAfter) {
                jQuery("#preview_right_space").html(" ");
                jQuery("#preview_left_space").html("");
            }
            else {
                jQuery("#preview_left_space").html(" ");
                jQuery("#preview_right_space").html("");
            }
        }
        else {
            jQuery("#preview_left_space").html("");
            jQuery("#preview_right_space").html("");
        }
    };
    const onUnitAfterChange = function(unitAfter) {
        console.log("onUnitAfterChange ".concat(unitAfter));
        if (unitAfter) {
            jQuery("#preview_left").hide();
            jQuery("#preview_right").show();
            jQuery("#preview_left_space").html("");
            if (jQuery("#separate_price").is(":checked")) {
                jQuery("#preview_right_space").html(" ");
            }
            else {
                jQuery("#preview_right_space").html("");
            }
        }
        else {
            jQuery("#preview_left").show();
            jQuery("#preview_right").hide();
            jQuery("#preview_right_space").html("");
            if (jQuery("#separate_price").is(":checked")) {
                jQuery("#preview_left_space").html(" ");
            }
            else {
                jQuery("#preview_left_space").html("");
            }
        }
    };
    const showSettings = function(contentScriptParams) {
        convertToCurrency = contentScriptParams.convertToCurrency;
        convertToCountry = contentScriptParams.convertToCountry;
        currencySymbols = contentScriptParams.currencySymbols;
        customSymbols = contentScriptParams.customSymbols;
        subUnitSeparator = contentScriptParams.subUnitSeparator;
        enableOnStart = contentScriptParams.enableOnStart;
        excludedDomains = contentScriptParams.excludedDomains;
        enabledCurrencies = contentScriptParams.enabledCurrencies;
        quoteAdjustmentPercent = contentScriptParams.quoteAdjustmentPercent;
        roundAmounts = contentScriptParams.roundAmounts;
        separatePrice = contentScriptParams.separatePrice;
        showOriginalPrices = contentScriptParams.showOriginalPrices;
        unitAfter = contentScriptParams.unitAfter;
        tempConvertUnits = contentScriptParams.tempConvertUnits;
        thousandSep = contentScriptParams.thousandSep;
        setUIFromPreferences();
    };
    return {
        showSettings : showSettings
    };
})();
//
self.port.on("showSettings", DirectCurrencySettings.showSettings);
