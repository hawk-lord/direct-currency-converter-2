/**
 * Created by per on 15-03-25.
 */
const ContentInterface = function(aUrlProvider, anInformationHolder) {
    "use strict";
    const CustomTabObject = function() {
        "use strict";
        this.enabled = false;
        this.hasConvertedElements = false;
        this.workers = [];
    };
    const {ContentScriptParams} = require("./contentScriptParams");
    const attachHandler = (aWorker) => {
        const finishedTabProcessingHandler = (aHasConvertedElements) => {
            try {
                if (aWorker.tab.customTabObject == null) {
                    aWorker.tab.customTabObject = new CustomTabObject();
                }
                aWorker.tab.customTabObject.isEnabled = anInformationHolder.conversionEnabled;
                aWorker.tab.customTabObject.workers.push(aWorker);
                aWorker.tab.customTabObject.hasConvertedElements = aHasConvertedElements;
            }
            catch(err) {
                // console.log("ContentScriptInterface: " + err);
            }
        };
        console.log("attachHandler");
        aWorker.port.emit("updateSettings", new ContentScriptParams(aWorker.tab, anInformationHolder));
        aWorker.port.on("finishedTabProcessing", finishedTabProcessingHandler);
    };
    const {PageMod} = require("sdk/page-mod");
    const attach = function() {
        PageMod({
            include: "*",
            contentScriptFile: [aUrlProvider.getUrl("common/dcc-regexes.js"),
                aUrlProvider.getUrl("common/dcc-content.js"),
                aUrlProvider.getUrl("dcc-firefox-content-adapter.js")],
            contentScriptWhen: "ready",
            attachTo: ["existing", "top", "frame"],
            onAttach: attachHandler
        });
    };
    return {
        attach: attach
    }
};

if (typeof exports === "object") {
    exports.ContentInterface = ContentInterface;
}
