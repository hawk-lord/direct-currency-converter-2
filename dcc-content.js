/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Based on code from Simple Currency Converter
 * https://addons.mozilla.org/addon/simple-currency-converter/
 *
 * Module pattern is used.
 */
const DccFunctions = (function(){
    "use strict";
    const allSubUnits = {
        "DKK": ["øre"],
        "SEK": ["öre"],
        "USD": ["¢", "￠"]
    };
    const checkSubUnit = (aPrice, aReplacedUnit, aConversionQuote) => {
        const currencySubUnits = allSubUnits[aReplacedUnit];
        if (currencySubUnits) {
            for (var subUnit of currencySubUnits) {
                if (aPrice.full.includes(subUnit)) {
                    return aConversionQuote / 100;
                }
            }
        }
        return aConversionQuote;
    };
    return {
        checkSubUnit : checkSubUnit
    }
})();


const CurrencyRegex = function (aCurrency, aRegex1, aRegex2){
    this.currency = aCurrency;
    this.regex1 = aRegex1;
    this.regex2 = aRegex2;
};


const DirectCurrencyContent = (function(aDccFunctions) {
    "use strict";
    var conversionQuotes = [];
    var currencyCode = "";
    var currencySymbol = "¤";
    const customFormat = {"beforeCurrencySymbol" : true, "monetaryGroupingSeparatorSymbol" : " ", "monetarySeparatorSymbol" : ",", "currencySpacing" : "\u2009"};
    var excludedDomains = [];
    var isEnabled = true;
    var quoteAdjustmentPercent = 0;
    const regex1 = {};
    const regex2 = {};
    const enabledCurrenciesWithRegexes = [];
    var roundAmounts = false;
    var showOriginalPrices = false;
    var showOriginalCurrencies = false;
    var showTooltip = true;
    const skippedElements = ["audio", "button", "embed", "head", "img", "noscript", "object", "script", "select", "style", "textarea", "video"];
    const subUnits = {"EUR" : "cent", "RUB" : "коп."};

    // hover element showing conversion
    const style = document.createElement("style");
    document.head.appendChild(style);
    const sheet = style.sheet;
    sheet.insertRule("[data-dcctitle]:hover:after {" +
        "content: attr(data-dcctitle);" +
        "white-space: pre-line;" +
        "font-style: normal;" +
        "font-variant: normal;" +
        "font-weight: normal;" +
        "font-stretch: normal;" +
        "font-size: medium;" +
        "line-height: normal;" +
        "font-family: sans-serif;" +
        "text-align: left;" +
        "text-transform: none;" +
        "list-style-type:none;" +
        "padding: 10px;" +
        "background-color: burlywood;" +
        "border-style: solid;" +
        "border-color: papayawhip;" +
        "color: white;font-size: 15px;" +
        "position: fixed;" +
        "left: 0;" +
        "top: 0;" +
        "width: 300px;" +
        "height: 100px;" +
        "z-index: 2147483647;" +
        "}", 0);

    /**
     * This is to check that PriceRegexes exists in SeaMonkey and Firefox
     *
     */
    if(typeof Promise !== "undefined" && Promise.toString().contains("[native code]")){
        const promise = new Promise(
            function(resolve, reject) {
                if (PriceRegexes)
                    resolve(PriceRegexes);
                else
                    reject(Error("promise NOK"));
            }
        );
        promise.then(
            function(aPriceRegexes) {
                aPriceRegexes.makePriceRegexes(regex1, regex2)
            },
            function (err) {
            }
        ).catch(
            function (err) {
                console.error("promise catch " + err);
            }
        );
    }
    else {
        PriceRegexes.makePriceRegexes(regex1, regex2);
    }
    const formatAlsoOtherUnit = function (aReplacedUnit, aConvertedAmount, aMultiplicator) {
        if (aReplacedUnit === "inch") {
            return formatPrice(aConvertedAmount, "mm", aMultiplicator);
        }
        else if (aReplacedUnit === "kcal") {
            return formatPrice(aConvertedAmount, "kJ", aMultiplicator);
        }
        else if (aReplacedUnit === "nmi") {
            return formatPrice(aConvertedAmount, "km", aMultiplicator);
        }
        else if (aReplacedUnit === "mile") {
            return formatPrice(aConvertedAmount, "km", aMultiplicator);
        }
        else if (aReplacedUnit === "mil") {
            return formatPrice(aConvertedAmount, "km", aMultiplicator);
        }
        else if (aReplacedUnit === "knots") {
            return formatPrice(aConvertedAmount, "km/h", aMultiplicator);
        }
        else if (aReplacedUnit === "hp") {
            return formatPrice(aConvertedAmount, "kW", aMultiplicator);
        }
        else {
            return formatPrice(aConvertedAmount, currencySymbol, aMultiplicator);
        }
    };
    const addOriginalUnit = function (anElementTitleText, aReplacedUnit) {
        if (anElementTitleText === "" || anElementTitleText.contains(aReplacedUnit)) {
            return anElementTitleText;
        }
        else {
            return anElementTitleText + " [" + aReplacedUnit + "]";
        }
    };
    const makeCacheNodes = function(aNode, anElementTitleText, aConvertedContent, aReplacedUnit) {
        const documentFragment = document.createDocumentFragment();
        documentFragment.appendChild(makeCacheNode("originalText", aNode.textContent, ""));
        documentFragment.appendChild(makeCacheNode("convertedText", aConvertedContent, addOriginalUnit(anElementTitleText, aReplacedUnit)));
        return documentFragment;
    };
    const replaceCurrency = function(aNode) {
        // convertedContent goes here if callback functions are declared inside replaceCurrency
        var convertedContent = aNode.textContent;
        var replacedUnit = "";
        var elementTitleText = "";
        // Don't check text without numbers
        if (!/\d/.exec(convertedContent)) {
            return;
        }
        for (var currencyRegex of enabledCurrenciesWithRegexes) {
            if (currencyRegex.currency === currencyCode) {
                continue;
            }
            var prices = findPrices(currencyRegex.regex1, aNode.textContent, 3);
            if (prices.length === 0) {
                prices = findPrices(currencyRegex.regex2, aNode.textContent, 1);
            }
            if (prices.length === 0) {
                continue;
            }
            else {
                replacedUnit = currencyRegex.currency;
            }
            break;
        }
        if (replacedUnit === "") {
            return;
        }
        const conversionQuote = conversionQuotes[replacedUnit] * (1 + quoteAdjustmentPercent / 100);
        var tempAmount;
        var tempConvertedAmount;
        for (var price of prices) {
            var tempConversionQuote = aDccFunctions.checkSubUnit(price, replacedUnit, conversionQuote);
            const convertedAmount = tempConversionQuote * parseAmount(price.amount);
            const multiplicator = getMultiplicator(replacedUnit, price.full.toLowerCase());
            var convertedPrice = formatAlsoOtherUnit(replacedUnit, convertedAmount, multiplicator);
            if (showOriginalPrices) {
                if (!convertedContent.contains(replacedUnit) && showOriginalCurrencies) {
                    convertedPrice = convertedPrice + " (##__## [¤¤¤])";
                }
                else {
                    convertedPrice = convertedPrice + " (##__##)";
                }
            }
            convertedContent = convertedContent.substring(0, price.positionInString) +
                convertedContent.substring(price.positionInString, convertedContent.length).replace(price.full, convertedPrice);
            if (showOriginalPrices) {
                convertedContent = convertedContent.replace("##__##", price.full);
                convertedContent = convertedContent.replace("¤¤¤", replacedUnit);
            }
            tempAmount = parseAmount(price.amount);
            tempConvertedAmount = convertedAmount;
        }
        for (var price of prices) {
            elementTitleText += " ~ " + price.full;
        }
        elementTitleText = elementTitleText.substring(3);
        if (showOriginalPrices) {
            elementTitleText = "";
        }
        aNode.parentNode.insertBefore(makeCacheNodes(aNode, elementTitleText, convertedContent), aNode, replacedUnit);
        if (aNode.baseURI.contains("pdf.js")) {
            if (aNode.parentNode) {
                aNode.parentNode.style.color = "black";
                aNode.parentNode.style.backgroundColor = "lightyellow";
                if (aNode.parentNode.parentNode) {
                    aNode.parentNode.parentNode.style.opacity = "1";
                }
            }
        }
        if (isEnabled && showTooltip) {
            var dccTitle = "Converted value: ";
            dccTitle += formatPrice(tempConvertedAmount, currencyCode, "") + "\n";
            dccTitle += "Original value: ";
            dccTitle += formatPrice(tempAmount, replacedUnit, "") + "\n";
            dccTitle += "Conversion quote " + replacedUnit + "/" + currencyCode + " = " + formatPrice(conversionQuote, "", "") + "\n";
            dccTitle += "Conversion quote " + currencyCode + "/" + replacedUnit + " = " + formatPrice(1/conversionQuote, "", "");
            substitute(aNode, false, dccTitle);
        }
    };
    const getMultiplicator = function(aReplacedUnit, aPrice) {
        if (aReplacedUnit === "SEK") {
            return getSekMultiplicator(aPrice);
        }
        else if (aReplacedUnit === "DKK") {
            return getDkkMultiplicator(aPrice);
        }
        else if (aReplacedUnit === "ISK") {
            return getIskMultiplicator(aPrice);
        }
        else if (aReplacedUnit === "NOK") {
            return getNokMultiplicator(aPrice);
        }
        return "";
    };
    const getSekMultiplicator = function(aUnit) {
        if (aUnit.contains("miljoner")) {
            return "miljoner ";
        }
        else if (aUnit.contains("miljon")) {
            return "miljon ";
        }
        else if (aUnit.contains("miljarder")) {
            return "miljarder ";
        }
        else if (aUnit.contains("miljard")) {
            return "miljard ";
        }
        else if (aUnit.contains("mnkr")) {
            return "mn ";
        }
        else if (aUnit.contains("mdkr")) {
            return "md ";
        }
        else if (aUnit.toLowerCase().contains("mkr")) {
            return "mn ";
        }
        else if (aUnit.contains("ksek")) {
            return "k";
        }
        else if (aUnit.contains("msek")) {
            return "M";
        }
        else if (aUnit.contains("gsek")) {
            return "G";
        }
        return "";
    };
    const getDkkMultiplicator = function(aUnit) {
        if (aUnit.contains("millión")) {
            return "millión ";
        }
        else if (aUnit.contains("miljón")) {
            return "miljón ";
        }
        else if (aUnit.contains("milliard")) {
            return "milliard ";
        }
        if (aUnit.contains("mia.")) {
            return "mia. ";
        }
        if (aUnit.contains("mio.")) {
            return "mio. ";
        }
        else if (aUnit.contains("million")) {
            return "million ";
        }
        return "";
    };
    const getIskMultiplicator = function(aUnit) {
        if (aUnit.contains("milljón")) {
            return "milljón ";
        }
        else if (aUnit.contains("milljarð")) {
            return "milljarð ";
        }
        return "";
    };
    const getNokMultiplicator = function(aUnit) {
        if (aUnit.contains("milliard")) {
            return "milliard";
        }
        else if (aUnit.contains("million")) {
            return "million ";
        }
        return "";
    };
    const makePrice = function(aMatch, anAmountPosition) {
        const price = {};
        // 848,452.63
        price.amount = aMatch[anAmountPosition].trim();
        // 848,452.63 NOK
        price.full = aMatch[0];
        // 1 (position in the string where the price was found)
        price.positionInString = aMatch.index;
        //console.log(price.amount);
        //console.log(price.full);
        //console.log(price.positionInString);
        return price;
    };
    // Stores prices that will be replaced with converted prices
    const findPrices = function(aRegex, aText, anAmountPosition) {
        const prices = [];
        if (aRegex == null) {
            return prices;
        }
        var match;
        while ((match = aRegex.exec(aText)) !== null) {
            prices.push(makePrice(match, anAmountPosition));
        }
        return prices;
    };
    const makeCacheNode = function(aClassName, aValue, aTitle) {
        const element = document.createElement("input");
        element.setAttribute("type", "hidden");
        element.className = aClassName;
        element.value = aValue;
        element.title = aTitle;
        return element;
    };
    const parseAmount = function(anAmount) {
        var amount = anAmount;
        const comma = amount.contains(",");
        const point = amount.contains(".");
        const apo = amount.contains("'");
        const colon = amount.contains(":");
        const space = amount.contains(" ") || amount.contains("\u00A0");
        if (space) {
            amount = amount.replace(/,/g,".");
            amount = amount.replace(/\s/g,"");
        }
        else {
            if (comma && point) {
                if (amount.indexOf(",") < amount.indexOf(".")) {
                    amount = amount.replace(/,/g,"");
                }
                else {
                    amount = amount.replace(/\./g,"");
                    amount = amount.replace(/,/g,".");
                }
            }
            else if (apo && point) {
                if (amount.indexOf("'") < amount.indexOf(".")) {
                    amount = amount.replace(/'/g,"");
                }
                else {
                    amount = amount.replace(/\./g,"");
                    amount = amount.replace(/'/g,".");
                }
            }
            else if (apo && comma) {
                if (amount.indexOf("'") < amount.indexOf(",")) {
                    amount = amount.replace(/'/g,"");
                    amount = amount.replace(/,/g,".");
                }
                else {
                    amount = amount.replace(/,/g,"");
                    amount = amount.replace(/'/g,".");
                }
            }
            else if (apo) {
                const apoCount = amount.split("'").length - 1;
                const checkValidity = (amount.length - amount.indexOf("'") - apoCount) % 3;
                if (amount.charAt(0) === "0" || checkValidity !== 0) {
                }
                else {
                    amount = amount.replace(/'/g,"");
                }
            }
            else if (point) {
                const pointCount = amount.split(".").length - 1;
                const checkValidity = (amount.length - amount.indexOf(".") - pointCount) % 3;
                if (amount.charAt(0) === "0" || checkValidity !== 0) {
                }
                else {
                    amount = amount.replace(/\./g,"");
                }
            }
            else if (comma) {
                const commaCount = amount.split(",").length - 1;
                const checkValidity = (amount.length - amount.indexOf(",") - commaCount) % 3;
                if (amount.charAt(0) === "0" || checkValidity !== 0) {
                    amount = amount.replace(/,/g,".");
                }
                else {
                    amount = amount.replace(/,/g,"");
                }
            }
            else if (colon) {
                const colonCount = amount.split(":").length - 1;
                const checkValidity = (amount.length - amount.indexOf(":") - colonCount) % 3;
                if (amount.charAt(0) === "0" || checkValidity !== 0) {
                    amount = amount.replace(/:/g,".");
                }
                else {
                    amount = amount.replace(/:/g,"");
                }
            }
        }
        return parseFloat(amount);
    };
    const formatPrice = function(anAmount, aUnit, aMultiplicator) {
        var unit = aUnit;
        const fractionDigits = (roundAmounts && anAmount > 1) || unit === "mm" || unit === "kJ" ? 0 : 2;
        const amountString = anAmount.toFixed(fractionDigits);
        const amountParts = amountString.split(".");
        const amountIntegralPart = amountParts[0];
        const hasFractionalPart = amountParts.length > 1;
        const amountFractionalPart = hasFractionalPart ? amountParts[1] : null;
        var formattedPrice;
        if (amountIntegralPart === 0 && hasFractionalPart && currencyCode in subUnits  && aMultiplicator === "") {
            formattedPrice = parseInt(amountFractionalPart);
            unit = subUnits[currencyCode];
        }
        else {
            formattedPrice = addMonetaryGroupingSeparatorSymbol(amountIntegralPart, customFormat.monetaryGroupingSeparatorSymbol);
            if (hasFractionalPart) {
                formattedPrice = formattedPrice + customFormat.monetarySeparatorSymbol + amountFractionalPart;
            }
        }
        if (customFormat.beforeCurrencySymbol) {
            formattedPrice = formattedPrice + customFormat.currencySpacing + aMultiplicator + unit;
        }
        else {
            formattedPrice = unit + customFormat.currencySpacing + formattedPrice;
        }
        return " " + formattedPrice;
    };
    const addMonetaryGroupingSeparatorSymbol = function(anAmount, aMonetaryGroupingSeparatorSymbol) {
        const amountParts = anAmount.split(".");
        var x1 = amountParts[0];
        const x2 = amountParts.length > 1 ? "." + amountParts[1] : "";
        const regex = /(\d+)(\d{3})/;
        const monetaryGroupingSeparatorSymbol = aMonetaryGroupingSeparatorSymbol === " " ? "\u00a0" : aMonetaryGroupingSeparatorSymbol;
        while (regex.test(x1)) {
            x1 = x1.replace(regex, "$1" + monetaryGroupingSeparatorSymbol + "$2");
        }
        return x1 + x2;
    };
    const mergeArrays = function(destination, source) {
        for (var property in source) {
            if (source.hasOwnProperty(property)) {
                destination[property] = source[property];
            }
        }
        return destination;
    };
    const mutationHandler = function(aMutationRecord) {
        if (aMutationRecord.type === "childList") {
            for (var node of aMutationRecord.addedNodes) {
                traverseDomTree(node);
            }
        }
    };
    const mutationsHandler = function(aMutations) {
        aMutations.forEach(mutationHandler);
    };
    const startObserve = function() {
        const MutationObserver = window.MutationObserver;
        if (document === null || MutationObserver == null) {
            return;
        }
        const mutationObserver = new MutationObserver(mutationsHandler);
        const mutationObserverInit = { attributes: true, childList: true, subtree: true, characterData: true };
        if (document.body !== null) {
            mutationObserver.observe(document.body, mutationObserverInit);
        }
    };
    const resetDomTree = function(aNode) {
        if (aNode === null) {
            return;
        }
        var nodeList = aNode.querySelectorAll(".convertedText, .originalText");
        for (var node of nodeList) {
            node.parentNode.removeChild(node);
        }
    };
    const traverseDomTree = function(aNode) {
        if (aNode !== null) {
            // The third check takes care of Google Images code "<div class=rg_meta>{"cb":3, ..."
            if (aNode.nodeType === Node.TEXT_NODE && !/^\s*$/.test(aNode.nodeValue) && !/\{/.test(aNode.nodeValue)) {
                if (aNode.parentNode !== null && skippedElements.indexOf(aNode.parentNode.tagName.toLowerCase()) === -1) {
                    if (aNode.previousSibling === null || aNode.previousSibling.className !== "convertedText") {
                        replaceCurrency(aNode);
                    }
                }
            }
            const originalChildNodes = [];
            for (var node of aNode.childNodes) {
                originalChildNodes.push(node);
            }
            for (var node of originalChildNodes) {
                traverseDomTree(node);
            }
        }
    };
    const substitute = function(aNode, isShowOriginal, aDccTitle) {
        //console.log(aNode.nodeName);
        //console.log(isShowOriginal);
        //console.log(aReplacedUnit);
        if (aNode === null) {
            return;
        }
        const className = isShowOriginal ? ".originalText" : ".convertedText";
        const nodeList = aNode.parentNode.querySelectorAll(className);
        for (var node of nodeList) {
            const originalNode = isShowOriginal ? node.nextSibling.nextSibling : node.nextSibling;
            originalNode.textContent = node.value;
            if (aDccTitle) {
                originalNode.parentNode.dataset.dcctitle = aDccTitle;
            }
        }
    };
    const onSendEnabledStatus = function(aStatus) {
        const isEnabled = aStatus.isEnabled;
        const hasConvertedElements = aStatus.hasConvertedElements;
        var message = "...";
        var process = true;
        for (var excludedDomain of excludedDomains) {
            const matcher = new RegExp(excludedDomain, "g");
            const found = matcher.test(document.URL);
            if (found) {
                process = false;
                break;
            }
        }
        if (process) {
            if (!isEnabled) {
                message = "Roll back...";
            }
            else if (hasConvertedElements) {
                message = "Converted from converted elements cache...";
            }
            else {
                message = "Converted from scratch...";
                startObserve();
                traverseDomTree(document.body);
            }
            substitute(document.body, !isEnabled);
        }
    };
    const onUpdateSettings = function(contentScriptParams) {
        const tempConvertUnits = contentScriptParams.tempConvertUnits;
        var message = "...";
        var hasConvertedElements = false;
        substitute(document.body, true);
        resetDomTree(document.body);
        conversionQuotes = contentScriptParams.conversionQuotes;
        excludedDomains = contentScriptParams.excludedDomains;
        currencyCode = contentScriptParams.convertToCurrency;
        const allCurrencySymbols = mergeArrays(contentScriptParams.currencySymbols, contentScriptParams.customSymbols);
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

        enabledCurrenciesWithRegexes.length = 0;
        for (var currency of contentScriptParams.convertFroms) {
            if (currency.enabled) {
                enabledCurrenciesWithRegexes.push(new CurrencyRegex(currency.isoName, regex1[currency.isoName], regex2[currency.isoName]));
            }
        }
        if (tempConvertUnits) {
            const regexObj_inch = new CurrencyRegex("inch", regex1["inch"], regex2["inch"]);
            enabledCurrenciesWithRegexes.push(regexObj_inch);
            const regexObj_kcal = new CurrencyRegex("kcal", regex1["kcal"], regex2["kcal"]);
            enabledCurrenciesWithRegexes.push(regexObj_kcal);
            const regexObj_nmi = new CurrencyRegex("nmi", regex1["nmi"], regex2["nmi"]);
            enabledCurrenciesWithRegexes.push(regexObj_nmi);
            const regexObj_mile = new CurrencyRegex("mile", regex1["mile"], regex2["mile"]);
            enabledCurrenciesWithRegexes.push(regexObj_mile);
            const regexObj_mil = new CurrencyRegex("mil", regex1["mil"], regex2["mil"]);
            enabledCurrenciesWithRegexes.push(regexObj_mil);
            const regexObj_knots = new CurrencyRegex("knots", regex1["knots"], regex2["knots"]);
            enabledCurrenciesWithRegexes.push(regexObj_knots);
            const regexObj_hp = new CurrencyRegex("hp", regex1["hp"], regex2["hp"]);
            enabledCurrenciesWithRegexes.push(regexObj_hp);
        }
        var process = true;
        for (var excludedDomain of contentScriptParams.excludedDomains) {
            const matcher = new RegExp(excludedDomain, "g");
            const found = matcher.test(document.URL);
            if (found) {
                process = false;
                break;
            }
        }
        if (!contentScriptParams.isEnabled || !process) {
            message = "Did nothing. Conversion is turned off...";
        }
        else {
            message = "Content was converted...";
            startObserve();
            if (document !== null) {
                traverseDomTree(document.body);
                substitute(document.body, false);
                hasConvertedElements = true;
            }
        }
        ContentAdapter.finish(hasConvertedElements);
        isEnabled = contentScriptParams.isEnabled;
    };
    return {
        onSendEnabledStatus : onSendEnabledStatus,
        onUpdateSettings : onUpdateSettings
    };
})(DccFunctions);
