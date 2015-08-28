FreegeoipServiceProviderTest = TestCase("FreegeoipServiceProviderTest");

FreegeoipServiceProviderTest.prototype.test = () => {
    "use strict";
    const GeoService = function() {};
    GeoService.prototype.findCountry = () => {

    };
    const geoService = new GeoService();
    const freegeoipServiceProvider = new FreegeoipServiceProvider();
    freegeoipServiceProvider.loadUserCountry(geoService);
};

