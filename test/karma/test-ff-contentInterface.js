/**
 * Created by per on 2015-09-10.
 */



/*
const MockPanel = function() {
    "use strict";
};
MockPanel.prototype.port = {};
MockPanel.prototype.port.on = function() {};
*/

const PageMod = function() {
    "use strict";

};

const tabs = function() {
    "use strict";

};


describe("FirefoxContentInterface", function() {
    "use strict";
    describe("#new", function() {
        it("new", function () {
            const informationHolder = new MockInformationHolder();
            const firefoxContentInterface = new FirefoxContentInterface(informationHolder, PageMod, MockContentScriptParams, tabs, eventAggregator);
        });
    });
});
