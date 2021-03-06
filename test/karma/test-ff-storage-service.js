

const MockStorage = function() {
    "use strict";

};

describe("FirefoxStorageServiceProvider", function() {
    "use strict";
    const defaultExcludedDomains = ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com"];
    const iso4217Currencies = [{"isoName":"SEK","enabled":true},{"isoName":"AFN","enabled":false},{"isoName":"AED","enabled":false},{"isoName":"ALL","enabled":false},{"isoName":"AMD","enabled":false},{"isoName":"ANG","enabled":false},{"isoName":"AOA","enabled":false},{"isoName":"ARS","enabled":false},{"isoName":"AUD","enabled":false},{"isoName":"AWG","enabled":false},{"isoName":"AZN","enabled":false},{"isoName":"BAM","enabled":false},{"isoName":"BBD","enabled":false},{"isoName":"BDT","enabled":false},{"isoName":"BGN","enabled":false},{"isoName":"BHD","enabled":false},{"isoName":"BIF","enabled":false},{"isoName":"BMD","enabled":false},{"isoName":"BND","enabled":false},{"isoName":"BOB","enabled":false},{"isoName":"BOV","enabled":false},{"isoName":"BRL","enabled":false},{"isoName":"BSD","enabled":false},{"isoName":"BTN","enabled":false},{"isoName":"BWP","enabled":false},{"isoName":"BYN","enabled":false},{"isoName":"BZD","enabled":false},{"isoName":"CAD","enabled":false},{"isoName":"CDF","enabled":false},{"isoName":"CHE","enabled":false},{"isoName":"CHF","enabled":true},{"isoName":"CHW","enabled":false},{"isoName":"CLF","enabled":false},{"isoName":"CLP","enabled":false},{"isoName":"CNY","enabled":false},{"isoName":"COP","enabled":false},{"isoName":"COU","enabled":false},{"isoName":"CRC","enabled":false},{"isoName":"CUC","enabled":false},{"isoName":"CUP","enabled":false},{"isoName":"CVE","enabled":false},{"isoName":"CZK","enabled":false},{"isoName":"DJF","enabled":false},{"isoName":"DKK","enabled":true},{"isoName":"DOP","enabled":false},{"isoName":"DZD","enabled":false},{"isoName":"EGP","enabled":false},{"isoName":"ERN","enabled":false},{"isoName":"ETB","enabled":false},{"isoName":"EUR","enabled":true},{"isoName":"FJD","enabled":false},{"isoName":"FKP","enabled":false},{"isoName":"GBP","enabled":true},{"isoName":"GEL","enabled":false},{"isoName":"GHS","enabled":false},{"isoName":"GIP","enabled":false},{"isoName":"GMD","enabled":false},{"isoName":"GNF","enabled":false},{"isoName":"GTQ","enabled":false},{"isoName":"GYD","enabled":false},{"isoName":"HKD","enabled":false},{"isoName":"HNL","enabled":false},{"isoName":"HRK","enabled":false},{"isoName":"HTG","enabled":false},{"isoName":"HUF","enabled":false},{"isoName":"IDR","enabled":false},{"isoName":"ILS","enabled":false},{"isoName":"INR","enabled":false},{"isoName":"IQD","enabled":false},{"isoName":"IRR","enabled":false},{"isoName":"ISK","enabled":true},{"isoName":"JMD","enabled":false},{"isoName":"JOD","enabled":false},{"isoName":"JPY","enabled":true},{"isoName":"KES","enabled":false},{"isoName":"KGS","enabled":false},{"isoName":"KHR","enabled":false},{"isoName":"KMF","enabled":false},{"isoName":"KPW","enabled":false},{"isoName":"KRW","enabled":false},{"isoName":"KWD","enabled":false},{"isoName":"KYD","enabled":false},{"isoName":"KZT","enabled":false},{"isoName":"LAK","enabled":false},{"isoName":"LBP","enabled":false},{"isoName":"LKR","enabled":false},{"isoName":"LRD","enabled":false},{"isoName":"LSL","enabled":false},{"isoName":"LYD","enabled":false},{"isoName":"MAD","enabled":false},{"isoName":"MDL","enabled":false},{"isoName":"MGA","enabled":false},{"isoName":"MKD","enabled":false},{"isoName":"MMK","enabled":false},{"isoName":"MNT","enabled":false},{"isoName":"MOP","enabled":false},{"isoName":"MRO","enabled":false},{"isoName":"MUR","enabled":false},{"isoName":"MVR","enabled":false},{"isoName":"MWK","enabled":false},{"isoName":"MXN","enabled":false},{"isoName":"MXV","enabled":false},{"isoName":"MYR","enabled":false},{"isoName":"MZN","enabled":false},{"isoName":"NAD","enabled":false},{"isoName":"NGN","enabled":false},{"isoName":"NIO","enabled":false},{"isoName":"NOK","enabled":true},{"isoName":"NPR","enabled":false},{"isoName":"NZD","enabled":false},{"isoName":"OMR","enabled":false},{"isoName":"PAB","enabled":false},{"isoName":"PEN","enabled":false},{"isoName":"PGK","enabled":false},{"isoName":"PHP","enabled":false},{"isoName":"PKR","enabled":false},{"isoName":"PLN","enabled":false},{"isoName":"PYG","enabled":false},{"isoName":"QAR","enabled":false},{"isoName":"RON","enabled":false},{"isoName":"RSD","enabled":false},{"isoName":"RUB","enabled":true},{"isoName":"RWF","enabled":false},{"isoName":"SAR","enabled":false},{"isoName":"SBD","enabled":false},{"isoName":"SCR","enabled":false},{"isoName":"SDG","enabled":false},{"isoName":"SGD","enabled":false},{"isoName":"SHP","enabled":false},{"isoName":"SLL","enabled":false},{"isoName":"SOS","enabled":false},{"isoName":"SRD","enabled":false},{"isoName":"SSP","enabled":false},{"isoName":"STD","enabled":false},{"isoName":"SVC","enabled":false},{"isoName":"SYP","enabled":false},{"isoName":"SZL","enabled":false},{"isoName":"THB","enabled":false},{"isoName":"TJS","enabled":false},{"isoName":"TMT","enabled":false},{"isoName":"TND","enabled":false},{"isoName":"TOP","enabled":false},{"isoName":"TRY","enabled":false},{"isoName":"TTD","enabled":false},{"isoName":"TWD","enabled":false},{"isoName":"TZS","enabled":false},{"isoName":"UAH","enabled":false},{"isoName":"UGX","enabled":false},{"isoName":"USD","enabled":true},{"isoName":"USN","enabled":false},{"isoName":"UYI","enabled":false},{"isoName":"UYU","enabled":false},{"isoName":"UZS","enabled":false},{"isoName":"VEF","enabled":false},{"isoName":"VND","enabled":false},{"isoName":"VUV","enabled":false},{"isoName":"WST","enabled":false},{"isoName":"XAF","enabled":false},{"isoName":"XAG","enabled":false},{"isoName":"XAU","enabled":false},{"isoName":"XBA","enabled":false},{"isoName":"XBB","enabled":false},{"isoName":"XBC","enabled":false},{"isoName":"XBD","enabled":false},{"isoName":"XCD","enabled":false},{"isoName":"XDR","enabled":false},{"isoName":"XOF","enabled":false},{"isoName":"XPD","enabled":false},{"isoName":"XPF","enabled":false},{"isoName":"XPT","enabled":false},{"isoName":"XSU","enabled":false},{"isoName":"XTS","enabled":false},{"isoName":"XUA","enabled":false},{"isoName":"XXX","enabled":false},{"isoName":"YER","enabled":false},{"isoName":"ZAR","enabled":false},{"isoName":"ZMW","enabled":false},{"isoName":"ZWL","enabled":false}]

    const storage = new MockStorage();
    describe("#init", function() {
        it("should have default values", function () {
            const firefoxStorageServiceProvider = new FirefoxStorageServiceProvider(storage);
            firefoxStorageServiceProvider.init(iso4217Currencies, defaultExcludedDomains);
            assert.isNull(firefoxStorageServiceProvider.convertToCurrency, "convertToCurrency");
            assert.isNull(firefoxStorageServiceProvider.convertToCountry, "convertToCountry");
            assert.strictEqual(Object.keys(firefoxStorageServiceProvider.customSymbols).length, 0, "customSymbols");
            assert.isTrue(firefoxStorageServiceProvider.enableOnStart, "enableOnStart");
            assert.strictEqual(firefoxStorageServiceProvider.quoteAdjustmentPercent, 0, "quoteAdjustmentPercent");
            assert.isUndefined(firefoxStorageServiceProvider.roundAmounts, "roundAmounts");
            assert.isFalse(firefoxStorageServiceProvider.showOriginalPrices, "showOriginalPrices");
            assert.isFalse(firefoxStorageServiceProvider.showOriginalCurrencies, "showOriginalCurrencies");
            assert.isTrue(firefoxStorageServiceProvider.showTooltip, "showTooltip");
            assert.isTrue(firefoxStorageServiceProvider.beforeCurrencySymbol, "beforeCurrencySymbol");
            assert.strictEqual(firefoxStorageServiceProvider.currencySpacing, " ", "currencySpacing");
            assert.strictEqual(firefoxStorageServiceProvider.monetarySeparatorSymbol, ",", "monetarySeparatorSymbol");
            assert.strictEqual(firefoxStorageServiceProvider.monetaryGroupingSeparatorSymbol, ".", "monetaryGroupingSeparatorSymbol");
            assert.isFalse(firefoxStorageServiceProvider.tempConvertUnits, "", "tempConvertUnits");
            assert.strictEqual(firefoxStorageServiceProvider.convertFroms, iso4217Currencies, "iso4217Currencies");
            assert.strictEqual(firefoxStorageServiceProvider.excludedDomains, defaultExcludedDomains, "excludedDomains");
        });
    });
    describe("#resetSettings", function() {
        it("should have default values", function () {
            const firefoxStorageServiceProvider = new FirefoxStorageServiceProvider(storage);
            firefoxStorageServiceProvider.resetSettings(iso4217Currencies);
            assert.isNull(firefoxStorageServiceProvider.convertToCurrency, "convertToCurrency");
            assert.isNull(firefoxStorageServiceProvider.convertToCountry, "convertToCountry");
            assert.strictEqual(Object.keys(firefoxStorageServiceProvider.customSymbols).length, 0, "customSymbols");
            assert.isTrue(firefoxStorageServiceProvider.enableOnStart, "enableOnStart");
            assert.strictEqual(firefoxStorageServiceProvider.quoteAdjustmentPercent, 0, "quoteAdjustmentPercent");
            assert.isUndefined(firefoxStorageServiceProvider.roundAmounts, "roundAmounts");
            assert.isFalse(firefoxStorageServiceProvider.showOriginalPrices, "showOriginalPrices");
            assert.isFalse(firefoxStorageServiceProvider.showOriginalCurrencies, "showOriginalCurrencies");
            assert.isTrue(firefoxStorageServiceProvider.showTooltip, "showTooltip");
            assert.isTrue(firefoxStorageServiceProvider.beforeCurrencySymbol, "beforeCurrencySymbol");
            assert.strictEqual(firefoxStorageServiceProvider.currencySpacing, " ", "currencySpacing");
            assert.strictEqual(firefoxStorageServiceProvider.monetarySeparatorSymbol, ",", "monetarySeparatorSymbol");
            assert.strictEqual(firefoxStorageServiceProvider.monetaryGroupingSeparatorSymbol, ".", "monetaryGroupingSeparatorSymbol");
            assert.isFalse(firefoxStorageServiceProvider.tempConvertUnits, "", "tempConvertUnits");
            assert.strictEqual(firefoxStorageServiceProvider.convertFroms, iso4217Currencies, "iso4217Currencies");
        });
    });
});
