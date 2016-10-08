/**
 * Created by per on 2015-09-10.
 */


const MockRequest = function(urlString, fn) {
    "use strict";
};
MockRequest.prototype.get = function() {};


describe("FirefoxFreegeoipServiceProviderTest", function() {
    "use strict";
    describe("#new", function() {
        it("should not fail", function () {
            const freegeoipServiceProvider = new FirefoxFreegeoipServiceProvider(MockRequest, eventAggregator);
        });
    });
    describe("#findCountry", function() {
        it("should not fail", function () {
            const urlString = "";
            const freegeoipServiceProvider = new FirefoxFreegeoipServiceProvider(MockRequest, eventAggregator);
            freegeoipServiceProvider.findCountry(urlString);
        });
    })
});

