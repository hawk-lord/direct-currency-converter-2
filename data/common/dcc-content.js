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
    const checkSubUnit = function(aPrice, aReplacedUnit, aConversionQuote) {
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
    const seks = [
        ["miljoner", "miljoner "],
        ["miljon", "miljon "],
        ["miljarder", "miljarder "],
        ["miljard", "miljard "],
        ["mnkr", "mn "],
        ["mdkr", "md "],
        ["mkr", "mn "],
        ["ksek", "k"],
        ["msek", "M"],
        ["gsek", "G"]
    ];
    const dkks = [
        ["millión", "millión "],
        ["miljón", "miljón "],
        ["milliard", "milliard "],
        ["mia.", "mia. "],
        ["mio.", "mio. "],
        ["million", "million "]
    ];
    const isks = [
        ["milljón", "milljón "],
        ["milljarð", "milljarð "]
    ];
    const noks = [
        ["milliard", "milliard "],
        ["million", "million "]
    ];
    const Mult = function(aMults) {
        "use strict";
        this.mults = new Map(aMults);
        this.func = function(aUnit) {
            this.multsIter = this.mults.keys();
            var entry = this.multsIter.next();
            while (!entry.done) {
                if (aUnit.includes(entry.value)) {
                    return this.mults.get(entry.value);
                }
                entry = this.multsIter.next();
            }
            return "";
        }
    };
    const multies = {};
    multies["SEK"] = new Mult(seks);
    multies["DKK"] = new Mult(dkks);
    multies["ISK"] = new Mult(isks);

    multies["NOK"] = new Mult(noks);

    const getMultiplicator = function(aPrice) {
        if (multies[aPrice.currency]) {
            return multies[aPrice.currency].func(aPrice.full.toLowerCase());
        }
        return "";
    };

    const addMonetaryGroupingSeparatorSymbol = function(anAmount, aMonetaryGroupingSeparatorSymbol) {
        var amount = anAmount;
        const regex = /(\d+)(\d{3})/;
        const monetaryGroupingSeparatorSymbol = aMonetaryGroupingSeparatorSymbol === " " ? "\u00a0" : aMonetaryGroupingSeparatorSymbol;
        while (regex.test(amount)) {
            amount = amount.replace(regex, "$1" + monetaryGroupingSeparatorSymbol + "$2");
        }
        return amount;
    };

    const formatAmount = function(anAmountIntegralPart, anAmountFractionalPart, aMultiplicator, aUnit, aCurrencyCode, aMonetaryGroupingSeparatorSymbol, aMonetarySeparatorSymbol) {
        //console.log("anAmountIntegralPart             " + anAmountIntegralPart);
        //console.log("anAmountFractionalPart           " + anAmountFractionalPart);
        //console.log("aMultiplicator                   " + aMultiplicator);
        //console.log("aUnit                            " + aUnit);
        //console.log("aCurrencyCode                    " + aCurrencyCode);
        //console.log("aMonetaryGroupingSeparatorSymbol " + aMonetaryGroupingSeparatorSymbol);
        //console.log("aMonetarySeparatorSymbol         " + aMonetarySeparatorSymbol);
        //console.log("-----------------------------------");

        const subUnits = {"EUR": "cent", "RUB" : "коп.", "SEK": "öre"};
        var formattedPrice;
        var unit = aUnit;
        const hasFractionalPart = anAmountFractionalPart !== "";
        if (anAmountIntegralPart === "0" && hasFractionalPart && aCurrencyCode in subUnits && aMultiplicator === "" && aUnit !== "") {
            formattedPrice = anAmountFractionalPart.replace(/^0+/, "");
            unit = subUnits[aCurrencyCode];
        }
        else {
            formattedPrice = addMonetaryGroupingSeparatorSymbol(anAmountIntegralPart, aMonetaryGroupingSeparatorSymbol);
            if (hasFractionalPart) {
                formattedPrice = formattedPrice + aMonetarySeparatorSymbol + anAmountFractionalPart;
            }
        }
        return {formattedPrice: formattedPrice, unit: unit};
    };

    const formatPrice = function(anAmount, aUnit, aMultiplicator, aRoundAmounts, aCurrencyCode, aCustomFormat) {
        const fractionDigits = (aRoundAmounts && anAmount > 1) || aUnit === "mm" || aUnit === "kJ" ? 0 : 2;
        const amountString = anAmount.toFixed(fractionDigits);
        const amountParts = amountString.split(".");
        const amountIntegralPart = amountParts[0];
        const amountFractionalPart = amountParts.length > 1 ? amountParts[1] : "";
        var formattedPrice;
        const __ret = formatAmount(amountIntegralPart, amountFractionalPart, aMultiplicator, aUnit, aCurrencyCode, aCustomFormat.monetaryGroupingSeparatorSymbol, aCustomFormat.monetarySeparatorSymbol);
        formattedPrice = __ret.formattedPrice;
        const unit = __ret.unit;
        if (aCustomFormat.beforeCurrencySymbol) {
            formattedPrice = formattedPrice + aCustomFormat.currencySpacing + aMultiplicator + unit;
        }
        else {
            formattedPrice = unit + aCustomFormat.currencySpacing + formattedPrice + aMultiplicator;
        }
        return " " + formattedPrice;
    };

    return {
        checkSubUnit: checkSubUnit,
        multies: multies,
        getMultiplicator: getMultiplicator,
        addMonetaryGroupingSeparatorSymbol: addMonetaryGroupingSeparatorSymbol,
        formatAmount: formatAmount,
        formatPrice: formatPrice
    }
})();

