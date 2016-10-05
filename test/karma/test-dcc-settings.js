/**
 * Created by per on 2015-09-09.
 */
describe("", function() {
    "use strict";
    const contentScriptParams = new MockContentScriptParams();
    describe("Settings", function() {
        // it.skip("should skip", function() {
        //     assert.fail();
        // });
        it("should not fail", function() {
            DirectCurrencySettings.showSettings(contentScriptParams);
        })
    });
});