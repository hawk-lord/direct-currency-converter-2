/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const ContentAdapter = function() {
    "use strict";
    self.port.on("sendEnabledStatus", DirectCurrencyContent.onSendEnabledStatus);
    self.port.on("updateSettings", DirectCurrencyContent.onUpdateSettings);
    return {
        finish: (hasConvertedElements) => {
            self.port.emit("finishedTabProcessing", hasConvertedElements);
        }
    }
}();