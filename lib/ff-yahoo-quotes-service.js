/*
 * © 2014-2015 Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Module pattern is used.
 */
const FirefoxYahooQuotesServiceProvider = function() {
    "use strict";
    const {Request} = require("sdk/request");
    const eventAggregator = require("./eventAggregator");
    const onCompleteFromTo = (aResponse) => {
        try {
            // console.log("onCompleteFromTo aResponse " + aResponse.status);
            eventAggregator.publish("quotesFromTo", aResponse);
        }
        catch(err) {
            console.log("err " + err);
        }
    };
    const onCompleteToFrom = (aResponse) => {
        try {
            console.log("onCompleteToFrom aResponse " + aResponse.status);
            eventAggregator.publish("quotesToFrom", aResponse);
        }
        catch(err) {
            console.log("err " + err);
        }
    };
    const fetchQuotesFromTo = (aUrlString) =>  {
        const urlString = aUrlString;
        const request = Request({
            url: urlString,
            onComplete: onCompleteFromTo
        });
        request.get();
    };
    const fetchQuotesToFrom = (aUrlString) =>  {
        const urlString = aUrlString;
        const request = Request({
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

exports.FirefoxYahooQuotesServiceProvider = FirefoxYahooQuotesServiceProvider;
