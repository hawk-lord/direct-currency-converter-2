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

        const MinorUnit = function(code, decimals, names) {
            this.code = code;
            this.decimals = decimals;
            this.names = names;
        };

        const minorUnits = [];
        minorUnits.push(new MinorUnit("AED", 2, ["fils", "fulus"]));
        minorUnits.push(new MinorUnit("AFN", 2, ["pul"]));
        minorUnits.push(new MinorUnit("ALL", 2, ["qindarkë", "qindarka"]));
        minorUnits.push(new MinorUnit("AMD", 2, ["luma"]));
        minorUnits.push(new MinorUnit("ANG", 2, ["cent"]));
        minorUnits.push(new MinorUnit("AOA", 2, ["cêntimo", "centimo"]));
        minorUnits.push(new MinorUnit("ARS", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("AUD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("AWG", 2, ["cent"]));
        minorUnits.push(new MinorUnit("AZN", 2, ["qapik"]));
        minorUnits.push(new MinorUnit("BAM", 2, ["pf"]));
        minorUnits.push(new MinorUnit("BBD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("BDT", 2, ["poisha"]));
        minorUnits.push(new MinorUnit("BGN", 2, ["stotinka", "stotinki"]));
        minorUnits.push(new MinorUnit("BHD", 3, ["fils"]));
        minorUnits.push(new MinorUnit("BIF", 0, []));
        minorUnits.push(new MinorUnit("BMD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("BND", 2, ["cent"]));
        minorUnits.push(new MinorUnit("BOB", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("BOV", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("BRL", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("BSD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("BTN", 2, ["chhertum"]));
        minorUnits.push(new MinorUnit("BWP", 2, ["thebe"]));
        minorUnits.push(new MinorUnit("BYN", 2, ["kopek", "капейка", "капейкі"]));
        minorUnits.push(new MinorUnit("BZD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("CAD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("CDF", 2, ["centime"]));
        minorUnits.push(new MinorUnit("CHE", 2, ["rappen", "centime", "centesimo", "centesimi", "rap"]));
        minorUnits.push(new MinorUnit("CHF", 2, ["rappen", "centime", "centesimo", "centesimi", "rap"]));
        minorUnits.push(new MinorUnit("CHW", 2, ["rappen", "centime", "centesimo", "centesimi", "rap"]));
        minorUnits.push(new MinorUnit("CLF", 4, []));
        minorUnits.push(new MinorUnit("CLP", 0, []));
        minorUnits.push(new MinorUnit("CNY", 2, ["fen", "fēn"]));
        minorUnits.push(new MinorUnit("COP", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("COU", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("CRC", 2, ["centimo", "céntimo"]));
        minorUnits.push(new MinorUnit("CUC", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("CUP", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("CVE", 0, []));
        minorUnits.push(new MinorUnit("CZK", 2, ["haléř", "haléře", "haléřů"]));
        minorUnits.push(new MinorUnit("DJF", 0, []));
        minorUnits.push(new MinorUnit("DKK", 2, ["øre"]));
        minorUnits.push(new MinorUnit("DOP", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("DZD", 2, ["centime"]));
        minorUnits.push(new MinorUnit("EGP", 2, ["piastre"]));
        minorUnits.push(new MinorUnit("ERN", 2, ["cent"]));
        minorUnits.push(new MinorUnit("ETB", 2, ["santim"]));
        minorUnits.push(new MinorUnit("EUR", 2, ["cent"]));
        minorUnits.push(new MinorUnit("FJD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("FKP", 2, ["penny", "pence"]));
        minorUnits.push(new MinorUnit("GBP", 2, ["penny", "pence"]));
        minorUnits.push(new MinorUnit("GEL", 2, ["tetri"]));
        minorUnits.push(new MinorUnit("GHS", 2, ["pesewa"]));
        minorUnits.push(new MinorUnit("GIP", 2, ["penny", "pence"]));
        minorUnits.push(new MinorUnit("GMD", 2, ["butut"]));
        minorUnits.push(new MinorUnit("GNF", 0, []));
        minorUnits.push(new MinorUnit("GTQ", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("GYD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("HKD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("HNL", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("HRK", 2, ["lipa"]));
        minorUnits.push(new MinorUnit("HTG", 2, ["centime"]));
        minorUnits.push(new MinorUnit("HUF", 2, ["fillér"]));
        minorUnits.push(new MinorUnit("IDR", 2, ["sen"]));
        minorUnits.push(new MinorUnit("ILS", 2, ["agora"]));
        minorUnits.push(new MinorUnit("INR", 2, ["paisa"]));
        minorUnits.push(new MinorUnit("IQD", 3, ["fils"]));
        minorUnits.push(new MinorUnit("IRR", 2, []));
        minorUnits.push(new MinorUnit("ISK", 0, []));
        minorUnits.push(new MinorUnit("JMD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("JOD", 3, ["fils"]));
        minorUnits.push(new MinorUnit("JPY", 0, []));
        minorUnits.push(new MinorUnit("KES", 2, ["cent"]));
        minorUnits.push(new MinorUnit("KGS", 2, ["tyiyn"]));
        minorUnits.push(new MinorUnit("KHR", 2, ["sen"]));
        minorUnits.push(new MinorUnit("KMF", 0, []));
        minorUnits.push(new MinorUnit("KPW", 2, ["chon"]));
        minorUnits.push(new MinorUnit("KRW", 0, []));
        minorUnits.push(new MinorUnit("KWD", 3, ["fils"]));
        minorUnits.push(new MinorUnit("KYD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("KZT", 2, ["tïın"]));
        minorUnits.push(new MinorUnit("LAK", 2, ["att", "ອັດ"]));
        minorUnits.push(new MinorUnit("LBP", 2, ["piastre"]));
        minorUnits.push(new MinorUnit("LKR", 2, ["cent"]));
        minorUnits.push(new MinorUnit("LRD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("LSL", 2, ["sente", "lisente"]));
        minorUnits.push(new MinorUnit("LYD", 3, ["dirham"]));
        minorUnits.push(new MinorUnit("MAD", 2, ["santim"]));
        minorUnits.push(new MinorUnit("MDL", 2, ["ban"]));
        minorUnits.push(new MinorUnit("MGA", 2, []));
        minorUnits.push(new MinorUnit("MKD", 2, ["deni", "дени"]));
        minorUnits.push(new MinorUnit("MMK", 2, ["pya"]));
        minorUnits.push(new MinorUnit("MNT", 2, ["möngö", "мөнгө"]));
        minorUnits.push(new MinorUnit("MOP", 2, ["sin", "仙"]));
        minorUnits.push(new MinorUnit("MRO", 2, []));
        minorUnits.push(new MinorUnit("MUR", 2, ["cent"]));
        minorUnits.push(new MinorUnit("MVR", 2, ["laari"]));
        minorUnits.push(new MinorUnit("MWK", 2, ["tambala"]));
        minorUnits.push(new MinorUnit("MXN", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("MXV", 2, []));
        minorUnits.push(new MinorUnit("MYR", 2, ["sen"]));
        minorUnits.push(new MinorUnit("MZN", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("NAD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("NGN", 2, ["kobo"]));
        minorUnits.push(new MinorUnit("NIO", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("NOK", 2, ["øre"]));
        minorUnits.push(new MinorUnit("NPR", 2, ["paisa"]));
        minorUnits.push(new MinorUnit("NZD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("OMR", 3, ["baisa"]));
        minorUnits.push(new MinorUnit("PAB", 2, ["centésimo", "centesimo"]));
        minorUnits.push(new MinorUnit("PEN", 2, ["céntimo", "centimo"]));
        minorUnits.push(new MinorUnit("PGK", 2, ["toea"]));
        minorUnits.push(new MinorUnit("PHP", 2, ["sentimo", "centavo"]));
        minorUnits.push(new MinorUnit("PKR", 2, ["paisa"]));
        minorUnits.push(new MinorUnit("PLN", 2, ["grosz"]));
        minorUnits.push(new MinorUnit("PYG", 0, []));
        minorUnits.push(new MinorUnit("QAR", 2, ["dirham"]));
        minorUnits.push(new MinorUnit("RON", 2, ["ban", "bani"]));
        minorUnits.push(new MinorUnit("RSD", 2, ["para"]));
        minorUnits.push(new MinorUnit("RUB", 2, ["kopek", "коп"]));
        minorUnits.push(new MinorUnit("RWF", 0, []));
        minorUnits.push(new MinorUnit("SAR", 2, ["halalah", "هللة"]));
        minorUnits.push(new MinorUnit("SBD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("SCR", 2, ["cent"]));
        minorUnits.push(new MinorUnit("SDG", 2, ["qirsh", "piastre"]));
        minorUnits.push(new MinorUnit("SEK", 2, ["öre"]));
        minorUnits.push(new MinorUnit("SGD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("SHP", 2, ["penny", "pence"]));
        minorUnits.push(new MinorUnit("SLL", 2, ["cent"]));
        minorUnits.push(new MinorUnit("SOS", 2, ["senti"]));
        minorUnits.push(new MinorUnit("SRD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("SSP", 2, ["piaster"]));
        minorUnits.push(new MinorUnit("STD", 2, ["cêntimo", "centimo"]));
        minorUnits.push(new MinorUnit("SVC", 2, ["centavo"]));
        minorUnits.push(new MinorUnit("SYP", 2, ["piastre"]));
        minorUnits.push(new MinorUnit("SZL", 2, ["cent"]));
        minorUnits.push(new MinorUnit("THB", 2, ["satang"]));
        minorUnits.push(new MinorUnit("TJS", 2, ["diram"]));
        minorUnits.push(new MinorUnit("TMT", 2, ["tenge", "teňňe"]));
        minorUnits.push(new MinorUnit("TND", 3, ["milim", "millime"]));
        minorUnits.push(new MinorUnit("TOP", 2, ["seniti"]));
        minorUnits.push(new MinorUnit("TRY", 2, ["kuruş"]));
        minorUnits.push(new MinorUnit("TTD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("TWD", 2, ["cent",  "分", "fēn"]));
        minorUnits.push(new MinorUnit("TZS", 2, ["senti", "cent"]));
        minorUnits.push(new MinorUnit("UAH", 2, ["kopiyka", "копійка"]));
        minorUnits.push(new MinorUnit("UGX", 0, []));
        minorUnits.push(new MinorUnit("USD", 2, ["cent", "¢", "￠"]));
        minorUnits.push(new MinorUnit("USN", 2, []));
        minorUnits.push(new MinorUnit("UYI", 0, []));
        minorUnits.push(new MinorUnit("UYU", 2, ["centésimo"]));
        minorUnits.push(new MinorUnit("UZS", 2, ["tiyin"]));
        minorUnits.push(new MinorUnit("VEF", 2, ["céntimo"]));
        minorUnits.push(new MinorUnit("VND", 0, []));
        minorUnits.push(new MinorUnit("VUV", 0, []));
        minorUnits.push(new MinorUnit("WST", 2, ["sene"]));
        minorUnits.push(new MinorUnit("XAF", 0, []));
        minorUnits.push(new MinorUnit("XAG", 0, []));
        minorUnits.push(new MinorUnit("XAU", 0, []));
        minorUnits.push(new MinorUnit("XBA", 0, []));
        minorUnits.push(new MinorUnit("XBB", 0, []));
        minorUnits.push(new MinorUnit("XBC", 0, []));
        minorUnits.push(new MinorUnit("XBD", 0, []));
        minorUnits.push(new MinorUnit("XCD", 2, ["cent"]));
        minorUnits.push(new MinorUnit("XDR", 0, []));
        minorUnits.push(new MinorUnit("XOF", 0, []));
        minorUnits.push(new MinorUnit("XPD", 0, []));
        minorUnits.push(new MinorUnit("XPF", 0, []));
        minorUnits.push(new MinorUnit("XPT", 0, []));
        minorUnits.push(new MinorUnit("XSU", 0, []));
        minorUnits.push(new MinorUnit("XTS", 0, []));
        minorUnits.push(new MinorUnit("XUA", 0, []));
        minorUnits.push(new MinorUnit("XXX", 0, []));
        minorUnits.push(new MinorUnit("YER", 2, ["fils"]));
        minorUnits.push(new MinorUnit("ZAR", 2, ["cent"]));
        minorUnits.push(new MinorUnit("ZMW", 2, ["ngwee"]));
        minorUnits.push(new MinorUnit("ZWL", 2, ["cent"]));

        const checkMinorUnit = (aPrice, aUnit, aMultiplicatorString) => {
            if (aMultiplicatorString !== "") {
                return false;
            }
            for (let minorUnit of minorUnits) {
                if (minorUnit.code === aUnit) {
                    for (let name of minorUnit.names) {
                        if (aPrice.full.toLowerCase().includes(name)) {
                            return minorUnit.decimals;
                        }
                    }

                }
            }
            return 0;
        };


        const seks = [
            ["miljoner", 6],
            ["miljon", 6],
            ["miljarder", 9],
            ["miljard", 9],
            ["mnkr", 9],
            ["mdkr", 9],
            ["mkr", 6],
            ["ksek", 3],
            ["msek", 6],
            ["gsek", 9]
        ];
        const dkks = [
            ["millión", 6],
            ["miljón", 6],
            ["milliard", 9],
            ["mia.", 9],
            ["mio.", 6],
            ["million", 6]
        ];
        const isks = [
            ["milljón", 6],
            ["milljarð", 9]
        ];
        const noks = [
            ["milliard", 9],
            ["million", 6]
        ];
        const mgas = [
            ["milliard", 9],
            ["million", 6]
        ];
        const vnds = [
            ["ngàn", 3],
            ["triệu", 6],
            ["tỷ", 9]
        ];

        /**
         * Multiples of money: million, etc.
         *
         * @param aMulties
         * @constructor
         */
        const Mult = function(aMulties) {
            "use strict";
            this.multsMap = new Map(aMulties);
            /**
             *
             * @param aPrice
             * @returns {*}
             */
            this.findMult = (aPrice) => {
                this.multsIter = this.multsMap.keys();
                let entry = this.multsIter.next();
                while (!entry.done) {
                    if (aPrice.includes(entry.value)) {
                        return {text: entry.value, exponent: this.multsMap.get(entry.value)};
                    }
                    entry = this.multsIter.next();
                }
                return {text: "", exponent: 0};
            }
        };

        const multies = {};
        multies["SEK"] = new Mult(seks);
        multies["DKK"] = new Mult(dkks);
        multies["ISK"] = new Mult(isks);
        multies["NOK"] = new Mult(noks);
        multies["MGA"] = new Mult(mgas);
        multies["VND"] = new Mult(vnds);

        /**
         * If Mult is defined for the current currency, find if there is a multiple in the price.
         * If so return the multiple, possibly corrected (mnkr becomes mn).
         *
         * @param aPrice
         * @returns {*} a string with the
         */
        const getMultiplicator = (aPrice) => {
            if (multies[aPrice.originalCurrency]) {
                return multies[aPrice.originalCurrency].findMult(aPrice.full.toLowerCase());
            }
            return {exponent: 0, text: ""};
        };

        /**
         *
         * @param anAmount
         * @param aMonetaryGroupingSeparatorSymbol
         * @returns {*}
         */
        const addMonetaryGroupingSeparatorSymbol = (anAmount, aMonetaryGroupingSeparatorSymbol) => {
            let amount = anAmount;
            const regex = /(\d+)(\d{3})/;
            while (regex.test(amount)) {
                amount = amount.replace(regex, "$1" + aMonetaryGroupingSeparatorSymbol + "$2");
            }
            return amount;
        };

        /**
         *
         * @param anAmountIntegralPart
         * @param anAmountFractionalPart
         * @param aMonetaryGroupingSeparatorSymbol
         * @param aMonetarySeparatorSymbol
         * @returns {*}
         */
        const formatAmount = (anAmountIntegralPart, anAmountFractionalPart,
                                      aMonetaryGroupingSeparatorSymbol, aMonetarySeparatorSymbol) => {
            let formattedPrice;
            const hasFractionalPart = anAmountFractionalPart !== "";
            const monetaryGroupingSeparatorSymbol = aMonetaryGroupingSeparatorSymbol === " " ? "\u00a0" : aMonetaryGroupingSeparatorSymbol;
            formattedPrice = addMonetaryGroupingSeparatorSymbol(anAmountIntegralPart, monetaryGroupingSeparatorSymbol);
            if (hasFractionalPart) {
                formattedPrice = formattedPrice + aMonetarySeparatorSymbol + anAmountFractionalPart;
            }
            return formattedPrice;
        };

        /**
         *
         * @param aRoundAmounts
         * @param anAmount
         * @param aUnit
         * @param aCustomFormat
         * @returns {string}
         */
        const formatPrice = (aRoundAmounts, anAmount, aUnit, aCustomFormat) => {
            const fractionDigits = (aRoundAmounts && anAmount > 1) || aUnit === "mm" || aUnit === "kJ" ? 0 : 2;
            const amountString = isNaN(anAmount) ? "Unknown" : anAmount.toFixed(fractionDigits);
            const amountParts = amountString.split(".");
            const amountIntegralPart = amountParts[0];
            const amountFractionalPart = amountParts.length > 1 ? amountParts[1] : "";
            let formattedPrice = formatAmount(amountIntegralPart, amountFractionalPart,
                aCustomFormat.monetaryGroupingSeparatorSymbol, aCustomFormat.monetarySeparatorSymbol);
            if (aCustomFormat.beforeCurrencySymbol) {
                formattedPrice = formattedPrice + aCustomFormat.currencySpacing + aUnit;
            }
            else {
                formattedPrice = aUnit + aCustomFormat.currencySpacing + formattedPrice;
            }
            return " " + formattedPrice;
        };

        /**
         *
         * @param aReplacedUnit
         * @param aCurrencySymbol
         * @returns {*}
         */
        const useUnit = (aReplacedUnit, aCurrencySymbol) => {
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

        /**
         *
         * @param anAmount
         * @returns {Number}
         */
        const parseAmount = (anAmount) => {
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

        /**
         *
         * @param aConversionQuote
         * @param aParsedAmount
         * @param aPrice
         * @param aReplacedUnit
         * @returns {number}
         */
        const convertAmount = (aConversionQuote, aParsedAmount, aPrice, aReplacedUnit, aMultiplicator, aMultiplicatorString) => {
            const decimals = checkMinorUnit(aPrice, aReplacedUnit, aMultiplicatorString);
            return aConversionQuote * aParsedAmount * Math.pow(10, aMultiplicator) * Math.pow(10, -decimals);
        };

        /**
         *
         * @param aConvertedPrice
         * @param aConvertedContent
         * @param aShowOriginalPrices
         * @param aReplacedUnit
         * @param aShowOriginalCurrencies
         * @param aPrice
         * @returns {*}
         */
        const replaceContent = (aConvertedPrice, aConvertedContent, aShowOriginalPrices, aReplacedUnit,
                                        aShowOriginalCurrencies, aPrice) => {
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

        /**
         *
         * @param aPrice
         * @param aConversionQuote
         * @param aReplacedUnit
         * @param aCurrencySymbol
         * @param aCurrencyCode
         * @param aRoundAmounts
         * @param aCustomFormat
         * @param aShowOriginalPrices
         * @param aShowOriginalCurrencies
         * @param aConvertedContent
         * @returns {*}
         */
        const convertContent = (aPrice, aConversionQuote, aReplacedUnit, aCurrencySymbol, aCurrencyCode, aRoundAmounts,
                                aCustomFormat, aShowOriginalPrices, aShowOriginalCurrencies, aConvertedContent) => {
            const parsedAmount = parseAmount(aPrice.amount);
            const multiplicator = getMultiplicator(aPrice);
            const convertedAmount = convertAmount(aConversionQuote, parsedAmount, aPrice, aReplacedUnit,
                multiplicator.exponent, multiplicator.text);
            const usedUnit = useUnit(aReplacedUnit, aCurrencySymbol);
            // "93,49 €"
            const convertedPrice = formatPrice(aRoundAmounts, convertedAmount, usedUnit, aCustomFormat);
            // " 93,49 € (100 USD)"
            const convertedContent = replaceContent(convertedPrice, aConvertedContent, aShowOriginalPrices,
                aReplacedUnit, aShowOriginalCurrencies, aPrice);
            return convertedContent;
        };

        /**
         * Stores prices that will be replaced with converted prices
         *
         * @param anOriginalCurrency
         * @param aCurrency
         * @param aRegex
         * @param aText
         * @param anAmountPosition
         * @returns {Array}
         */
        const findPricesInCurrency = (anOriginalCurrency, aCurrency, aRegex, aText, anAmountPosition) => {
            const prices = [];
            if (!aRegex) {
                return prices;
            }
            let match;
            while (match = aRegex.exec(aText)) {
                prices.push(new Price(anOriginalCurrency, aCurrency, match, anAmountPosition));
            }
            return prices;
        };

        /**
         *
         * @param anEnabledCurrenciesWithRegexes
         * @param aCurrencyCode
         * @param aTextContent
         * @returns {Array}
         */
        const findPrices = (anEnabledCurrenciesWithRegexes, aCurrencyCode, aTextContent) => {
            let prices = [];
            for (let currencyRegex of anEnabledCurrenciesWithRegexes) {
                if (currencyRegex.currency === aCurrencyCode) {
                    continue;
                }
                prices = findPricesInCurrency(aCurrencyCode, currencyRegex.currency, currencyRegex.regex1, aTextContent, 2);
                if (prices.length === 0) {
                    prices = findPricesInCurrency(aCurrencyCode, currencyRegex.currency, currencyRegex.regex2, aTextContent, 1);
                }
                if (prices.length === 0) {
                    continue;
                }
                break;
            }
            return prices;
        };

        /**
         *
         * @param anExcludedDomains
         * @param anUrl
         * @returns {boolean}
         */
        const isExcludedDomain = (anExcludedDomains, anUrl) => {
            for (let excludedDomain of anExcludedDomains) {
                const matcher = new RegExp(excludedDomain, "g");
                if (matcher.test(anUrl)){
                    return true;
                }
            }
            return false;
        };

        return {
            checkMinorUnit: checkMinorUnit,
            multies: multies,
            getMultiplicator: getMultiplicator,
            addMonetaryGroupingSeparatorSymbol: addMonetaryGroupingSeparatorSymbol,
            formatAmount: formatAmount,
            formatPrice: formatPrice,
            useUnit: useUnit,
            parseAmount: parseAmount,
            convertAmount: convertAmount,
            replaceContent: replaceContent,
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
            String.prototype.includes = () => {
                return String.prototype.indexOf.apply(this, arguments) !== -1;
            };
        }
        let conversionQuotes = [];
        let currencyCode = "";
        //const subUnits = {"EUR": "cent", "RUB" : "коп.", "SEK": "öre"};
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
            "overflow-y: scroll;" +
            "}", 0);


        /*
         * Wait for PriceRegexes to be created before running makePriceRegexes.
         * Should be executed once only.
         */
        const makePriceRegexes = () => {
            new Promise(
                (resolve, reject) => PriceRegexes? resolve(PriceRegexes): reject(Error("makePriceRegexes rejected"))
            ).then(
                (aPriceRegexes) => aPriceRegexes.makePriceRegexes(regex1, regex2),
                (err) => console.error("makePriceRegexes then error " + err)
            ).catch(
                (err) => console.error("makePriceRegexes catch error " + err)
            );
        };

        makePriceRegexes();


        const replaceCurrency = (aNode) => {
            if (!aNode) {
                return;
            }
            if (!aNode.parentNode) {
                return;
            }
            if (aNode.nodeType !== Node.TEXT_NODE) {
                return;
            }
            const isSibling = aNode.previousSibling;
            const dataNode = isSibling ? aNode.previousSibling : aNode.parentNode;
            if (skippedElements.indexOf(aNode.parentNode.tagName.toLowerCase()) !== -1) {
                return;
            }
            if (/^\s*$/.test(aNode.nodeValue)) {
                return;
            }
            if (/\{/.test(aNode.nodeValue)) {
                return;
            }
            if (!/\d/.test(aNode.nodeValue)) {
                return;
            }
            // Can be [object SVGAnimatedString]
            // Extra check of "string" for Chrome
            if (dataNode
                && dataNode.className
                && typeof dataNode.className === "string"
                && dataNode.className.includes("dccConverted")) {
                return;
            }
            const prices = aDccFunctions.findPrices(enabledCurrenciesWithRegexes, currencyCode, aNode.nodeValue);
            if (prices.length === 0) {
                return;
            }
            const replacedUnit = prices[0].originalCurrency;
            const conversionQuote = conversionQuotes[replacedUnit] * (1 + quoteAdjustmentPercent / 100);
            let tempAmount;
            let tempConvertedAmount;
            let convertedContent = aNode.nodeValue;
            for (let price of prices) {
                convertedContent = aDccFunctions.convertContent(price, conversionQuote, replacedUnit, currencySymbol,
                    currencyCode, roundAmounts, customFormat, showOriginalPrices, showOriginalCurrencies, convertedContent);
            }
            for (let price of prices) {
                // FIXME show all amounts
                const decimals = aDccFunctions.checkMinorUnit(price, replacedUnit);
                tempAmount = aDccFunctions.parseAmount(price.amount) * Math.pow(10, -decimals);
            }
            for (let price of prices) {
                // FIXME show all amounts
                const decimals = aDccFunctions.checkMinorUnit(price, replacedUnit);
                const convertedAmount = conversionQuote * aDccFunctions.parseAmount(price.amount) * Math.pow(10, -decimals);
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

            if (dataNode.dataset) {
                if (isSibling) {
                    dataNode.dataset.dccConvertedContentSibling = convertedContent;
                    if (!dataNode.dataset.dccOriginalContentSibling) {
                        dataNode.dataset.dccOriginalContentSibling = aNode.nodeValue;
                    }
                    if (!dataNode.className.includes("dccConvertedSibling")) {
                        dataNode.className += " dccConvertedSibling";
                    }
                }
                else {
                    dataNode.dataset.dccConvertedContent = convertedContent;
                    if (!dataNode.dataset.dccOriginalContent) {
                        dataNode.dataset.dccOriginalContent = aNode.nodeValue;
                    }
                    if (!dataNode.className.includes("dccConverted")) {
                        dataNode.className += " dccConverted";
                    }
                }
            }
            else {
                console.error("dataNode.dataset is undefined or null");
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
                dccTitle += aDccFunctions.formatPrice(roundAmounts, tempConvertedAmount, currencyCode, customFormat) + "\n";
                dccTitle += "Original value: ";
                dccTitle += aDccFunctions.formatPrice(roundAmounts, tempAmount, replacedUnit, customFormat) + "\n";
                dccTitle += "Conversion quote " + replacedUnit + "/" + currencyCode + " = " +
                    aDccFunctions.formatPrice(roundAmounts, conversionQuote, "", customFormat) + "\n";
                dccTitle += "Conversion quote " + currencyCode + "/" + replacedUnit + " = " +
                    aDccFunctions.formatPrice(roundAmounts, 1/conversionQuote, "", customFormat) + "\n";
                const showOriginal = false;
                substituteOne(aNode, showOriginal, dccTitle);
            }
        };


        const mutationHandler = (aMutationRecord) => {
            if (aMutationRecord.type === "childList") {
                for (let i = 0; i < aMutationRecord.addedNodes.length; ++i) {
                    const node = aMutationRecord.addedNodes[i];
                    traverseDomTree(node);
                }
            }
        };

        const mutationsHandler = (aMutations) => {
            aMutations.forEach(mutationHandler);
        };

        const startObserve = () => {
            const mutationObserver = new MutationObserver(mutationsHandler);
            const mutationObserverInit = {
                childList: true,
                attributes: false,
                characterData: false,
                subtree: true,
                attributeOldValue: false,
                characterDataOldValue: false
            };
            if (document.body) {
                mutationObserver.observe(document.body, mutationObserverInit);
            }
        };

        const resetDomTree = (aNode) => {
            if (!aNode) {
                return;
            }
            const nodeList = aNode.querySelectorAll(".dccConverted");
            for (let i = 0; i < nodeList.length; ++i) {
                const node = nodeList[i];
                if (node.dataset && node.dataset.dccOriginalContent) {
                    delete node.dataset.dccOriginalContent;
                }
                if (node.dataset && node.dataset.dccConvertedContent) {
                    delete node.dataset.dccConvertedContent;
                }
                node.className = node.className.replace("dccConverted", "");
            }
        };

        const traverseDomTree = (aNode) => {
            if (!aNode) {
                return
            }
            replaceCurrency(aNode);
            for (let i = 0; i < aNode.childNodes.length; ++i) {
                const node = aNode.childNodes[i];
                traverseDomTree(node);
            }
        };

        const substituteOne = (aNode, isShowOriginal, aDccTitle) => {
            if (!aNode) {
                return;
            }
            if (!aNode.parentNode) {
                return;
            }
            if (aNode.nodeType !== Node.TEXT_NODE) {
                return;
            }
            const isSibling = aNode.previousSibling;
            const dataNode = isSibling ? aNode.previousSibling : aNode.parentNode;
            if (isSibling) {
                if (dataNode.dataset && dataNode.dataset.dccOriginalContentSibling) {
                    if (aDccTitle) {
                        aNode.parentNode.dataset.dcctitle = aNode.parentNode.dataset.dcctitle ? aNode.parentNode.dataset.dcctitle : "";
                        aNode.parentNode.dataset.dcctitle += aDccTitle + "\n";
                    }
                    if (dataNode.dataset.dccConvertedContentSibling) {
                        aNode.nodeValue = isShowOriginal ? dataNode.dataset.dccOriginalContentSibling : dataNode.dataset.dccConvertedContentSibling;
                    }
                }
            }
            else {
                if (dataNode.dataset && dataNode.dataset.dccOriginalContent) {
                    if (aDccTitle) {
                        aNode.parentNode.dataset.dcctitle = aNode.parentNode.dataset.dcctitle ? aNode.parentNode.dataset.dcctitle : "";
                        aNode.parentNode.dataset.dcctitle += aDccTitle + "\n";
                    }
                    if (dataNode.dataset.dccConvertedContent) {
                        aNode.nodeValue = isShowOriginal ? dataNode.dataset.dccOriginalContent : dataNode.dataset.dccConvertedContent;
                    }
                }
            }
        };

        const substituteAll = (aNode, isShowOriginal) => {
            if (!aNode) {
                return;
            }
            const nodeList = aNode.querySelectorAll(".dccConverted");

            for (let i = 0; i < nodeList.length; ++i) {
                const node = nodeList[i];
                const textNode = node.firstChild ? node.firstChild : node.nextSibling;
                if (node.dataset && node.dataset.dccOriginalContent && node.dataset.dccConvertedContent) {
                    textNode.nodeValue = isShowOriginal ? node.dataset.dccOriginalContent : node.dataset.dccConvertedContent;
                }
            }
        };

        const onSendEnabledStatus = (aStatus) => {
            if (aDccFunctions.isExcludedDomain(excludedDomains, document.URL)) {
                return;
            }
            if (aStatus.isEnabled && !aStatus.hasConvertedElements) {
                startObserve();
                traverseDomTree(document.body);
            }
            const showOriginal = !aStatus.isEnabled;
            substituteAll(document.body, showOriginal);
        };

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

        const readEnabledCurrencies = (contentScriptParams) => {
            enabledCurrenciesWithRegexes.length = 0;
            for (let currency of contentScriptParams.convertFroms) {
                if (currency.enabled) {
                    enabledCurrenciesWithRegexes.push(new CurrencyRegex(currency.isoName, regex1[currency.isoName], regex2[currency.isoName]));
                }
            }
            if (contentScriptParams.tempConvertUnits) {
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
        };

        /**
         *
         * @param contentScriptParams
         */
        const onUpdateSettings = (contentScriptParams) => {
            const showOriginal = true;
            substituteAll(document.body, showOriginal);
            resetDomTree(document.body);
            readParameters(contentScriptParams);

            const startConversion = () => {
                readEnabledCurrencies(contentScriptParams);
                let process = true;
                for (let excludedDomain of contentScriptParams.excludedDomains) {
                    const matcher = new RegExp(excludedDomain, "g");
                    const found = matcher.test(document.URL);
                    if (found) {
                        process = false;
                        break;
                    }
                }
                let hasConvertedElements = false;
                if (contentScriptParams.isEnabled && process) {
                    startObserve();
                    if (document) {
                        traverseDomTree(document.body);
                        const showOriginal = false;
                        substituteAll(document.body, showOriginal);
                        hasConvertedElements = true;
                    }
                }
                ContentAdapter.finish(hasConvertedElements);
                isEnabled = contentScriptParams.isEnabled;

            };

            const startConversionWhenReady = () => {
                new Promise(
                    (resolve, reject) => PriceRegexes ? resolve(): reject(Error("startConversionWhenReady Not OK"))
                ).then(
                    startConversion(),
                    (err) => console.error("startConversionWhenReady then error " + err)
                ).catch(
                    (err) => console.error("startConversionWhenReady catch error " + err)
                );
            };

            startConversionWhenReady();

        };
        return {
            onSendEnabledStatus : onSendEnabledStatus,
            onUpdateSettings : onUpdateSettings
        };
    })(this.DccFunctions);

    this.DirectCurrencyContent = DirectCurrencyContent;

}