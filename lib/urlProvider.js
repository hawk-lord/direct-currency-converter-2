/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Based on code from Simple Currency Converter
 * https://addons.mozilla.org/addon/simple-currency-converter/
 *
 * Moved into its own file for no special reason.
 */
// Stereotype Service provider
var UrlProvider = (function() {
    const {data} = require("sdk/self");
    return {
        getUrl : function(aUrl) {
            return data.url(aUrl);
        }
    };
}());
//
exports.getUrl = UrlProvider.getUrl;
