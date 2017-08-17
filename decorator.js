/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';

var hoistNonReactStatics = require('./index');

module.exports = function hoistNonReactStaticsFrom(sourceComponent) {
  return function(targetComponent) {
    return hoistNonReactStatics(targetComponent, sourceComponent);
  }
};
