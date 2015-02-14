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
    const escapeHtml = function(s) {
        if (s === null || s == null) {
            return "";
        }
        return String(s).replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    jQuery(document).ready(function() {
        jQuery( "#toggleCurrencies" ).click(function() {
            jQuery("fieldset.currencies").toggleClass( "minimised" );
        });
        jQuery("#enabledCurrencies, #disabledCurrencies" ).sortable({
            connectWith: ".connectedSortable"
        }).disableSelection();
        jQuery("#convert_to_currency").change(function() {
            const currencyCountry = jQuery(this).val();
            convertToCurrency = currencyCountry.substr(0, 3);
            // console.log("convertToCurrency : " + convertToCurrency);
            convertToCountry = currencyCountry.substr(-2);
            // console.log("convertToCountry : " + convertToCountry);
            onCurrencyChange(convertToCurrency);
        });
        jQuery("#custom_symbol").change(function() {
            const customSymbol = escapeHtml(jQuery(this).val());
            customSymbols[convertToCurrency] = customSymbol;
            jQuery("#preview_left").html(customSymbol);
            jQuery("#preview_right").html(customSymbol);
        });
        jQuery("#custom_symbol_reset-button").click(function() {
            customSymbols = {};
            onCurrencyChange(convertToCurrency);
        });
        jQuery("#decimal_separator").change(function() {
            subUnitSeparator = escapeHtml(jQuery(this).val());
            jQuery("#preview_decimal").html(subUnitSeparator);
        });
        jQuery("#thousands_separator").change(function() {
            thousandSep = jQuery(this).val();
            jQuery("#preview_thousand").html(thousandSep);
        });

        jQuery("#enable_conversion").change(function() {
            enableOnStart = jQuery(this).is(":checked");
        });
        jQuery("#adjustment_percentage").change(function() {
            quoteAdjustmentPercent = jQuery(this).val();
        });
        jQuery("#always_round").change(function() {
            roundAmounts = jQuery(this).is(":checked");
        });
        jQuery("#separate_price").change(function() {
            separatePrice = jQuery(this).is(":checked");
            onSeparatePriceChange(separatePrice);
        });
        jQuery("#show_original_prices").change(function() {
            showOriginalPrices = jQuery(this).is(":checked");
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
            tempConvertUnits = jQuery(this).is(":checked");
        });
        jQuery("#save-button").click(function() {
            const customSymbol = escapeHtml(jQuery("#custom_symbol").val());
            if (customSymbol !== null && customSymbol !== "") {
                customSymbols[convertToCurrency] = customSymbol;
            }
            const excludedTextAreaString = escapeHtml(jQuery("#excluded_domains").val());
            var excludedLines = excludedTextAreaString.replace(/\r\n/g, "\n").split("\n");
            // remove empty entries
            excludedLines = jQuery.grep(excludedLines, function(n){ return(n); });
            if (excludedLines === null || excludedLines[0] === "") {
                excludedLines = [];
            }
            excludedDomains = excludedLines;
            enabledCurrencies = {};
            var listItems = jQuery("#enabledCurrencies").find("li");
            listItems.each(function () {
                enabledCurrencies[jQuery(this).attr('id')] = true;
            });
            listItems = jQuery("#disabledCurrencies").find("li");
            listItems.each(function() {
                enabledCurrencies[jQuery(this).attr('id')] = false;
            });
            const contentScriptParams = {};
            contentScriptParams.convertToCurrency = escapeHtml(convertToCurrency);
            contentScriptParams.convertToCountry = escapeHtml(convertToCountry);
            contentScriptParams.customSymbols = customSymbols;
            Object.keys(contentScriptParams.customSymbols).forEach(escapeHtml);
            contentScriptParams.subUnitSeparator = escapeHtml(subUnitSeparator);
            contentScriptParams.enableOnStart = enableOnStart;
            contentScriptParams.excludedDomains = excludedDomains;
            Object.keys(contentScriptParams.excludedDomains).forEach(escapeHtml);
            contentScriptParams.enabledCurrencies = enabledCurrencies;
            Object.keys(contentScriptParams.enabledCurrencies).forEach(escapeHtml);
            contentScriptParams.quoteAdjustmentPercent = escapeHtml(quoteAdjustmentPercent);
            contentScriptParams.roundAmounts = roundAmounts;
            contentScriptParams.separatePrice = separatePrice;
            contentScriptParams.showOriginalPrices = showOriginalPrices;
            contentScriptParams.unitAfter = unitAfter;
            contentScriptParams.tempConvertUnits = tempConvertUnits;
            contentScriptParams.thousandSep = thousandSep;
            SettingsAdapter.save(contentScriptParams);
        });
        jQuery("#reset-button").click(function() {
            SettingsAdapter.reset();
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
    var currencyNames = {};
    const setUIFromPreferences = function() {
        jQuery("#convert_to_currency").val(convertToCurrency + "_" + convertToCountry);
        onCurrencyChange(convertToCurrency);
        jQuery("#custom_symbol").val(escapeHtml(customSymbols[convertToCurrency]));
        jQuery("#decimal_separator").val(subUnitSeparator);
        jQuery("#thousands_separator").val(thousandSep);
        jQuery("#preview_decimal").html(subUnitSeparator);
        jQuery("#enable_conversion").prop("checked", enableOnStart);
        const excludedText = excludedDomains.join("\n").replace(/\n/g, "\r\n");
        jQuery("#excluded_domains").val(excludedText);
        for (var currency in enabledCurrencies) {
            if (enabledCurrencies[currency]) {
                jQuery("#enabledCurrencies").append(jQuery(document.createElement("li")).attr({
                        id: currency
                }).append(currencyNames[currency]));
            }
            else {
                jQuery("#disabledCurrencies").append(jQuery(document.createElement("li")).attr({
                        id: currency
                }).append(currencyNames[currency]));
            }
        }
        jQuery("#adjustment_percentage").val(quoteAdjustmentPercent);
        jQuery("#always_round").prop("checked", roundAmounts);
        onSeparatePriceChange(separatePrice);
        jQuery("#show_original_prices").prop("checked", showOriginalPrices);
        // console.log("unitAfter " + unitAfter);
        jQuery("#unitAfter").prop("checked", unitAfter);
        jQuery("#unitBefore").prop("checked", !unitAfter);
        onUnitAfterChange(unitAfter);
        jQuery("#separate_price").prop("checked", separatePrice);
        jQuery("#temp_convert_units").prop("checked", tempConvertUnits);
        jQuery("#preview_thousand").html(thousandSep);
        const selectedOption = jQuery('#convert_to_currency').val();
        const selectList = jQuery("#convert_to_currency").find("option");
        selectList.sort(function(a,b){
            const A = jQuery(a).text().toLowerCase();
            const B = jQuery(b).text().toLowerCase();
            if (A < B){
                return -1;
            }
            else if (A > B){
                return 1;
            }
            else{
                return 0;
            }
        });
        jQuery("#convert_to_currency").html(selectList);
        jQuery('#convert_to_currency').val(selectedOption);
    };
    const onCurrencyChange = function(val) {
        var currencyVal = escapeHtml(val);
        jQuery("#custom_symbol").val(customSymbols[currencyVal]);
        const allCurrencySymbols = jQuery.extend({}, currencySymbols, customSymbols);
        if (currencyVal in allCurrencySymbols) {
            currencyVal = allCurrencySymbols[currencyVal];
        }
        jQuery("#preview_left").html(currencyVal);
        jQuery("#preview_right").html(currencyVal);
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
        // console.log("onUnitAfterChange ".concat(unitAfter));
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
        convertToCurrency = escapeHtml(contentScriptParams.convertToCurrency);
        convertToCountry = escapeHtml(contentScriptParams.convertToCountry);
        currencySymbols = contentScriptParams.currencySymbols;
        Object.keys(currencySymbols).forEach(escapeHtml);
        customSymbols = contentScriptParams.customSymbols;
        Object.keys(customSymbols).forEach(escapeHtml);
        subUnitSeparator = escapeHtml(contentScriptParams.subUnitSeparator);
        enableOnStart = contentScriptParams.enableOnStart;
        excludedDomains = contentScriptParams.excludedDomains;
        excludedDomains.map(escapeHtml);
        enabledCurrencies = contentScriptParams.enabledCurrencies;
        Object.keys(enabledCurrencies).forEach(escapeHtml);
        quoteAdjustmentPercent = escapeHtml(contentScriptParams.quoteAdjustmentPercent);
        roundAmounts = contentScriptParams.roundAmounts;
        separatePrice = contentScriptParams.separatePrice;
        showOriginalPrices = contentScriptParams.showOriginalPrices;
        unitAfter = contentScriptParams.unitAfter;
        tempConvertUnits = contentScriptParams.tempConvertUnits;
        thousandSep = contentScriptParams.thousandSep;
        currencyNames = contentScriptParams.currencyNames;
        setUIFromPreferences();
    };
    return {
        showSettings : showSettings
    };
})();
