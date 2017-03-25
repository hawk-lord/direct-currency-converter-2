/**
 * TODO use new EventAggregator()?
 */
describe("eventAggregator", () => {
    "use strict";
    it("should not fail", () => {
        let called = false;
        const eventName = "message";
        const eventArgs = { foo : "bar" };
        const callback = (data) => {
                called = (data === eventArgs);
            };
        eventAggregator.subscribe(eventName, callback);
        eventAggregator.publish(eventName, eventArgs);
        assert(called);
    });
});

