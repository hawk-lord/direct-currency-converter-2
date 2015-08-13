/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const SmChromeInterface = function(anInformationHolder) {
    "use strict";
    const _ = require("sdk/l10n").get;
/*
    const {Panel} = require("sdk/panel");
    const {ToggleButton} = require("sdk/ui");
*/
    const eventAggregator = require("./dcc-common-lib/eventAggregator");
/*
    const onHideToolsPanel = () => {
        toolsButton.state('window', {checked: false});
    };
    const toolsPanel = Panel({
        width: 400,
        height: 200,
        contentURL: "./panel.html",
        contentStyleFile: "./panel-style.css",
        onHide: onHideToolsPanel
    });
    toolsPanel.port.on("showSettingsTab", () => {
        eventAggregator.publish("showSettingsTab");
        toolsPanel.hide();
    });
    toolsPanel.port.on("showTestTab", () => {
        eventAggregator.publish("showTestTab");
        toolsPanel.hide();
    });
    const toolsIcon = {
        "16": "./images/1402782691_repair_cost.png",
        "32": "./images/1402782677_repair_cost.png",
        "64": "./images/1402782661_repair_cost.png"
    };
    */
    const onToolsButtonChange = (anEvent) => {
        eventAggregator.publish("showSettingsTab");
    };
    /*
    const toolsButton = ToggleButton({
        checked: false,
        id: "dcc-tools-button",
        label: _("Open settings"),
        icon: toolsIcon,
        onChange: onToolsButtonChange
    });
    const conversionIcon = {
        "16": "./images/1402781551_currency_exchange_1.png",
        "32": "./images/1402781537_currency_exchange_1.png",
        "64": "./images/1402781517_currency_exchange_1.png"
    };
    */
    const onConversionButtonClick = (anEvent) => {
        anEvent.target.checked != anEvent.target.checked;
        eventAggregator.publish("toggleConversion", anEvent.target.checked);
    };
    /*
    const conversionButton = ToggleButton({
        checked: false,
        id: "dcc-conversion-button",
        label: _("Toggle currency conversion"),
        icon: conversionIcon,
        onClick: onConversionButtonClick
    });
*/
    const button = require("./button");
    const windowUtils = require("sdk/window/utils");
    const win = windowUtils.getMostRecentBrowserWindow();
    const urlProvider = require("./urlProvider");

    // toolsButton
    // id="toggle-button--dccjointax-dcc-tools-button"
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
    // conversionButton
    // id="toggle-button--dccjointax-dcc-conversion-button"
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
