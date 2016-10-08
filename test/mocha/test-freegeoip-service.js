const FreegeoipServiceProvider = require("../../lib/dcc-common-lib/freegeoip-service").FreegeoipServiceProvider;
// Chai installed locally, npm install chai --save-dev
const assert = require("chai").assert;

describe("FreegeoipServiceProviderTest", function() {
    "use strict";
    var findCountryCalled = false;
    const MockGeoService = function() {};
    MockGeoService.prototype.findCountry = () => {
        findCountryCalled = true;
    };
    const geoService = new MockGeoService();
    describe("#loadUserCountry", function() {
        const freegeoipServiceProvider = new FreegeoipServiceProvider();
        it("should not fail", function () {
            freegeoipServiceProvider.loadUserCountry(geoService);
            assert.isTrue(findCountryCalled);
        });
    })
});

