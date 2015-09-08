var ContentScriptParams = require("../../lib/dcc-common-lib/contentScriptParams").ContentScriptParams;
const assert = require("assert");

const MockInformationHolder = function () {
};
MockInformationHolder.prototype.getConversionQuotes = () => {
    return {ALL: 1.1};
};
MockInformationHolder.prototype.getCurrencySymbols = () => {
    return {};
};
MockInformationHolder.prototype.getCurrencyNames = () => {
    return {};
};
MockInformationHolder.prototype.getCurrencyNames = () => {
    return {};
};
const informationHolder = new MockInformationHolder();


describe("ContentScriptParams", ()  => {
    "use strict";
    it("Testing ContentScriptParams", function () {
        const contentScriptParams = new ContentScriptParams(null, informationHolder);
    })
});


