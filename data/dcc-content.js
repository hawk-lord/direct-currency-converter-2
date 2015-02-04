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
const DirectCurrencyContent = (function() {
    var conversionQuotes = [];
    var currencyCode = "";
    var currencySymbol = "¤";
    const customFormat = {"unitAfter" : true, "thousandsSeparator" : " ", "subUnitSeparator" : ",", "isAmountUnitSeparated" : true};
    var excludedDomains = [];
    var isEnabled = true;
    var quoteAdjustmentPercent = 0;
    const CurrencyRegex = function (aCurrency, aRegex1, aRegex2){
        this.currency = aCurrency;
        this.regex1 = aRegex1;
        this.regex2 = aRegex2;
    };
    const regex1 = {};
    const regex2 = {};
    const enabledCurrenciesWithRegexes = [];
    var roundAmounts = false;
    var showOriginal = false;
    const skippedElements = ["audio", "button", "embed", "head", "img", "noscript", "object", "script", "select", "style", "textarea", "video"];
    const subUnits = {"EUR" : "cent", "RUB" : "коп."};

    // console.error("Promise !== undefined " + Promise !== "undefined");
    // console.error("Promise.toString().indexOf(\"[native code]\") " + Promise.toString().indexOf("[native code]"));
    /**
     * This is to check that PriceRegexes exists in SeaMonkey and Firefox
     *
     */
    if(typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1){
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
                // console.error("Promise fulfilled aPriceRegexes " + aPriceRegexes + " aData " +  aData);
                aPriceRegexes.makePriceRegexes(regex1, regex2)
            },
            function (err) {
                // console.error("promise then "  + err);
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
    //
    //
    const replaceCurrency = function(aNode) {
        // convertedContent goes here if callback functions are declared inside replaceCurrency
        var convertedContent = "";
        var matchFound = false;
        var replacedUnit = "";
        var elementTitleText = "";
        const checkRegex = function(aCurrencyRegex) {
            var conversionQuote = 1;
            const makeReplacement = function(aPrice) {
                var tempConversionQuote = conversionQuote;
                if (replacedUnit === "SEK" && aPrice.full.toLowerCase().indexOf("öre") > -1) {
                    tempConversionQuote = conversionQuote / 100;
                }
                if (replacedUnit === "inch") {
                    tempConversionQuote = 25.4;
                }
                else if (replacedUnit === "kcal") {
                    tempConversionQuote = 4.184;
                }
                else if (replacedUnit === "nmi") {
                    tempConversionQuote = 1.852;
                }
                else if (replacedUnit === "mile") {
                    tempConversionQuote = 1.602;
                }
                else if (replacedUnit === "mil") {
                    tempConversionQuote = 10;
                }
                else if (replacedUnit === "knots") {
                    tempConversionQuote = 1.852;
                }
                else if (replacedUnit === "hp") {
                    tempConversionQuote = 0.73549875;
                }
                const convertedAmount = convertAmount(aPrice.amount, tempConversionQuote);
                    // console.log("aPrice.amount " + aPrice.amount);
                    // console.log("convertedAmount " + convertedAmount);
                var multiplicator = "";
                if (replacedUnit === "SEK") {
                    multiplicator = getSekMultiplicator(aPrice.full.toLowerCase());
                }
                else if (replacedUnit === "DKK") {
                    multiplicator = getDkkMultiplicator(aPrice.full.toLowerCase());
                }
                else if (replacedUnit === "ISK") {
                    multiplicator = getIskMultiplicator(aPrice.full.toLowerCase());
                }
                else if (replacedUnit === "NOK") {
                    multiplicator = getNokMultiplicator(aPrice.full.toLowerCase());
                }
                var convertedPrice = "";
                if (replacedUnit === "inch"){
                    convertedPrice = formatPrice(convertedAmount, "mm", multiplicator);
                }
                else if (replacedUnit === "kcal"){
                    convertedPrice = formatPrice(convertedAmount, "kJ", multiplicator);
                }
                else if (replacedUnit === "nmi"){
                    convertedPrice = formatPrice(convertedAmount, "km", multiplicator);
                }
                else if (replacedUnit === "mile"){
                    convertedPrice = formatPrice(convertedAmount, "km", multiplicator);
                }
                else if (replacedUnit === "mil"){
                    convertedPrice = formatPrice(convertedAmount, "km", multiplicator);
                }
                else if (replacedUnit === "knots"){
                    convertedPrice = formatPrice(convertedAmount, "km/h", multiplicator);
                }
                else if (replacedUnit === "hp"){
                    convertedPrice = formatPrice(convertedAmount, "kW", multiplicator);
                }
                else {
                    convertedPrice = formatPrice(convertedAmount, currencySymbol, multiplicator);
                }
                if (showOriginal) {
                    if (convertedContent.indexOf(replacedUnit) > -1 ) {
                        convertedPrice = convertedPrice + " (##__##)";
                    }
                    else {
                        convertedPrice = convertedPrice + " (##__## [¤¤¤])";
                    }
                }
                // console.log("convertedContent " + convertedContent);
                // aPrice.full 50.000 krónur
                // console.log("aPrice.full " + aPrice.full);
                // convertedPrice 6 700,00 € (##__##)
                // console.log("convertedPrice " + convertedPrice);
                // var tempConvertedContent = convertedContent.replace(aPrice.full, convertedPrice);
                var tempConvertedContent = convertedContent.substring(0, aPrice.index) +
                   convertedContent.substring(aPrice.index, convertedContent.length).replace(aPrice.full, convertedPrice);
                // console.log("tempConvertedContent " + tempConvertedContent);
                //fix US $100
                // if (replacedUnit === "USD") {
                    // // fix converting of $123.00 USD, so it will not show USD after conversion
                    // tempConvertedContent = tempConvertedContent.replace(replacedUnit, "");
                    // if (convertedContent.substring(0, 4).toLowerCase() === "us $" || convertedContent.contains(" US $")) {
                        // tempConvertedContent = tempConvertedContent.replace(/US/i, "");
                    // }
                    // //fix US$100
                    // if (convertedContent.substring(0, 3).toLowerCase() === "us$" || convertedContent.contains(" US$")) {
                        // tempConvertedContent = tempConvertedContent.replace(/US/i, "");
                    // }
                // }
                if (showOriginal) {
                    // console.log("tempConvertedContent " + tempConvertedContent);
                    tempConvertedContent = tempConvertedContent.replace("##__##", aPrice.full);
                    // console.log("tempConvertedContent " + tempConvertedContent);
                    tempConvertedContent = tempConvertedContent.replace("¤¤¤", replacedUnit);
                    // console.log("tempConvertedContent " + tempConvertedContent);
                }
                // if (replacedUnit === "USD") {
                    // // console.log("replacedUnit === USD")
                    // const otherDollarSigns = ["ARS", "CLD", "COP", "CUP", "DOP", "MXN", "PHP", "UYU", "AUD", "BBD", "BMD", "BND", "BSD", "BZD", "CAD", "FJD", "GYD", "HKD", "JMD", "KYD", "LRD", "NAD", "NZD", "SBD", "SGD", "SRD", "TTD", "TWD", "XCD"];
                    // const ignoreOtherDollars = function(aCurrency, anIndex, anArray) {
                            // const dollarIndex = convertedContent.indexOf("$");
                            // const cIndex = convertedContent.indexOf(aCurrency);
                            // // console.log(cIndex + "  " + dollarIndex + " ");
                            // return dollarIndex > -1 && cIndex > -1;
                    // };
                    // if (otherDollarSigns.some(ignoreOtherDollars)) {
                        // tempConvertedContent = convertedContent;
                    // }
                // }
                convertedContent = tempConvertedContent;
                elementTitleText += "~" + aPrice.full;
            };
                    // console.log("checkRegex.this " + this);
            replacedUnit = aCurrencyRegex.currency;
            if (currencyCode === replacedUnit) {
               return false;
            }
            var prices = findPrices(aCurrencyRegex.regex1, aNode.textContent, 3);
            if (prices.length === 0) {
                prices = findPrices(aCurrencyRegex.regex2, aNode.textContent, 1);
            }
            if (prices.length === 0) {
                return false;
            }
            else {
                matchFound = true;
            }
            conversionQuote = conversionQuotes[replacedUnit];
            conversionQuote = conversionQuote * (1 + quoteAdjustmentPercent / 100);
            prices.forEach(makeReplacement);
            return true;
        };
        // aReplacedUnit removed, taken from closure
        const makeCacheNodes = function(aNode, anElementTitleText, aConvertedContent) {
            // console.log("aNode.textContent " + aNode.textContent);
            // console.log("anElementTitleText " + anElementTitleText);
            // console.log("aConvertedContent " + aConvertedContent);
            // console.log: direct-currency-converter: aNode.textContent
            //            100 SEK
            // console.log: direct-currency-converter: aConvertedContent
                // 11,12 € (100 SEK)
            const documentFragment = document.createDocumentFragment();
            // if (DirectCurrencyContent.isEnabled) {
                // // aNode.parentNode.title = anElementTitleText;
                // // aNode.textContent = aConvertedContent;
            // }
            var title;
            if (anElementTitleText === "" || anElementTitleText.indexOf(replacedUnit) > -1) {
                title = anElementTitleText;
            }
            else {
                title = anElementTitleText + " [" + replacedUnit + "]";
            }
            documentFragment.appendChild(makeCacheNode("originalText", aNode.textContent, ""));
            documentFragment.appendChild(makeCacheNode("convertedText", aConvertedContent, title));
            return documentFragment;
        };
        convertedContent = aNode.textContent;
        elementTitleText = "";
        matchFound = false;
        // Don't check text without numbers
        if (/\d/.exec(aNode.textContent)) {
            // console.log("/[0-9]/");
            // Modifies convertedContent and elementTitleText
            enabledCurrenciesWithRegexes.some(checkRegex);
        }
        else {
            // console.log("!/[0-9]/");
        }
        if (!matchFound) {
            return;
        }
        elementTitleText = elementTitleText.substring(1);
        if (showOriginal) {
            elementTitleText = "";
        }
        aNode.parentNode.insertBefore(makeCacheNodes(aNode, elementTitleText, convertedContent), aNode);
        if (aNode.baseURI.indexOf("pdf.js") > -1) {
            if (aNode.parentNode) {
                aNode.parentNode.style.color = "black";
                aNode.parentNode.style.backgroundColor = "lightyellow";
                if (aNode.parentNode.parentNode) {
                    aNode.parentNode.parentNode.style.opacity = "1";
                }
            }
        }
        if (isEnabled) {
            substitute(aNode, false);
        }
    };
    //
    const getSekMultiplicator = function(aUnit) {
        if (aUnit.indexOf("miljoner") > -1) {
            return "miljoner ";
        }
        else if (aUnit.indexOf("miljon") > -1) {
            return "miljon ";
        }
        else if (aUnit.indexOf("miljarder") > -1) {
            return "miljarder ";
        }
        else if (aUnit.indexOf("miljard") > -1) {
            return "miljard ";
        }
        else if (aUnit.indexOf("mnkr") > -1) {
            return "mn ";
        }
        else if (aUnit.indexOf("mdkr") > -1) {
            return "md ";
        }
        else if (aUnit.toLowerCase().indexOf("mkr") > -1) {
            return "mn ";
        }
        else if (aUnit.indexOf("ksek") > -1) {
            return "k";
        }
        else if (aUnit.indexOf("msek") > -1) {
            return "M";
        }
        else if (aUnit.indexOf("gsek") > -1) {
            return "G";
        }
        return "";
    };
    const getDkkMultiplicator = function(aUnit) {
        if (aUnit.indexOf("millión") > -1) {
            return "millión ";
        }
        else if (aUnit.indexOf("miljón") > -1) {
            return "miljón ";
        }
        else if (aUnit.indexOf("milliard") > -1) {
            return "milliard ";
        }
        if (aUnit.indexOf("mia.") > -1) {
            return "mia. ";
        }
        if (aUnit.indexOf("mio.") > -1) {
            return "mio. ";
        }
        else if (aUnit.indexOf("million") > -1) {
            return "million ";
        }
        return "";
    };
    const getIskMultiplicator = function(aUnit) {
        if (aUnit.indexOf("milljón") > -1) {
            return "milljón ";
        }
        else if (aUnit.indexOf("milljarð") > -1) {
            return "milljarð ";
        }
        return "";
    };
    const getNokMultiplicator = function(aUnit) {
        if (aUnit.indexOf("milliard") > -1) {
            return "milliard";
        }
        else if (aUnit.indexOf("million") > -1) {
            return "million ";
        }
        return "";
    };
    // Stores prices that will be replaced with converted prices
    const findPrices = function(aRegex, aText, anAmountPosition) {
        const prices = [];
        // aRegex may be undefined in SM...
        if (aRegex == null) {
            return prices;
        }
        const makePrice = function(aMatch) {
            const price = {};
            price.amount = aMatch[anAmountPosition].trim();
            price.full = aMatch[0];
            price.index = aMatch.index;
            // console.log(price.amount + ";" + price.full + ";" + price.index);
            return price;
        };
        var match;
        while ((match = aRegex.exec(aText)) !== null) {
            // console.log(anAmountPosition);
            // console.log(match.index);
            // console.log(match);
            prices.push(makePrice(match));
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
    const convertAmount = function(anAmount, aConversionQuote) {
        var amount = anAmount;
        const commaIndex = amount.indexOf(",");
        const pointIndex = amount.indexOf(".");
        const apoIndex = amount.indexOf("'");
        const colonIndex = amount.indexOf(":");
        var spaceIndex = amount.indexOf(" ");
        if (spaceIndex < 0) {
            spaceIndex = amount.indexOf("\u00A0");
        }
        // 1 234,56; 1,234.56; 1.234,56; 1,23; 1.23; 1,234
        if (spaceIndex > -1) {
            amount = amount.replace(/,/g,".");
            amount = amount.replace(/\s/g,"");
        }
        else {
            if (commaIndex > -1 && pointIndex > -1) {
                if (commaIndex < pointIndex) {
                    // 1,000.00
                    amount = amount.replace(/,/g,"");
                    // 1000.00
                }
                else {
                    // 1.000,00
                    amount = amount.replace(/\./g,"");
                    // 1000,00
                    amount = amount.replace(/,/g,".");
                    // 1000.00
                }
            }
            else if (apoIndex > -1 && pointIndex > -1) {
                if (apoIndex < pointIndex) {
                    // 1'000.00
                    amount = amount.replace(/'/g,"");
                    // 1000.00
                }
                else {
                    // 1.000'00
                    amount = amount.replace(/\./g,"");
                    // 1000'00
                    amount = amount.replace(/'/g,".");
                    // 1000.00
                }
            }
            else if (apoIndex > -1 && commaIndex > -1) {
                if (apoIndex < commaIndex) {
                    // 1'000,00
                    amount = amount.replace(/'/g,"");
                    // 1000,00
                    amount = amount.replace(/,/g,".");
                    // 1000.00
                }
                else {
                    // 1,000'00
                    amount = amount.replace(/,/g,"");
                    // 1000'00
                    amount = amount.replace(/'/g,".");
                    // 1000.00
                }
            }
            else if (apoIndex > -1) {
                   // only apo
                const apoCount = amount.split("'").length - 1;
                var checkValidity = (amount.length - apoIndex - apoCount) % 3;
                if (amount.charAt(0) === "0" || checkValidity !== 0) {
                        // CHF 10'000.-.
                }
                else {
                    amount = amount.replace(/'/g,"");
                }
            }
            else if (pointIndex > -1) {
                   // only point
                const pointCount = amount.split(".").length - 1;
                var checkValidity = (amount.length - pointIndex - pointCount) % 3;
                if (amount.charAt(0) === "0" || checkValidity !== 0) {
                        //if < 1 or NOT of form 1,234,567 {
                }
                else {
                    amount = amount.replace(/\./g,"");
                }
            }
            else if (commaIndex > -1) {
                   // only commas
                const commaCount = amount.split(",").length - 1;
                var checkValidity = (amount.length - commaIndex - commaCount) % 3;
                if (amount.charAt(0) === "0" || checkValidity !== 0) {
                       //if < 1 or NOT of form 1,234,567
                    amount = amount.replace(/,/g,".");
                }
                else {
                    amount = amount.replace(/,/g,"");
                }
            }
            else if (colonIndex > -1) {
                // only colons
                const colonCount = amount.split(":").length - 1;
                var checkValidity = (amount.length - colonIndex - colonCount) % 3;
                if (amount.charAt(0) === "0" || checkValidity !== 0) {
                    amount = amount.replace(/:/g,".");
                }
                else {
                    amount = amount.replace(/:/g,"");
                }
            }
        }
        return aConversionQuote * amount;
    };
    const formatPrice = function(anAmount, aUnit, aMultiplicator) {
        var unit = aUnit;
        const fractionDigits = (roundAmounts && anAmount > 1) || unit === "mm" || unit === "kJ" ? 0 : 2;
        // 12.34 or 12
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
            formattedPrice = addThousandsSeparator(amountIntegralPart, customFormat.thousandsSeparator);
            if (hasFractionalPart) {
                formattedPrice = formattedPrice + customFormat.subUnitSeparator + amountFractionalPart;
            }
        }
        const amountUnitSeparator = customFormat.isAmountUnitSeparated ? "\u2009" : "";
        if (customFormat.unitAfter) {
            formattedPrice = formattedPrice + amountUnitSeparator + aMultiplicator + unit;
        }
        else {
            formattedPrice = unit + amountUnitSeparator + formattedPrice;
        }
        return " " + formattedPrice;
    };
    const addThousandsSeparator = function(anAmount, aThousandsSeparator) {
        const amountParts = anAmount.split(".");
        var x1 = amountParts[0];
        const x2 = amountParts.length > 1 ? "." + amountParts[1] : "";
        const regex = /(\d+)(\d{3})/;
        const thousandsSeparator = aThousandsSeparator === " " ? "\u00a0" : aThousandsSeparator;
        while (regex.test(x1)) {
            x1 = x1.replace(regex, "$1" + thousandsSeparator + "$2");
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
    const startObserve = function() {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        if (document === null || MutationObserver == null) {
            return;
        }
        const mutationHandler = function(aMutationRecord) {
            if (aMutationRecord.type === "childList") {
                // Can't use forEach on NodeList
                // Can't use const here - SyntaxError: invalid for/in left-hand side
                for (var i = 0; i < aMutationRecord.addedNodes.length; ++i) {
                    var node = aMutationRecord.addedNodes[i];
                    traverseDomTree(node);
                }
            }
        };
        const mutationsHandler = function(mutations) {
            mutations.forEach(mutationHandler);
        };
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
        // console.log("traverseDomTree.this " + this);
        // console.log("traverseDomTree.this.test " + this.test);
        // console.log("traverseDomTree.this.test.length " + this.test.length);
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
                originalChildNodes.push(aNode.childNodes[i]);
            }
            for (var i = 0; i < originalChildNodes.length; ++i) {
                var node = originalChildNodes[i];
                traverseDomTree(node);
            }
        }
    };
    const substitute = function(aNode, isShowOriginal) {
        if (aNode === null) {
            return;
        }
        const className = isShowOriginal ? ".originalText" : ".convertedText";
        var nodeList = aNode.parentNode.querySelectorAll(className);
        for (var i = 0; i < nodeList.length; ++i) {
            var node = nodeList[i];
            // Must be var, not const, in Chrome
            var originalNode = isShowOriginal ? node.nextSibling.nextSibling : node.nextSibling;
            originalNode.textContent = node.value;
            originalNode.parentNode.title = node.title;
        }
    };
    const onSendEnabledStatus = function(aStatus) {
        // console.log("content  onSendEnabledStatus ");
        // console.log("onSendEnabledStatus.this " + this);
        const isEnabled = aStatus.isEnabled;
        const hasConvertedElements = aStatus.hasConvertedElements;
        var message = "...";
        var process = true;
        const excludedLen = excludedDomains.length;
        for (var i = 0; i < excludedLen; i++) {
            const matcher = new RegExp(excludedDomains[i], "g");
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
                // console.log("line 553 ");
                traverseDomTree(document.body);
            }
            // console.log("message " + message);
            substitute(document.body, !isEnabled);
        }
    };
    const onUpdateSettings = function(contentScriptParams) {
        // console.log("content  onUpdateSettings ");
        // console.log("onUpdateSettings.this " + this);
        const tempConvertUnits = contentScriptParams.tempConvertUnits;
        var message = "...";
        var hasConvertedElements = false;
        // TODO show original again, but only if currency was changed
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
        customFormat.unitAfter = contentScriptParams.unitAfter;
        customFormat.thousandsSeparator = contentScriptParams.thousandSep;
        customFormat.subUnitSeparator = contentScriptParams.subUnitSeparator;
        customFormat.isAmountUnitSeparated = contentScriptParams.separatePrice;
        roundAmounts = contentScriptParams.roundAmounts;
        showOriginal = contentScriptParams.showOriginalPrices;
        quoteAdjustmentPercent = +contentScriptParams.quoteAdjustmentPercent;

        enabledCurrenciesWithRegexes.length = 0;
        for (var currency in contentScriptParams.enabledCurrencies) {
            // Add enabled currencies to enabledCurrenciesWithRegexes
            if (contentScriptParams.enabledCurrencies[currency]) {
                enabledCurrenciesWithRegexes.push(new CurrencyRegex(currency, regex1[currency], regex2[currency]));
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
        const excludedLen = contentScriptParams.excludedDomains.length;
        for (var i = 0; i < excludedLen; i++) {
            const matcher = new RegExp(contentScriptParams.excludedDomains[i], "g");
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
        // console.log(message);
        ContentAdapter.finish(hasConvertedElements);
        isEnabled = contentScriptParams.isEnabled;
    };
    return {
        onSendEnabledStatus : onSendEnabledStatus,
        onUpdateSettings : onUpdateSettings
    };
})();
