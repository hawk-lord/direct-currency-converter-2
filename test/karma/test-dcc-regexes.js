

describe("PriceRegexes", function() {
    "use strict";
    const regex1 = {};
    const regex2 = {};
    PriceRegexes.makePriceRegexes(regex1, regex2);
    describe("#makePriceRegexes(regex1, regex2)", function() {
        it("should be ALL", function () {
            assert.equal(regex1.ALL.exec("ALL 100 000.00")[1], "ALL");
        });
        it("should be ALL", function () {
            assert.equal(regex2.ALL.exec("100 000.00 ALL")[2], "ALL");
        });
        it("should be DOP", function () {
            assert.notEqual(regex1.DOP.exec("RD$0 - RD$150,000 DOP")[2], "DOP");
        });
        it("should be DOP", function () {
            assert.equal(regex2.DOP.exec("RD$0 - RD$150,000 DOP")[2], "DOP");
        })
    })
});
