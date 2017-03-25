/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const FirefoxFreegeoipServiceProvider = function(Request, eventAggregator) {
    const onComplete = (aResponse) => {
        try {
            const responseText = JSON.parse(aResponse.text);
            let countryCode;
            if (aResponse.status === 200) {
                countryCode = responseText.country_code;
            }
            else {
                countryCode = "";
            }
            eventAggregator.publish("countryReceivedFreegeoip", countryCode);
        }
        catch(err) {
            console.error("err " + err);
            eventAggregator.publish("countryReceivedFreegeoip", "");
        }
    };
    const findCountry = (aUrlString) =>  {
        const request = new Request({
            url: aUrlString,
            onComplete: onComplete
        });
        request.get();
    };
    return {
        findCountry: findCountry
    };
};

if (typeof exports === "object") {
    exports.FirefoxFreegeoipServiceProvider = FirefoxFreegeoipServiceProvider;
}