/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
const FirefoxYahooQuotesServiceProvider = function() {
    "use strict";
    const {Request} = require("sdk/request");
    const eventAggregator = require("./dcc-common-lib/eventAggregator");
    const onCompleteFromTo = (aResponse) => {
        try {
            // console.log("onCompleteFromTo aResponse " + aResponse.status);
            if (aResponse.status === 200) {
                eventAggregator.publish("quotesFromTo", aResponse.text);
            }
            else {
                console.error("onCompleteFromTo aResponse.status " + aResponse.status);
            }
        }
        catch(err) {
            console.error("err " + err);
        }
    };
    const onCompleteToFrom = (aResponse) => {
        try {
            // console.log("onCompleteToFrom aResponse " + aResponse.status);
            if (aResponse.status === 200) {
                eventAggregator.publish("quotesToFrom", aResponse.text);
            }
            else {
                console.error("onCompleteToFrom aResponse.status " + aResponse.status);
            }
        }
        catch(err) {
            console.error("err " + err);
        }
    };
    const fetchQuotesFromTo = (aUrlString) =>  {
        // console.log("fetchQuotesFromTo ");
        const urlString = aUrlString;
        const request = new Request({
            url: urlString,
            onComplete: onCompleteFromTo
        });
        request.get();
    };
    const fetchQuotesToFrom = (aUrlString) =>  {
        // console.log("fetchQuotesToFrom ");
        const urlString = aUrlString;
        const request = new Request({
            url: urlString,
            onComplete: onCompleteToFrom
        });
        request.get();
    };
    return {
        fetchQuotesFromTo: fetchQuotesFromTo,
        fetchQuotesToFrom: fetchQuotesToFrom
    };
};

if (typeof exports === "object") {
    exports.FirefoxYahooQuotesServiceProvider = FirefoxYahooQuotesServiceProvider;
}