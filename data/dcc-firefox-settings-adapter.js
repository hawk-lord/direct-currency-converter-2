/**
 * Created by per on 14-10-30.
 */

const SettingsAdapter = function() {
    self.port.on("showSettings", DirectCurrencySettings.showSettings);
    return {
        save: function (contentScriptParams) {
            self.port.emit("saveSettings", contentScriptParams);
        },
        reset: function () {
            self.port.emit("resetSettings");
        }
    }
}();