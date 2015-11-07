

/**
 *
 */
describe("ParseContentScriptParams", ()  => {
    "use strict";
    it("should not fail", function () {
        const informationHolder = new MockInformationHolder();
        const contentScriptParams = new MockContentScriptParams();
        const parseContentScriptParams = new ParseContentScriptParams(contentScriptParams, informationHolder);
    })
});


