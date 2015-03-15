/**
 * Firefox browser
 */
const FirefoxFreegeoipServiceProvider = function() {
    "use strict";
    const {Request} = require("sdk/request");
    const eventAggregator = require("./eventAggregator");
    const onComplete = function(aResponse) {
        try {
            const response = JSON.parse(aResponse.text);
            var countryCode;
            if (aResponse.status == "200") {
                countryCode = response.country_code;
            }
            else {
                countryCode = "GB";
            }
            console.log("aResponse.status " + aResponse.status);
            eventAggregator.publish("countryReceived", countryCode);
        }
        catch(err) {
            // console.log("err " + err);
            //informationHolder.setUserCountry("CH");
        }
        // console.log("informationHolder.convertToCountry " + informationHolder.convertToCountry);
        // controller.loadQuotes();
    };
    const findCountry = function (aUrlString, aConvertToCountry) {
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
