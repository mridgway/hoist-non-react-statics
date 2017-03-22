/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';

var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true,
    type: true
},

    KNOWN_STATICS = {
        name: true,
        length: true,
        prototype: true,
        caller: true,
        arguments: true,
        arity: true
    },

    isGetOwnPropertySymbolsAvailable = typeof Object.getOwnPropertySymbols === 'function';

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, customStatics, onlyOwnedEnum) {

    var idx = 0, keys, len, key;

    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
        keys = (onlyOwnedEnum) ? Object.keys(sourceComponent) : Object.getOwnPropertyNames(sourceComponent);

        /* istanbul ignore else */
        if (!onlyOwnedEnum && isGetOwnPropertySymbolsAvailable) {
            keys = keys.concat(Object.getOwnPropertySymbols(sourceComponent));
        }

        for (len = keys.length; idx < len; ++idx) {
            key = keys[idx];

            if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!customStatics || !customStatics[key])) {
                try {
                    targetComponent[key] = sourceComponent[key];
                } catch (error) {

                }
            }
        }
    }

    return targetComponent;
};
