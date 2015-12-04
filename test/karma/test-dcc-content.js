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
            const actual = DccFunctions.checkSubUnit(price, replacedUnit);
            assert.strictEqual(actual, false, "is same");
        });
        it("should be one hundreth", () => {
            const price = {full: "50 öre"};
            const replacedUnit = "SEK";
            const conversionQuote = 13.57;
            const actual = DccFunctions.checkSubUnit(price, replacedUnit);
            assert.strictEqual(actual, true, "is 1/100");
        });
        it("should be same", () => {
            const price = {full: "50 kr"};
            const replacedUnit = "SEK";
            const conversionQuote = 13.57;
            const actual = DccFunctions.checkSubUnit(price, replacedUnit);
            assert.strictEqual(actual, false, "is same");
        })
    });
    describe("#mult", () => {
        it("should be empty", () => {
            const expected = "";
            const actual = DccFunctions.multies["SEK"].func(expected);
            assert.strictEqual(actual, expected, "is empty");
        });
        it("should be miljon", () => {
            const expected = "miljon ";
            const actual = DccFunctions.multies["SEK"].func("miljon");
            assert.strictEqual(actual, expected, "is miljon");
        });
        it("should be mn", () => {
            const expected = "mn ";
            const actual = DccFunctions.multies["SEK"].func("mkr");
            assert.strictEqual(actual, expected, "is mn");
        });
        it("should be G", () => {
            const expected = "G";
            const actual = DccFunctions.multies["SEK"].func("gsek");
            assert.strictEqual(actual, expected, "is G");
        });
    });
    describe("#addMonetaryGroupingSeparatorSymbol", () => {
        it("should be same", () => {
            const monetaryGroupingSeparatorSymbol = " ";
            const expected = "0";
            const actual = DccFunctions.addMonetaryGroupingSeparatorSymbol(expected, monetaryGroupingSeparatorSymbol);
            assert.strictEqual(actual, expected, "is same");
        });
        it("should be same", () => {
            const monetaryGroupingSeparatorSymbol = " ";
            const expected = "0.00";
            const actual = DccFunctions.addMonetaryGroupingSeparatorSymbol(expected, monetaryGroupingSeparatorSymbol);
            assert.strictEqual(actual, expected, "is same");
        });
        it("should have a non-breaking space", () => {
            const monetaryGroupingSeparatorSymbol = " ";
            const value = "1111";
            const expected = "1 111";
            const actual = DccFunctions.addMonetaryGroupingSeparatorSymbol(value, monetaryGroupingSeparatorSymbol);
            assert.strictEqual(actual, expected, "is same");
        });
        it("should have an apostrophe", () => {
            const monetaryGroupingSeparatorSymbol = "'";
            const value = "1111111";
            const expected = "1'111'111";
            const actual = DccFunctions.addMonetaryGroupingSeparatorSymbol(value, monetaryGroupingSeparatorSymbol);
            assert.strictEqual(actual, expected, "is same");
        });
        it("should have a comma", () => {
            const monetaryGroupingSeparatorSymbol = ",";
            const value = "1111111";
            const expected = "1,111,111";
            const actual = DccFunctions.addMonetaryGroupingSeparatorSymbol(value, monetaryGroupingSeparatorSymbol);
            assert.strictEqual(actual, expected, "is same");
        });
    });
    describe("#formattedAmount", () => {
        it("should be same", () => {
            const anAmountIntegralPart = "1";
            const anAmountFractionalPart = "23";
            const isSubUnit = false;
            const aMonetaryGroupingSeparatorSymbol = ".";
            const aMonetarySeparatorSymbol = ",";
            const expected = "1,23";
            const actual = DccFunctions.formatAmount(anAmountIntegralPart, anAmountFractionalPart, isSubUnit, aMonetaryGroupingSeparatorSymbol, aMonetarySeparatorSymbol);
            assert.strictEqual(actual, expected, "is same");
        });
        it("should be same", () => {
            const anAmountIntegralPart = "0";
            const anAmountFractionalPart = "23";
            const isSubUnit = true;
            const aMonetaryGroupingSeparatorSymbol = ".";
            const aMonetarySeparatorSymbol = ",";
            const expected = "23";
            const actual = DccFunctions.formatAmount(anAmountIntegralPart, anAmountFractionalPart, isSubUnit, aMonetaryGroupingSeparatorSymbol, aMonetarySeparatorSymbol);
            assert.strictEqual(actual, expected, "is same");
        });
        it("should be same", () => {
            const anAmountIntegralPart = "0";
            const anAmountFractionalPart = "03";
            const isSubUnit = true;
            const aMonetaryGroupingSeparatorSymbol = ".";
            const aMonetarySeparatorSymbol = ",";
            const expected = "3";
            const actual = DccFunctions.formatAmount(anAmountIntegralPart, anAmountFractionalPart, isSubUnit, aMonetaryGroupingSeparatorSymbol, aMonetarySeparatorSymbol);
            assert.strictEqual(actual, expected, "is same");
        });
        it("should be same", () => {
            const anAmountIntegralPart = "0";
            const anAmountFractionalPart = "23";
            const isSubUnit = false;
            const aMonetaryGroupingSeparatorSymbol = ".";
            const aMonetarySeparatorSymbol = ",";
            const expected = "0,23";
            const actual = DccFunctions.formatAmount(anAmountIntegralPart, anAmountFractionalPart, isSubUnit, aMonetaryGroupingSeparatorSymbol, aMonetarySeparatorSymbol);
            assert.strictEqual(actual, expected, "is same");
        });
    });

    describe("#formattedPrice", () => {
        it("should be same", () => {
            const anAmount = 1234.56;
            const aMultiplicator = "";
            const aUnit = "€";
            const aRoundAmounts = false;
            const aCurrencyCode = "EUR";
            const aCustomFormat = {"beforeCurrencySymbol" : true, "monetaryGroupingSeparatorSymbol" : " ", "monetarySeparatorSymbol" : ",", "currencySpacing" : "\u2009"};
            const anAllowSubUnit = false;
            const expected = " 1\u00A0234,56\u2009€";
            const actual = DccFunctions.formatPrice(aCurrencyCode, aRoundAmounts, anAmount, aUnit, anAllowSubUnit, aCustomFormat, aMultiplicator);
            assert.strictEqual(actual, expected, "is same");
        });
        it("should be same", () => {
            const anAmount = 0.56;
            const aMultiplicator = "";
            const aUnit = "€";
            const aRoundAmounts = false;
            const aCurrencyCode = "EUR";
            const aCustomFormat = {"beforeCurrencySymbol" : true, "monetaryGroupingSeparatorSymbol" : " ", "monetarySeparatorSymbol" : ",", "currencySpacing" : "\u2009"};
            const anAllowSubUnit = false;
            const expected = " 0,56\u2009€";
            const actual = DccFunctions.formatPrice(aCurrencyCode, aRoundAmounts, anAmount, aUnit, anAllowSubUnit, aCustomFormat, aMultiplicator);
            assert.strictEqual(actual, expected, "is same");
        });
    });

});


