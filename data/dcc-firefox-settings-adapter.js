/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const SettingsAdapter = function() {
    "use strict";
    self.port.on("showSettings", DirectCurrencySettings.showSettings);
    return {
        save: (contentScriptParams) => {
            self.port.emit("saveSettings", contentScriptParams);
        },
        reset: () => {
            self.port.emit("resetSettings");
        }
    }
}();