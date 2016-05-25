/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Based on code from Simple Currency Converter
 * https://addons.mozilla.org/addon/simple-currency-converter/
 *
 * Module pattern is used.
 */
if (!this.DirectCurrencySettings) {
    const DirectCurrencySettings = (function() {
        "use strict";
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
            jQuery("#fromCurrencies").sortable({
                revert: true
            });
    // Why was this used?        jQuery("ol, li").disableSelection();
            jQuery("#convert_to_currency").change(function() {
                const currencyCountry = jQuery(this).val();
                convertToCurrency = currencyCountry.substr(0, 3);
                convertToCountry = currencyCountry.substr(-2);
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
            jQuery("#monetary_separator_symbol").change(function() {
                monetarySeparatorSymbol = escapeHtml(jQuery(this).val());
                jQuery("#preview_monetary_separator_symbol").html(monetarySeparatorSymbol);
            });
            jQuery("#monetary_grouping_separator_symbol").change(function() {
                monetaryGroupingSeparatorSymbol = jQuery(this).val();
                jQuery("#preview_monetary_grouping_separator_symbol").html(monetaryGroupingSeparatorSymbol);
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
            jQuery("#currency_spacing").change(function() {
                currencySpacing = jQuery(this).is(":checked");
                onCurrencySpacingChange(currencySpacing);
            });
            jQuery("#show_original_prices").change(function() {
                showOriginalPrices = jQuery(this).is(":checked");
            });
            jQuery("#showOriginalCurrencies").change(function() {
                showOriginalCurrencies = jQuery(this).is(":checked");
            });
            jQuery("#showTooltip").change(function() {
                showTooltip = jQuery(this).is(":checked");
            });
            jQuery("#beforeCurrencySymbol").change(function() {
                beforeCurrencySymbol = jQuery(this).is(":checked");
                onBeforeCurrencySymbolChange(beforeCurrencySymbol);
            });
            jQuery("#unitBefore").change(function() {
                beforeCurrencySymbol = !jQuery(this).is(":checked");
                onBeforeCurrencySymbolChange(beforeCurrencySymbol);
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
                convertFroms = [];
                const liFromCurrencies = jQuery("#fromCurrencies").find("li");
                liFromCurrencies.each(function () {
                    var inputs = jQuery(this).find("input");
                    var input = jQuery(inputs)[0];
                    if (input && input.checked) {
                        convertFroms.push({"isoName": jQuery(this).attr("id"), "enabled": true});
                    }
                    else {
                        convertFroms.push({"isoName": jQuery(this).attr("id"), "enabled": false});
                    }
                });
                const contentScriptParams = {};
                contentScriptParams.convertToCurrency = escapeHtml(convertToCurrency);
                contentScriptParams.convertToCountry = escapeHtml(convertToCountry);
                contentScriptParams.customSymbols = customSymbols;
                Object.keys(contentScriptParams.customSymbols).forEach(escapeHtml);
                contentScriptParams.monetarySeparatorSymbol = escapeHtml(monetarySeparatorSymbol);
                contentScriptParams.enableOnStart = enableOnStart;
                contentScriptParams.excludedDomains = excludedDomains;
                Object.keys(contentScriptParams.excludedDomains).forEach(escapeHtml);
                contentScriptParams.convertFroms = convertFroms;
                //Object.keys(contentScriptParams.convertFroms).forEach(escapeHtml);
                contentScriptParams.quoteAdjustmentPercent = escapeHtml(quoteAdjustmentPercent);
                contentScriptParams.roundAmounts = roundAmounts;
                contentScriptParams.currencySpacing = currencySpacing? "\u00a0" : "";
                contentScriptParams.showOriginalPrices = showOriginalPrices;
                contentScriptParams.showOriginalCurrencies = showOriginalCurrencies;
                contentScriptParams.showTooltip = showTooltip;
                contentScriptParams.beforeCurrencySymbol = beforeCurrencySymbol;
                contentScriptParams.tempConvertUnits = tempConvertUnits;
                contentScriptParams.monetaryGroupingSeparatorSymbol = monetaryGroupingSeparatorSymbol;
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
        var monetarySeparatorSymbol = null;
        var enableOnStart = null;
        var excludedDomains = [];
        var convertFroms = [];
        var quoteAdjustmentPercent = null;
        var roundAmounts = null;
        var currencySpacing = null;
        var showOriginalPrices = null;
        var showOriginalCurrencies = null;
        var showTooltip = null;
        var beforeCurrencySymbol = true;
        var tempConvertUnits = null;
        var monetaryGroupingSeparatorSymbol = null;
        var currencyNames = {};
        const setUIFromPreferences = function() {
            jQuery("#convert_to_currency").val(convertToCurrency + "_" + convertToCountry);
            onCurrencyChange(convertToCurrency);
            if (customSymbols[convertToCurrency]) {
                jQuery("#custom_symbol").val(escapeHtml(customSymbols[convertToCurrency]));
            }
            jQuery("#monetary_separator_symbol").val(monetarySeparatorSymbol);
            jQuery("#preview_monetary_separator_symbol").html(monetarySeparatorSymbol);
            jQuery("#monetary_grouping_separator_symbol").val(monetaryGroupingSeparatorSymbol);
            jQuery("#preview_monetary_grouping_separator_symbol").html(monetaryGroupingSeparatorSymbol);
            jQuery("#enable_conversion").prop("checked", enableOnStart);
            const excludedText = excludedDomains.join("\n").replace(/\n/g, "\r\n");
            jQuery("#excluded_domains").val(excludedText);
            for (var currency of convertFroms) {
                var li = jQuery(document.createElement("li")).attr({
                    class: "ui-state-default",
                    id: currency.isoName
                });
                jQuery("#fromCurrencies").append(li);
                var label = jQuery(document.createElement("label"));
                li.append(label);
                if (currency.enabled) {
                    label.append(jQuery(document.createElement("input")).attr({
                        type: "checkbox",
                        checked: "checked"
                    }));
                }
                else {
                    label.append(jQuery(document.createElement("input")).attr({
                        type: "checkbox"
                    }));
                }
                label.append(currencyNames[currency.isoName]);
            }
            jQuery("#adjustment_percentage").val(quoteAdjustmentPercent);
            jQuery("#always_round").prop("checked", roundAmounts);
            onCurrencySpacingChange(currencySpacing !== "");
            jQuery("#show_original_prices").prop("checked", showOriginalPrices);
            jQuery("#showOriginalCurrencies").prop("checked", showOriginalCurrencies);
            jQuery("#showTooltip").prop("checked", showTooltip);
            jQuery("#showTooltip").prop("checked", showTooltip);
            jQuery("#beforeCurrencySymbol").prop("checked", beforeCurrencySymbol);
            jQuery("#unitBefore").prop("checked", !beforeCurrencySymbol);
            onBeforeCurrencySymbolChange(beforeCurrencySymbol);
            jQuery("#currency_spacing").prop("checked", currencySpacing !== "");
            jQuery("#temp_convert_units").prop("checked", tempConvertUnits);
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
            if (customSymbols[currencyVal]) {
                jQuery("#custom_symbol").val(customSymbols[currencyVal]);
            }
            const allCurrencySymbols = jQuery.extend({}, currencySymbols, customSymbols);
            if (currencyVal in allCurrencySymbols) {
                currencyVal = allCurrencySymbols[currencyVal];
            }
            jQuery("#preview_left").html(currencyVal);
            jQuery("#preview_right").html(currencyVal);
        };
        const onCurrencySpacingChange = function(val) {
            if (val) {
                if (beforeCurrencySymbol) {
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
        const onBeforeCurrencySymbolChange = function(beforeCurrencySymbol) {
            if (beforeCurrencySymbol) {
                jQuery("#preview_left").hide();
                jQuery("#preview_right").show();
                jQuery("#preview_left_space").html("");
                if (jQuery("#currency_spacing").is(":checked")) {
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
                if (jQuery("#currency_spacing").is(":checked")) {
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
            monetarySeparatorSymbol = escapeHtml(contentScriptParams.monetarySeparatorSymbol);
            enableOnStart = contentScriptParams.enableOnStart;
            excludedDomains = contentScriptParams.excludedDomains;
            excludedDomains.map(escapeHtml);
            convertFroms = contentScriptParams.convertFroms;
            //Object.keys(convertFroms).forEach(escapeHtml);
            quoteAdjustmentPercent = escapeHtml(contentScriptParams.quoteAdjustmentPercent);
            roundAmounts = contentScriptParams.roundAmounts;
            currencySpacing = contentScriptParams.currencySpacing;
            showOriginalPrices = contentScriptParams.showOriginalPrices;
            showOriginalCurrencies = contentScriptParams.showOriginalCurrencies;
            showTooltip = contentScriptParams.showTooltip;
            beforeCurrencySymbol = contentScriptParams.beforeCurrencySymbol;
            tempConvertUnits = contentScriptParams.tempConvertUnits;
            monetaryGroupingSeparatorSymbol = contentScriptParams.monetaryGroupingSeparatorSymbol;
            currencyNames = contentScriptParams.currencyNames;
            setUIFromPreferences();
        };
        return {
            showSettings : showSettings
        };
    })();
    this.DirectCurrencySettings = DirectCurrencySettings;
}