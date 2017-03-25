/*
 * © Per Johansson
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict";

const Localisation = function() {

    /**
     * Returns a localised String from /locale/xx.properties
     * @type {*|get|Function|accessor|currentFlavors|{value}}
     * @private
     */
    const _ = require("sdk/l10n").get;
    return {
        _ : _
    }
};

if (typeof exports === "object") {
    exports.Localisation = Localisation;
}
