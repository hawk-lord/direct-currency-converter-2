const DirectCurrencyContent = require("../../data/common/dcc-content").DirectCurrencyContent;
const assert = require("assert");


const MockStatus = function() {};
MockStatus.prototype.isEnabled = true;
MockStatus.prototype.hasConvertedElements = false;
const status = new MockStatus();

const MockContentScriptParams = function() {};
MockContentScriptParams.prototype.excludedDomains = () => {
    return [];
};
MockContentScriptParams.prototype.currencySymbols = () => {
    return [];
};
MockContentScriptParams.prototype.customSymbols = () => {
    return [];
};
const contentScriptParams = new MockContentScriptParams();

describe("DirectCurrencyContent", function () {
    "use strict";
    describe("#onSendEnabledStatus()", function () {
        it ("should not fail", function() {
            DirectCurrencyContent.onSendEnabledStatus(status);
        });
    });
    describe("#onUpdateSettings()", function () {
        it ("should not fail", function() {
            DirectCurrencyContent.onUpdateSettings(contentScriptParams);
        });
    })
});


