
describe("InformationHolder", function() {
    "use strict";
    const StorageService = function() {};
    StorageService.prototype.init = () => {
    };
    const defaultExcludedDomains = ["images.google.com", "docs.google.com", "drive.google.com", "twitter.com"];
    const defaultEnabledCurrencies = {"SEK":true, "CHF":true, "DKK":true, "EUR":true, "GBP":true, "ISK":true, "JPY":true, "NOK":true, "RUB":true, "USD":true};
    const storageService = new StorageService();
    const iso4217Currencies = [];
    describe("#new", function() {
        it("test", function () {
            const informationHolder = new InformationHolder(defaultEnabledCurrencies, defaultExcludedDomains, storageService, null, null, iso4217Currencies, null, null);
        });
    })
});
