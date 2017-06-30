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
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var defineProperty = Object.defineProperty;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = getPrototypeOf && getPrototypeOf(Object);

function copyProperty(targetComponent, sourceComponent, key) {
    try { // Avoid failures from read-only properties
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
        defineProperty(targetComponent, key, descriptor);
    } catch (e) {}
}

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
                    copyProperty(targetComponent, sourceComponent, key);
                }
            }
        }

        if (getOwnPropertySymbols) {
            var symbols = getOwnPropertySymbols(sourceComponent);
            for (var i = 0; i < symbols.length; i++) {
                if (!REACT_STATICS[symbols[i]] && (!blacklist || !blacklist[symbols[i]])) {
                    if (propIsEnumerable.call(sourceComponent, symbols[i])) {
                        copyProperty(targetComponent, sourceComponent, symbols[i]);
                    }
                }
            }
        }

        return targetComponent;
    }

    return targetComponent;
};
