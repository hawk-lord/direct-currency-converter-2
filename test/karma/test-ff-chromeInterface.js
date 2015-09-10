/**
 * Created by per on 2015-09-10.
 */

const _ = function() {
    "use strict";

};

const MockPanel = function() {
    "use strict";
};
MockPanel.prototype.port = {};
MockPanel.prototype.port.on = function() {};

const ToggleButton = function() {
    "use strict";

};

describe("FirefoxChromeInterface", function() {
    "use strict";
    describe("#new", function() {
        it("new", function () {
            const firefoxChromeInterface = new FirefoxChromeInterface(_, MockPanel, ToggleButton, eventAggregator);
        });
    });
});