const Price = function() {
    currency: "";
    amount: 0;
    full: "";
    positionInString: 0;
};

const CurrencyRegex = function (aCurrency, aRegex1, aRegex2){
    this.currency = aCurrency;
    this.regex1 = aRegex1;
    this.regex2 = aRegex2;
};

const DirectCurrencyContent = (function(aDccFunctions) {
    "use strict";
    if (!String.prototype.includes) {
        String.prototype.includes = function() {'use strict';
            return String.prototype.indexOf.apply(this, arguments) !== -1;
        };
    }
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
     * This is to check that PriceRegexes exists
     *
     */
    if(typeof Promise !== "undefined" && Promise.toString().includes("[native code]")){
        const promise = new Promise(
            function(resolve, reject) {
                if (PriceRegexes) {
                    resolve(PriceRegexes);
                }
                else {
                    reject(Error("promise NOK"));
                }
            }
        );
        promise.then(
            function(aPriceRegexes) {
                aPriceRegexes.makePriceRegexes(regex1, regex2)
            },
            function (err) {
                console.error("promise then " + err);
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
            return aDccFunctions.formatPrice(aConvertedAmount, "mm", aMultiplicator, roundAmounts, currencyCode, customFormat);
        }
        else if (aReplacedUnit === "kcal") {
            return aDccFunctions.formatPrice(aConvertedAmount, "kJ", aMultiplicator, roundAmounts, currencyCode, customFormat);
        }
        else if (aReplacedUnit === "nmi") {
            return aDccFunctions.formatPrice(aConvertedAmount, "km", aMultiplicator, roundAmounts, currencyCode, customFormat);
        }
        else if (aReplacedUnit === "mile") {
            return aDccFunctions.formatPrice(aConvertedAmount, "km", aMultiplicator, roundAmounts, currencyCode, customFormat);
        }
        else if (aReplacedUnit === "mil") {
            return aDccFunctions.formatPrice(aConvertedAmount, "km", aMultiplicator, roundAmounts, currencyCode, customFormat);
        }
        else if (aReplacedUnit === "knots") {
            return aDccFunctions.formatPrice(aConvertedAmount, "km/h", aMultiplicator, roundAmounts, currencyCode, customFormat);
        }
        else if (aReplacedUnit === "hp") {
            return aDccFunctions.formatPrice(aConvertedAmount, "kW", aMultiplicator, roundAmounts, currencyCode, customFormat);
        }
        else {
            return aDccFunctions.formatPrice(aConvertedAmount, currencySymbol, aMultiplicator, roundAmounts, currencyCode, customFormat);
        }
    };
    const addOriginalUnit = function (anElementTitleText, aReplacedUnit) {
        if (anElementTitleText === "" || anElementTitleText.includes(aReplacedUnit)) {
            return anElementTitleText;
        }
        else {
            return anElementTitleText + " [" + aReplacedUnit + "]";
        }
    };
    const makeCacheNodes = function(aNode, anElementTitleText, aConvertedContent, aReplacedUnit) {
        const documentFragment = document.createDocumentFragment();
        documentFragment.appendChild(makeCacheNode("originalText", aNode.textContent));
        documentFragment.appendChild(makeCacheNode("convertedText", aConvertedContent));
        return documentFragment;
    };
    const replaceCurrency = function(aNode) {
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
            var prices = findPrices(currencyRegex.currency, currencyRegex.regex1, aNode.textContent, 3);
            if (prices.length === 0) {
                prices = findPrices(currencyRegex.currency, currencyRegex.regex2, aNode.textContent, 1);
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
            var convertedPrice = formatAlsoOtherUnit(replacedUnit, convertedAmount, aDccFunctions.getMultiplicator(price));
            if (showOriginalPrices) {
                if (!convertedContent.includes(replacedUnit) && showOriginalCurrencies) {
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
        if (aNode.baseURI.includes("pdf.js")) {
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
            dccTitle += aDccFunctions.formatPrice(tempConvertedAmount, currencyCode, "", roundAmounts, currencyCode, customFormat) + "\n";
            dccTitle += "Original value: ";
            dccTitle += aDccFunctions.formatPrice(tempAmount, replacedUnit, "", "", roundAmounts, currencyCode, customFormat) + "\n";
            dccTitle += "Conversion quote " + replacedUnit + "/" + currencyCode + " = " + aDccFunctions.formatPrice(conversionQuote, "", "", roundAmounts, currencyCode, customFormat) + "\n";
            dccTitle += "Conversion quote " + currencyCode + "/" + replacedUnit + " = " + aDccFunctions.formatPrice(1/conversionQuote, "", "", roundAmounts, currencyCode, customFormat);
            substitute(aNode, false, dccTitle);
        }
    };
    const makePrice = function(aCurrency, aMatch, anAmountPosition) {
        const price = new Price();
        price.currency = aCurrency;
        // 848,452.63
        price.amount = aMatch[anAmountPosition].trim();
        // 848,452.63 NOK
        price.full = aMatch[0];
        // 1 (position in the string where the price was found)
        price.positionInString = aMatch.index;
        return price;
    };
    // Stores prices that will be replaced with converted prices
    const findPrices = function(aCurrency, aRegex, aText, anAmountPosition) {
        const prices = [];
        if (aRegex == null) {
            return prices;
        }
        var match;
        while ((match = aRegex.exec(aText)) !== null) {
            prices.push(makePrice(aCurrency, match, anAmountPosition));
        }
        return prices;
    };
    const makeCacheNode = function(aClassName, aValue) {
        const element = document.createElement("input");
        element.setAttribute("type", "hidden");
        element.className = aClassName;
        element.value = aValue;
        return element;
    };
    const parseAmount = function(anAmount) {
        var amount = anAmount;
        const comma = amount.includes(",");
        const point = amount.includes(".");
        const apo = amount.includes("'");
        const colon = amount.includes(":");
        const space = amount.includes(" ") || amount.includes("\u00A0");
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
    const mutationHandler = function(aMutationRecord) {
        if (aMutationRecord.type === "childList") {
            for (var i = 0; i < aMutationRecord.addedNodes.length; ++i) {
                var node = aMutationRecord.addedNodes[i];
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
        for (var i = 0; i < nodeList.length; ++i) {
            var node = nodeList[i];
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
            for (var i = 0; i < aNode.childNodes.length; ++i) {
                var node = aNode.childNodes[i];
                originalChildNodes.push(node);
            }
            for (var i = 0; i < originalChildNodes.length; ++i) {
                var node = originalChildNodes[i];
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
        for (var i = 0; i < nodeList.length; ++i) {
            var node = nodeList[i];
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

        if(typeof Promise !== "undefined" && Promise.toString().includes("[native code]")){
            const promise2 = new Promise(
                function(resolve, reject) {
                    if (PriceRegexes) {
                        resolve();
                    }
                    else {
                        reject(Error("promise2 NOK"));
                    }
                }
            );
            promise2.then(
                function() {
                    afterRegexesCreated();
                },
                function (err) {
                    console.error("promise2 then " + err);
                }
            ).catch(
                function (err) {
                    console.error("promise2 catch " + err);
                }
            );
        }
        else {
            afterRegexesCreated();
        }

        const afterRegexesCreated = function() {
            // "use strict";
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
    };
    return {
        onSendEnabledStatus : onSendEnabledStatus,
        onUpdateSettings : onUpdateSettings
    };
})(DccFunctions);
