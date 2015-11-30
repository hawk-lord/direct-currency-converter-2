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
            assert.strictEqual(actual, conversionQuote, "is same");
        });
        it("should be one hundreth", () => {
            const price = {full: "50 öre"};
            const replacedUnit = "SEK";
            const conversionQuote = 13.57;
            const actual = DccFunctions.checkSubUnit(price, replacedUnit, conversionQuote);
            assert.strictEqual(actual, conversionQuote/100, "is 1/100");
        });
        it("should be same", () => {
            const price = {full: "50 kr"};
            const replacedUnit = "SEK";
            const conversionQuote = 13.57;
            const actual = DccFunctions.checkSubUnit(price, replacedUnit, conversionQuote);
            assert.strictEqual(actual, conversionQuote, "is same");
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
            const expected = "1\u00a0111";
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
            const aMultiplicator = "";
            const aUnit = "€";
            const aCurrencyCode = "EUR";
            const aMonetaryGroupingSeparatorSymbol = ".";
            const aMonetarySeparatorSymbol = ",";
            const expected = {formattedPrice: "1,23", unit: aUnit};
            const actual = DccFunctions.formatAmount(anAmountIntegralPart, anAmountFractionalPart, aMultiplicator, aUnit, aCurrencyCode, aMonetaryGroupingSeparatorSymbol, aMonetarySeparatorSymbol);
            // console.log(actual);
            assert.strictEqual(actual.unit, expected.unit, "is same");
            assert.strictEqual(actual.formattedPrice, expected.formattedPrice, "is same");
        });
        it("should be same", () => {
            const anAmountIntegralPart = "0";
            const anAmountFractionalPart = "23";
            const aMultiplicator = "";
            const aUnit = "€";
            const aCurrencyCode = "EUR";
            const aMonetaryGroupingSeparatorSymbol = ".";
            const aMonetarySeparatorSymbol = ",";
            const expected = {formattedPrice: "23", unit: "cent"};
            const actual = DccFunctions.formatAmount(anAmountIntegralPart, anAmountFractionalPart, aMultiplicator, aUnit, aCurrencyCode, aMonetaryGroupingSeparatorSymbol, aMonetarySeparatorSymbol);
            // console.log(actual);
            assert.strictEqual(actual.unit, expected.unit, "is same");
            assert.strictEqual(actual.formattedPrice, expected.formattedPrice, "is same");
        });
        it("should be same", () => {
            const anAmountIntegralPart = "0";
            const anAmountFractionalPart = "03";
            const aMultiplicator = "";
            const aUnit = "kr";
            const aCurrencyCode = "SEK";
            const aMonetaryGroupingSeparatorSymbol = ".";
            const aMonetarySeparatorSymbol = ",";
            const expected = {formattedPrice: "3", unit: "öre"};
            const actual = DccFunctions.formatAmount(anAmountIntegralPart, anAmountFractionalPart, aMultiplicator, aUnit, aCurrencyCode, aMonetaryGroupingSeparatorSymbol, aMonetarySeparatorSymbol);
            // console.log(actual);
            assert.strictEqual(actual.unit, expected.unit, "is same");
            assert.strictEqual(actual.formattedPrice, expected.formattedPrice, "is same");
        });
        it("should be same", () => {
            const anAmountIntegralPart = "0";
            const anAmountFractionalPart = "23";
            const aMultiplicator = "";
            const aUnit = "";
            const aCurrencyCode = "SEK";
            const aMonetaryGroupingSeparatorSymbol = ".";
            const aMonetarySeparatorSymbol = ",";
            const expected = {formattedPrice: "0,23", unit: ""};
            const actual = DccFunctions.formatAmount(anAmountIntegralPart, anAmountFractionalPart, aMultiplicator, aUnit, aCurrencyCode, aMonetaryGroupingSeparatorSymbol, aMonetarySeparatorSymbol);
            assert.strictEqual(actual.unit, expected.unit, "is same");
            assert.strictEqual(actual.formattedPrice, expected.formattedPrice, "is same");
        });
    });

    describe("#formattedPrice", () => {
        it("should be same", () => {
            const anAmount = 1234.56;
            const aMultiplicator = "";
            const aUnit = "€";
            const aRoundAmounts = false;
            const aCurrencyCode = "EUR";
            const aMonetaryGroupingSeparatorSymbol = ".";
            const aMonetarySeparatorSymbol = ",";
            const aCustomFormat = {"beforeCurrencySymbol" : true, "monetaryGroupingSeparatorSymbol" : " ", "monetarySeparatorSymbol" : ",", "currencySpacing" : "\u2009"};
            const expected = " 1\u00A0234,56\u2009€";
            const actual = DccFunctions.formatPrice(anAmount, aUnit, aMultiplicator, aRoundAmounts, aCurrencyCode, aCustomFormat);
            assert.strictEqual(actual, expected, "is same");
        });
    });

});


