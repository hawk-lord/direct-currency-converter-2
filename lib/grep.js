/**
 * From jQuery
 *
 * @param elems
 * @param callback
 * @param inv
 * @returns {Array}
 */
exports.grep = function grep( elems, callback, inv ) {
        var retVal,
            ret = [],
            i = 0,
            length = elems.length;
        inv = !!inv;
        // Go through the array, only saving the items
        // that pass the validator function
        for ( ; i < length; i++ ) {
            retVal = !!callback( elems[ i ], i );
            if ( inv !== retVal ) {
                ret.push( elems[ i ] );
            }
        }
        return ret;
   };

