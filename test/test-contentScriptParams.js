ContentScriptParamsTest = TestCase("ContentScriptParamsTest");

ContentScriptParamsTest.prototype.test = () => {
    "use strict";
    const InformationHolder = function () {};
    InformationHolder.prototype.getConversionQuotes = () => {
        return {ALL: 1.1};
    };
    InformationHolder.prototype.getCurrencySymbols = () => {
        return {};
    };
    InformationHolder.prototype.getCurrencyNames = () => {
        return {};
    };
    InformationHolder.prototype.getCurrencyNames = () => {
        return {};
    };
    const informationHolder = new InformationHolder();
    const contentScriptParams = new ContentScriptParams(null, informationHolder);
    //contentScriptParams.
};

