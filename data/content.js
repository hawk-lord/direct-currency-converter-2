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
    "use strict";
    var conversionQuotes = [];
    var currencyCode = "";
    var currencySymbol = "¤";
    const customFormat = {"unitAfter" : true, "thousandsSeparator" : " ", "subUnitSeparator" : ",", "isAmountUnitSeparated" : true};
    var excludedDomains = [];
    var isEnabled = true;
    var quoteAdjustmentPercent = 0;
    const regex1 = {};
    const regex2 = {};
    const regexArray = [];
    var roundAmounts = false;
    var showOriginal = false;
    const skippedElements = ["audio", "button", "embed", "head", "img", "noscript", "object", "script", "select", "style", "textarea", "video"];
    const subUnits = {"EUR" : "cent", "RUB" : "коп."};
    const makePriceRegexes = function(aRegex1, aRegex2) {
        aRegex1.USD = /((\$\s?|USD\s?)(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9})))/ig;
        aRegex2.USD = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?\$|\s?USD))/ig;
        aRegex1.GBP = /((\£\s?|GBP\s?)(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9})))/ig;
        aRegex2.GBP = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?\£|\s?GBP))/ig;
        aRegex1.EUR = /((\€\s?|euro\s?|EUR\s?)(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9})))/ig;
        aRegex2.EUR = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?\€|\s?euro|\s?EUR))/ig;
        aRegex1.JPY = /((\¥\s?|\yen\s?|JPY\s?)(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9})))/ig;
        aRegex2.JPY = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?\¥|\s?\yen|\s?JPY))/ig;
        aRegex1.RUB = /((RUB\s?)(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9})))/ig;
        aRegex2.RUB = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?\р\.|\s?\Р\.|\s?\р\у\б\.|\s?\р\у\б\л\е\й|\s?\р\у\б\л\ь|\s?\р\у\б|\s?rubles|\s?ruble|\s?RUB))/ig;
        aRegex1.SEK = /((\kr\s?|skr\s?|SEK\s?)(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,|\:)\d{1,9})?)))/ig;
        aRegex2.SEK = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,|\:)\d{1,9})?)|(\.\d{1,9}))(\s?öre|\s?(svenska\s)?kronor|\s?miljon(er)? kronor|\s?miljard(er)? kronor|\s?mnkr|\s?mdkr|\s?mkr|\s?s?kr((?![a-zó])|$)|\s?kSEK|\s?MSEK|\s?GSEK|\s?SEK|\:\-|\,\-)(?!\w))/ig;
        aRegex1.NOK = /((\kr\s?|nkr\s?|NOK\s?)(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9})))/ig;
        aRegex2.NOK = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?milliard(er)? kroner|\s?million(er)? kroner|\s?kroner|\s?kr[\.\s]|\s?nkr|\s?NOK|\:\-|\,\-)(?!\w))/ig;
        aRegex1.DKK = /((\kr\s?|\kr.\s?|dkr\s?|DKK\s?)(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9})))/ig;
        aRegex2.DKK = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?mio\. kroner|\s?million(er)? kroner|\s?mia\. kroner|\s?kroner|s?mia\. krónur|\s?milliard(ir)? krónur?|s?mio\. krónur|\s?millión(ir)? krónur?|\s?miljón(ir)? krónur?|\s?krónur?|\s?kr|\s?dkr|\s?DKK|\:\-|\,\-)(?!\w))/ig;
        aRegex1.ISK = /((\kr\s?|iskr\s?|ISK\s?)(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9})))/ig;
        aRegex2.ISK = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?milljarð(ar)?(ur)? króna|\s?milljón(a)?(ir)?(um)? króna|\s?króna?(ur)?|\s?kr|\s?iskr|\s?ISK|\:\-|\,\-)(?!\w))/ig;
        aRegex1.CHF = /((Fr\.\s?|CHF\s?)(((\d{1,3}((\'|\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9})))/ig;
        aRegex2.CHF = /((((\d{1,3}((\'|\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?Fr\.|\s?Franken|\s?CHF))/ig;
        aRegex1.inch = /NOMATCH/ig;
        aRegex2.inch = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?tum|\-tums?|\s?\"|\s?\″)(?!\w))/ig;
        aRegex1.kcal = /NOMATCH/ig;
        aRegex2.kcal = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?kcal|\s?kalorier)(?!\w))/ig;
        aRegex1.nmi = /NOMATCH/ig;
        aRegex2.nmi = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?sjömil|\s?nautiska mil?|\s?nautical miles?)(?!\w))/ig;
        aRegex1.mile = /NOMATCH/ig;
        aRegex2.mile = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?mile|\s?miles)(?!\w))/ig;
        aRegex1.mil = /NOMATCH/ig;
        aRegex2.mil = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?mil)(?!\w))/ig;
        aRegex1.knots = /NOMATCH/ig;
        aRegex2.knots = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?knop)(?!\w))/ig;
        aRegex1.hp = /NOMATCH/ig;
        aRegex2.hp = /((((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)|(\.\d{1,9}))(\s?hästkrafter|\s?hkr?|\s?hp)(?!\w))/ig;
    };
    //
    makePriceRegexes(regex1, regex2);
    //
    const replaceCurrency = function(aNode) {
        // convertedContent goes here if callback functions are declared inside replaceCurrency
        var convertedContent = "";
        var matchFound = false;
        var replacedUnit = "";
        var elementTitleText = "";
        const checkRegex = function(aRegex, anIndex, anArray) {
            var conversionQuote = 1;
            const makeReplacement = function(aPrice, anIndex, anArray) {
                var tempConversionQuote = conversionQuote;
                if (replacedUnit === "SEK" && aPrice.unit.toLowerCase().contains("öre")) {
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
                    multiplicator = getSekMultiplicator(aPrice.unit.toLowerCase());
                }
                else if (replacedUnit === "DKK") {
                    multiplicator = getDkkMultiplicator(aPrice.unit.toLowerCase());
                }
                else if (replacedUnit === "ISK") {
                    multiplicator = getIskMultiplicator(aPrice.unit.toLowerCase());
                }
                else if (replacedUnit === "NOK") {
                    multiplicator = getNokMultiplicator(aPrice.unit.toLowerCase());
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
                    if (convertedContent.contains(replacedUnit)) {
                        convertedPrice = convertedPrice + " (##__##)";
                    }
                    else {
                        convertedPrice = convertedPrice + " (##__## [¤¤¤])";
                    }
                }
                // console.log("convertedContent " + convertedContent);
                // aPrice.unit 50.000 krónur
                // console.log("aPrice.unit " + aPrice.unit);
                // convertedPrice 6 700,00 € (##__##)
                // console.log("convertedPrice " + convertedPrice);
                // var tempConvertedContent = convertedContent.replace(aPrice.unit, convertedPrice);
                var tempConvertedContent = convertedContent.substring(0, aPrice.index) +
                   convertedContent.substring(aPrice.index, convertedContent.length).replace(aPrice.unit, convertedPrice);
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
                    tempConvertedContent = tempConvertedContent.replace("##__##", aPrice.unit);
                    // console.log("tempConvertedContent " + tempConvertedContent);
                    tempConvertedContent = tempConvertedContent.replace("¤¤¤", replacedUnit);
                    // console.log("tempConvertedContent " + tempConvertedContent);
                }
                if (replacedUnit === "USD") {
                    // console.log("replacedUnit === USD")
                    const otherDollarSigns = ["ARS", "CLD", "COP", "CUP", "DOP", "MXN", "PHP", "UYU", "AUD", "BBD", "BMD", "BND", "BSD", "BZD", "CAD", "FJD", "GYD", "HKD", "JMD", "KYD", "LRD", "NAD", "NZD", "SBD", "SGD", "SRD", "TTD", "TWD", "XCD"];
                    const ignoreOtherDollars = function(aCurrency, anIndex, anArray) {
                            const dollarIndex = convertedContent.indexOf("$");
                            const cIndex = convertedContent.indexOf(aCurrency);
                            // console.log(cIndex + "  " + dollarIndex + " ");
                            return dollarIndex > -1 && cIndex > -1;
                    };
                    if (otherDollarSigns.some(ignoreOtherDollars)) {
                        tempConvertedContent = convertedContent;
                    }
                    
                }
                convertedContent = tempConvertedContent;
                elementTitleText += "~" + aPrice.unit;
            };
                    // console.log("checkRegex.this " + this);
            replacedUnit = aRegex.currency;
            if (currencyCode === replacedUnit) {
               return false;
            }
            var prices = findPrices(aRegex.regex1, aNode.textContent, 3, 0);
            if (prices.length === 0) {
                prices = findPrices(aRegex.regex2, aNode.textContent, 2, 0);
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
        const makeCacheNodes = function(aNode, anElementTitleText, aConvertedContent, aReplacedUnit) {
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
            if (anElementTitleText === "" || anElementTitleText.contains(replacedUnit)) {
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
        if (/[0-9]/.exec(aNode.textContent)) {
            console.log("/[0-9]/");
            // Modifies convertedContent and elementTitleText
            regexArray.some(checkRegex);
        }
        else {
            console.log("!/[0-9]/");
        }
        if (!matchFound) {
            return;
        }
        elementTitleText = elementTitleText.substring(1);
        if (showOriginal) {
            elementTitleText = "";
        }
        aNode.parentNode.insertBefore(makeCacheNodes(aNode, elementTitleText, convertedContent, replacedUnit), aNode);
        if (aNode.baseURI.contains("pdf.js")) {
            aNode.parentNode.style.color = "black";
            aNode.parentNode.style.backgroundColor = "lightyellow";
        }
        if (isEnabled) {
            substitute(aNode, false);
        }
    };
    //
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
    const findPrices = function(aRegex, aText, anAmountPosition, aUnitPosition) {
        const prices = [];
        if (aRegex === null) {
            return prices;
        }
        var match = [];
        while (match = aRegex.exec(aText)) {
// // Simple regular expression to match http / https / ftp-style URLs.
// var parsedURL = /^(\w+)\:\/\/([^\/]+)\/(.*)$/.exec(url);
// if (!parsedURL)
  // return null;
// var [, protocol, fullhost, fullpath] = parsedURL;
            const price = {};
            price.amount = match[anAmountPosition];
            price.unit = match[aUnitPosition];
            price.index = match.index;
            prices.push(price);
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
                let checkValidity = (amount.length - apoIndex - apoCount) % 3;
                if (amount.charAt(0) === "0" || checkValidity !== 0) {
                        // CHF 10'000.-.
                }
                else {
                    amount = amount.replace(/\'/g,"");
                }
            }
            else if (pointIndex > -1) {
                   // only point
                const pointCount = amount.split(".").length - 1;
                let checkValidity = (amount.length - pointIndex - pointCount) % 3;
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
                let checkValidity = (amount.length - commaIndex - commaCount) % 3;
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
                let checkValidity = (amount.length - colonIndex - colonCount) % 3;
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
        if (anAmount < 1 && hasFractionalPart && currencyCode in subUnits  && aMultiplicator === "") {
            formattedPrice = amountFractionalPart;
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
        return formattedPrice;
    };
    const addThousandsSeparator = function(anAmount, thousandsSeparator) {
        const amountParts = anAmount.split(".");
        var x1 = amountParts[0];
        const x2 = amountParts.length > 1 ? "." + amountParts[1] : "";
        const regex = /(\d+)(\d{3})/;
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
        if (document === null || MutationObserver === null) {
            return;
        }
        const mutationHandler = function(aMutationRecord, anIndex, anArray) {
            if (aMutationRecord.type === "childList") {
                // Can't use forEach on NodeList
                for (var node of aMutationRecord.addedNodes) {
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
        for (var node of aNode.querySelectorAll(".convertedText, .originalText")) {
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
            for (var node of aNode.childNodes) {
                traverseDomTree(node);
            }
        }
    };
    const substitute = function(aNode, isShowOriginal) {
        if (aNode === null) {
            return;
        }
        const className = isShowOriginal ? ".originalText" : ".convertedText";
        for (var node of aNode.parentNode.querySelectorAll(className)) {
            const originalNode = isShowOriginal ? node.nextSibling.nextSibling : node.nextSibling;
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

        for (var currency in contentScriptParams.enabledCurrencies) {
            if (contentScriptParams.enabledCurrencies[currency]) {
                const regexObj = {};
                regexObj.currency = currency;
                regexObj.regex1 = regex1[regexObj.currency];
                regexObj.regex2 = regex2[regexObj.currency];
                regexArray.push(regexObj);
            }
        }
        if (tempConvertUnits) {
            const regexObj_inch = {};
            regexObj_inch.currency = "inch";
            regexObj_inch.regex1 = regex1.inch;
            regexObj_inch.regex2 = regex2.inch;
            regexArray.push(regexObj_inch);
        }
        if (tempConvertUnits) {
            const regexObj_kcal = {};
            regexObj_kcal.currency = "kcal";
            regexObj_kcal.regex1 = regex1.kcal;
            regexObj_kcal.regex2 = regex2.kcal;
            regexArray.push(regexObj_kcal);
        }
        if (tempConvertUnits) {
            const regexObj_nmi = {};
            regexObj_nmi.currency = "nmi";
            regexObj_nmi.regex1 = regex1.nmi;
            regexObj_nmi.regex2 = regex2.nmi;
            regexArray.push(regexObj_nmi);
        }
        if (tempConvertUnits) {
            const regexObj_mile = {};
            regexObj_mile.currency = "mile";
            regexObj_mile.regex1 = regex1.mile;
            regexObj_mile.regex2 = regex2.mile;
            regexArray.push(regexObj_mile);
        }
        if (tempConvertUnits) {
            const regexObj_mil = {};
            regexObj_mil.currency = "mil";
            regexObj_mil.regex1 = regex1.mil;
            regexObj_mil.regex2 = regex2.mil;
            regexArray.push(regexObj_mil);
        }
        if (tempConvertUnits) {
            const regexObj_knots = {};
            regexObj_knots.currency = "knots";
            regexObj_knots.regex1 = regex1.knots;
            regexObj_knots.regex2 = regex2.knots;
            regexArray.push(regexObj_knots);
        }
        if (tempConvertUnits) {
            const regexObj_hp = {};
            regexObj_hp.currency = "hp";
            regexObj_hp.regex1 = regex1.hp;
            regexObj_hp.regex2 = regex2.hp;
            regexArray.push(regexObj_hp);
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
                // console.log("line 663 ");
                traverseDomTree(document.body);
                substitute(document.body, false);
                hasConvertedElements = true;
            }
        }
        self.port.emit("finishedTabProcessing", hasConvertedElements);
        isEnabled = contentScriptParams.isEnabled;
    };
    return {
        onSendEnabledStatus : onSendEnabledStatus,
        onUpdateSettings : onUpdateSettings
    };
})();
// end DirectCurrencyContent

// Left-click
self.port.on("sendEnabledStatus", DirectCurrencyContent.onSendEnabledStatus);
// Right-click
self.port.on("updateSettings", DirectCurrencyContent.onUpdateSettings);


    // // Experiments
    // //$("p").click(alert("p clicked"));
    // // aNode.onclick = function() {
    // // alert(aNode.textContent);
//
    // document.body.onclick = function() {
        // console.log("body clicked");
    // };
    // $("body").onclick = function() {
        // console.log("Jquery body clicked");
    // };
    // var doit = function(e) {
        // var elementClickedOn = e.target;
        // //can experiement with e.originalTarget, e.currentTarget, and some others like explicitOriginalTarget, one of them gets you the text node you clicked on
        // alert('you clicked on: ' + elementClickedOn.nodeName);
    // };
    // document.addEventListener('click', doit, false);

// $("td").on("click", alert("Hej"));
// function getColumnID() {
    // var $td = $(this),
        // $th = $td.closest('table').find('th').eq($td.index());
    // console.log($th.attr("id"));
// }//
