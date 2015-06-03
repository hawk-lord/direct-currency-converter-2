EventAggregatorTest = TestCase("EventAggregatorTest");

EventAggregatorTest.prototype.test = () => {
    "use strict";
    const eventName = "EVENT";
    const eventArgs = {test: "DONE"};
    const handler = (args) => {
        console.log(args.test);
        return 0;
    };
    eventAggregator.publish(eventName, eventArgs);
    eventAggregator.subscribe(eventName, handler);
};
