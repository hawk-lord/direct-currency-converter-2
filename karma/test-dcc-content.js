/*

 */
var status = new MockStatus();

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


