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
if (!this.DirectCurrencyQuotes) {
    const DirectCurrencyQuotes = (function() {
        "use strict";
        let conversionQuotes = [];
        let currencyCode = "";
        let currencySymbol = "¤";
        const customFormat = {"beforeCurrencySymbol" : true, "monetaryGroupingSeparatorSymbol" : " ", "monetarySeparatorSymbol" : ",", "currencySpacing" : "\u2009"};
        let excludedDomains = [];
        let isEnabled = true;
        let quoteAdjustmentPercent = 0;
        const regex1 = {};
        const regex2 = {};
        const enabledCurrenciesWithRegexes = [];
        let roundAmounts = false;
        let showOriginalPrices = false;
        let showOriginalCurrencies = false;
        let showTooltip = true;

        const numberFormat = new Intl.NumberFormat(window.navigator.language, { minimumFractionDigits: 6 });
        var ascending = false;

        /**
         *
         * @param contentScriptParams
         */
        const readParameters = (contentScriptParams) => {
            conversionQuotes = contentScriptParams.conversionQuotes;
            excludedDomains = contentScriptParams.excludedDomains;
            currencyCode = contentScriptParams.convertToCurrency;
            const allCurrencySymbols = Object.assign({}, contentScriptParams.currencySymbols, contentScriptParams.customSymbols);
            if (currencyCode in allCurrencySymbols) {
                currencySymbol = allCurrencySymbols[currencyCode];
            }
            else {
                currencySymbol = currencyCode;
            }
            customFormat.beforeCurrencySymbol = contentScriptParams.beforeCurrencySymbol;
            customFormat.monetaryGroupingSeparatorSymbol = contentScriptParams.monetaryGroupingSeparatorSymbol;
            customFormat.monetarySeparatorSymbol = contentScriptParams.monetarySeparatorSymbol;
            customFormat.currencySpacing = contentScriptParams.currencySpacing;
            roundAmounts = contentScriptParams.roundAmounts;
            showOriginalPrices = contentScriptParams.showOriginalPrices;
            showOriginalCurrencies = contentScriptParams.showOriginalCurrencies;
            showTooltip = contentScriptParams.showTooltip;
            quoteAdjustmentPercent = +contentScriptParams.quoteAdjustmentPercent;
        };

        const populateTable = (aSortByValue) => {
            const caption =  document.getElementById("caption");
            while (caption.hasChildNodes()) {
                caption.removeChild(caption.lastChild);
            }
            const textNodeCaption = document.createTextNode("Quotes XXX / " + currencyCode + " = ");
            caption.appendChild(textNodeCaption);

            const tableBody =  document.getElementById("tableBody");
            while (tableBody.hasChildNodes()) {
                tableBody.removeChild(tableBody.lastChild);
            }
            const conversionQuotesArray = [];
            for (let conversionQuote in conversionQuotes) {
                if (!conversionQuotes[conversionQuote]) {
                    continue;
                }
                if (!conversionQuote.match(/[A-Z][A-Z][A-Z]/)) {
                    continue;
                }
                conversionQuotesArray.push({name: conversionQuote, value: conversionQuotes[conversionQuote]});
            }
            const sortByValue = (anA, aB) => {
                const a = ascending ? aB : anA;
                const b = ascending ? anA : aB;
                return aSortByValue ? b.value - a.value : a.name.localeCompare(b.name);
            };
            const conversionQuotesArraySorted = conversionQuotesArray.sort(sortByValue);
            for (let conversionQuote of conversionQuotesArraySorted) {
                const tableRow = document.createElement("tr");
                const tableCell1 = document.createElement("td");
                const textNode1 = document.createTextNode(conversionQuote.name);
                tableCell1.appendChild(textNode1);
                tableRow.appendChild(tableCell1);
                const tableCell2 = document.createElement("td");
                const textNode2 = document.createTextNode(numberFormat.format(conversionQuote.value));
                tableCell2.appendChild(textNode2);
                tableRow.appendChild(tableCell2);
                tableBody.appendChild(tableRow);
            }
            ascending = !ascending;
        };

        const sortByCurrency = () => {
            populateTable(false);
        };
        const sortByValue = () => {
            populateTable(true);
        };
        const currencyElement = document.getElementById("currency");
        currencyElement.addEventListener("click", sortByCurrency);
        const valueElement = document.getElementById("value");
        valueElement.addEventListener("click", sortByValue);

        /**
         *
         * @param contentScriptParams
         */
        const onUpdateQuotes = (contentScriptParams) => {
            readParameters(contentScriptParams);
            populateTable(true);
        };
        return {
            onUpdateQuotes : onUpdateQuotes
        };
    })();

    this.DirectCurrencyQuotes = DirectCurrencyQuotes;

}