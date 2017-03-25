/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const AndroidChromeInterface = function(_, eventAggregator, windowUtils) {
    // FIXME remove when uninstall or upgrade
    const window = windowUtils.getMostRecentBrowserWindow();
    try {

        const dccMainMenuLabel = "DCC";
        const dccMainMenuIcon = null;
        const dccMainMenuMenuId = window.NativeWindow.menu.add({
            name: dccMainMenuLabel
        });


        const openSettingsLabel = _("Open settings");
        const openSettingsIcon = null;
        const onToolsButtonChange = () => {
            eventAggregator.publish("showSettingsTab");
        };
        const openSettingsMenuId = window.NativeWindow.menu.add({
            name: openSettingsLabel,
            icon: openSettingsIcon,
            callback: onToolsButtonChange,
            parent: dccMainMenuMenuId
        });

        const toggleLabel = _("Toggle currency conversion");
        const toggleIcon = null;
        // TODO get state from program state
        let state = true;
        const onConversionButtonClick = () => {
            state = !state;
            eventAggregator.publish("toggleConversion", state);
        };
        const toggleMenuId = window.NativeWindow.menu.add({
            name: toggleLabel,
            icon: toggleIcon,
            callback: onConversionButtonClick,
            parent: dccMainMenuMenuId
        });

        const openTestPageLabel = _("Open test page");
        const openTestPageIcon = null;
        const openTestPage = () => {
            const tabs = require("sdk/tabs");
            tabs.open({
                url: "./common/prices.html"
            });
        };
        const openTestPageMenuId = window.NativeWindow.menu.add({
            name: openTestPageLabel,
            icon: openTestPageIcon,
            callback: openTestPage,
            parent: dccMainMenuMenuId
        });

        const openQuotesPageLabel = _("Open quotes page");
        const openQuotesPageIcon = null;
        const openQuotesPage = () => {
            const tabs = require("sdk/tabs");
            tabs.open({
                url: "./common/quotes.html"
            });
        };
        const openQuotesPageMenuId = window.NativeWindow.menu.add({
            name: openQuotesPageLabel,
            icon: openQuotesPageIcon,
            callback: openQuotesPage,
            parent: dccMainMenuMenuId
        });



    }
    catch(err) {
        console.error(err);
        window.alert(err);
    }
    return {
        setConversionButtonState: (anEnabled) => {
            //conversionButton.checked = anEnabled;
        },
        setToolsButtonText: (aQuoteString) => {
            // toolsButton.label = _("Open settings") + "\n" + aQuoteString;
        }
    }


};

if (typeof exports === "object") {
    exports.AndroidChromeInterface = AndroidChromeInterface;
}
