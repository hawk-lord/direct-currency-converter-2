/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const FirefoxContentInterface = function(anInformationHolder, PageMod, ContentScriptParams, tabs, eventAggregator) {
    "use strict";
    var settingsWorker = null;
    var testPageWorker = null;
    const CustomTabObject = function() {
        "use strict";
        this.enabled = false;
        this.hasConvertedElements = false;
        this.workers = [];
    };
    const sendEnabledStatus = (aWorker) => {
        // console.log("sendEnabledStatus aWorker.tab " + aWorker.tab);
        if (aWorker.tab) {
            const status = {};
            status.isEnabled = anInformationHolder.conversionEnabled;
            if (aWorker.tab.customTabObject) {
                status.hasConvertedElements = aWorker.tab.customTabObject.hasConvertedElements;
            }
            else {
                status.hasConvertedElements = false;
            }
            try {
                aWorker.port.emit("sendEnabledStatus", status);
            }
            catch(err) {
                // This happens sometimes
                // Error: The page is currently hidden and can no longer be used until it is visible again.
                // console.error("sendEnabledStatus: " + err);
            }
        }
        else {
            // This happens sometimes
            // console.error("!aWorker.tab");
        }
    };
    const sendSettingsToPage = (aWorker) => {
        const finishedTabProcessingHandler = (aHasConvertedElements) => {
            // console.log("finishedTabProcessingHandler");
            try {
                if (aWorker.tab) {
                    if (!aWorker.tab.customTabObject) {
                        aWorker.tab.customTabObject = new CustomTabObject();
                    }
                    aWorker.tab.customTabObject.isEnabled = anInformationHolder.conversionEnabled;
                    aWorker.tab.customTabObject.workers.push(aWorker);
                    aWorker.tab.customTabObject.hasConvertedElements = aHasConvertedElements;
                }
            }
            catch (err) {
                console.error("finishedTabProcessingHandler: " + err);
            }
        };
        aWorker.port.emit("updateSettings", new ContentScriptParams(aWorker.tab, anInformationHolder));
        aWorker.port.on("finishedTabProcessing", finishedTabProcessingHandler);
    };
    var pageMod;
    const watchForPages = () => {
        // TODO exclude from informationHolder, FF 32
        // FF 34 no urlProvider needed
        pageMod = new PageMod({
            include: "*",
            contentScriptFile: ["./common/dcc-regexes.js",
                "./common/dcc-content.js",
                "./dcc-firefox-content-adapter.js"],
            contentScriptWhen: "ready",
            attachTo: ["existing", "top", "frame"],
            onAttach: sendSettingsToPage
        });
        // Special treatment of resource URLs
        const setTab = (aTab) => {
            if (aTab.url
                && aTab.url.includes("dcc")
                && aTab.url.includes("joint-dot-ax")
                && aTab.url.includes("settings.html")) {
                settingsWorker = aTab.attach({contentScriptFile: ["./common/jquery-2.2.4.min.js", "./common/jquery-ui-1.12.0.min.js", "./common/jquery.ui.touch-punch.js", "./common/dcc-settings.js", "./dcc-firefox-settings-adapter.js"]});
                // console.log("settingsWorker.port.emit showSettings");
                settingsWorker.port.emit("showSettings", new ContentScriptParams(aTab, anInformationHolder));
                settingsWorker.port.on("saveSettings", (aContentScriptParams) => {
                    eventAggregator.publish("saveSettings", {
                        contentScriptParams: aContentScriptParams
                    });
                });
                settingsWorker.port.on("resetSettings", () => {
                    eventAggregator.publish("resetSettings");
                });
            }
            else if (aTab.url
                && aTab.url.includes("dcc")
                && aTab.url.includes("joint-dot-ax")
                && aTab.url.includes("prices.html")) {
                // PageMod does not seem to work on resource URLs
                testPageWorker = aTab.attach({contentScriptFile: ["./common/dcc-regexes.js", "./common/dcc-content.js", "./dcc-firefox-content-adapter.js"]});
                sendSettingsToPage(testPageWorker);
            }
            if (aTab.customTabObject) {
                var i = aTab.customTabObject.workers.length;
                while (i--) {
                    const worker = aTab.customTabObject.workers[i];
                    if (!worker.tab) {
                        // console.log("ready: workers.splice");
                        aTab.customTabObject.workers.splice(i, 1);
                    }
                }
            }
        };
        const activateTab = (aTab) => {
            toggleConversion(anInformationHolder.conversionEnabled);
            // Unused now
            eventAggregator.publish("tabActivated", {
                tab: aTab
            });
        };
        const releaseTab = (aTab) => {
            // console.log("releaseTab");
            if (settingsWorker && settingsWorker.tab) {
                if (settingsWorker.tab.title == aTab.title) {
                    settingsWorker.destroy();
                    settingsWorker = null;
                }
            }
            if (testPageWorker && testPageWorker.tab) {
                if (testPageWorker.tab.title == aTab.title) {
                    testPageWorker.destroy();
                    testPageWorker = null;
                }
            }
            aTab.customTabObject = null;
        };
        //
        tabs.on("ready", setTab);
        // Only sets isEnabled for the tab. Could be used to enable individual tabs
        tabs.on("activate", activateTab);
        // resets customTabObject for the tab, or settingsWorker.tab if it was the settings tab
        tabs.on("close", releaseTab);
    };
    const toggleConversion = (aStatus) => {
        // console.log("aStatus " + aStatus);
        // console.log("toggleConversion");
        if (!tabs.activeTab.customTabObject) {
            tabs.activeTab.customTabObject = new CustomTabObject();
        }
        tabs.activeTab.customTabObject.isEnabled = aStatus;
        anInformationHolder.conversionEnabled = aStatus;
        tabs.activeTab.customTabObject.workers.map(sendEnabledStatus);
        tabs.activeTab.customTabObject.hasConvertedElements = true;
    };
    const showSettingsTab = () => {
        const isOpen = settingsWorker && settingsWorker.tab ;
        if (!isOpen) {
            tabs.open({url: "./settings.html"});
        }
        else {
            settingsWorker.tab.activate();
        }
    };
    const showTestTab = () => {
        const isOpen = testPageWorker && testPageWorker.tab ;
        if (!isOpen) {
            tabs.open({url: "./common/prices.html"});
        }
        else {
            testPageWorker.tab.activate();
        }
    };
    const closeSettingsTab = () => {
        if (settingsWorker && settingsWorker.tab) {
            settingsWorker.tab.close();
        }
    };

    return {
        watchForPages: watchForPages,
        toggleConversion: toggleConversion,
        showSettingsTab: showSettingsTab,
        showTestTab: showTestTab,
        //registerToTabsEvents: registerToTabsEvents,
        closeSettingsTab: closeSettingsTab
    }
};

if (typeof exports === "object") {
    exports.FirefoxContentInterface = FirefoxContentInterface;
}
