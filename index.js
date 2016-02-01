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

var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    arguments: true,
    arity: true
};

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent) {
    var sourceKeys = Object.getOwnPropertyNames(sourceComponent),
        targetKeys = Object.getOwnPropertyNames(targetComponent);
    for (var i=0; i<sourceKeys.length; ++i) {
        if (!REACT_STATICS[sourceKeys[i]] && !KNOWN_STATICS[sourceKeys[i]] && targetKeys.indexOf(sourceKeys[i]) === -1) {
            targetComponent[sourceKeys[i]] = sourceComponent[sourceKeys[i]];
        }
    }

    return targetComponent;
};
