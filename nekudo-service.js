/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const NekudoServiceProvider = function() {
    "use strict";
    const loadUserCountry = function (aGeoService) {
        const urlString = "http://geoip.nekudo.com/api";
        aGeoService.findCountry(urlString);
    };
    return {
        loadUserCountry: loadUserCountry
    };
};

if (typeof exports === "object") {
    exports.NekudoServiceProvider = NekudoServiceProvider;
}
