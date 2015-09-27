

/**
 *
 */
describe("ContentScriptParams", ()  => {
    "use strict";
    it("convertToCurrency", function () {
        const informationHolder = new MockInformationHolder();
        informationHolder.convertToCurrency = "EUR";
        const contentScriptParams = new ContentScriptParams(null, informationHolder);
        assert.equal(contentScriptParams.convertToCurrency, informationHolder.convertToCurrency, "convertToCurrency");
    })
});


