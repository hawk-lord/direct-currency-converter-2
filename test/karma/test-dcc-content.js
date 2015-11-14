/*

 */

const contentScriptParams = new MockContentScriptParams();

describe("DirectCurrencyContent", function () {
    "use strict";
    describe("#onSendEnabledStatus()", function () {
        const status = new MockStatus();
        it("should not fail", function () {
            DirectCurrencyContent.onSendEnabledStatus(status);
            assert(true);
        });
    });
    describe("#onUpdateSettings()", function () {
        it("should not fail", function () {
            DirectCurrencyContent.onUpdateSettings(contentScriptParams);
            assert(true);
        });
    });
    describe("#checkSubUnit", function() {
        it("should be same", function() {
            const price = null;
            const replacedUnit = "MGA";
            const conversionQuote = 12.34;
            const actual = DccFunctions.checkSubUnit(price, replacedUnit, conversionQuote);
            assert.equal(actual, conversionQuote, "is same");
        });
        it("should be one hundreth", function() {
            const price = {full: "50 öre"};
            const replacedUnit = "SEK";
            const conversionQuote = 13.57;
            const actual = DccFunctions.checkSubUnit(price, replacedUnit, conversionQuote);
            assert.equal(actual, conversionQuote/100, "is 1/100");
        })
    });
/*
    describe("#checkOtherUnit", function() {
        it("should be same", function() {
            const replacedUnit = "MGA";
            const conversionQuote = 12.34;
            const actual = DccFunctions.checkOtherUnit(replacedUnit, conversionQuote);
            assert.equal(actual, conversionQuote, "is same");
        });
        it("should be one hundreth", function() {
            const replacedUnit = "inch";
            const conversionQuote = 0;
            const actual = DccFunctions.checkOtherUnit(replacedUnit, conversionQuote);
            assert.equal(actual, 25.4, "is 25.4");
        })
    })
*/
});


