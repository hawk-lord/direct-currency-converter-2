const eventAggregator = require("../../lib/dcc-common-lib/eventAggregator");
const assert = require("assert");


describe("eventAggregator", function() {
    "use strict";
    const eventName = "EVENT";
    const eventArgs = {test: "DONE"};
    const handler = (args) => {
        console.log(args.test);
        return 0;
    };
    describe("#publish()", function() {
        it("test", function () {
            eventAggregator.publish(eventName, eventArgs);
        });
    });
    describe("#subscribe()", function() {
        it("test", function () {
            eventAggregator.subscribe(eventName, handler);
        });
    })
});

