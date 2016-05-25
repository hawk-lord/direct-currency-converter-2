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
if (!this.DccFunctions) {
    const DccFunctions = (function(){
        "use strict";
        //console.log("DccFunctions");
        const allSubUnits = {
            "DKK": ["øre"],
            "NOK": ["øre"],
            "SEK": ["öre"],
            "USD": ["¢", "￠"]
        };
        const checkSubUnit = function(aPrice, aUnit) {
            const currencySubUnits = allSubUnits[aUnit];
            if (currencySubUnits) {
                for (let subUnit of currencySubUnits) {
                    if (aPrice.full.includes(subUnit)) {
                        return true;
                    }
                }
            }
            return false;
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
                let entry = this.multsIter.next();
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
            if (multies[aPrice.originalCurrency]) {
                return multies[aPrice.originalCurrency].func(aPrice.full.toLowerCase());
            }
            return "";
        };

        const addMonetaryGroupingSeparatorSymbol = function(anAmount, aMonetaryGroupingSeparatorSymbol) {
            let amount = anAmount;
            const regex = /(\d+)(\d{3})/;
            while (regex.test(amount)) {
                amount = amount.replace(regex, "$1" + aMonetaryGroupingSeparatorSymbol + "$2");
            }
            return amount;
        };

        const formatAmount = function(anAmountIntegralPart, anAmountFractionalPart, isSubUnit,
                                      aMonetaryGroupingSeparatorSymbol, aMonetarySeparatorSymbol) {
            // console.log("anAmountIntegralPart             " + anAmountIntegralPart);
            // console.log("anAmountFractionalPart           " + anAmountFractionalPart);
            // console.log("isSubUnit                        " + isSubUnit);
            // console.log("aMonetaryGroupingSeparatorSymbol " + aMonetaryGroupingSeparatorSymbol);
            // console.log("aMonetarySeparatorSymbol         " + aMonetarySeparatorSymbol);
            // console.log("-----------------------------------");

            let formattedPrice;
            const hasFractionalPart = anAmountFractionalPart !== "";
            if (anAmountIntegralPart === "0" && hasFractionalPart && isSubUnit) {
                formattedPrice = anAmountFractionalPart.replace(/^0+/, "");
            }
            else {
                const monetaryGroupingSeparatorSymbol = aMonetaryGroupingSeparatorSymbol === " " ? "\u00a0" : aMonetaryGroupingSeparatorSymbol;
                formattedPrice = addMonetaryGroupingSeparatorSymbol(anAmountIntegralPart, monetaryGroupingSeparatorSymbol);
                if (hasFractionalPart) {
                    formattedPrice = formattedPrice + aMonetarySeparatorSymbol + anAmountFractionalPart;
                }
            }
            return formattedPrice;
        };

        const formatPrice = function(aCurrencyCode, aRoundAmounts, anAmount, aUnit, anAllowSubUnit, aCustomFormat,
                                     aMultiplicator) {
            // console.log("anAmount              " + anAmount);
            // console.log("aUnit                 " + aUnit);
            // console.log("aMultiplicator        " + aMultiplicator);
            // console.log("aRoundAmounts         " + aRoundAmounts);
            // console.log("aCurrencyCode         " + aCurrencyCode);
            // console.log("aCustomFormat         " + aCustomFormat);
            // console.log("-----------------------------------");
            const subUnits = {"EUR": "cent", "RUB" : "коп.", "SEK": "öre"};
            const subUnit = subUnits[aCurrencyCode];
            const fractionDigits = (aRoundAmounts && anAmount > 1) || aUnit === "mm" || aUnit === "kJ" ? 0 : 2;
            const amountString = anAmount.toFixed(fractionDigits);
            const amountParts = amountString.split(".");
            const amountIntegralPart = amountParts[0];
            const amountFractionalPart = amountParts.length > 1 ? amountParts[1] : "";
            const isSubUnit = anAllowSubUnit && (subUnit !== undefined) && amountIntegralPart === "0" && amountFractionalPart !== "";
            let formattedPrice = formatAmount(amountIntegralPart, amountFractionalPart, isSubUnit,
                aCustomFormat.monetaryGroupingSeparatorSymbol, aCustomFormat.monetarySeparatorSymbol);
            if (aCustomFormat.beforeCurrencySymbol) {
                formattedPrice = formattedPrice + aCustomFormat.currencySpacing + aMultiplicator + (isSubUnit ? subUnit : aUnit);
            }
            else {
                formattedPrice = (isSubUnit ? subUnit : aUnit) + aCustomFormat.currencySpacing + formattedPrice + aMultiplicator;
            }
            return " " + formattedPrice;
        };

        const useUnit = function (aReplacedUnit, aCurrencySymbol){
            const otherUnits = {
                "inch": "mm",
                "kcal": "kJ",
                "nmi": "km",
                "mile": "km",
                "mil": "km",
                "knots": "km/h",
                "hp": "kW"
            };
            return otherUnits[aReplacedUnit] ? otherUnits[aReplacedUnit] : aCurrencySymbol;
        };

        const parseAmount = function(anAmount) {
            let amount = anAmount;
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

        const convertAmount = function(aConversionQuote, aParsedAmount, aPrice, aReplacedUnit) {
            return aConversionQuote * aParsedAmount * (checkSubUnit(aPrice, aReplacedUnit) ? 1/100 : 1);
        };

        const convertContent = function(aConvertedPrice, aConvertedContent, aShowOriginalPrices, aReplacedUnit,
                                        aShowOriginalCurrencies, aPrice) {
            let convertedPrice = aConvertedPrice;
            let convertedContent = aConvertedContent;
            if (aShowOriginalPrices) {
                if (!convertedContent.includes(aReplacedUnit) && aShowOriginalCurrencies) {
                    convertedPrice = convertedPrice + " (##__## [¤¤¤])";
                }
                else {
                    convertedPrice = convertedPrice + " (##__##)";
                }
            }
            convertedContent = convertedContent.substring(0, aPrice.positionInString) +
                convertedContent.substring(aPrice.positionInString, convertedContent.length).replace(aPrice.full, convertedPrice);
            if (aShowOriginalPrices) {
                convertedContent = convertedContent.replace("##__##", aPrice.full);
                convertedContent = convertedContent.replace("¤¤¤", aReplacedUnit);
            }
            return convertedContent;
        };

        // Stores prices that will be replaced with converted prices
        const findPricesInCurrency = function(anOriginalCurrency, aCurrency, aRegex, aText, anAmountPosition) {
            const prices = [];
            if (aRegex == null) {
                return prices;
            }
            let match;
            while ((match = aRegex.exec(aText)) !== null) {
                prices.push(new Price(anOriginalCurrency, aCurrency, match, anAmountPosition));
            }
            return prices;
        };

        const findPrices = function(anEnabledCurrenciesWithRegexes, aCurrencyCode, aTextContent) {
            let prices;
            for (let currencyRegex of anEnabledCurrenciesWithRegexes) {
                if (currencyRegex.currency === aCurrencyCode) {
                    continue;
                }
                prices = findPricesInCurrency(aCurrencyCode, currencyRegex.currency, currencyRegex.regex1, aTextContent, 3);
                if (prices.length === 0) {
                    prices = findPricesInCurrency(aCurrencyCode, currencyRegex.currency, currencyRegex.regex2, aTextContent, 1);
                }
                if (prices.length === 0) {
                    continue;
                }
                break;
            }
            // console.log("findPrices prices.length " + prices.length);
            return prices;
        };

        const isExcludedDomain = function(anExcludedDomains, anUrl) {
            for (let excludedDomain of anExcludedDomains) {
                const matcher = new RegExp(excludedDomain, "g");
                if (matcher.test(anUrl)){
                    return true;
                }
            }
            return false;
        };

        return {
            checkSubUnit: checkSubUnit,
            multies: multies,
            getMultiplicator: getMultiplicator,
            addMonetaryGroupingSeparatorSymbol: addMonetaryGroupingSeparatorSymbol,
            formatAmount: formatAmount,
            formatPrice: formatPrice,
            useUnit: useUnit,
            parseAmount: parseAmount,
            convertAmount: convertAmount,
            convertContent: convertContent,
            findPricesInCurrency: findPricesInCurrency,
            findPrices: findPrices,
            isExcludedDomain: isExcludedDomain
        }
    })();
    this.DccFunctions = DccFunctions;
}

if (!this.Price) {
    const Price = function(aCurrency, anOriginalCurrency, aMatch, anAmountPosition) {
        "use strict";
        this.originalCurrency = anOriginalCurrency;
        this.currency = aCurrency;
        // 848,452.63
        this.amount = aMatch[anAmountPosition].trim();
        // 848,452.63 NOK
        this.full = aMatch[0];
        // 1 (position in the string where the price was found)
        this.positionInString = aMatch.index;
    };
    this.Price = Price;
}

if (!this.CurrencyRegex) {
    const CurrencyRegex = function (aCurrency, aRegex1, aRegex2) {
        "use strict";
        this.currency = aCurrency;
        this.regex1 = aRegex1;
        this.regex2 = aRegex2;
    };
    this.CurrencyRegex = CurrencyRegex;
}

if (!this.DirectCurrencyContent) {
    const DirectCurrencyContent = (function(aDccFunctions) {
        "use strict";
        if (!String.prototype.includes) {
            String.prototype.includes = function() {'use strict';
                return String.prototype.indexOf.apply(this, arguments) !== -1;
            };
        }
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


        const replaceCurrency = function(aNode) {
            // console.log("replaceCurrency");
            // Don't check text without numbers
            if (!/\d/.exec(aNode.textContent)) {
                return;
            }
            // console.log("aNode.parentNode " + aNode.parentNode);
            // console.log("aNode.parentNode.className " + aNode.parentNode.className);
            // console.log("typeof aNode.parentNode.className " + typeof aNode.parentNode.className);
            // Can be [object SVGAnimatedString]
            // console.log("aNode.parentNode.className === string " + (typeof aNode.parentNode.className === "string"));
            // if (typeof aNode.parentNode.className === "string") {
            //     console.log("aNode.parentNode.className.includes(\"dccConverted\") " + aNode.parentNode.className.includes("dccConverted"));
            // };
            // Extra check of "string" for Chrome
            if (aNode.parentNode
                && aNode.parentNode.className
                && typeof aNode.parentNode.className === "string"
                && aNode.parentNode.className.includes("dccConverted")) {
                return;
            }
            // console.log("replaceCurrency continues");
            const prices = aDccFunctions.findPrices(enabledCurrenciesWithRegexes, currencyCode, aNode.textContent);
            if (prices.length === 0) {
                return;
            }
            const replacedUnit = prices[0].originalCurrency;
            const conversionQuote = conversionQuotes[replacedUnit] * (1 + quoteAdjustmentPercent / 100);
            let tempAmount;
            let tempConvertedAmount;
            let convertedContent = aNode.textContent;
            for (let price of prices) {
                const parsedAmount = aDccFunctions.parseAmount(price.amount);
                const convertedAmount = aDccFunctions.convertAmount(conversionQuote, parsedAmount, price, replacedUnit);
                const usedUnit = aDccFunctions.useUnit(replacedUnit, currencySymbol);
                const multiplicator = aDccFunctions.getMultiplicator(price);
                const convertedPrice = aDccFunctions.formatPrice(currencyCode, roundAmounts, convertedAmount, usedUnit,
                    true, customFormat, multiplicator);
                convertedContent = aDccFunctions.convertContent(convertedPrice, convertedContent, showOriginalPrices,
                    replacedUnit, showOriginalCurrencies, price);
                // console.log("convertedContent " + convertedContent);
            }
            for (let price of prices) {
                // FIXME show all amounts
                const isFromSubUnit = aDccFunctions.checkSubUnit(price, replacedUnit);
                tempAmount = aDccFunctions.parseAmount(price.amount)  * (isFromSubUnit ? 1/100 : 1) ;
            }
            for (let price of prices) {
                // FIXME show all amounts
                const isFromSubUnit = aDccFunctions.checkSubUnit(price, replacedUnit);
                const convertedAmount = conversionQuote * aDccFunctions.parseAmount(price.amount) * (isFromSubUnit ? 1/100 : 1);
                tempConvertedAmount = convertedAmount;
            }
            /* FIXME use this old title creation
            let elementTitleText = "";
            for (let price of prices) {
                elementTitleText += " ~ " + price.full;
            }
            elementTitleText = elementTitleText.substring(3);
            if (showOriginalPrices) {
                elementTitleText = "";
            }
            */

            aNode.parentNode.dataset.dccConvertedContent = convertedContent;
            if (!aNode.parentNode.dataset.dccOriginalContent) {
                aNode.parentNode.dataset.dccOriginalContent = aNode.textContent;
            }
            if (!aNode.parentNode.className.includes("dccConverted")) {
                aNode.parentNode.className += " dccConverted";
            }


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
                let dccTitle = "Converted value: ";
                dccTitle += aDccFunctions.formatPrice(currencyCode, roundAmounts, tempConvertedAmount, currencyCode, false, customFormat, "") + "\n";
                dccTitle += "Original value: ";
                dccTitle += aDccFunctions.formatPrice(replacedUnit, roundAmounts, tempAmount, replacedUnit, false, customFormat, "") + "\n";
                dccTitle += "Conversion quote " + replacedUnit + "/" + currencyCode + " = " +
                    aDccFunctions.formatPrice("", roundAmounts, conversionQuote, "", false, customFormat, "") + "\n";
                dccTitle += "Conversion quote " + currencyCode + "/" + replacedUnit + " = " +
                    aDccFunctions.formatPrice("", roundAmounts, 1/conversionQuote, "", false, customFormat, "");
                substitute(aNode, false, dccTitle);
            }
        };


        const mutationHandler = function(aMutationRecord) {
            // console.log("aMutationRecord.type " + aMutationRecord.type);
            if (aMutationRecord.type === "childList") {
                for (let i = 0; i < aMutationRecord.addedNodes.length; ++i) {
                    let node = aMutationRecord.addedNodes[i];
                    traverseDomTree(node);
                }
            }
        };

        const mutationsHandler = function(aMutations) {
            aMutations.forEach(mutationHandler);
        };

        const startObserve = function() {
            // console.log("startObserve");
            const mutationObserver = new MutationObserver(mutationsHandler);
            const mutationObserverInit = {
                childList: true,
                attributes: false,
                characterData: false,
                subtree: true,
                attributeOldValue: false,
                characterDataOldValue: false
            };
            if (document.body !== null) {
                mutationObserver.observe(document.body, mutationObserverInit);
            }
        };

        const resetDomTree = function(aNode) {
            // console.log("resetDomTree");
            if (aNode === null) {
                return;
            }
            const nodeList = aNode.parentNode.querySelectorAll(".dccConverted");
            // console.log(nodeList.length);
            for (let i = 0; i < nodeList.length; ++i) {
                let node = nodeList[i];
                if (node.dataset && node.dataset.dccOriginalContent) {
                    delete node.dataset.dccOriginalContent;
                }
                if (node.dataset && node.dataset.dccConvertedContent) {
                    delete node.dataset.dccConvertedContent;
                }
                node.className = node.className.replace("dccConverted", "");
                // console.log(node.className);
            }
        };

        const traverseDomTree = function(aNode) {
            // console.log("traverseDomTree");
            if (aNode !== null) {
                // The third check takes care of Google Images code "<div class=rg_meta>{"cb":3, ..."
                if (aNode.nodeType === Node.TEXT_NODE && !/^\s*$/.test(aNode.nodeValue) && !/\{/.test(aNode.nodeValue)) {
                    if (aNode.parentNode !== null && skippedElements.indexOf(aNode.parentNode.tagName.toLowerCase()) === -1) {
                        replaceCurrency(aNode);
                    }
                }
                // Not optimized: unsupported phi use of const variable
                // const originalChildNodes = [];
                let originalChildNodes = [];
                for (let i = 0; i < aNode.childNodes.length; ++i) {
                    let node = aNode.childNodes[i];
                    originalChildNodes.push(node);
                }
                for (let i = 0; i < originalChildNodes.length; ++i) {
                    let node = originalChildNodes[i];
                    traverseDomTree(node);
                }
            }
        };

        const substitute = function(aNode, isShowOriginal, aDccTitle) {
            // console.log("substitute");
            if (aNode === null) {
                return;
            }
            // console.log("aDccTitle " + aDccTitle);
            // console.log("aNode.nodeName " + aNode.nodeName);
            // console.log("aNode.textContent " + aNode.textContent);
            // console.log("aNode.parentNode.nodeName " + aNode.parentNode.nodeName);
            // console.log("aNode.parentNode.textContent " + aNode.parentNode.textContent);
            if (aNode.parentNode.dataset && aNode.parentNode.dataset.dccOriginalContent) {
                // console.log("aNode.parentNode.dataset.dccOriginalContent " + aNode.parentNode.dataset.dccOriginalContent);
                if (aDccTitle) {
                    aNode.parentNode.dataset.dcctitle = aDccTitle;
                }
            }
            //console.log(isShowOriginal);
            //console.log(aReplacedUnit);

            const nodeList = aNode.parentNode.querySelectorAll(".dccConverted");
            // console.log(nodeList.length);
            for (let i = 0; i < nodeList.length; ++i) {
                let node = nodeList[i];
                if (node.dataset && node.dataset.dccOriginalContent && node.dataset.dccConvertedContent) {
                    node.textContent = isShowOriginal ? node.dataset.dccOriginalContent : node.dataset.dccConvertedContent;
                    // TODO this won't happen
                    if (aDccTitle) {
                        node.dataset.dcctitle = aDccTitle;
                    }
                }
            }
            // console.log("substitute done");
        };

        const onSendEnabledStatus = function(aStatus) {
            // console.log("onSendEnabledStatus");
            if (aDccFunctions.isExcludedDomain(excludedDomains, document.URL)) {
                return;
            }
            if (aStatus.isEnabled && !aStatus.hasConvertedElements) {
                // console.log("aStatus.isEnabled && !aStatus.hasConvertedElements");
                startObserve();
                traverseDomTree(document.body);
            }
            substitute(document.body, !aStatus.isEnabled);
        };

        const onUpdateSettings = function(contentScriptParams) {
            // console.log("onUpdateSettings");
            const tempConvertUnits = contentScriptParams.tempConvertUnits;
            let message = "...";
            let hasConvertedElements = false;
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

            const afterRegexesCreated = function() {
                "use strict";
                enabledCurrenciesWithRegexes.length = 0;
                for (let currency of contentScriptParams.convertFroms) {
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
                let process = true;
                for (let excludedDomain of contentScriptParams.excludedDomains) {
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
                    // console.log("afterRegexesCreated");
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

            if(typeof Promise !== "undefined" && Promise.toString().includes("[native code]")){
                const promise2 = new Promise(
                    function(resolve, reject) {
                        // console.log("promise2");
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
                //).catch(
                //    function (err) {
                //        console.error("promise2 catch " + err);
                //    }
                );
            }
            else {
                afterRegexesCreated();
            }

        };
        return {
            onSendEnabledStatus : onSendEnabledStatus,
            onUpdateSettings : onUpdateSettings
        };
    })(this.DccFunctions);
    this.DirectCurrencyContent = DirectCurrencyContent;
}