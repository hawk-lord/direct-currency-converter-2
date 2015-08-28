DirectCurrencyContentTest = TestCase("DirectCurrencyContentTest");

DirectCurrencyContentTest.prototype.testOnSendEnabledStatus = () => {
    "use strict";
    const status = {};
    status.isEnabled = true;
    status.hasConvertedElements = false;
    const res = DirectCurrencyContent.onSendEnabledStatus(status);
    console.log(res);
};

/*

ReferenceError: ContentAdapter is not defined

DirectCurrencyContentTest.prototype.testOnUpdateSettings = () => {
    "use strict";
    const ContentScriptParams = function () {};
    ContentScriptParams.prototype.excludedDomains = () => {
        return [];
    };
    ContentScriptParams.prototype.currencySymbols = () => {
        return [];
    };
    ContentScriptParams.prototype.customSymbols = () => {
        return [];
    };
    const contentScriptParams = new ContentScriptParams();
    const res = DirectCurrencyContent.onUpdateSettings(contentScriptParams);
    console.log(res);
};
*/

