

const MockStorage = function() {
    "use strict";

};

describe("FirefoxStorageServiceProvider", function() {
    "use strict";
    const defaultExcludedDomains = ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com"];
    const defaultEnabledCurrencies = {"SEK":true, "CHF":true, "DKK":true, "EUR":true, "GBP":true, "ISK":true, "JPY":true, "NOK":true, "RUB":true, "USD":true};

    const storage = new MockStorage();
    describe("#init", function() {
        it("should not fail", function () {
            const firefoxStorageServiceProvider = new FirefoxStorageServiceProvider(storage);
            firefoxStorageServiceProvider.init(defaultEnabledCurrencies, defaultExcludedDomains);
            assert.isUndefined(firefoxStorageServiceProvider.convertToCurrency, "convertToCurrency");
            assert.isUndefined(firefoxStorageServiceProvider.convertToCountry, "convertToCountry");
            assert.strictEqual(Object.keys(firefoxStorageServiceProvider.customSymbols).length, 0, "customSymbols");
            assert.isTrue(firefoxStorageServiceProvider.enableOnStart, "enableOnStart");
            assert.strictEqual(firefoxStorageServiceProvider.quoteAdjustmentPercent, 0, "quoteAdjustmentPercent");
            assert.isUndefined(firefoxStorageServiceProvider.roundAmounts, "roundAmounts");
            assert.isTrue(firefoxStorageServiceProvider.showOriginalPrices, "showOriginalPrices");
            assert.isTrue(firefoxStorageServiceProvider.beforeCurrencySymbol, "beforeCurrencySymbol");
            assert.strictEqual(firefoxStorageServiceProvider.currencySpacing, " ", "currencySpacing");
            assert.strictEqual(firefoxStorageServiceProvider.monetarySeparatorSymbol, ",", "monetarySeparatorSymbol");
            assert.strictEqual(firefoxStorageServiceProvider.monetaryGroupingSeparatorSymbol, ".", "monetaryGroupingSeparatorSymbol");
            assert.isFalse(firefoxStorageServiceProvider.tempConvertUnits, "", "tempConvertUnits");
            assert.strictEqual(firefoxStorageServiceProvider.enabledCurrencies, defaultEnabledCurrencies, "enabledCurrencies");
            assert.strictEqual(firefoxStorageServiceProvider.excludedDomains, defaultExcludedDomains, "excludedDomains");
        });
    });
    describe("#resetSettings", function() {
        it("should have default values", function () {
            const firefoxStorageServiceProvider = new FirefoxStorageServiceProvider(storage);
            firefoxStorageServiceProvider.resetSettings(defaultEnabledCurrencies);
            assert.isNull(firefoxStorageServiceProvider.convertToCurrency, "convertToCurrency");
            assert.isNull(firefoxStorageServiceProvider.convertToCountry, "convertToCountry");
            assert.strictEqual(Object.keys(firefoxStorageServiceProvider.customSymbols).length, 0, "customSymbols");
            assert.isTrue(firefoxStorageServiceProvider.enableOnStart, "enableOnStart");
            assert.strictEqual(firefoxStorageServiceProvider.quoteAdjustmentPercent, 0, "quoteAdjustmentPercent");
            assert.isUndefined(firefoxStorageServiceProvider.roundAmounts, "roundAmounts");
            assert.isTrue(firefoxStorageServiceProvider.showOriginalPrices, "showOriginalPrices");
            assert.isTrue(firefoxStorageServiceProvider.beforeCurrencySymbol, "beforeCurrencySymbol");
            assert.strictEqual(firefoxStorageServiceProvider.currencySpacing, " ", "currencySpacing");
            assert.strictEqual(firefoxStorageServiceProvider.monetarySeparatorSymbol, ",", "monetarySeparatorSymbol");
            assert.strictEqual(firefoxStorageServiceProvider.monetaryGroupingSeparatorSymbol, ".", "monetaryGroupingSeparatorSymbol");
            assert.isFalse(firefoxStorageServiceProvider.tempConvertUnits, "", "tempConvertUnits");
            assert.strictEqual(firefoxStorageServiceProvider.enabledCurrencies, defaultEnabledCurrencies, "enabledCurrencies");
        });
    });
});
