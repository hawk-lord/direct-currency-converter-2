InformationHolderTest = TestCase("InformationHolderTest");

InformationHolderTest.prototype.test = () => {
    "use strict";
    const StorageService = function() {};
    StorageService.prototype.init = () => {
    };
    const storageService = new StorageService();
    const iso4217Currencies = [];
    const informationHolder = new InformationHolder(storageService, null, null, iso4217Currencies, null, null);
};

