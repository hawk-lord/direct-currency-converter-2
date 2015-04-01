/**
 * Created by per on 14-10-30.
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