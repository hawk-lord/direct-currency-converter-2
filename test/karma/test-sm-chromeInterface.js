/**
 * Created by per on 2015-09-10.
 */

const _ = function() {
    "use strict";
};


const createdButton = function() {
    "use strict";
};
createdButton.setAttribute = function() {
    "use strict";
};

const button = function() {
    "use strict";
};
button.createButton = function() {
    "use strict";
    return createdButton;
};


const windowUtils = function() {
    "use strict";
};
windowUtils.getMostRecentBrowserWindow = function() { return {} };

const urlProvider = function() {
    "use strict";
};
urlProvider.getUrl = function() {};

describe("AndroidChromeInterface", function() {
    "use strict";
    describe("#new", function() {
        it("new", function () {
                const chromeInterface = new AndroidChromeInterface(_, eventAggregator, MockInformationHolder, button, windowUtils, urlProvider);
        });
    });
    describe("#enabled", function() {
        const enabled = true;
        it("enabled", function () {
            const chromeInterface = new AndroidChromeInterface(_, eventAggregator, MockInformationHolder, button, windowUtils, urlProvider);
            chromeInterface.setConversionButtonState(enabled);
        });
    });
    describe("#toolsButtonText", function() {
        const toolsButtonText = "DCC";
        it("toolsButtonText", function () {
            const chromeInterface = new AndroidChromeInterface(_, eventAggregator, MockInformationHolder, button, windowUtils, urlProvider);
            chromeInterface.setToolsButtonText(toolsButtonText);
        });
    });
});
