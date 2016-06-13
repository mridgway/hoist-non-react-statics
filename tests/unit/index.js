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

    it('should not hoist custom statics', function () {
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

        hoistNonReactStatics(Wrapper, Component, {foo: true});
        expect(Wrapper.foo).to.be.undefined;
    });

    it('should not hoist statics from strings', function() {
        var Component = 'input';
        var Wrapper = React.createClass({
            render: function() {
                return <Component />;
            }
        });

        hoistNonReactStatics(Wrapper, Component);
        expect(Wrapper[0]).to.equal(undefined); // if hoisting it would equal 'i'
    });

});
