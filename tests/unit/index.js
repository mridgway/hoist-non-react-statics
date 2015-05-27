/*globals describe,it,beforeEach */
"use strict";

var expect = require('chai').expect;
var React = require('react');
var hoistNonReactStatics = require('../../index');

describe('hoist-non-react-statics', function () {

    it('should hoist non react statics', function () {
        var Component = React.createClass({
            displayName: 'Foo',
            statics: {
                foo: 'bar'
            },
            render: function () {
                return null;
            }
        });

        var Wrapper = React.createClass({
            displayName: 'Bar',
            render: function () {
                return <Component />;
            }
        });

        hoistNonReactStatics(Wrapper, Component);

        expect(Wrapper.displayName).to.equal('Bar');
        expect(Wrapper.foo).to.equal('bar');
    });

});
