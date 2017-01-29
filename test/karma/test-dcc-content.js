/*

 */

const convertFroms = [];
convertFroms.push({"isoName": "USD", "enabled": true});
const conversionQuotes = {
    "USD": 1.2
};
const convertToCurrency2 = "EUR";

const contentScriptParams = new MockContentScriptParams();
contentScriptParams.convertFroms = convertFroms;
contentScriptParams.convertToCurrency = convertToCurrency2;
contentScriptParams.conversionQuotes = conversionQuotes;
contentScriptParams.isEnabled = true;

describe("DirectCurrencyContent", () => {
    "use strict";
    describe("A test suite", function() {
        beforeEach(function() { });
        afterEach(function() { });
        it('should be OK', function() { expect(false).to.be.false; });
    });
    describe("#onUpdateSettings()", () => {
        it("should not fail", () => {
            document.body.className = "documentclass";
            document.body.style.background = "red";
            document.body.style.color = "blue";
            const newtext = document.createTextNode("100 USD");
            newtext.id = "id1";
            const paragraph = document.createElement("p");
            paragraph.className = "paragraphclass";
            paragraph.appendChild(newtext);
            document.body.appendChild(paragraph);
            DirectCurrencyContent.onUpdateSettings(contentScriptParams);
            // TODO use Promise PriceRegexes
            var unixtime_ms = new Date().getTime();
            // while(new Date().getTime() < unixtime_ms + 5000) {
            //     //console.log("waiting");
            // }
            assert(true);
        });
    });
    // describe("#onSendEnabledStatus()", () => {
    //     const status = new MockStatus();
    //     it("should not fail", () => {
    //         DirectCurrencyContent.onSendEnabledStatus(status);
    //         assert(true);
    //     });
    // });
    describe("#checkSubUnit", () => {
        it("should be false", () => {
            const price = {full: "50000 ariary"};
            const replacedUnit = "MGA";
            expect(DccFunctions.checkSubUnit(price, replacedUnit)).to.be.false;
        });
        it("should be same", () => {
            const price = {full: "50000 ariary"};
            const replacedUnit = "MGA";
            const actual = DccFunctions.checkSubUnit(price, replacedUnit, "");
            assert.strictEqual(actual, false, "is same");
        });
        it("should be one hundreth", () => {
            const price = {full: "50 öre"};
            const replacedUnit = "SEK";
            const actual = DccFunctions.checkSubUnit(price, replacedUnit, "");
            assert.strictEqual(actual, true, "is 1/100");
        });
        it("should be same", () => {
            const price = {full: "50 kr"};
            const replacedUnit = "SEK";
            const actual = DccFunctions.checkSubUnit(price, replacedUnit, "");
            assert.strictEqual(actual, false, "is same");
        })
    });
    describe("#multies", () => {
        it("should be empty", () => {
            const expected = "";
            const actual = DccFunctions.multies["SEK"].findMult(expected);
            assert.strictEqual(actual, expected, "is empty");
        });
        it("should be miljon", () => {
            const expected = "miljon ";
            const actual = DccFunctions.multies["SEK"].findMult("miljon");
            assert.strictEqual(actual, expected, "is miljon");
        });
        it("should be mn", () => {
            const expected = "mn ";
            const actual = DccFunctions.multies["SEK"].findMult("mkr");
            assert.strictEqual(actual, expected, "is mn");
        });
        it("should be G", () => {
            const expected = "G";
            const actual = DccFunctions.multies["SEK"].findMult("gsek");
            assert.strictEqual(actual, expected, "is G");
        });
    });
    describe("#getMultiplicator", () => {
        it("should throw an error due to a missing parameter", () => {
            expect(DccFunctions.getMultiplicator).to.throw(Error, /aPrice is undefined/);
        });
        it("should throw an error due to a null parameter", () => {
            expect(() => {DccFunctions.getMultiplicator(null)} ).to.throw(Error, /aPrice is null/);
        });
        it("should return an empty string", () => {
            const aCurrency = "EUR";
            const anOriginalCurrency = "SEK";
            const aMatch = ["848,452.63 SEK", "", "848,452.63"];
            const anAmountPosition = 2;
            const price = new Price(aCurrency, anOriginalCurrency, aMatch, anAmountPosition);
            expect(DccFunctions.getMultiplicator(price) ).to.equal("");
        });
        it("should return 'miljon '", () => {
            const aCurrency = "EUR";
            const anOriginalCurrency = "SEK";
            const aMatch = ["1 miljon SEK", "", "1 miljon"];
            const anAmountPosition = 2;
            const price = new Price(aCurrency, anOriginalCurrency, aMatch, anAmountPosition);
            expect(DccFunctions.getMultiplicator(price) ).to.equal("miljon ");
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
    describe("#formatAmount", () => {
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

    describe("#formatPrice", () => {
        it("should have grouping separator, decimal separator and unit separator", () => {
            const anAmount = 1234.56;
            const aMultiplicator = "";
            const aUnit = "€";
            const aRoundAmounts = false;
            const aCurrencyCode = "EUR";
            const subUnits = {"EUR": "cent", "RUB" : "коп.", "SEK": "öre"};
            const aSubUnit = subUnits[aCurrencyCode];
            const aCustomFormat = {"beforeCurrencySymbol" : true, "monetaryGroupingSeparatorSymbol" : " ", "monetarySeparatorSymbol" : ",", "currencySpacing" : "\u2009"};
            const anAllowSubUnit = false;
            const expected = " 1\u00A0234,56\u2009€";
            const actual = DccFunctions.formatPrice(aRoundAmounts, anAmount, aUnit, aSubUnit, anAllowSubUnit, aCustomFormat, aMultiplicator);
            assert.strictEqual(actual, expected, "is same");
        });
        it("should have leading zero, decimal separator and unit separator", () => {
            const anAmount = 0.56;
            const aMultiplicator = "";
            const aUnit = "€";
            const aRoundAmounts = false;
            const aCurrencyCode = "EUR";
            const subUnits = {"EUR": "cent", "RUB" : "коп.", "SEK": "öre"};
            const aSubUnit = subUnits[aCurrencyCode];
            const aCustomFormat = {"beforeCurrencySymbol" : true, "monetaryGroupingSeparatorSymbol" : " ", "monetarySeparatorSymbol" : ",", "currencySpacing" : "\u2009"};
            const anAllowSubUnit = false;
            const expected = " 0,56\u2009€";
            const actual = DccFunctions.formatPrice(aRoundAmounts, anAmount, aUnit, aSubUnit, anAllowSubUnit, aCustomFormat, aMultiplicator);
            assert.strictEqual(actual, expected, "is same");
        });
        it("should have leading zero, decimal separator, unit separator and multiple", () => {
            const anAmount = 0.01;
            const aMultiplicator = "miljoner ";
            const aUnit = "€";
            const aRoundAmounts = false;
            const aCurrencyCode = "EUR";
            const subUnits = {"EUR": "cent", "RUB" : "коп.", "SEK": "öre"};
            const aSubUnit = subUnits[aCurrencyCode];
            const aCustomFormat = {"beforeCurrencySymbol" : true, "monetaryGroupingSeparatorSymbol" : " ", "monetarySeparatorSymbol" : ",", "currencySpacing" : "\u2009"};
            const anAllowSubUnit = false;
            const expected = " 0,01\u2009miljoner €";
            const actual = DccFunctions.formatPrice(aRoundAmounts, anAmount, aUnit, aSubUnit, anAllowSubUnit, aCustomFormat, aMultiplicator);
            assert.strictEqual(actual, expected, "is same");
        });
    });

    describe("#useUnit", () => {
            it("should be mm", () => {
                const expected = "mm";
                const actual = DccFunctions.useUnit("inch", "");
                assert.strictEqual(actual, expected, "is same");
            });
            it("is empty", () => {
                const expected = "SEK";
                const actual = DccFunctions.useUnit("", "SEK");
                assert.strictEqual(actual, expected, "is same");
            });
            it("is empty", () => {
                const expected = "SEK";
                const actual = DccFunctions.useUnit("xxx", "SEK");
                assert.strictEqual(actual, expected, "is same");
            })
    });

    describe("#parseAmount", () => {
            it("should be 0", () => {
                const expected = 0;
                const actual = DccFunctions.parseAmount("0");
                assert.strictEqual(actual, expected, "is same");
            });
            it("should be 0.1", () => {
                const expected = 0.1;
                const actual = DccFunctions.parseAmount("0.10");
                assert.strictEqual(actual, expected, "is same");
            });
            it("should be 1", () => {
                const expected = 1;
                const actual = DccFunctions.parseAmount("1.00");
                assert.strictEqual(actual, expected, "is same");
            });
            it("should be 1", () => {
                const expected = 1;
                const actual = DccFunctions.parseAmount("1,00");
                assert.strictEqual(actual, expected, "is same");
            });
            it("should be 1000", () => {
                const expected = 1000;
                const actual = DccFunctions.parseAmount("1,000.00");
                assert.strictEqual(actual, expected, "is same");
            });
            it("should be 1000", () => {
                const expected = 1000;
                const actual = DccFunctions.parseAmount("1'000");
                assert.strictEqual(actual, expected, "is same");
            });
    });

    describe("#convertAmount", () => {
        it("should be 0.41", () => {
            const conversionQuote = 0.000041;
            const parsedAmount = 10000;
            const currency = "EUR";
            const originalCurrency = "VND";
            const match = ["10000 VND", "10000 ", "10000", undefined, undefined, "10000", undefined, undefined, "VND"];
            const amountPosition = 2;
            const price = new Price(currency, originalCurrency, match, amountPosition);
            const replacedUnit = "VND";
            const expected = 0.41;
            const actual = DccFunctions.convertAmount(conversionQuote, parsedAmount, price, replacedUnit);
            const actualRounded = Math.round(actual * 100) / 100;
            assert.strictEqual(actualRounded, expected, "is same");
        });
        it("should be 1100", () => {
            const conversionQuote = 0.11;
            const parsedAmount = 10000;
            const currency = "EUR";
            const originalCurrency = "SEK";
            const match = ["10000 SEK", "10000 ", "10000", undefined, undefined, "10000", undefined, undefined, "SEK"];
            const amountPosition = 2;
            const price = new Price(currency, originalCurrency, match, amountPosition);
            const replacedUnit = "SEK";
            const expected = 1100;
            const actual = DccFunctions.convertAmount(conversionQuote, parsedAmount, price, replacedUnit, "");
            const actualRounded = Math.round(actual * 100) / 100;
            assert.strictEqual(actualRounded, expected, "is same");
        });
        it("should be 0.11", () => {
            const conversionQuote = 0.11;
            const parsedAmount = 0.10;
            const currency = "EUR";
            const originalCurrency = "SEK";
            const match = ["0.10 kr", "0.10 ", "0", undefined, undefined, "0", ".10", ".", "kr"];
            const amountPosition = 2;
            const price = new Price(currency, originalCurrency, match, amountPosition);
            const replacedUnit = "SEK";
            const expected = 0.01;
            const actual = DccFunctions.convertAmount(conversionQuote, parsedAmount, price, replacedUnit, "");
            const actualRounded = Math.round(actual * 100) / 100;
            assert.strictEqual(actualRounded, expected, "is same");
        });
        it("should be 0.01", () => {
            const conversionQuote = 0.11;
            const parsedAmount = 10;
            const currency = "EUR";
            const originalCurrency = "SEK";
            const match = ["10 öre", "10 ", "10", undefined, undefined, "10", undefined, undefined, "öre"];
            const amountPosition = 2;
            const price = new Price(currency, originalCurrency, match, amountPosition);
            const replacedUnit = "SEK";
            const expected = 0.01;
            const actual = DccFunctions.convertAmount(conversionQuote, parsedAmount, price, replacedUnit, "");
            const actualRounded = Math.round(actual * 100) / 100;
            assert.strictEqual(actualRounded, expected, "is same");
        });
        it("should be 0.22", () => {
            const conversionQuote = 0.11;
            const parsedAmount = 2;
            const currency = "EUR";
            const originalCurrency = "SEK";
            const match = ["2 miljoner kronor", "2 ", "2", undefined, undefined, "2", undefined, undefined, "miljoner kronor"];
            const amountPosition = 2;
            const price = new Price(currency, originalCurrency, match, amountPosition);
            const replacedUnit = "SEK";
            const expected = 0.22;
            const actual = DccFunctions.convertAmount(conversionQuote, parsedAmount, price, replacedUnit, "");
            const actualRounded = Math.round(actual * 100) / 100;
            assert.strictEqual(actualRounded, expected, "is same");
        });
        it("should be 0.22", () => {
            const conversionQuote = 0.0156;
            const parsedAmount = 2;
            const currency = "EUR";
            const originalCurrency = "RUB";
            const match = ["2 RUB", "2 ", "2", undefined, undefined, "2", undefined, undefined, "RUB"];
            const amountPosition = 2;
            const price = new Price(currency, originalCurrency, match, amountPosition);
            const replacedUnit = "RUB";
            const expected = 0.03;
            const actual = DccFunctions.convertAmount(conversionQuote, parsedAmount, price, replacedUnit, "");
            const actualRounded = Math.round(actual * 100) / 100;
            assert.strictEqual(actualRounded, expected, "is same");
        });
    });

    describe("#replaceContent", () => {
        it("should replace USD with EUR", () => {
            const expected = " 28.179,00 € to $30,000";
            const convertedPrice = " 28.179,00 €";
            const convertedContent = "$3,000 to $30,000";
            const showOriginalPrices = false;
            const replacedUnit = "USD";
            const showOriginalCurrencies = false;
            const anOriginalCurrency = "USD";
            const aCurrency = "EUR";
            const match = ["$3,000", "", "$", "3,000", "3,000", ",000", ",", undefined, undefined, undefined];
            match.index = 0;
            const anAmountPosition = 3;
            const price = new Price(aCurrency, anOriginalCurrency, match, anAmountPosition);
            const actual = DccFunctions.replaceContent(convertedPrice, convertedContent, showOriginalPrices,
                replacedUnit, showOriginalCurrencies, price);
            assert.strictEqual(actual, expected, "is same");
        });
        it("should replace RUB with EUR", () => {
            const expected = " 155,47 €";
            const convertedPrice = " 155,47 €";
            const convertedContent = "10000 RUB";
            const showOriginalPrices = false;
            const replacedUnit = "RUB";
            const showOriginalCurrencies = false;
            const anOriginalCurrency = "RUB";
            const aCurrency = "EUR";
            const match = ["10000 RUB", "10000 ", "10000", undefined, undefined, "10000", undefined, undefined, "RUB"];
            match.index = 0;
            const anAmountPosition = 2;
            const price = new Price(aCurrency, anOriginalCurrency, match, anAmountPosition);
            const actual = DccFunctions.replaceContent(convertedPrice, convertedContent, showOriginalPrices,
                replacedUnit, showOriginalCurrencies, price);
            assert.strictEqual(actual, expected, "is same");
        });
    });

    describe("#convertContent", () => {
        it("should replace USD with EUR", () => {
            const expected = " 2\u00A0700,00\u2009€ to $30,000";
            const aCurrency = "EUR";
            const anOriginalCurrency = "USD";
            const match = ["$3,000", "", "$", "3,000", "3,000", ",000", ",", undefined, undefined, undefined];
            match.index = 0;
            const anAmountPosition = 3;
            const price = new Price(aCurrency, anOriginalCurrency, match, anAmountPosition);
            const conversionQuote = 0.9;
            const replacedUnit = "USD";
            const currencySymbol = "€";
            const currencyCode = "EUR";
            const roundAmounts = false;
            const customFormat = {"beforeCurrencySymbol" : true, "monetaryGroupingSeparatorSymbol" : " ", "monetarySeparatorSymbol" : ",", "currencySpacing" : "\u2009"};
            const showOriginalPrices = false;
            const showOriginalCurrencies = false;
            const convertedContent = "$3,000 to $30,000";
            const actual = DccFunctions.convertContent(price, conversionQuote, replacedUnit, currencySymbol,
                currencyCode, roundAmounts, customFormat, showOriginalPrices, showOriginalCurrencies, convertedContent);
            assert.strictEqual(actual, expected, "is same");
        });
    });

});


