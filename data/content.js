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
    const enabledCurrenciesWithRegexes = [];
    var roundAmounts = false;
    var showOriginal = false;
    const skippedElements = ["audio", "button", "embed", "head", "img", "noscript", "object", "script", "select", "style", "textarea", "video"];
    const subUnits = {"EUR" : "cent", "RUB" : "коп."};
    const makePriceRegexes = function(aRegex1, aRegex2) {
        aRegex1.AED = /(dhs?\s?|AED\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.AFN = /(؋\s?|افغانۍ\s?|afs?\s?|AFN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.ALL = /(Lekë?\s?|ALL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.AMD = /(\\u058F\s?|Դրամ\s?|drams?\s?|драм\s?|AMD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.ANG = /(NAƒ\s?|ƒ\s?|NAfs?|ANG\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.AOA = /(Kz\s?|AOA\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.ARS = /(AR\$\s?|\$\s?|ARS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.AUD = /(AUD\s?\$\s?|AU\$\s?|\$\s?|AUD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.AWG = /(Afl\.?\s?|AWG\.?\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.AZN = /(₼\s?|AZN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BAM = /(BAM\s?|KM\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BBD = /(BBD\s?|Bds\$?\s?|\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BDT = /(BDT\s?|৳\s?|Tk\.?\s?|Taka\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BGN = /(BGN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BHD = /(BHD\s?|دينار\s?|BD\.?\s?|.د.ب\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BIF = /(BIF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BMD = /(BMD\$\s?|BMD\s?|Bd\$?\s?|\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BND = /(BND\$\s?|BND\s?|B\$\s?|\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BOB = /(BOB\s?|Bs\.?\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BOV = /(BOV\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BRL = /(BRL\s?|R\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BSD = /(BSD\$\s?|BSD\s?|B\$\s?|\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BTN = /(BTN\s?|Nu\.?\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BWP = /(BWP\s?|\sP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BYR = /(BYR\s?|Br\.?\s?|бр\.?\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BZD = /(BZD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.BZD = /(BZD\s?|BZ\s?\$\s?|\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.CAD = /(CAD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.CDF = /(CDF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.CHE = /(CHE\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        // aRegex1.CHF = /(CHF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.CHW = /(CHW\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.CLF = /(CLF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.CLP = /(CLP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.CNY = /(CNY\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.COP = /(COP\s?\$\s?|COP\s?|COL\$\s?|\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.COU = /(COU\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.CRC = /(CRC\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.CUC = /(CUC\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.CUP = /(CUP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.CVE = /(CVE\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.CZK = /(CZK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.DJF = /(DJF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        // aRegex1.DKK = /(DKK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.DOP = /(DOP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.DZD = /(DZD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.EGP = /(EGP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.ERN = /(ERN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.ETB = /(ETB\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        // aRegex1.EUR = /(EUR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.FJD = /(FJD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.FKP = /(FKP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        // aRegex1.GBP = /(GBP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.GEL = /(GEL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.GHS = /(GHS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.GIP = /(GIP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.GMD = /(GMD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.GNF = /(GNF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.GTQ = /(GTQ\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.GYD = /(GYD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.HKD = /(HKD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.HNL = /(HNL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.HRK = /(HRK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.HTG = /(HTG\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.HUF = /(HUF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.IDR = /(IDR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.ILS = /(ILS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.INR = /(INR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.IQD = /(IQD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.IRR = /(IRR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        // aRegex1.ISK = /(ISK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.JMD = /(JMD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.JOD = /(JOD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        // aRegex1.JPY = /(JPY\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.KES = /(KES\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.KGS = /(KGS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.KHR = /(KHR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.KMF = /(KMF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.KPW = /(KPW\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.KRW = /(KRW\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.KWD = /(KWD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.KYD = /(KYD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.KZT = /(KZT\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.LAK = /(LAK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.LBP = /(LBP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.LKR = /(LKR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.LRD = /(LRD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.LSL = /(LSL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.LTL = /(LTL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.LYD = /(LYD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MAD = /(MAD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MDL = /(MDL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MGA = /(MGA\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MKD = /(MKD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MMK = /(MMK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MNT = /(MNT\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MOP = /(MOP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MRO = /(MRO\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MUR = /(MUR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MVR = /(MVR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MWK = /(MWK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MXN = /(MXN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MXV = /(MXV\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MYR = /(MYR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.MZN = /(MZN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.NAD = /(NAD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.NGN = /(NGN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.NIO = /(NIO\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        // aRegex1.NOK = /(NOK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.NPR = /(NPR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.NZD = /(NZD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.OMR = /(OMR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.PAB = /(PAB\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.PEN = /(PEN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.PGK = /(PGK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.PHP = /(PHP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.PKR = /(PKR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.PLN = /(PLN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.PYG = /(PYG\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.QAR = /(QAR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.RON = /(RON\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.RSD = /(RSD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        // aRegex1.RUB = /(RUB\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.RWF = /(RWF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.SAR = /(SAR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.SBD = /(SBD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.SCR = /(SCR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.SDG = /(SDG\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        // aRegex1.SEK = /(SEK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.SGD = /(SGD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.SHP = /(SHP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.SLL = /(SLL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.SOS = /(SOS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.SRD = /(SRD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.SSP = /(SSP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.STD = /(STD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.SVC = /(SVC\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.SYP = /(SYP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.SZL = /(SZL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.THB = /(THB\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.TJS = /(TJS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.TMT = /(TMT\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.TND = /(TND\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.TOP = /(TOP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.TRY = /(TRY\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.TTD = /(TTD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.TWD = /(TWD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.TZS = /(TZS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.UAH = /(UAH\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.UGX = /(UGX\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        // aRegex1.USD = /(USD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.USN = /(USN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.UYI = /(UYI\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.UYU = /(UYU\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.UZS = /(UZS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.VEF = /(VEF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.VND = /(VND\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.VUV = /(VUV\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.WST = /(WST\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XAF = /(XAF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XAG = /(XAG\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XAU = /(XAU\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XBA = /(XBA\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XBB = /(XBB\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XBC = /(XBC\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XBD = /(XBD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XCD = /(XCD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XDR = /(XDR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XOF = /(XOF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XPD = /(XPD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XPF = /(XPF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XPT = /(XPT\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XSU = /(XSU\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XTS = /(XTS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XUA = /(XUA\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.XXX = /(XXX\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.YER = /(YER\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.ZAR = /(ZAR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.ZMW = /(ZMW\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex1.ZWL = /(ZWL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex2.AED = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?dhs?|\s?dirhams?|\s?AED)/ig;
        aRegex2.AFN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s؋\s?afs?|\s?افغانۍ|\s?afghanis?|\s?AFN)/ig;
        aRegex2.ALL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?Lekë?|\s?ALL)/ig;
        aRegex2.AMD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\\u058F|\s?Դրամ|\s?drams?|\s?драм|\s?AMD)/ig;
        aRegex2.ANG = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?NAƒ|\s?ƒ|\s?NAf\.?|\sgulden|\s?ANG)/ig;
        aRegex2.AOA = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?Kz|\s?kwanzas?|\s?AOA)/ig;
        aRegex2.ARS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?AR\$|\s?\$|\s?pesos?|\s?ARS)/ig;
        aRegex2.AUD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?AUD\$|\s?AU\$|\s?\$|\s?dollars?|\s?AUD)/ig;
        aRegex2.AWG = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?Afl\.?|\sflorin|\s?AWG)/ig;
        aRegex2.AZN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?₼|\s?manat|\s?man\.?|\s?AZN)/ig;
        aRegex2.BAM = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KM|\s?BAM)/g;
        aRegex2.BBD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\$|\s?dollars?|\s?BBD)/ig;
        aRegex2.BDT = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BDT|\s?টাকা|\s?Tk|\s?taka)/ig;
        aRegex2.BGN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BGN|\s?лв\.?|\s?лева?|\s?lv\.?|\s?leva?)/ig;
        aRegex2.BHD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BHD|\s?.د.ب|\s?dinars?|\s?دينار)/ig;
        aRegex2.BIF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BIF|\s?Fbu?|\s?francs|\s?Fr)/ig;
        aRegex2.BMD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BMD|\s?\$|\s?dollars?)/ig;
        aRegex2.BND = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BND|\s?\$|\s?dollars?)/ig;
        aRegex2.BOB = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BOB|\s?Bs\.?|\s?Bolivianos?)/ig;
        aRegex2.BOV = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BOV|\s?MVDOL)/ig;
        aRegex2.BRL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BRL|\s?R\$|\s?real|\s?reais)/ig;
        aRegex2.BSD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BSD|\s?\$|\s?dollars?)/ig;
        aRegex2.BTN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BTN|\s?Ngultrum|\s?དངུལ་ཀྲམ)/ig;
        aRegex2.BWP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BWP|\s?pula)/ig;
        aRegex2.BYR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BYR|\s?Br\.?|\s?бр\.?|\s?рубель|\s?рублёў|\s?рублей|\s?rubles?)/ig;
        aRegex2.BZD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\$|\s?dollars?|\s?BZD)/ig;
        aRegex2.CAD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CAD)/ig;
        aRegex2.CDF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CDF)/ig;
        aRegex2.CHE = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CHE)/ig;
        // aRegex2.CHF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CHF)/ig;
        aRegex2.CHW = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CHW)/ig;
        aRegex2.CLF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CLF)/ig;
        aRegex2.CLP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CLP)/ig;
        aRegex2.CNY = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CNY)/ig;
        aRegex2.COP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?COP|\s?Col\$)/ig;
        aRegex2.COU = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?COU)/ig;
        aRegex2.CRC = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CRC)/ig;
        aRegex2.CUC = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CUC)/ig;
        aRegex2.CUP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CUP)/ig;
        aRegex2.CVE = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CVE)/ig;
        aRegex2.CZK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CZK)/ig;
        aRegex2.DJF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?DJF)/ig;
        // aRegex2.DKK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?DKK)/ig;
        aRegex2.DOP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?DOP)/ig;
        aRegex2.DZD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?DZD)/ig;
        aRegex2.EGP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?EGP)/ig;
        aRegex2.ERN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?ERN)/ig;
        aRegex2.ETB = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?ETB)/ig;
        // aRegex2.EUR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?EUR)/ig;
        aRegex2.FJD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?FJD)/ig;
        aRegex2.FKP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?FKP)/ig;
        // aRegex2.GBP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GBP)/ig;
        aRegex2.GEL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GEL)/ig;
        aRegex2.GHS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GHS)/ig;
        aRegex2.GIP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GIP)/ig;
        aRegex2.GMD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GMD)/ig;
        aRegex2.GNF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GNF)/ig;
        aRegex2.GTQ = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GTQ)/ig;
        aRegex2.GYD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GYD)/ig;
        aRegex2.HKD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?HKD)/ig;
        aRegex2.HNL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?HNL)/ig;
        aRegex2.HRK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?HRK)/ig;
        aRegex2.HTG = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?HTG)/ig;
        aRegex2.HUF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?HUF)/ig;
        aRegex2.IDR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?IDR)/ig;
        aRegex2.ILS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?ILS)/ig;
        aRegex2.INR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?INR)/ig;
        aRegex2.IQD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?IQD)/ig;
        aRegex2.IRR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?IRR)/ig;
        // aRegex2.ISK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?ISK)/ig;
        aRegex2.JMD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?JMD)/ig;
        aRegex2.JOD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?JOD)/ig;
        // aRegex2.JPY = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?JPY)/ig;
        aRegex2.KES = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KES)/ig;
        aRegex2.KGS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KGS)/ig;
        aRegex2.KHR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KHR)/ig;
        aRegex2.KMF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KMF)/ig;
        aRegex2.KPW = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KPW)/ig;
        aRegex2.KRW = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KRW)/ig;
        aRegex2.KWD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KWD)/ig;
        aRegex2.KYD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KYD)/ig;
        aRegex2.KZT = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KZT)/ig;
        aRegex2.LAK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?LAK)/ig;
        aRegex2.LBP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?LBP)/ig;
        aRegex2.LKR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?LKR)/ig;
        aRegex2.LRD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?LRD)/ig;
        aRegex2.LSL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?LSL)/ig;
        aRegex2.LTL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?LTL)/ig;
        aRegex2.LYD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?LYD)/ig;
        aRegex2.MAD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MAD)/ig;
        aRegex2.MDL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MDL)/ig;
        aRegex2.MGA = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MGA)/ig;
        aRegex2.MKD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MKD)/ig;
        aRegex2.MMK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MMK)/ig;
        aRegex2.MNT = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MNT)/ig;
        aRegex2.MOP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MOP)/ig;
        aRegex2.MRO = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MRO)/ig;
        aRegex2.MUR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MUR)/ig;
        aRegex2.MVR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MVR)/ig;
        aRegex2.MWK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MWK)/ig;
        aRegex2.MXN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MXN)/ig;
        aRegex2.MXV = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MXV)/ig;
        aRegex2.MYR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MYR)/ig;
        aRegex2.MZN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MZN)/ig;
        aRegex2.NAD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?NAD)/ig;
        aRegex2.NGN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?NGN)/ig;
        aRegex2.NIO = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?NIO)/ig;
        // aRegex2.NOK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?NOK)/ig;
        aRegex2.NPR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?NPR)/ig;
        aRegex2.NZD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?NZD)/ig;
        aRegex2.OMR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?OMR)/ig;
        aRegex2.PAB = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?PAB)/ig;
        aRegex2.PEN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?PEN)/ig;
        aRegex2.PGK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?PGK)/ig;
        aRegex2.PHP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?PHP)/ig;
        aRegex2.PKR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?PKR)/ig;
        aRegex2.PLN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?PLN)/ig;
        aRegex2.PYG = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?PYG)/ig;
        aRegex2.QAR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?QAR)/ig;
        aRegex2.RON = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?RON)/ig;
        aRegex2.RSD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?RSD)/ig;
        // aRegex2.RUB = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?RUB)/ig;
        aRegex2.RWF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?RWF)/ig;
        aRegex2.SAR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SAR)/ig;
        aRegex2.SBD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SBD)/ig;
        aRegex2.SCR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SCR)/ig;
        aRegex2.SDG = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SDG)/ig;
        // aRegex2.SEK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SEK)/ig;
        aRegex2.SGD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SGD)/ig;
        aRegex2.SHP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SHP)/ig;
        aRegex2.SLL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SLL)/ig;
        aRegex2.SOS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SOS)/ig;
        aRegex2.SRD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SRD)/ig;
        aRegex2.SSP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SSP)/ig;
        aRegex2.STD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?STD)/ig;
        aRegex2.SVC = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SVC)/ig;
        aRegex2.SYP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SYP)/ig;
        aRegex2.SZL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SZL)/ig;
        aRegex2.THB = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?THB)/ig;
        aRegex2.TJS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TJS)/ig;
        aRegex2.TMT = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TMT)/ig;
        aRegex2.TND = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TND)/ig;
        aRegex2.TOP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TOP)/ig;
        aRegex2.TRY = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TRY)/ig;
        aRegex2.TTD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TTD)/ig;
        aRegex2.TWD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TWD)/ig;
        aRegex2.TZS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TZS)/ig;
        aRegex2.UAH = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?UAH)/ig;
        aRegex2.UGX = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?UGX)/ig;
        // aRegex2.USD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?USD)/ig;
        aRegex2.USN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?USN)/ig;
        aRegex2.UYI = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?UYI)/ig;
        aRegex2.UYU = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?UYU)/ig;
        aRegex2.UZS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?UZS)/ig;
        aRegex2.VEF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?VEF)/ig;
        aRegex2.VND = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?VND)/ig;
        aRegex2.VUV = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?VUV)/ig;
        aRegex2.WST = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?WST)/ig;
        aRegex2.XAF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XAF)/ig;
        aRegex2.XAG = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XAG)/ig;
        aRegex2.XAU = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XAU)/ig;
        aRegex2.XBA = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XBA)/ig;
        aRegex2.XBB = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XBB)/ig;
        aRegex2.XBC = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XBC)/ig;
        aRegex2.XBD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XBD)/ig;
        aRegex2.XCD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XCD)/ig;
        aRegex2.XDR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XDR)/ig;
        aRegex2.XOF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XOF)/ig;
        aRegex2.XPD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XPD)/ig;
        aRegex2.XPF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XPF)/ig;
        aRegex2.XPT = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XPT)/ig;
        aRegex2.XSU = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XSU)/ig;
        aRegex2.XTS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XTS)/ig;
        aRegex2.XUA = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XUA)/ig;
        aRegex2.XXX = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XXX)/ig;
        aRegex2.YER = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?YER)/ig;
        aRegex2.ZAR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?ZAR)/ig;
        aRegex2.ZMW = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?ZMW)/ig;
        aRegex2.ZWL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?ZWL)/ig;
        aRegex1.USD = /(\$\s?|USD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex2.USD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\$|\s?USD)/ig;
        aRegex1.GBP = /(\£\s?|GBP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex2.GBP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\£|\s?GBP)/ig;
        aRegex1.EUR = /(\€\s?|euro\s?|EUR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex2.EUR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\€|\s?euro|\s?EUR)/ig;
        aRegex1.JPY = /(\¥\s?|\yen\s?|JPY\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex2.JPY = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\¥|\s?\yen|\s?JPY)/ig;
        aRegex1.RUB = /(RUB\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex2.RUB = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\р\.|\s?\Р\.|\s?\р\у\б\.|\s?\р\у\б\л\е\й|\s?\р\у\б\л\ь|\s?\р\у\б|\s?rubles|\s?ruble|\s?RUB)/ig;
        aRegex1.SEK = /(\kr\s?|skr\s?|SEK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,|\:)\d{1,9})?)/ig;
        aRegex2.SEK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,|\:)\d{1,9})?)(\s?öre|\s?(svenska\s)?kronor|\s?miljon(er)? kronor|\s?miljard(er)? kronor|\s?mnkr|\s?mdkr|\s?mkr|\s?s?kr((?![a-zó])|$)|\s?kSEK|\s?MSEK|\s?GSEK|\s?SEK|\:\-|\,\-)(?!\w)/ig;
        aRegex1.NOK = /(\kr\s?|nkr\s?|NOK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex2.NOK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?milliard(er)? kroner|\s?million(er)? kroner|\s?kroner|\s?kr[\.\s]|\s?nkr|\s?NOK|\:\-|\,\-)(?!\w)/ig;
        aRegex1.DKK = /(\kr\s?|\kr.\s?|dkr\s?|DKK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex2.DKK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?mio\. kroner|\s?million(er)? kroner|\s?mia\. kroner|\s?kroner|s?mia\. krónur|\s?milliard(ir)? krónur?|s?mio\. krónur|\s?millión(ir)? krónur?|\s?miljón(ir)? krónur?|\s?krónur?|\s?kr|\s?dkr|\s?DKK|\:\-|\,\-)(?!\w)/ig;
        aRegex1.ISK = /(\kr\s?|iskr\s?|ISK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex2.ISK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?milljarð(ar)?(ur)? króna|\s?milljón(a)?(ir)?(um)? króna|\s?króna?(ur)?|\s?kr|\s?iskr|\s?ISK|\:\-|\,\-)(?!\w)/ig;
        aRegex1.CHF = /(Fr\.\s?|CHF\s?)((\d{1,3}((\'|\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/ig;
        aRegex2.CHF = /((\d{1,3}((\'|\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?Fr\.|\s?Franken|\s?CHF)/ig;
        aRegex1.inch = /NOMATCH/ig;
        aRegex2.inch = /(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?))(\s?tum|\-tums?|\s?\"|\s?\″)(?!\w)/ig;
        aRegex1.kcal = /NOMATCH/ig;
        aRegex2.kcal = /(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?))(\s?kcal|\s?kalorier)(?!\w)/ig;
        aRegex1.nmi = /NOMATCH/ig;
        aRegex2.nmi = /(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?))(\s?sjömil|\s?nautiska mil?|\s?nautical miles?)(?!\w)/ig;
        aRegex1.mile = /NOMATCH/ig;
        aRegex2.mile = /(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?))(\s?mile|\s?miles)(?!\w)/ig;
        aRegex1.mil = /NOMATCH/ig;
        aRegex2.mil = /(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?))(\s?mil)(?!\w)/ig;
        aRegex1.knots = /NOMATCH/ig;
        aRegex2.knots = /(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?))(\s?knop)(?!\w)/ig;
        aRegex1.hp = /NOMATCH/ig;
        aRegex2.hp = /(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?))(\s?hästkrafter|\s?hkr?|\s?hp)(?!\w)/ig;
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
        const checkRegex = function(anEnabledCurrenciesWithRegexes, anIndex, anArray) {
            var conversionQuote = 1;
            const makeReplacement = function(aPrice, anIndex, anArray) {
                var tempConversionQuote = conversionQuote;
                if (replacedUnit === "SEK" && aPrice.full.toLowerCase().contains("öre")) {
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
                    if (convertedContent.contains(replacedUnit)) {
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
            replacedUnit = anEnabledCurrenciesWithRegexes.currency;
            if (currencyCode === replacedUnit) {
               return false;
            }
            var prices = findPrices(anEnabledCurrenciesWithRegexes.regex1, aNode.textContent, 2);
            if (prices.length === 0) {
                prices = findPrices(anEnabledCurrenciesWithRegexes.regex2, aNode.textContent, 1);
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
    // Stores prices that will be replaced with converted prices
    const findPrices = function(aRegex, aText, anAmountPosition) {
        const prices = [];
        if (aRegex === null) {
            return prices;
        }
        const makePrice = function(aMatch) {
            const price = {};
            price.amount = aMatch[anAmountPosition];
            price.full = aMatch[0];
            price.index = aMatch.index;
            // console.log(price.amount + ";" + price.full + ";" + price.index);
            return price;
        };
        var match = [];
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
                // Can't use const here - SyntaxError: invalid for/in left-hand side
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
            // Add enabled currencies to enabledCurrenciesWithRegexes
            if (contentScriptParams.enabledCurrencies[currency]) {
                const currencyRegex = {};
                currencyRegex.currency = currency;
                currencyRegex.regex1 = regex1[currency];
                currencyRegex.regex2 = regex2[currency];
                enabledCurrenciesWithRegexes.push(currencyRegex);
                // console.log("enabledCurrenciesWithRegexes " + enabledCurrenciesWithRegexes.length);
            }
        }
        // console.log("enabledCurrenciesWithRegexes.length " + enabledCurrenciesWithRegexes.length);
        if (tempConvertUnits) {
            const regexObj_inch = {};
            regexObj_inch.currency = "inch";
            regexObj_inch.regex1 = regex1.inch;
            regexObj_inch.regex2 = regex2.inch;
            enabledCurrenciesWithRegexes.push(regexObj_inch);
            const regexObj_kcal = {};
            regexObj_kcal.currency = "kcal";
            regexObj_kcal.regex1 = regex1.kcal;
            regexObj_kcal.regex2 = regex2.kcal;
            enabledCurrenciesWithRegexes.push(regexObj_kcal);
            const regexObj_nmi = {};
            regexObj_nmi.currency = "nmi";
            regexObj_nmi.regex1 = regex1.nmi;
            regexObj_nmi.regex2 = regex2.nmi;
            enabledCurrenciesWithRegexes.push(regexObj_nmi);
            const regexObj_mile = {};
            regexObj_mile.currency = "mile";
            regexObj_mile.regex1 = regex1.mile;
            regexObj_mile.regex2 = regex2.mile;
            enabledCurrenciesWithRegexes.push(regexObj_mile);
            const regexObj_mil = {};
            regexObj_mil.currency = "mil";
            regexObj_mil.regex1 = regex1.mil;
            regexObj_mil.regex2 = regex2.mil;
            enabledCurrenciesWithRegexes.push(regexObj_mil);
            const regexObj_knots = {};
            regexObj_knots.currency = "knots";
            regexObj_knots.regex1 = regex1.knots;
            regexObj_knots.regex2 = regex2.knots;
            enabledCurrenciesWithRegexes.push(regexObj_knots);
            const regexObj_hp = {};
            regexObj_hp.currency = "hp";
            regexObj_hp.regex1 = regex1.hp;
            regexObj_hp.regex2 = regex2.hp;
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
