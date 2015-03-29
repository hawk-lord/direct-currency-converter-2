/**
 * Created by per on 15-03-25.
 */
const ContentInterface = function(aUrlProvider, anInformationHolder) {
    "use strict";
    const {PageMod} = require("sdk/page-mod");
    const tabs = require("sdk/tabs");
    const CustomTabObject = function() {
        "use strict";
        this.enabled = false;
        this.hasConvertedElements = false;
        this.workers = [];
    };
    const {ContentScriptParams} = require("./contentScriptParams");
    const attachHandler = (aWorker) => {
        const finishedTabProcessingHandler = (aHasConvertedElements) => {
            // console.log("finishedTabProcessingHandler");
            try {
                if (aWorker.tab.customTabObject == null) {
                    aWorker.tab.customTabObject = new CustomTabObject();
                }
                aWorker.tab.customTabObject.isEnabled = anInformationHolder.conversionEnabled;
                aWorker.tab.customTabObject.workers.push(aWorker);
                aWorker.tab.customTabObject.hasConvertedElements = aHasConvertedElements;
            }
            catch(err) {
                console.error("ContentScriptInterface: " + err);
            }
            const status = {};
            // status.isEnabled = aStatus;
            status.isEnabled = true;
            //status.hasConvertedElements = aWorker.activeTab.customTabObject.hasConvertedElements;
            status.hasConvertedElements = true;
            try {
                aWorker.port.emit("sendEnabledStatus", status);
            }
            catch(err) {
                // To hide "Error: The page is currently hidden and can no longer be used until it is visible again."
                console.error("TabsInterface: " + err);
            }

        };
        // console.log("attachHandler pageMod " + pageMod.include);
        aWorker.port.emit("updateSettings", new ContentScriptParams(aWorker.tab, anInformationHolder));
        aWorker.port.on("finishedTabProcessing", finishedTabProcessingHandler);
    };
    var pageMod;
    const attachToPage = function() {
        // TODO exclude from informationHolder, FF 32
        // FF 34 no urlProvider needed
        pageMod = new PageMod({
            include: "*",
            contentScriptFile: ["./common/dcc-regexes.js",
                "./common/dcc-content.js",
                "./dcc-firefox-content-adapter.js"],
            contentScriptWhen: "ready",
            attachTo: ["existing", "top", "frame"],
            onAttach: attachHandler
        });
    };
    const sendEnabledStatus = (aWorker) => {
        if (aWorker.tab) {
            const status = {};
            status.isEnabled = aStatus;
            status.hasConvertedElements = tabs.activeTab.customTabObject.hasConvertedElements;
            try {
                aWorker.port.emit("sendEnabledStatus", status);
            }
            catch(err) {
                // To hide "Error: The page is currently hidden and can no longer be used until it is visible again."
                console.error("sendEnabledStatus: " + err);
            }
        }
    };
    const toggleConversion = (aStatus) => {
        console.log("aStatus " + aStatus);
        console.log("toggleConversion");
        if (tabs.activeTab.customTabObject) {
            console.log("tabs.activeTab.customTabObject");
            tabs.activeTab.customTabObject.isEnabled = aStatus;
            anInformationHolder.conversionEnabled = aStatus;
            tabs.activeTab.customTabObject.workers.map(sendEnabledStatus);
            tabs.activeTab.customTabObject.hasConvertedElements = true;
        }
        else {
            console.error("customTabObject is missing");
        }
    };

    return {
        attachToPage: attachToPage,
        toggleConversion: toggleConversion
    }
};

if (typeof exports === "object") {
    exports.ContentInterface = ContentInterface;
}
