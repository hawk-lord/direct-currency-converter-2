DirectCurrencySettingsTest = TestCase("DirectCurrencySettingsTest");

DirectCurrencySettingsTest.prototype.test = () => {
    "use strict";
    const ContentScriptParams = function () {};
    // function does "TypeError: excludedDomains.map is not a function"
    ContentScriptParams.prototype.excludedDomains = [];
    ContentScriptParams.prototype.currencySymbols = () => {
        return [];
    };
    ContentScriptParams.prototype.customSymbols = () => {
        return [];
    };
    ContentScriptParams.prototype.enabledCurrencies = () => {
        return {};
    };
    const contentScriptParams = new ContentScriptParams();
    DirectCurrencySettings.showSettings(contentScriptParams);
};
