/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const FirefoxNekudoServiceProvider = function(Request, eventAggregator) {
    "use strict";
    const onComplete = (aResponse) => {
        try {
            const responseText = JSON.parse(aResponse.text);
            var countryCode;
            if (aResponse.status === 200) {
                countryCode = responseText.country.code;
            }
            else {
                countryCode = "";
            }
            // console.log("countryReceived aResponse.status " + aResponse.status);
            eventAggregator.publish("countryReceivedNekudo", countryCode);
        }
        catch(err) {
            console.error("err " + err);
            eventAggregator.publish("countryReceivedNekudo", "");
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
    exports.FirefoxNekudoServiceProvider = FirefoxNekudoServiceProvider;
}