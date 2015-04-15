/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

/**
 * Stereotype Information holder
 * @param aStorageService
 * @returns {{conversionEnabled, conversionEnabled, convertToCountry, convertToCountry, convertToCurrency, convertToCurrency, getConversionQuotes: Function, setConversionQuote: Function, getCurrencySymbols: Function, customSymbols, customSymbols, decimalSep, decimalSep, excludedDomains, excludedDomains, enabledCurrencies, enabledCurrencies, enableOnStart, enableOnStart, quoteAdjustmentPercent, quoteAdjustmentPercent, roundPrices, roundPrices, separatePrice, separatePrice, showOriginalPrices, showOriginalPrices, unitAfter, unitAfter, tempConvertUnits, tempConvertUnits, thousandSep, thousandSep, getCurrencyNames: Function, getFromCurrencies: Function, isAllCurrenciesRead: Function, getQuoteString: Function, resetReadCurrencies: Function, resetSettings: Function}}
 * @constructor
 */
const InformationHolder = function(aStorageService, _) {
    "use strict";
    const conversionQuotes = {};
    const country_currency = {"AX":"EUR","ALL":"USD","AF":"AFN","AL":"ALL","DZ":"DZD","AS":"USD","AD":"ADP","AO":"AON","AI":"XCD","AG":"XCD","AR":"ARS","AM":"AMD","AW":"AWG","AU":"AUD","AT":"EUR","AZ":"AZN","BS":"BSD","BH":"BHD","BD":"BDT","BB":"BBD","BY":"BYR","BE":"EUR","BZ":"BZD","BJ":"XOF","BM":"BMD","BT":"BTN","BO":"BOB","BA":"BAM","BW":"BWP","BR":"BRL","BN":"BND","BG":"BGN","BF":"XOF","BI":"BIF","KH":"KHR","CM":"XAF","CA":"CAD","CV":"CVE","KY":"KYD","CF":"XAF","TD":"XAF","CL":"CLP","CN":"CNY","CX":"AUD","CO":"COP","KM":"KMF","CG":"XAF","CD":"CDF","CK":"NZD","CR":"CRC","HR":"HRK","CU":"CUP","CY":"CYP","CZ":"CZK","DK":"DKK","DJ":"DJF","DM":"XCD","DO":"DOP","EC":"USD","EG":"EGP","SV":"SVC","GQ":"XAF","ER":"USD","ET":"ETB","FO":"DKK","FJ":"FJD","FI":"EUR","FR":"EUR","GF":"FRF","PF":"XPF","TF":"USD","GA":"XAF","GM":"GMD","GE":"GEL","DE":"EUR","GH":"GHS","GI":"GIP","GR":"EUR","GL":"DKK","GD":"XCD","GP":"FRF","GU":"USD","GT":"GTQ","GG":"USD","GN":"GNF","GW":"XAF","GY":"GYD","HT":"HTG","HN":"HNL","HK":"HKD","HU":"HUF","IS":"ISK","IN":"INR","ID":"IDR","IR":"IRR","IQ":"IQD","IE":"EUR","IL":"ILS","IT":"EUR","CI":"USD","JM":"JMD","JP":"JPY","JO":"JOD","KZ":"KZT","KE":"KES","KI":"AUD","KP":"KPW","KR":"KRW","KW":"KWD","KG":"KGS","LA":"LAK","LB":"LBP","LS":"LSL","LR":"LRD","LY":"LYD","LI":"CHF","LT":"LTL","LU":"EUR","MK":"MKD","MG":"MGF","MW":"MWK","MY":"MYR","MV":"MVR","ML":"XOF","MT":"MTL","MH":"USD","MQ":"FRF","MR":"MRO","MU":"MUR","MX":"MXN","FM":"USD","MD":"MDL","MC":"FRF","MN":"MNT","ME":"EUR","MS":"XCD","MA":"MAD","MZ":"MZN","MM":"MMK","NA":"NAD","NR":"AUD","NP":"NPR","NL":"EUR","AN":"ANG","NC":"XPF","NZ":"NZD","NI":"NIO","NE":"XOF","NG":"NGN","MP":"AUD","NO":"NOK","OM":"OMR","PK":"PKR","PW":"USD","PA":"PAB","PG":"PGK","PY":"PYG","PE":"PEN","PH":"PHP","PL":"PLN","PT":"EUR","PR":"USD","QA":"QAR","RE":"FRF","RO":"RON","RU":"RUB","RW":"USD","SH":"SHP","KN":"XCD","LC":"XCD","MF":"USD","PM":"FRF","VC":"XCD","WS":"WST","SM":"ITL","ST":"STD","SA":"SAR","SN":"XOF","RS":"RSD","SC":"SCR","SL":"SLL","SG":"SGD","SK":"SKK","SI":"EUR","SB":"SBD","SO":"SOS","ZA":"ZAR","ES":"EUR","LK":"LKR","SD":"SDD","SR":"SRG","SZ":"SZL","SE":"SEK","CH":"CHF","SY":"SYP","TW":"TWD","TJ":"RUB","TZ":"TZS","TH":"THB","TL":"USD","TG":"XOF","TO":"TOP","TT":"TTD","TN":"TND","TR":"TRY","TM":"TMT","TC":"USD","TV":"AUD","UG":"UGX","UA":"UAH","AE":"AED","GB":"GBP","US":"USD","UY":"UYU","UZ":"UZS","VU":"VUV","VE":"VEF","VN":"VND","VG":"GBP","VI":"USD","EH":"ESP","YE":"YER","ZM":"ZMW"};
    var numberOfReadCurrencies = 0;
    const fromCurrencies = ["AFN", "AED", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SVC", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "UYI", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XOF", "XPD", "XPF", "XPT", "XSU", "XTS", "XUA", "XXX", "YER", "ZAR", "ZMW", "ZWL"];
    const currencySymbols = {
        "BGN" : "лв",
        "EUR" : "€",
        "GBP" : "£",
        "ILS" : "₪",
        "JPY" : "¥",
        "NGN" : "₦",
        "PHP" : "₱",
        "PLN" : "zł",
        "PYG" : "₲",
        "RUB" : "руб.",
        "THB" : "฿",
        "USD" : "$"
    };
    const _excludedDomains = ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com"];
    const defaultEnabled = {"CHF":true, "DKK":true, "EUR":true, "GBP":true, "ISK":true, "JPY":true, "NOK":true, "RUB":true, "SEK":true, "USD":true};
    aStorageService.init(defaultEnabled, _excludedDomains);
    var conversionEnabled = aStorageService.enableOnStart;
    const _currencyNames = {};
    fromCurrencies.forEach((aCurrency) => {
        if (defaultEnabled[aCurrency] == undefined) {
            defaultEnabled[aCurrency] = false;
        }
        _currencyNames[aCurrency] = _(aCurrency);
    });
    var quoteStrings = [];

    const getConversionQuotes = function() {
        return conversionQuotes;
    };
    const setConversionQuote = function(aConvertFromCurrency, aQuote) {
        conversionQuotes[aConvertFromCurrency] = aQuote;
        numberOfReadCurrencies++;
        // console.log(numberOfReadCurrencies);
    };
    const getCurrencySymbols = function() {
        return currencySymbols;
    };
    const getCurrencyNames = function () {
        return _currencyNames;
    };
    const getFromCurrencies = function () {
        return fromCurrencies;
    };
    const isAllCurrenciesRead = function() {
        return numberOfReadCurrencies >= fromCurrencies.length;
    };
    const makeQuoteString = (aConvertFromCurrency) => {
        const quote = conversionQuotes[aConvertFromCurrency];
        const conversionQuote = (parseFloat(quote)).toFixed(4);
        if (aConvertFromCurrency != aStorageService.convertToCurrency) {
            const quoteString = "1 " + aConvertFromCurrency + " = " + conversionQuote.replace(".", aStorageService.decimalSep) + " " + aStorageService.convertToCurrency;
            quoteStrings.push(quoteString);
        }
    };
    const getQuoteString = function () {
        quoteStrings = [];
        fromCurrencies.forEach(makeQuoteString);
        return quoteStrings.join("; ");
    };
    const resetReadCurrencies = function() {
        numberOfReadCurrencies = 0;
    };
    const resetSettings = function() {
        aStorageService.resetSettings();
        aStorageService.init(defaultEnabled, _excludedDomains);
    };

    return {
        get conversionEnabled () {
            return conversionEnabled;
        },
        set conversionEnabled (aConversionEnabled) {
            conversionEnabled = aConversionEnabled;
        },
        get convertToCountry () {
            return aStorageService.convertToCountry;
        },
        set convertToCountry (aCountry) {
            aStorageService.convertToCountry = aCountry;
            if (!aStorageService.convertToCurrency) {
                aStorageService.convertToCurrency = country_currency[aCountry];
            }
        },
        get convertToCurrency () {
            return aStorageService.convertToCurrency;
        },
        set convertToCurrency (aCurrency) {
            aStorageService.convertToCurrency = aCurrency;
        },
        getConversionQuotes: getConversionQuotes,
        setConversionQuote: setConversionQuote,
        getCurrencySymbols: getCurrencySymbols,
        get customSymbols () {
            return aStorageService.customSymbols;
        },
        set customSymbols (aCustomSymbols) {
            aStorageService.customSymbols = aCustomSymbols;
        },
        get decimalSep () {
            return aStorageService.decimalSep;
        },
        set decimalSep (aDecimalSep) {
            aStorageService.decimalSep = aDecimalSep;
        },
        get excludedDomains () {
            return aStorageService.excludedDomains;
        },
        set excludedDomains (anExcludedDomains) {
            aStorageService.excludedDomains = anExcludedDomains;
        },
        get enabledCurrencies () {
            return aStorageService.enabledCurrencies;
        },
        set enabledCurrencies (aEnabledCurrencies) {
            aStorageService.enabledCurrencies = aEnabledCurrencies;
        },
        get enableOnStart () {
            return aStorageService.enableOnStart;
        },
        set enableOnStart (anEnableOnStart) {
            aStorageService.enableOnStart = anEnableOnStart;
        },
        get quoteAdjustmentPercent () {
            return aStorageService.quoteAdjustmentPercent;
        },
        set quoteAdjustmentPercent (aQuoteAdjustmentPercent) {
            aStorageService.quoteAdjustmentPercent = aQuoteAdjustmentPercent;
        },
        get roundPrices () {
            return aStorageService.roundPrices;
        },
        set roundPrices (aRoundPrices) {
            aStorageService.roundPrices = aRoundPrices;
        },
        get separatePrice () {
            return aStorageService.separatePrice;
        },
        set separatePrice (aSeparatePrice) {
            aStorageService.separatePrice = aSeparatePrice;
        },
        get showOriginalPrices () {
            return aStorageService.showOriginalPrices;
        },
        set showOriginalPrices (aShowOriginalPrices) {
            aStorageService.showOriginalPrices = aShowOriginalPrices;
        },
        get unitAfter () {
            return aStorageService.unitAfter;
        },
        set unitAfter (aUnitAfter) {
            aStorageService.unitAfter = aUnitAfter;
        },
        get tempConvertUnits () {
            return aStorageService.tempConvertUnits;
        },
        set tempConvertUnits (aTempConvertUnits) {
            aStorageService.tempConvertUnits = aTempConvertUnits;
        },
        get thousandSep () {
            return aStorageService.thousandSep;
        },
        set thousandSep (aThousandSep) {
            aStorageService.thousandSep = aThousandSep;
        },
        getCurrencyNames: getCurrencyNames,
        getFromCurrencies: getFromCurrencies,
        isAllCurrenciesRead: isAllCurrenciesRead,
        getQuoteString: getQuoteString,
        resetReadCurrencies: resetReadCurrencies,
        resetSettings: resetSettings
    }
};

if (typeof exports === "object") {
    exports.InformationHolder = InformationHolder;
}
