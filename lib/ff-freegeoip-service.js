/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const FirefoxFreegeoipServiceProvider = function() {
    "use strict";
    const {Request} = require("sdk/request");
    const eventAggregator = require("./dcc-common-lib/eventAggregator");
    const onComplete = (aResponse) => {
        try {
            const responseText = JSON.parse(aResponse.text);
            let countryCode;
            if (aResponse.status === 200) {
                countryCode = responseText.country_code;
            }
            else {
                countryCode = "GB";
            }
            // console.log("countryReceived aResponse.status " + aResponse.status);
            eventAggregator.publish("countryReceived", countryCode);
        }
        catch(err) {
            console.error("err " + err);
            eventAggregator.publish("countryReceived", "CH");
        }
    };
    const findCountry = (aUrlString) =>  {
        const request = Request({
            url: aUrlString,
            onComplete: onComplete
        });
        request.get();
    };
    return {
        findCountry: findCountry
    };
};

exports.FirefoxFreegeoipServiceProvider = FirefoxFreegeoipServiceProvider;
