const FreegeoipServiceProvider = require("../../lib/dcc-common-lib/freegeoip-service").FreegeoipServiceProvider;
const assert = require("assert");


describe("FreegeoipServiceProvider", function() {
    "use strict";
    const GeoService = function() {};
    GeoService.prototype.findCountry = () => {

    };
    const geoService = new GeoService();
    describe("#new", function() {
        const freegeoipServiceProvider = new FreegeoipServiceProvider();
        it("test", function () {
            freegeoipServiceProvider.loadUserCountry(geoService);
        });
    })
});

