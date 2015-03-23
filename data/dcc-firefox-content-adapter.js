/**
 * Created by per on 14-10-30.
 */

const ContentAdapter = function() {
    self.port.on("sendEnabledStatus", DirectCurrencyContent.onSendEnabledStatus);
    self.port.on("updateSettings", DirectCurrencyContent.onUpdateSettings);
    return {
        finish: (hasConvertedElements) => {
            self.port.emit("finishedTabProcessing", hasConvertedElements);
        }
    }
}();