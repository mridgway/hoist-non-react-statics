/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';

var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true
};

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent) {
    var keys = Object.keys(sourceComponent);
    for (var i=0; i<keys.length; ++i) {
        if (!REACT_STATICS[keys[i]]) {
            targetComponent[keys[i]] = sourceComponent[keys[i]];
        }
    }

    return targetComponent;
};
