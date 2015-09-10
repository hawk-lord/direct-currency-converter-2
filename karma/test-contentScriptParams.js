
const informationHolder = new MockInformationHolder();

/**
 *
 */
describe("ContentScriptParams", ()  => {
    "use strict";
    it("should not fail", function () {
        const contentScriptParams = new ContentScriptParams(null, informationHolder);
    })
});


