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

    it('should not overwrite target keys', function () {
        var Component,
            Wrapper;

        Component = React.createClass({
            statics: {
                bar: 'Bar',
                foo: 'Overwrite'
            },
            render: function () {
                return null;
            }
        });

        Wrapper = React.createClass({
            statics: {
                foo: 'Foo'
            },
            render: function () {
                return null;
            }
        });

        hoistNonReactStatics(Wrapper, Component);

        expect(Wrapper.bar).to.equal('Bar');
        expect(Wrapper.foo).to.equal('Foo');
    });

});
