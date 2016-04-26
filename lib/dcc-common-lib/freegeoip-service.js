/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const FreegeoipServiceProvider = function() {
    "use strict";
    const loadUserCountry = function (aGeoService) {
        const urlString = "http://freegeoip.net/json/";
        aGeoService.findCountry(urlString);
    };
    return {
        loadUserCountry: loadUserCountry
    };
};

if (typeof exports === "object") {
    exports.FreegeoipServiceProvider = FreegeoipServiceProvider;
}
