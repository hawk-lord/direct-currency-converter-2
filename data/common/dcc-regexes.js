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

if (!this.PriceRegexes) {
    const PriceRegexes = (function() {
        "use strict";
        const makePriceRegexes = function(aRegex1, aRegex2) {
            const begin = "(^|\\s|\\()";
            const value = "(\\d{1,3}((,|\\.|\\s)\\d{3})+|(\\d+))((\\.|,)\\d{1,9})?";
            const space = "\\s?";
            const end = "(?![\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0\\u08A2-\\u08AC\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6E5\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA793\\uA7A0-\\uA7AA\\uA7F8-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC])";
            const makeRegex1 = function(reg) {
                return RegExp(begin + reg + "(" + space + value + ")", "g");
            };
            const makeRegex2 = function(reg) {
                return RegExp("(" + value + space + ")" + reg + end, "g");
            };
            try {
                aRegex1.AED = makeRegex1("(AED|Dhs?)");
                aRegex2.AED = makeRegex2("(AED|Dhs?|dirhams?)");
                aRegex1.AFN = makeRegex1("(AFN|؋|افغانۍ|[aA]fs?)");
                aRegex2.AFN = makeRegex2("(AFN|\\s؋\\s?afs?|afs?|افغانۍ|afghanis?)");
                aRegex1.ALL = makeRegex1("(ALL|Lekë?)");
                aRegex2.ALL = makeRegex2("(ALL|[lL]ekë?|L)");
                aRegex1.AMD = makeRegex1("(AMD|\\u058F|Դրամ|drams?|драм)");
                aRegex2.AMD = makeRegex2("(AMD|\\u058F|Դրամ|drams?|драм)");
                aRegex1.ANG = makeRegex1("(ANG|NAƒ|ƒ|NAf\\.?)");
                aRegex2.ANG = makeRegex2("(ANG|NAƒ|ƒ|NAf\\.?|\\sgulden)");
                aRegex1.AOA = makeRegex1("(AOA|[kK]z)");
                aRegex2.AOA = makeRegex2("(AOA|Kz|kwanzas?)");
                aRegex1.ARS = makeRegex1("(ARS|AR\\$|\\$)");
                aRegex2.ARS = makeRegex2("(ARS|AR\\$|\\$|pesos?)");
                aRegex1.AUD = makeRegex1("(AUD|AUD\\s?\\$|AU\\$|\\$)");
                aRegex2.AUD = makeRegex2("(AUD|AUD\\$|AU\\$|\\$|dollars?)");
                aRegex1.AWG = makeRegex1("(AWG|AWG\\.?Afl\\.?)");
                aRegex2.AWG = makeRegex2("(AWG|[aA]fl\\.?|\\sflorin)");
                aRegex1.AZN = makeRegex1("(AZN|₼)");
                aRegex2.AZN = makeRegex2("(AZN|₼|manat|man\\.?)");
                aRegex1.BAM = makeRegex1("(BAM|KM)");
                aRegex2.BAM = makeRegex2("(BAM|KM)");
                aRegex1.BBD = makeRegex1("(BBD|Bds\\$?|\\$)");
                aRegex2.BBD = makeRegex2("(BBD|\\$|dollars?)");
                aRegex1.BDT = makeRegex1("(BDT|৳|Tk\\.?|Taka)");
                aRegex2.BDT = makeRegex2("(BDT|টাকা|Tk|taka)");
                aRegex1.BGN = makeRegex1("(BGN)");
                aRegex2.BGN = makeRegex2("(BGN|лв\\.?|лева?|lv\\.?|leva?)");
                aRegex1.BHD = makeRegex1("(BHD|دينار|BD\\.?|\\.د\\.ب)");
                aRegex2.BHD = makeRegex2("(BHD|\\.د\\.ب|dinars?|دينار)");
                aRegex1.BIF = makeRegex1("(BIF)");
                aRegex2.BIF = makeRegex2("(BIF|Fbu?|francs|Fr)");
                aRegex1.BMD = makeRegex1("(BMD\\$|BMD|BD\\$?|Bd\\$?|\\$)");
                aRegex2.BMD = makeRegex2("(BMD|\\$|dollars?)");
                aRegex1.BND = makeRegex1("(BND\\$|BND|B\\$|\\$)");
                aRegex2.BND = makeRegex2("(BND|\\$|dollars?)");
                aRegex1.BOB = makeRegex1("(BOB|Bs\\.?)");
                aRegex2.BOB = makeRegex2("(BOB|Bs\\.?|Bolivianos?)");
                aRegex1.BOV = makeRegex1("(BOV)");
                aRegex2.BOV = makeRegex2("(BOV|MVDOL)");
                aRegex1.BRL = makeRegex1("(BRL|R\\$)");
                aRegex2.BRL = makeRegex2("(BRL|R\\$|real|reais)");
                aRegex1.BSD = makeRegex1("(BSD|BSD\\$|B\\$|\\$)");
                aRegex2.BSD = makeRegex2("(BSD|\\$|dollars?)");
                aRegex1.BTN = makeRegex1("(BTN|Nu\\.?)");
                aRegex2.BTN = makeRegex2("(BTN|[nN]gultrum|དངུལ་ཀྲམ)");
                aRegex1.BWP = makeRegex1("(BWP|\\sP)");
                aRegex2.BWP = makeRegex2("(BWP|pula)");
                aRegex1.BYN = makeRegex1("(BYN|Br\\.?|бр\\.?)");
                aRegex2.BYN = makeRegex2("(BYN|Br\\.?|бр\\.?|рубель|рублёў|рублей|rubles?)");
                aRegex1.BZD = makeRegex1("(BZD|BZ\\s?\\$|\\$)");
                aRegex2.BZD = makeRegex2("(BZD|\\$|dollars?)");
                aRegex1.CAD = makeRegex1("(CAD|CAD\\$|C\\$|\\$)");
                aRegex2.CAD = makeRegex2("(CAD|\\$|dollars?)");
                aRegex1.CDF = makeRegex1("(CDF|F[Cc])");
                aRegex2.CDF = makeRegex2("(CDF|F[Cc]|francs)");
                aRegex1.CHE = makeRegex1("(CHE)");
                aRegex2.CHE = makeRegex2("(CHE)");
                aRegex1.CHF = RegExp(begin + "(CHF|Fr\\.)(\\s?(\\d{1,3}(('|,|\\.|\\s)\\d{3})+|(\\d+))((\\.|,)\\d{1,9})?)", "g");
                aRegex2.CHF = RegExp("((\\d{1,3}(('|,|\\.|\\s)\\d{3})+|(\\d+))((\\.|,)\\d{1,9})?\\s?)(CHF|Fr\\.|Franken)" + end, "g");
                aRegex1.CHW = makeRegex1("(CHW)");
                aRegex2.CHW = makeRegex2("(CHW)");
                aRegex1.CLF = makeRegex1("(CLF|UF)");
                aRegex2.CLF = makeRegex2("(CLF|U\\.?F\\.?|Unidades de Fomentos)");
                aRegex1.CLP = makeRegex1("(CLP|\\$)");
                aRegex2.CLP = makeRegex2("(CLP|[Pp]esos?)");
                aRegex1.CNY = makeRegex1("(CNY|¥|[yY]u[áa]n|[rR]enminbi|RMB)");
                aRegex2.CNY = makeRegex2("(CNY|¥|[yY]u[áa]n|[rR]enminbi|RMB)");
                aRegex1.COP = makeRegex1("(COP|COP\\s?\\$|COL\\$|Col\\$|CO\\$|\\$)");
                aRegex2.COP = makeRegex2("(COP|pesos?)");
                aRegex1.COU = makeRegex1("(COU)");
                aRegex2.COU = makeRegex2("(COU|UVR|Unidades de Valor Real)");
                aRegex1.CRC = makeRegex1("(CRC|₡)");
                aRegex2.CRC = makeRegex2("(CRC|[cC]ol[oó]n(es))");
                aRegex1.CUC = makeRegex1("(CUC|CUC\\s?\\$|\\$)");
                aRegex2.CUC = makeRegex2("(CUC|[pP]esos [cC]onvertibles)");
                aRegex1.CUP = makeRegex1("(CUP|CUP\\s?\\$|MN\\$|\\$)");
                aRegex2.CUP = makeRegex2("(CUP|[pP]esos?)");
                aRegex1.CVE = makeRegex1("(CVE)");
                aRegex2.CVE = makeRegex2("(CVE|\\$|ESC(UDOS)?|Esc(udos)?|esc(udos)?)");
                aRegex1.CZK = makeRegex1("(CZK)");
                aRegex2.CZK = makeRegex2("(CZK|Kč|koruna?y?)");
                aRegex1.DJF = makeRegex1("(DJF)");
                aRegex2.DJF = makeRegex2("(DJF|[Ff][Dd][Jj]|francs?)");
                aRegex1.DKK = makeRegex1("(DKK|kr|kr\\.|dkr)");
                aRegex2.DKK = makeRegex2("(DKK|mio\\. kroner|million(er)? kroner|mia\\. kroner|kroner|s?mia\\. kr(ónur)?|milliard(ir)? krónur?|s?mi[oó]\\. kr(ónur)?|millión(ir)? krónur?|mill?jón(ir)? krónur?|krónur?|kr|dkr|øre|:-|,-)");
                aRegex1.DOP = makeRegex1("(DOP|DOP\\s?\\$|RD\\$|\\$)");
                aRegex2.DOP = makeRegex2("(DOP|pesos?)");
                aRegex1.DZD = makeRegex1("(DZD|دج|DA)");
                aRegex2.DZD = makeRegex2("(DZD|دج|DA|dinars?)");
                aRegex1.EGP = makeRegex1("(EGP|L\\.?E\\.?\\s?|E£|ج\\.م)");
                aRegex2.EGP = makeRegex2("(EGP|L\\.?E|EGL|E£|ج\\.م|pounds?)");
                aRegex1.ERN = makeRegex1("(ERN|Nkf|Nfk|NFA|ናቕፋ)");
                aRegex2.ERN = makeRegex2("(ERN|Nkf|Nfk|ናቕፋ|[nN]akfa)");
                aRegex1.ETB = makeRegex1("(ETB|Br\\.?|ብር|Birr)");
                aRegex2.ETB = makeRegex2("(ETB|Br|ብር|[bB]irr)");
                aRegex1.EUR = makeRegex1("(EUR|€|euro)");
                aRegex2.EUR = makeRegex2("(EUR|€|euros?t?a?|евро|evro|euri|eura|ευρώ|evrō|euró|evrur|eiro|eurai|eurų|euras|ewros?|eòrathan|eurá|eúr|evro|evra|evri|evrov|欧元)");
                aRegex1.FJD = makeRegex1("(FJD|FJ\\$?|\\$)");
                aRegex2.FJD = makeRegex2("(FJD|\\$|dollars?)");
                aRegex1.FKP = makeRegex1("(FKP|FK£|£)");
                aRegex2.FKP = makeRegex2("(FKP|pounds?)");
                aRegex1.GBP = makeRegex1("(GBP|£)");
                aRegex2.GBP = makeRegex2("(GBP|£|pounds?)");
                aRegex1.GEL = makeRegex1("(GEL)");
                aRegex2.GEL = makeRegex2("(GEL|ლარი|lari)");
                aRegex1.GHS = makeRegex1("(GHS|GH₵|GH¢|GH[cC])");
                aRegex2.GHS = makeRegex2("(GHS|GH₵|cedi)");
                aRegex1.GIP = makeRegex1("(GIP|£)");
                aRegex2.GIP = makeRegex2("(GIP|pounds?)");
                aRegex1.GMD = makeRegex1("(GMD|D)");
                aRegex2.GMD = makeRegex2("(GMD|Dalasis?)");
                aRegex1.GNF = makeRegex1("(GNF)");
                aRegex2.GNF = makeRegex2("(GNF|FG|fg|francs?)");
                aRegex1.GTQ = makeRegex1("(GTQ|Q\\.?)");
                aRegex2.GTQ = makeRegex2("(GTQ|Q|quetzal(es)?|q)");
                aRegex1.GYD = makeRegex1("(GYD|GYD\\$|G\\$|\\$)");
                aRegex2.GYD = makeRegex2("(GYD|\\$|dollars?)");
                aRegex1.HKD = makeRegex1("(HKD|HK\\$|\\$)");
                aRegex2.HKD = makeRegex2("(HKD|\\$|dollars?)");
                aRegex1.HNL = makeRegex1("(HNL|L\\.?)");
                aRegex2.HNL = makeRegex2("(HNL|lempiras?)");
                aRegex1.HRK = makeRegex1("(HRK)");
                aRegex2.HRK = makeRegex2("(HRK|kn|kuna)");
                aRegex1.HTG = makeRegex1("(HTG)");
                aRegex2.HTG = makeRegex2("(HTG|[gG]ourdes?|G)");
                aRegex1.HUF = makeRegex1("(HUF)");
                aRegex2.HUF = makeRegex2("(HUF|Ft|forint)");
                aRegex1.IDR = makeRegex1("(IDR|Rp\\.?)");
                aRegex2.IDR = makeRegex2("(IDR|[rR]upiah)");
                aRegex1.ILS = makeRegex1("(ILS|NIS|₪|שֶׁקֶל)");
                aRegex2.ILS = makeRegex2("(ILS|NIS|₪|שֶׁקֶל|shekel)");
                aRegex1.INR = makeRegex1("(INR|₹|₨|Rs\\.?|रु\\.?|ரூ\\.?)");
                aRegex2.INR = makeRegex2("(INR|Rs\\.?|rupees)");
                aRegex1.IQD = makeRegex1("(IQD|دينار|د\\.ع)");
                aRegex2.IQD = makeRegex2("(IQD|دينار|د\\.ع|dinars?)");
                aRegex1.IRR = makeRegex1("(IRR|ریال|﷼)");
                aRegex2.IRR = makeRegex2("(IRR|ریال|﷼|[rR]ials?)");
                aRegex1.ISK = makeRegex1("(ISK|kr|iskr)");
                aRegex2.ISK = makeRegex2("(ISK|milljarð(ar?)?(ur)? króna|milljón(a)?(ir)?(um)? króna|þúsund króna?(ur)?|króna?(ur)?|kr|iskr|:-|,-)");
                aRegex1.JMD = makeRegex1("(JMD|JMD\\$|J\\$|\\$)");
                aRegex2.JMD = makeRegex2("(JMD|\\$|dollars?)");
                aRegex1.JOD = makeRegex1("(JOD|دينار|JD\\.?)");
                aRegex2.JOD = makeRegex2("(JOD|JD|dinars?|دينار)");
                aRegex1.JPY = makeRegex1("(JPY|¥|￥|yen|円|圓)");
                aRegex2.JPY = makeRegex2("(JPY|¥|￥|yen|円|圓)");
                aRegex1.KES = makeRegex1("(KES|Kshs?\\.?|KSh|KSH)");
                aRegex2.KES = makeRegex2("(KES|ksh|Shillings?)");
                aRegex1.KGS = makeRegex1("(KGS)");
                aRegex2.KGS = makeRegex2("(KGS|soms?|сом)");
                aRegex1.KHR = makeRegex1("(KHR|៛|រៀល)");
                aRegex2.KHR = makeRegex2("(KHR|៛|រៀល|[rR]iels?)");
                aRegex1.KMF = makeRegex1("(KMF)");
                aRegex2.KMF = makeRegex2("(KMF|[fF][cC]|francs?)");
                aRegex1.KPW = makeRegex1("(KPW|₩|￦|원)");
                aRegex2.KPW = makeRegex2("(KPW|₩|￦|원|wons?)");
                aRegex1.KRW = makeRegex1("(KRW|₩|￦|원)");
                aRegex2.KRW = makeRegex2("(KRW|₩|￦|원|wons?)");
                aRegex1.KWD = makeRegex1("(KWD|دينار|K\\.?D\\.?\\.?|\\.د\\.ب)");
                aRegex2.KWD = makeRegex2("(KWD|K\\.?D\\.?|\\.د\\.ب|dinars?|دينار)");
                aRegex1.KYD = makeRegex1("(KYD|KYD\\$?|CI\\$|\\$)");
                aRegex2.KYD = makeRegex2("(KYD)");
                aRegex1.KZT = makeRegex1("(KZT|₸)");
                aRegex2.KZT = makeRegex2("(KZT|₸|tenge|теңге)");
                aRegex1.LAK = makeRegex1("(LAK|ກີ|₭N?|KIP)");
                aRegex2.LAK = makeRegex2("(LAK|ກີ|₭N?|[kK]ip|KIP)");
                aRegex1.LBP = makeRegex1("(LBP|L\\.L\\.?|ل\\.ل\\.|ليرات)");
                aRegex2.LBP = makeRegex2("(LBP|Lebanese [pP]ounds?|L\\.L\\.?|ل\\.ل\\.|ليرات)");
                aRegex1.LKR = makeRegex1("(LKR|රු|₨\\.?|SLRs\\.?|Rs\\.?|ரூபாய்\\.?|රුපියල්\\.?)");
                aRegex2.LKR = makeRegex2("(LKR|Rs\\.?|rupees|ரூபாய்)");
                aRegex1.LRD = makeRegex1("(LRD|LD\\$?|L\\$|\\$)");
                aRegex2.LRD = makeRegex2("(LRD|\\$|dollars?)");
                aRegex1.LSL = makeRegex1("(LSL|Maloti|M|Loti)");
                aRegex2.LSL = makeRegex2("(LSL|Maloti|LOTI)");
                aRegex1.LYD = makeRegex1("(LYD|L\\.?D\\.?|ل\\.د|دينار)");
                aRegex2.LYD = makeRegex2("(LYD|L\\.?D\\.?|ل\\.د|دينار|dinars?)");
                aRegex1.MAD = makeRegex1("(MAD|د\\.م\\.|دراهم)");
                aRegex2.MAD = makeRegex2("(MAD|د\\.م\\.|دراهم|dhs|Dh\\.?|dirhams?)");
                aRegex1.MDL = makeRegex1("(MDL)");
                aRegex2.MDL = makeRegex2("(MDL|leu|lei|лей|леев)");
                aRegex1.MGA = makeRegex1("(MGA|Ar)");
                aRegex2.MGA = makeRegex2("(MGA|mga|Mga|[aA]riary|[aA]r)");
                aRegex1.MKD = makeRegex1("(MKD)");
                aRegex2.MKD = makeRegex2("(MKD|денари?|ден|den(ari?)?)");
                aRegex1.MMK = makeRegex1("(MMK|[kK][sS]|[kK]yat)");
                aRegex2.MMK = makeRegex2("(MMK|[kK][sS]|[kK]yat|ကျပ်)");
                aRegex1.MNT = makeRegex1("(MNT|₮)");
                aRegex2.MNT = makeRegex2("(MNT|₮|ᠲᠥᠭᠦᠷᠢᠭ|төгрөг|tögrögs?|tugrik)");
                aRegex1.MOP = makeRegex1("(MOP|MOP\\s?\\$|\\$)");
                aRegex2.MOP = makeRegex2("(MOP|MOP\\$|澳門圓|澳门圆|[pP]atacas?)");
                aRegex1.MRO = makeRegex1("(MRO|أوقية)");
                aRegex2.MRO = makeRegex2("(MRO|أوقية|ouguiya|um|UM)");
                aRegex1.MUR = makeRegex1("(MUR|₨\\.?|[rR]s)");
                aRegex2.MUR = makeRegex2("(MUR|[rR]upees?|[rR]oupies?|[rR]s)");
                aRegex1.MVR = makeRegex1("(MVR|MRF\\.?|MRf\\.?|Mrf\\.?|Rf\\.?|RF\\.?|Rufiyaa)");
                aRegex2.MVR = makeRegex2("(MVR|mrf|Rufiyaa)");
                aRegex1.MWK = makeRegex1("(MWK|MwK|Mwk|M?K)");
                aRegex2.MWK = makeRegex2("(MWK|MK|[kK]wacha)");
                aRegex1.MXN = makeRegex1("(MXN|MEX\\$|Mex\\$|\\$)");
                aRegex2.MXN = makeRegex2("(MXN|MEX\\$|Mex\\$|[pP]esos?)");
                aRegex1.MXV = makeRegex1("(MXV)");
                aRegex2.MXV = makeRegex2("(MXV|UDIS?|[uU]nidades de Inversión|UNIDADES DE INVERSIÓN)");
                aRegex1.MYR = makeRegex1("(MYR|RM)");
                aRegex2.MYR = makeRegex2("(MYR|[rR]inggit)");
                aRegex1.MZN = makeRegex1("(MZN)");
                aRegex2.MZN = makeRegex2("(MZN|MTn|[mM]etical|[mM]eticais)");
                aRegex1.NAD = makeRegex1("(NAD|N?\\$)");
                aRegex2.NAD = makeRegex2("(NAD|dollars?)");
                aRegex1.NGN = makeRegex1("(NGN|₦|N)");
                aRegex2.NGN = makeRegex2("(NGN|[nN]aira)");
                aRegex1.NIO = makeRegex1("(NIO|C?\\$)");
                aRegex2.NIO = makeRegex2("(NIO|córdoba)");
                aRegex1.NOK = makeRegex1("(NOK|kr\\.?|NKR\\.?|NKr\\.?|Nkr\\.?|nkr\\.?)");
                aRegex2.NOK = makeRegex2("(NOK|milliard(er)? kroner|million(er)? kroner|kroner|kr\\.?|NKR|NKr|Nkr|nkr|:-|,-)");
                aRegex1.NPR = makeRegex1("(NPR|N?Rs\\.?|रू)");
                aRegex2.NPR = makeRegex2("(NPR|rupees?|रूपैयाँ)");
                aRegex1.NZD = makeRegex1("(NZD|NZ\\s?\\$|\\$)");
                aRegex2.NZD = makeRegex2("(NZD|[dD]ollars?)");
                aRegex1.OMR = makeRegex1("(OMR|ر\\.ع\\.|ر\\.ع|ريال‎|[rR]ials?|R\\.?O\\.?)");
                aRegex2.OMR = makeRegex2("(OMR|ريال عماني|ر\\.ع\\.|ر\\.ع|ريال‎|Omani [rR]ials?|[rR]ials?)");
                aRegex1.PAB = makeRegex1("(PAB|B\\/\\.?)");
                aRegex2.PAB = makeRegex2("(PAB|[bB]alboa)");
                aRegex1.PEN = makeRegex1("(PEN|S\\/\\.?)");
                aRegex2.PEN = makeRegex2("(PEN|SOL|Sol(es)?|sol(es)?)");
                aRegex1.PGK = makeRegex1("(PGK|K)");
                aRegex2.PGK = makeRegex2("(PGK|[kK]ina)");
                aRegex1.PHP = makeRegex1("(PHP|₱|PhP|Php|P)");
                aRegex2.PHP = makeRegex2("(PHP|[pP]esos)");
                aRegex1.PKR = makeRegex1("(PKR|₨\\.?|Rs\\.?|روپیہ)");
                aRegex2.PKR = makeRegex2("(PKR|[rR]upees?|روپیہ)");
                aRegex1.PLN = makeRegex1("(PLN|zł)");
                aRegex2.PLN = makeRegex2("(PLN|zł|złoty|zlotys?)");
                aRegex1.PYG = makeRegex1("(PYG|₲|Gs?\\.?)");
                aRegex2.PYG = makeRegex2("(PYG|[gG]s\\.?|guaraní(es)?)");
                aRegex1.QAR = makeRegex1("(QAR|QR\\.?|ريال|ر\\.ق)");
                aRegex2.QAR = makeRegex2("(QAR|[rR]iyals?|ريال|ر\\.ق)");
                aRegex1.RON = makeRegex1("(RON)");
                aRegex2.RON = makeRegex2("(RON|[lL]eu|[lL]ei)");
                aRegex1.RSD = makeRegex1("(RSD)");
                aRegex2.RSD = makeRegex2("(RSD|РСД|dinars?|din\\.?|динара?|дин\\.?)");
                aRegex1.RUB = makeRegex1("(RUB|₽)");
                aRegex2.RUB = makeRegex2("(RUB|₽|рублей|рубль|руб\\.?|[рP]\\.|[rR]o?ubles?|rub\\.?)");
                aRegex1.RWF = makeRegex1("(RWF|RwF|Rwf)");
                aRegex2.RWF = makeRegex2("(RWF|Rwf|Rwandan [fF]rancs?|[fF]rancs?)");
                aRegex1.SAR = makeRegex1("(SAR|SR|﷼|ريال|ر\\.س)");
                aRegex2.SAR = makeRegex2("(SAR|SR|﷼|ريال|ر\\.س|Saudi [rR]iyals?|[rR]iyals?)");
                aRegex1.SBD = makeRegex1("(SBD\\.?\\$?|SI\\$|\\$)");
                aRegex2.SBD = makeRegex2("(SBD|\\$|dollars?)");
                aRegex1.SCR = makeRegex1("(SCR|SR|Sr\\.?)");
                aRegex2.SCR = makeRegex2("(SCR|[rR]upees?|[rR]oupies?)");
                aRegex1.SDG = makeRegex1("(SDG|جنيه)");
                aRegex2.SDG = makeRegex2("(SDG|جنيه|Sudanese [pP]ounds?|[pP]ounds?)");
                aRegex1.SEK = RegExp(begin + "(SEK|kr|skr)(\\s?(\\d{1,3}((,|\\.|\\s)\\d{3})+|(\\d+))((\\.|,|:)\\d{1,9})?)", "g");
                aRegex2.SEK = RegExp("((\\d{1,3}((,|\\.|\\s)\\d{3})+|(\\d+))((\\.|,|:)\\d{1,9})?\\s?)(SEK|öre|(svenska\\s)?kronor|miljon(er)? kronor|miljard(er)? kronor|mnkr|mdkr|mkr|s?[kK]r|kSEK|MSEK|GSEK|:-|,-)" + end, "g");
                aRegex1.SGD = makeRegex1("(SGD|SGD\\s?\\$?|S?\\$)");
                aRegex2.SGD = makeRegex2("(SGD|(Singapore)?\\s?[dD]ollars?)");
                aRegex1.SHP = makeRegex1("(SHP|£)");
                aRegex2.SHP = makeRegex2("(SHP|pounds?)");
                aRegex1.SLL = makeRegex1("(SLL|L[eE]\\.?)");
                aRegex2.SLL = makeRegex2("(SLL|[lL]eone)");
                aRegex1.SOS = makeRegex1("(SOS)");
                aRegex2.SOS = makeRegex2("(SOS|Sh\\.?\\s?So\\.?|[sS]hillings?)");
                aRegex1.SRD = makeRegex1("(SRD|\\$)");
                aRegex2.SRD = makeRegex2("(SRD|[dD]ollars?)");
                aRegex1.SSP = makeRegex1("(SSP)");
                aRegex2.SSP = makeRegex2("(SSP|pounds?)");
                aRegex1.STD = makeRegex1("(STD|Dbs?\\.?)");
                aRegex2.STD = makeRegex2("(STD|dbs|[dD]obra)");
                aRegex1.SVC = makeRegex1("(SVC|₡|¢)");
                aRegex2.SVC = makeRegex2("(SVC|svc|[cC]ol[oó]n(es)?)");
                aRegex1.SYP = makeRegex1("(SYP|S\\.?P\\.?|ليرة)");
                aRegex2.SYP = makeRegex2("(SYP|S\\.?P\\.?|(de )?L\\.?S\\.?|(Syrian )?[pP]ounds?|[lL]ivres? [sS]yriennes?|[lL]ivres?|ليرة)");
                aRegex1.SZL = makeRegex1("(SZL|[eE]malangeni|E)");
                aRegex2.SZL = makeRegex2("(SZL|Lilangeni)");
                aRegex1.THB = makeRegex1("(THB|฿)");
                aRegex2.THB = makeRegex2("(THB|(Thai )?[bB]aht|บาท)");
                aRegex1.TJS = makeRegex1("(TJS|سامانی)");
                aRegex2.TJS = makeRegex2("(TJS|[sS]omoni|cомонӣ)");
                aRegex1.TMT = makeRegex1("(TMT)");
                aRegex2.TMT = makeRegex2("(TMT|[mM]anat|манат)");
                aRegex1.TND = makeRegex1("(TND)");
                aRegex2.TND = makeRegex2("(TND|DT|[dD][tT]|[dD]inars?|د\\.ت|دينار)");
                aRegex1.TOP = makeRegex1("(TOP|TOP\\$|T?\\$)");
                aRegex2.TOP = makeRegex2("(TOP|[pP]a'anga)");
                aRegex1.TRY = makeRegex1("(TRY|₺|TL)");
                aRegex2.TRY = makeRegex2("(TRY|[lL]ira|TL)");
                aRegex1.TTD = makeRegex1("(TTD|TTD\\$?|TT\\$|\\$)");
                aRegex2.TTD = makeRegex2("(TTD|dollars?)");
                aRegex1.TWD = makeRegex1("(TWD|NT\\$|\\$)");
                aRegex2.TWD = makeRegex2("(TWD|NTD|dollars?)");
                aRegex1.TZS = makeRegex1("(TZS|TZs|Tsh\\.?)");
                aRegex2.TZS = makeRegex2("(TZS|TSH|Tsh|(Tanzanian )?[sS]hillings?)");
                aRegex1.UAH = makeRegex1("(UAH|₴)");
                aRegex2.UAH = makeRegex2("(UAH|[hH]rn\\.?|грн\\.?|[hH]ryvnia?|[hH]ryven|гривна|гривня|гривні|гривень)");
                aRegex1.UGX = makeRegex1("(UGX|USH\\.?|USh\\.?|Ush\\.?|[sS]hillings)");
                aRegex2.UGX = makeRegex2("(UGX|USh|(Ugandan? )?[sS]hillings?)");
                aRegex1.USD = makeRegex1("(USD|USD\\s?\\$?|US\\s?\\$|Us\\s?\\$|\\$|\\$USD|U\\$S)");
                aRegex2.USD = makeRegex2("(USD|US\\s?\\$|Us\\s?\\$|\\$|[dD]ollars?|¢|￠)");
                aRegex1.USN = makeRegex1("(USN)");
                aRegex2.USN = makeRegex2("(USN)");
                aRegex1.UYI = makeRegex1("(UYI)");
                aRegex2.UYI = makeRegex2("(UYI|U\\.?I\\.?|[uU]nidades [iI]ndexadas)");
                aRegex1.UYU = makeRegex1("(UYU|\\$U|\\$)");
                aRegex2.UYU = makeRegex2("(UYU|\\$U|[pP]esos?)");
                aRegex1.UZS = makeRegex1("(UZS)");
                aRegex2.UZS = makeRegex2("(UZS|uzs|som|сўм|сум)");
                aRegex1.VEF = makeRegex1("(VEF|[bB]s\\.?[fF]?\\.?)");
                aRegex2.VEF = makeRegex2("(VEF|[bB]s\\.?[fF]?|[bB]olívar(es)?)");
                aRegex1.VND = makeRegex1("(VND|₫)");
                aRegex2.VND = makeRegex2("(VND|vnd|₫|[dD]ong|đồng|đ|ĐỒNG|Đ)");
                aRegex1.VUV = makeRegex1("(VUV|VT|Vt)");
                aRegex2.VUV = makeRegex2("(VUV|VT|vt|[vV]atu)");
                aRegex1.WST = makeRegex1("(WST|WST\\$?|WS\\$|\\$|SAT\\$?|ST\\$)");
                aRegex2.WST = makeRegex2("(WST|WST\\$?|[tT]ālā|[tT]ala)");
                aRegex1.XAF = makeRegex1("(XAF|FCFA|CFA)");
                aRegex2.XAF = makeRegex2("(XAF|FCFA|Fcfa|cfa|CFA [fF]rancs?|[fF]rancs?|[fF])");
                aRegex1.XAG = makeRegex1("(XAG)");
                aRegex2.XAG = makeRegex2("(XAG)");
                aRegex1.XAU = makeRegex1("(XAU)");
                aRegex2.XAU = makeRegex2("(XAU)");
                aRegex1.XBA = makeRegex1("(XBA)");
                aRegex2.XBA = makeRegex2("(XBA)");
                aRegex1.XBB = makeRegex1("(XBB)");
                aRegex2.XBB = makeRegex2("(XBB)");
                aRegex1.XBC = makeRegex1("(XBC)");
                aRegex2.XBC = makeRegex2("(XBC)");
                aRegex1.XBD = makeRegex1("(XBD)");
                aRegex2.XBD = makeRegex2("(XBD)");
                aRegex1.XCD = makeRegex1("(XCD|ECD?\\s?\\$|\\$)");
                aRegex2.XCD = makeRegex2("(XCD|ECD|[dD]ollars?)");
                aRegex1.XDR = makeRegex1("(XDR|SDR)");
                aRegex2.XDR = makeRegex2("(XDR|SDRs?|[sS]pecial [dD]rawing [rR]ights)");
                aRegex1.XOF = makeRegex1("(XOF|FCFA|CFA)");
                aRegex2.XOF = makeRegex2("(XOF|xof|FCFA|Fcfa|CFA [fF]rancs?|Frs CFA|CFA|cfa|[fF]rancos?|[fF]rancs?|[fF]rancos?|[fF])");
                aRegex1.XPD = makeRegex1("(XPD)");
                aRegex2.XPD = makeRegex2("(XPD)");
                aRegex1.XPF = makeRegex1("(XPF)");
                aRegex2.XPF = makeRegex2("(XPF|CFP|cfp|[fF]\\s?(cfp)|(CFP)|[fF]rcs CFP|[fF]rcs|[fF]rancs?|[fF])");
                aRegex1.XPT = makeRegex1("(XPT)");
                aRegex2.XPT = makeRegex2("(XPT)");
                aRegex1.XSU = makeRegex1("(XSU)");
                aRegex2.XSU = makeRegex2("(XSU)");
                aRegex1.XTS = makeRegex1("(XTS)");
                aRegex2.XTS = makeRegex2("(XTS)");
                aRegex1.XUA = makeRegex1("(XUA)");
                aRegex2.XUA = makeRegex2("(XUA)");
                aRegex1.XXX = makeRegex1("(XXX)");
                aRegex2.XXX = makeRegex2("(XXX)");
                aRegex1.YER = makeRegex1("(YER|Y\\.?R\\.?|﷼|ريال)");
                aRegex2.YER = makeRegex2("(YER|Y\\.?R\\.?|[rR]iy?als?|﷼|ريال)");
                aRegex1.ZAR = makeRegex1("(ZAR|R)");
                aRegex2.ZAR = makeRegex2("(ZAR|[rR]ands?)");
                aRegex1.ZMW = makeRegex1("(ZMW|Zmk|K)");
                aRegex2.ZMW = makeRegex2("(ZMW|[kK]wacha)");
                aRegex1.ZWL = makeRegex1("(ZWL|Z\\$)");
                aRegex2.ZWL = makeRegex2("(ZWL)");
                aRegex1.inch = /NOMATCH(?!\w)/g;
                aRegex2.inch = /((\d{1,3}((,|\.|\s)\d{3})+|(\d+))((\.|,)\d{1,9})?)(\s?tum|-tums?|\s?"|\s?″)(?!\w)/g;
                aRegex1.kcal = /NOMATCH(?!\w)/g;
                aRegex2.kcal = /((\d{1,3}((,|\.|\s)\d{3})+|(\d+))((\.|,)\d{1,9})?)(\s?kcal|\s?kalorier)(?!\w)/g;
                aRegex1.nmi = /NOMATCH(?!\w)/g;
                aRegex2.nmi = /((\d{1,3}((,|\.|\s)\d{3})+|(\d+))((\.|,)\d{1,9})?)(\s?sjömil|\s?nautiska mil?|\s?nautical miles?)(?!\w)/g;
                aRegex1.mile = /NOMATCH(?!\w)/g;
                aRegex2.mile = /((\d{1,3}((,|\.|\s)\d{3})+|(\d+))((\.|,)\d{1,9})?)(\s?mile|\s?miles)(?!\w)/g;
                aRegex1.mil = /NOMATCH(?!\w)/g;
                aRegex2.mil = /((\d{1,3}((,|\.|\s)\d{3})+|(\d+))((\.|,)\d{1,9})?)(\s?mil)(?!\w)/g;
                aRegex1.knots = /NOMATCH(?!\w)/g;
                aRegex2.knots = /((\d{1,3}((,|\.|\s)\d{3})+|(\d+))((\.|,)\d{1,9})?)(\s?knop)(?!\w)/g;
                aRegex1.hp = /NOMATCH(?!\w)/g;
                aRegex2.hp = /((\d{1,3}((,|\.|\s)\d{3})+|(\d+))((\.|,)\d{1,9})?)(\s?hästkrafter|\s?hkr?|\s?hp)(?!\w)/g;
            }
            catch(err) {
                console.error(err);
            }
        };
        return {
            makePriceRegexes : makePriceRegexes
        };
    })();
    this.PriceRegexes = PriceRegexes;
}