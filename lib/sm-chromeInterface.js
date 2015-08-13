/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const SmChromeInterface = function(anInformationHolder) {
    "use strict";
    const _ = require("sdk/l10n").get;
    const eventAggregator = require("./dcc-common-lib/eventAggregator");
    const onToolsButtonChange = (anEvent) => {
        eventAggregator.publish("showSettingsTab");
    };
    const onConversionButtonClick = (anEvent) => {
        anEvent.target.checked != anEvent.target.checked;
        eventAggregator.publish("toggleConversion", anEvent.target.checked);
    };
    const button = require("./button");
    const windowUtils = require("sdk/window/utils");
    const win = windowUtils.getMostRecentBrowserWindow();
    const urlProvider = require("./urlProvider");

    const toolsButton = button.createButton(eventAggregator, win, {
        panel: null,
        //onCommand: showSettingsTab,
        onCommand: onToolsButtonChange,
        id: "dcc-tools-button",
        label: "DCC",
        tooltiptext: _("Open settings"),
        show: anInformationHolder.showDccToolsButton,
        image: urlProvider.getUrl("images/1402782691_repair_cost.png")
    });

    const conversionButton = button.createButton(eventAggregator, win, {
        panel: null,
        // onCommand: toggle,
        onCommand: onConversionButtonClick,
        id: "dcc-conversion-button",
        label:  "DCC",
        tooltiptext: _("Toggle currency conversion"),
        show: anInformationHolder.showDccConversionButton,
        image: urlProvider.getUrl("images/1402781551_currency_exchange_1.png")
    });

    return {
        setConversionButtonState: (anEnabled) => {
            conversionButton.checked = anEnabled;
        },
        setToolsButtonText: (aQuoteString) => {
            toolsButton.setAttribute("tooltiptext", _("Open settings") + "\n" + aQuoteString);

        }
    }
};

if (typeof exports === "object") {
    exports.SmChromeInterface = SmChromeInterface;
}
