/**
 * Any browser
 */
const FreegeoipServiceProvider = function() {
    "use strict";
    const loadUserCountry = function (aGeoService, aConvertToCountry) {
        const urlString = "http://freegeoip.net/json/";
        var userCountry = aConvertToCountry;
        aGeoService.findCountry(urlString, userCountry);
    };
    return {
        loadUserCountry: loadUserCountry
    };
};

if (typeof exports === "object") {
    console.log("typeof require === object");
    exports.FreegeoipServiceProvider = FreegeoipServiceProvider;
}
