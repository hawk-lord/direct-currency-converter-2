/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const FirefoxContentInterface = function(anInformationHolder) {
    "use strict";
    const {PageMod} = require("sdk/page-mod");
    const {ContentScriptParams} = require("./dcc-common-lib/contentScriptParams");
    const tabs = require("sdk/tabs");
    const eventAggregator = require("./dcc-common-lib/eventAggregator");
    let settingsWorker = null;
    let testPageWorker = null;
    const CustomTabObject = function() {
        "use strict";
        this.enabled = false;
        this.hasConvertedElements = false;
        this.workers = [];
    };
    const sendEnabledStatus = (aWorker) => {
        console.log("sendEnabledStatus aWorker.tab " + aWorker.tab);
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
                console.error("sendEnabledStatus: " + err);
            }
        }
        else {
            console.error("!aWorker.tab");
        }
    };
    const sendSettingsToPage = (aWorker) => {
        const finishedTabProcessingHandler = (aHasConvertedElements) => {
            console.log("finishedTabProcessingHandler");
            try {
                if (!aWorker.tab.customTabObject) {
                    aWorker.tab.customTabObject = new CustomTabObject();
                }
                aWorker.tab.customTabObject.isEnabled = anInformationHolder.conversionEnabled;
                aWorker.tab.customTabObject.workers.push(aWorker);
                aWorker.tab.customTabObject.hasConvertedElements = aHasConvertedElements;
            }
            catch (err) {
                console.error("finishedTabProcessingHandler: " + err);
            }
        };
        aWorker.port.emit("updateSettings", new ContentScriptParams(aWorker.tab, anInformationHolder));
        aWorker.port.on("finishedTabProcessing", finishedTabProcessingHandler);
    };
    let pageMod;
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
            if (aTab.url === "resource://dcc-at-joint-dot-ax/direct-currency-converter-2/data/settings.html") {
                settingsWorker = aTab.attach({contentScriptFile: ["./common/jquery-2.1.3.min.js", "./common/jquery-ui-1.11.2.min.js", "./common/dcc-settings.js", "./dcc-firefox-settings-adapter.js"]});
                console.log("settingsWorker.port.emit showSettings");
                settingsWorker.port.emit("showSettings", new ContentScriptParams(aTab, anInformationHolder));
                settingsWorker.port.on("saveSettings", (aContentScriptParams) => {
                    eventAggregator.publish("saveSettings", {
                        contentScriptParams: aContentScriptParams
                    });
                });
                settingsWorker.port.on("resetSettings", () => {
                    eventAggregator.publish("resetSettings");
                });
                settingsWorker.settingsTab = aTab;
            }
            else if (aTab.url === "resource://dcc-at-joint-dot-ax/direct-currency-converter-2/data/common/prices.html") {
                // PageMod does not seem to work on resource URLs
                testPageWorker = aTab.attach({contentScriptFile: ["./common/dcc-regexes.js", "./common/dcc-content.js", "./dcc-firefox-content-adapter.js"]});
                sendSettingsToPage(testPageWorker);
            }
            if (aTab.customTabObject) {
                let i = aTab.customTabObject.workers.length;
                while (i--) {
                    const worker = aTab.customTabObject.workers[i];
                    if (!worker.tab) {
                        console.log("ready: workers.splice");
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
            if (settingsWorker && settingsWorker.settingsTab) {
                if (settingsWorker.settingsTab.title == aTab.title) {
                    settingsWorker.settingsTab = null;
                }
                else {
                    aTab.customTabObject = null;
                }
            }
            else {
                aTab.customTabObject = null;
            }
        };
        //
        tabs.on("ready", setTab);
        // Only sets isEnabled for the tab. Could be used to enable individual tabs
        tabs.on("activate", activateTab);
        // resets customTabObject for the tab, or settingsWorker.settingsTab if it was the settings tab
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
        const isOpen = settingsWorker && settingsWorker.settingsTab ;
        if (!isOpen) {
            tabs.open({url: "./settings.html"});
        }
        else {
            settingsWorker.settingsTab.activate();
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
/*
    const registerToTabsEvents = () => {
        // Special treatment of resource URLs
        const setTab = (aTab) => {
            if (aTab.url === "resource://dcc-at-joint-dot-ax/direct-currency-converter-2/data/settings.html") {
                settingsWorker = aTab.attach({contentScriptFile: ["./common/jquery-2.1.3.min.js", "./common/jquery-ui-1.11.2.min.js", "./common/dcc-settings.js", "./dcc-firefox-settings-adapter.js"]});
                console.log("settingsWorker.port.emit showSettings");
                settingsWorker.port.emit("showSettings", new ContentScriptParams(aTab, anInformationHolder));
                settingsWorker.port.on("saveSettings", (aContentScriptParams) => {
                    eventAggregator.publish("saveSettings", {
                        contentScriptParams: aContentScriptParams
                    });
                });
                settingsWorker.port.on("resetSettings", () => {
                    eventAggregator.publish("resetSettings");
                });
                settingsWorker.settingsTab = aTab;
            }
            else if (aTab.url === "resource://dcc-at-joint-dot-ax/direct-currency-converter-2/data/common/prices.html") {
                // PageMod does not seem to work on resource URLs
                testPageWorker = aTab.attach({contentScriptFile: ["./common/dcc-regexes.js", "./common/dcc-content.js", "./dcc-firefox-content-adapter.js"]});
                sendSettingsToPage(testPageWorker);
            }
            if (aTab.customTabObject) {
                let i = aTab.customTabObject.workers.length;
                while (i--) {
                    const worker = aTab.customTabObject.workers[i];
                    if (!worker.tab) {
                        console.log("ready: workers.splice");
                        aTab.customTabObject.workers.splice(i, 1);
                    }
                }
            }
        };
        const activateTab = (aTab) => {
            if (aTab.customTabObject) {
                aTab.customTabObject.isEnabled = anInformationHolder.conversionEnabled;
            }
            // Unused now
            eventAggregator.publish("tabActivated", {
                tab: aTab
            });
        };
        const releaseTab = (aTab) => {
            if (settingsWorker && settingsWorker.settingsTab) {
                if (settingsWorker.settingsTab.title == aTab.title) {
                    settingsWorker.settingsTab = null;
                }
                else {
                    aTab.customTabObject = null;
                }
            }
            else {
                aTab.customTabObject = null;
            }
        };
        //
        tabs.on("ready", setTab);
        // Only sets isEnabled for the tab. Could be used to enable individual tabs
        tabs.on("activate", activateTab);
        // resets customTabObject for the tab, or settingsWorker.settingsTab if it was the settings tab
        tabs.on("close", releaseTab);
    };
*/
    const closeSettingsTab = () => {
        if (settingsWorker && settingsWorker.settingsTab) {
            settingsWorker.settingsTab.close();
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