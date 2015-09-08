/*
OK:
cd /Users/per/WebstormProjects/Add-OnSDK/direct-currency-converter-2
mocha --harmony test/mocha

NOK:
mocha --harmony test/karma
 ReferenceError: DirectCurrencyContent is not defined

mocha --harmony --require /Users/per/WebstormProjects/Add-OnSDK/direct-currency-converter-2/data/common/dcc-content.js test/karma
ReferenceError: DirectCurrencyContent is not defined

mocha --harmony --require data/common/dcc-content.js test/karma/test-dcc-content.js
 ReferenceError: DirectCurrencyContent is not defined

mocha test/karma
 /Users/per/WebstormProjects/Add-OnSDK/direct-currency-converter-2/test/karma/dcc-mock-content-adapter.js:10
 finish: (hasConvertedElements) => {
 ^^
 SyntaxError: Unexpected token =>

// --require does not work if --harmony is included
mocha --harmony test/karma/*.js
with mocha.opts
 --require /Users/per/WebstormProjects/Add-OnSDK/direct-currency-converter-2/data/common/dcc-content.js
 ReferenceError: DirectCurrencyContent is not defined



 */
// require here is OK, but lacking browser means ReferenceError: document is not defined
//const DirectCurrencyContent = require("../../data/common/dcc-content.js").DirectCurrencyContent;
const MockStatus = function () {
    };
    MockStatus.prototype.isEnabled = true;
    MockStatus.prototype.hasConvertedElements = false;
    var status = new MockStatus();

    const MockContentScriptParams = function () {
    };
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
            it("should not fail", function () {
                DirectCurrencyContent.onSendEnabledStatus(status);
                assert(true);
            });
        });
        describe("#onUpdateSettings()", function () {
            it("should not fail", function () {
                DirectCurrencyContent.onUpdateSettings(contentScriptParams);
            });
        })
    });


