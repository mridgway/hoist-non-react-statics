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
};

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = getPrototypeOf && getPrototypeOf(Object);

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components

        if (objectPrototype) {
            var inheritedComponent = getPrototypeOf(sourceComponent);
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
                hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
            }
        }

        for (var key in sourceComponent) {
            if (!REACT_STATICS[key] && (!blacklist || !blacklist[key])) {
                if (hasOwnProperty.call(sourceComponent, key)) {
                    try { // Avoid failures from read-only properties
                        targetComponent[key] = sourceComponent[key];
                    } catch (e) {}
                }
            }
        }

        if (getOwnPropertySymbols) {
            var symbols = getOwnPropertySymbols(sourceComponent);
            for (var i = 0; i < symbols.length; i++) {
                if (!REACT_STATICS[symbols[i]] && (!blacklist || !blacklist[symbols[i]])) {
                    if (propIsEnumerable.call(sourceComponent, symbols[i])) {
                        try { // Avoid failures from read-only properties
                            targetComponent[symbols[i]] = sourceComponent[symbols[i]];
                        } catch(e) {}
                    }
                }
            }
        }

        return targetComponent;
    }

    return targetComponent;
};
