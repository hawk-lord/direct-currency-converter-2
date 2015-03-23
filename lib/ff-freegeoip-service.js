/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Module pattern is used.
 */
const FirefoxFreegeoipServiceProvider = function() {
    "use strict";
    const {Request} = require("sdk/request");
    const eventAggregator = require("./eventAggregator");
    const onComplete = (aResponse) => {
        try {
            const responseText = JSON.parse(aResponse.text);
            var countryCode;
            if (aResponse.status == "200") {
                countryCode = responseText.country_code;
            }
            else {
                countryCode = "GB";
            }
            // console.log("aResponse.status " + aResponse.status);
            eventAggregator.publish("countryReceived", countryCode);
        }
        catch(err) {
            console.error("err " + err);
            eventAggregator.publish("countryReceived", "CH");
        }
    };
    const findCountry = (aUrlString, aConvertToCountry) =>  {
        const urlString = aUrlString;
        var userCountry = aConvertToCountry;
        const request = Request({
            url: urlString,
            onComplete: onComplete
        });
        if (aConvertToCountry === null || aConvertToCountry == null) {
            request.get();
        }
    };
    return {
        findCountry: findCountry
    };
};

exports.FirefoxFreegeoipServiceProvider = FirefoxFreegeoipServiceProvider;
