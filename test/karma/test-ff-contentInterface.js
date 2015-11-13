/**
 * Created by per on 2015-09-10.
 */


const PageMod = function() {
    "use strict";

};

const tabs = function() {
    "use strict";
};
tabs.on = function (what, fn) {};
tabs.open = function () {};
tabs.activeTab = {};

describe("FirefoxContentInterface", function() {
    "use strict";
    describe("#new", function() {
        it("new", function () {
            const informationHolder = new MockInformationHolder();
            const firefoxContentInterface = new FirefoxContentInterface(informationHolder, PageMod, MockContentScriptParams, tabs, eventAggregator);
        });
        it("watchForPages", function () {
            const informationHolder = new MockInformationHolder();
            const firefoxContentInterface = new FirefoxContentInterface(informationHolder, PageMod, MockContentScriptParams, tabs, eventAggregator);
            firefoxContentInterface.watchForPages();
        });
        it("toggleConversion", function () {
            const conversionEnabled = true;
            const informationHolder = new MockInformationHolder();
            const firefoxContentInterface = new FirefoxContentInterface(informationHolder, PageMod, MockContentScriptParams, tabs, eventAggregator);
            firefoxContentInterface.toggleConversion(conversionEnabled);
        });
        it("showSettingsTab", function () {
            const informationHolder = new MockInformationHolder();
            const firefoxContentInterface = new FirefoxContentInterface(informationHolder, PageMod, MockContentScriptParams, tabs, eventAggregator);
            firefoxContentInterface.showSettingsTab();
        });
        it("showTestTab", function () {
            const informationHolder = new MockInformationHolder();
            const firefoxContentInterface = new FirefoxContentInterface(informationHolder, PageMod, MockContentScriptParams, tabs, eventAggregator);
            firefoxContentInterface.showTestTab();
        });
        it("closeSettingsTab", function () {
            const informationHolder = new MockInformationHolder();
            const firefoxContentInterface = new FirefoxContentInterface(informationHolder, PageMod, MockContentScriptParams, tabs, eventAggregator);
            firefoxContentInterface.closeSettingsTab();
        });
    });
});
