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
        aRegex1.AED = /(Dhs?\s?|AED\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.AED = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?dhs?|\s?dirhams?|\s?AED)/g;
        aRegex1.AFN = /(؋\s?|افغانۍ\s?|afs?\s?|AFN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.AFN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s؋\s?afs?|\s?افغانۍ|\s?afghanis?|\s?AFN)/g;
        aRegex1.ALL = /(Lekë?\s?|ALL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.ALL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?Lekë?|\s?ALL)/g;
        aRegex1.AMD = /(\\u058F\s?|Դրամ\s?|drams?\s?|драм\s?|AMD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.AMD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\\u058F|\s?Դրամ|\s?drams?|\s?драм|\s?AMD)/g;
        aRegex1.ANG = /(NAƒ\s?|ƒ\s?|NAfs?|ANG\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.ANG = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?NAƒ|\s?ƒ|\s?NAf\.?|\sgulden|\s?ANG)/g;
        aRegex1.AOA = /(Kz\s?|AOA\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.AOA = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?Kz|\s?kwanzas?|\s?AOA)/g;
        aRegex1.ARS = /(AR\$\s?|\$\s?|ARS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.ARS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?AR\$|\s?\$|\s?pesos?|\s?ARS)/g;
        aRegex1.AUD = /(AUD\s?\$\s?|AU\$\s?|\$\s?|AUD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.AUD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?AUD\$|\s?AU\$|\s?\$|\s?dollars?|\s?AUD)/g;
        aRegex1.AWG = /(Afl\.?\s?|AWG\.?\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.AWG = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?Afl\.?|\sflorin|\s?AWG)/g;
        aRegex1.AZN = /(₼\s?|AZN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.AZN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?₼|\s?manat|\s?man\.?|\s?AZN)/g;
        aRegex1.BAM = /(BAM\s?|KM\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BAM = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KM|\s?BAM)/g;
        aRegex1.BBD = /(BBD\s?|Bds\$?\s?|\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BBD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\$|\s?dollars?|\s?BBD)/g;
        aRegex1.BDT = /(BDT\s?|৳\s?|Tk\.?\s?|Taka\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BDT = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BDT|\s?টাকা|\s?Tk|\s?taka)/g;
        aRegex1.BGN = /(BGN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BGN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BGN|\s?лв\.?|\s?лева?|\s?lv\.?|\s?leva?)/g;
        aRegex1.BHD = /(BHD\s?|دينار\s?|BD\.?\s?|.د.ب\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BHD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BHD|\s?.د.ب|\s?dinars?|\s?دينار)/g;
        aRegex1.BIF = /(BIF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BIF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BIF|\s?Fbu?|\s?francs|\s?Fr)/g;
        aRegex1.BMD = /(BMD\$\s?|BMD\s?|Bd\$?\s?|\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BMD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BMD|\s?\$|\s?dollars?)/g;
        aRegex1.BND = /(BND\$\s?|BND\s?|B\$\s?|\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BND = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BND|\s?\$|\s?dollars?)/g;
        aRegex1.BOB = /(BOB\s?|Bs\.?\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BOB = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BOB|\s?Bs\.?|\s?Bolivianos?)/g;
        aRegex1.BOV = /(BOV\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BOV = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BOV|\s?MVDOL)/g;
        aRegex1.BRL = /(BRL\s?|R\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BRL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BRL|\s?R\$|\s?real|\s?reais)/g;
        aRegex1.BSD = /(BSD\$\s?|BSD\s?|B\$\s?|\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BSD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BSD|\s?\$|\s?dollars?)/g;
        aRegex1.BTN = /(BTN\s?|Nu\.?\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BTN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BTN|\s?Ngultrum|\s?དངུལ་ཀྲམ)/g;
        aRegex1.BWP = /(BWP\s?|\sP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BWP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BWP|\s?pula)/g;
        aRegex1.BYR = /(BYR\s?|Br\.?\s?|бр\.?\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BYR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?BYR|\s?Br\.?|\s?бр\.?|\s?рубель|\s?рублёў|\s?рублей|\s?rubles?)/g;
        aRegex1.BZD = /(BZD\s?|BZ\s?\$\s?|\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.BZD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\$|\s?dollars?|\s?BZD)/g;
        aRegex1.CAD = /(CAD\$\s?|C\$\s?|\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.CAD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CAD|\s?\$|\s?dollars?)/g;
        aRegex1.CDF = /(CDF\s?|F[Cc]\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.CDF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CDF|\s?F[Cc]|\s?francs)/g;
        aRegex1.CHE = /(CHE\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.CHE = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CHE)/g;
        aRegex1.CHF = /(Fr\.\s?|CHF\s?)((\d{1,3}((\'|\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.CHF = /((\d{1,3}((\'|\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?Fr\.|\s?Franken|\s?CHF)/g;
        aRegex1.CHW = /(CHW\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.CHW = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CHW)/g;
        aRegex1.CLF = /(CLF\s?|UF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.CLF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CLF|\s?U\.?F\.?)/g;
        aRegex1.CLP = /(CLP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.CLP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CLP)/g;
        aRegex1.CNY = /(CNY\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.CNY = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CNY)/g;
        aRegex1.COP = /(COP\s?\$\s?|COP\s?|COL\$\s?|\$\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.COP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?COP|\s?Col\$)/g;
        aRegex1.COU = /(COU\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.COU = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?COU)/g;
        aRegex1.CRC = /(CRC\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.CRC = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CRC)/g;
        aRegex1.CUC = /(CUC\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.CUC = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CUC)/g;
        aRegex1.CUP = /(CUP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.CUP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CUP)/g;
        aRegex1.CVE = /(CVE\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.CVE = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CVE)/g;
        aRegex1.CZK = /(CZK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.CZK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?CZK)/g;
        aRegex1.DJF = /(DJF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.DJF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?DJF)/g;
        aRegex1.DKK = /(\kr\s?|\kr.\s?|dkr\s?|DKK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.DKK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?mio\. kroner|\s?million(er)? kroner|\s?mia\. kroner|\s?kroner|s?mia\. krónur|\s?milliard(ir)? krónur?|s?mio\. krónur|\s?millión(ir)? krónur?|\s?miljón(ir)? krónur?|\s?krónur?|\s?kr|\s?dkr|\s?DKK|\:\-|\,\-)(?!\w)/g;
        aRegex1.DOP = /(DOP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.DOP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?DOP)/g;
        aRegex1.DZD = /(DZD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.DZD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?DZD)/g;
        aRegex1.EGP = /(EGP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.EGP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?EGP)/g;
        aRegex1.ERN = /(ERN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.ERN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?ERN)/g;
        aRegex1.ETB = /(ETB\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.ETB = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?ETB)/g;
        aRegex1.EUR = /(\€\s?|euro\s?|EUR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.EUR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\€|\s?euro|\s?EUR)/g;
        aRegex1.FJD = /(FJD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.FJD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?FJD)/g;
        aRegex1.FKP = /(FKP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.FKP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?FKP)/g;
        aRegex1.GBP = /(\£\s?|GBP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.GBP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\£|\s?GBP)/g;
        aRegex1.GEL = /(GEL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.GEL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GEL)/g;
        aRegex1.GHS = /(GHS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.GHS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GHS)/g;
        aRegex1.GIP = /(GIP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.GIP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GIP)/g;
        aRegex1.GMD = /(GMD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.GMD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GMD)/g;
        aRegex1.GNF = /(GNF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.GNF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GNF)/g;
        aRegex1.GTQ = /(GTQ\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.GTQ = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GTQ)/g;
        aRegex1.GYD = /(GYD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.GYD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?GYD)/g;
        aRegex1.HKD = /(HKD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.HKD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?HKD)/g;
        aRegex1.HNL = /(HNL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.HNL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?HNL)/g;
        aRegex1.HRK = /(HRK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.HRK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?HRK)/g;
        aRegex1.HTG = /(HTG\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.HTG = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?HTG)/g;
        aRegex1.HUF = /(HUF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.HUF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?HUF)/g;
        aRegex1.IDR = /(IDR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.IDR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?IDR)/g;
        aRegex1.ILS = /(ILS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.ILS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?ILS)/g;
        aRegex1.INR = /(INR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.INR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?INR)/g;
        aRegex1.IQD = /(IQD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.IQD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?IQD)/g;
        aRegex1.IRR = /(IRR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.IRR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?IRR)/g;
        aRegex1.ISK = /(\kr\s?|iskr\s?|ISK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.ISK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?milljarð(ar)?(ur)? króna|\s?milljón(a)?(ir)?(um)? króna|\s?króna?(ur)?|\s?kr|\s?iskr|\s?ISK|\:\-|\,\-)(?!\w)/g;
        aRegex1.JMD = /(JMD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.JMD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?JMD)/g;
        aRegex1.JOD = /(JOD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.JOD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?JOD)/g;
        aRegex1.JPY = /(\¥\s?|\yen\s?|JPY\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.JPY = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\¥|\s?\yen|\s?JPY)/g;
        aRegex1.KES = /(KES\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.KES = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KES)/g;
        aRegex1.KGS = /(KGS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.KGS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KGS)/g;
        aRegex1.KHR = /(KHR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.KHR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KHR)/g;
        aRegex1.KMF = /(KMF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.KMF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KMF)/g;
        aRegex1.KPW = /(KPW\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.KPW = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KPW)/g;
        aRegex1.KRW = /(KRW\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.KRW = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KRW)/g;
        aRegex1.KWD = /(KWD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.KWD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KWD)/g;
        aRegex1.KYD = /(KYD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.KYD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KYD)/g;
        aRegex1.KZT = /(KZT\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.KZT = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?KZT)/g;
        aRegex1.LAK = /(LAK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.LAK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?LAK)/g;
        aRegex1.LBP = /(LBP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.LBP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?LBP)/g;
        aRegex1.LKR = /(LKR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.LKR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?LKR)/g;
        aRegex1.LRD = /(LRD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.LRD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?LRD)/g;
        aRegex1.LSL = /(LSL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.LSL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?LSL)/g;
        aRegex1.LTL = /(LTL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.LTL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?LTL)/g;
        aRegex1.LYD = /(LYD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.LYD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?LYD)/g;
        aRegex1.MAD = /(MAD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MAD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MAD)/g;
        aRegex1.MDL = /(MDL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MDL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MDL)/g;
        aRegex1.MGA = /(MGA\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MGA = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MGA)/g;
        aRegex1.MKD = /(MKD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MKD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MKD)/g;
        aRegex1.MMK = /(MMK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MMK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MMK)/g;
        aRegex1.MNT = /(MNT\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MNT = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MNT)/g;
        aRegex1.MOP = /(MOP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MOP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MOP)/g;
        aRegex1.MRO = /(MRO\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MRO = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MRO)/g;
        aRegex1.MUR = /(MUR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MUR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MUR)/g;
        aRegex1.MVR = /(MVR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MVR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MVR)/g;
        aRegex1.MWK = /(MWK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MWK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MWK)/g;
        aRegex1.MXN = /(MXN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MXN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MXN)/g;
        aRegex1.MXV = /(MXV\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MXV = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MXV)/g;
        aRegex1.MYR = /(MYR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MYR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MYR)/g;
        aRegex1.MZN = /(MZN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.MZN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?MZN)/g;
        aRegex1.NAD = /(NAD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.NAD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?NAD)/g;
        aRegex1.NGN = /(NGN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.NGN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?NGN)/g;
        aRegex1.NIO = /(NIO\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.NIO = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?NIO)/g;
        aRegex1.NOK = /(\kr\s?|nkr\s?|NOK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.NOK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?milliard(er)? kroner|\s?million(er)? kroner|\s?kroner|\s?kr[\.\s]|\s?nkr|\s?NOK|\:\-|\,\-)(?!\w)/g;
        aRegex1.NPR = /(NPR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.NPR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?NPR)/g;
        aRegex1.NZD = /(NZD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.NZD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?NZD)/g;
        aRegex1.OMR = /(OMR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.OMR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?OMR)/g;
        aRegex1.PAB = /(PAB\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.PAB = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?PAB)/g;
        aRegex1.PEN = /(PEN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.PEN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?PEN)/g;
        aRegex1.PGK = /(PGK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.PGK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?PGK)/g;
        aRegex1.PHP = /(PHP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.PHP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?PHP)/g;
        aRegex1.PKR = /(PKR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.PKR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?PKR)/g;
        aRegex1.PLN = /(PLN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.PLN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?PLN)/g;
        aRegex1.PYG = /(PYG\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.PYG = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?PYG)/g;
        aRegex1.QAR = /(QAR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.QAR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?QAR)/g;
        aRegex1.RON = /(RON\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.RON = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?RON)/g;
        aRegex1.RSD = /(RSD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.RSD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?RSD)/g;
        aRegex1.RUB = /(RUB\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.RUB = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\р\.|\s?\Р\.|\s?\р\у\б\.|\s?\р\у\б\л\е\й|\s?\р\у\б\л\ь|\s?\р\у\б|\s?rubles|\s?ruble|\s?RUB)/g;
        aRegex1.RWF = /(RWF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.RWF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?RWF)/g;
        aRegex1.SAR = /(SAR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.SAR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SAR)/g;
        aRegex1.SBD = /(SBD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.SBD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SBD)/g;
        aRegex1.SCR = /(SCR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.SCR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SCR)/g;
        aRegex1.SDG = /(SDG\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.SDG = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SDG)/g;
        aRegex1.SEK = /(\kr\s?|skr\s?|SEK\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,|\:)\d{1,9})?)/g;
        aRegex2.SEK = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,|\:)\d{1,9})?)(\s?öre|\s?(svenska\s)?kronor|\s?miljon(er)? kronor|\s?miljard(er)? kronor|\s?mnkr|\s?mdkr|\s?mkr|\s?s?kr((?![a-zó])|$)|\s?kSEK|\s?MSEK|\s?GSEK|\s?SEK|\:\-|\,\-)(?!\w)/g;
        aRegex1.SGD = /(SGD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.SGD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SGD)/g;
        aRegex1.SHP = /(SHP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.SHP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SHP)/g;
        aRegex1.SLL = /(SLL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.SLL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SLL)/g;
        aRegex1.SOS = /(SOS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.SOS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SOS)/g;
        aRegex1.SRD = /(SRD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.SRD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SRD)/g;
        aRegex1.SSP = /(SSP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.SSP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SSP)/g;
        aRegex1.STD = /(STD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.STD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?STD)/g;
        aRegex1.SVC = /(SVC\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.SVC = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SVC)/g;
        aRegex1.SYP = /(SYP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.SYP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SYP)/g;
        aRegex1.SZL = /(SZL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.SZL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?SZL)/g;
        aRegex1.THB = /(THB\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.THB = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?THB)/g;
        aRegex1.TJS = /(TJS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.TJS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TJS)/g;
        aRegex1.TMT = /(TMT\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.TMT = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TMT)/g;
        aRegex1.TND = /(TND\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.TND = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TND)/g;
        aRegex1.TOP = /(TOP\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.TOP = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TOP)/g;
        aRegex1.TRY = /(TRY\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.TRY = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TRY)/g;
        aRegex1.TTD = /(TTD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.TTD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TTD)/g;
        aRegex1.TWD = /(TWD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.TWD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TWD)/g;
        aRegex1.TZS = /(TZS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.TZS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?TZS)/g;
        aRegex1.UAH = /(UAH\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.UAH = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?UAH)/g;
        aRegex1.UGX = /(UGX\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.UGX = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?UGX)/g;
        aRegex1.USD = /(\$\s?|USD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.USD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?\$|\s?USD)/g;
        aRegex1.USN = /(USN\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.USN = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?USN)/g;
        aRegex1.UYI = /(UYI\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.UYI = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?UYI)/g;
        aRegex1.UYU = /(UYU\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.UYU = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?UYU)/g;
        aRegex1.UZS = /(UZS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.UZS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?UZS)/g;
        aRegex1.VEF = /(VEF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.VEF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?VEF)/g;
        aRegex1.VND = /(VND\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.VND = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?VND)/g;
        aRegex1.VUV = /(VUV\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.VUV = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?VUV)/g;
        aRegex1.WST = /(WST\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.WST = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?WST)/g;
        aRegex1.XAF = /(XAF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XAF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XAF)/g;
        aRegex1.XAG = /(XAG\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XAG = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XAG)/g;
        aRegex1.XAU = /(XAU\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XAU = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XAU)/g;
        aRegex1.XBA = /(XBA\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XBA = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XBA)/g;
        aRegex1.XBB = /(XBB\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XBB = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XBB)/g;
        aRegex1.XBC = /(XBC\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XBC = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XBC)/g;
        aRegex1.XBD = /(XBD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XBD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XBD)/g;
        aRegex1.XCD = /(XCD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XCD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XCD)/g;
        aRegex1.XDR = /(XDR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XDR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XDR)/g;
        aRegex1.XOF = /(XOF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XOF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XOF)/g;
        aRegex1.XPD = /(XPD\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XPD = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XPD)/g;
        aRegex1.XPF = /(XPF\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XPF = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XPF)/g;
        aRegex1.XPT = /(XPT\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XPT = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XPT)/g;
        aRegex1.XSU = /(XSU\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XSU = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XSU)/g;
        aRegex1.XTS = /(XTS\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XTS = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XTS)/g;
        aRegex1.XUA = /(XUA\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XUA = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XUA)/g;
        aRegex1.XXX = /(XXX\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.XXX = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?XXX)/g;
        aRegex1.YER = /(YER\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.YER = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?YER)/g;
        aRegex1.ZAR = /(ZAR\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.ZAR = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?ZAR)/g;
        aRegex1.ZMW = /(ZMW\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.ZMW = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?ZMW)/g;
        aRegex1.ZWL = /(ZWL\s?)((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)/g;
        aRegex2.ZWL = /((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?)(\s?ZWL)/g;
        aRegex1.inch = /NOMATCH/g;
        aRegex2.inch = /(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?))(\s?tum|\-tums?|\s?\"|\s?\″)(?!\w)/g;
        aRegex1.kcal = /NOMATCH/g;
        aRegex2.kcal = /(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?))(\s?kcal|\s?kalorier)(?!\w)/g;
        aRegex1.nmi = /NOMATCH/g;
        aRegex2.nmi = /(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?))(\s?sjömil|\s?nautiska mil?|\s?nautical miles?)(?!\w)/g;
        aRegex1.mile = /NOMATCH/g;
        aRegex2.mile = /(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?))(\s?mile|\s?miles)(?!\w)/g;
        aRegex1.mil = /NOMATCH/g;
        aRegex2.mil = /(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?))(\s?mil)(?!\w)/g;
        aRegex1.knots = /NOMATCH/g;
        aRegex2.knots = /(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?))(\s?knop)(?!\w)/g;
        aRegex1.hp = /NOMATCH/g;
        aRegex2.hp = /(((\d{1,3}((\,|\.|\s)\d{3})+|(\d+))((\.|\,)\d{1,9})?))(\s?hästkrafter|\s?hkr?|\s?hp)(?!\w)/g;
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
