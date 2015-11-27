/*

 */

const contentScriptParams = new MockContentScriptParams();

describe("DirectCurrencyContent", () => {
    "use strict";
    describe("#onSendEnabledStatus()", () => {
        const status = new MockStatus();
        it("should not fail", () => {
            DirectCurrencyContent.onSendEnabledStatus(status);
            assert(true);
        });
    });
    describe("#onUpdateSettings()", () => {
        it("should not fail", () => {
            DirectCurrencyContent.onUpdateSettings(contentScriptParams);
            assert(true);
        });
    });
    describe("#checkSubUnit", () => {
        it("should be same", () => {
            const price = {full: "50000 ariary"};
            const replacedUnit = "MGA";
            const conversionQuote = 12.34;
            const actual = DccFunctions.checkSubUnit(price, replacedUnit, conversionQuote);
            assert.equal(actual, conversionQuote, "is same");
        });
        it("should be one hundreth", () => {
            const price = {full: "50 öre"};
            const replacedUnit = "SEK";
            const conversionQuote = 13.57;
            const actual = DccFunctions.checkSubUnit(price, replacedUnit, conversionQuote);
            assert.equal(actual, conversionQuote/100, "is 1/100");
        });
        it("should be same", () => {
            const price = {full: "50 kr"};
            const replacedUnit = "SEK";
            const conversionQuote = 13.57;
            const actual = DccFunctions.checkSubUnit(price, replacedUnit, conversionQuote);
            assert.equal(actual, conversionQuote, "is same");
        })
    });
    describe("#mult", () => {
        it("should be empty", () => {
            const expected = "";
            const actual = DccFunctions.sekMult("xxx");
            assert.equal(actual, expected, "is empty");
        });
        it("should be same", () => {
            const expected = "mn ";
            const actual = DccFunctions.sekMult("mkr");
            assert.equal(actual, expected, "is same");
        });
        it("should be same", () => {
            const expected = "miljon ";
            const actual = DccFunctions.sekMult("miljon");
            assert.equal(actual, expected, "is same");
        });
    });
/*
    describe("#checkOtherUnit", () => {
        it("should be same", () => {
            const replacedUnit = "MGA";
            const conversionQuote = 12.34;
            const actual = DccFunctions.checkOtherUnit(replacedUnit, conversionQuote);
            assert.equal(actual, conversionQuote, "is same");
        });
        it("should be one hundreth", () => {
            const replacedUnit = "inch";
            const conversionQuote = 0;
            const actual = DccFunctions.checkOtherUnit(replacedUnit, conversionQuote);
            assert.equal(actual, 25.4, "is 25.4");
        })
    })
*/
});


