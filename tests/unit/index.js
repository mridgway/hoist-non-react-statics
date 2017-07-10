/*globals describe,it,beforeEach */
"use strict";

var expect = require('chai').expect;
var React = require('react');
var createReactClass = require('create-react-class');
var hoistNonReactStatics = require('../../index');

describe('hoist-non-react-statics', function () {

    it('should hoist non react statics', function () {
        var Component = createReactClass({
            displayName: 'Foo',
            statics: {
                foo: 'bar'
            },
            render: function () {
                return null;
            }
        });

        var Wrapper = createReactClass({
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
        var Component = createReactClass({
            displayName: 'Foo',
            statics: {
                foo: 'bar'
            },
            render: function () {
                return null;
            }
        });

        var Wrapper = createReactClass({
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
        var Wrapper = createReactClass({
            render: function() {
                return <Component />;
            }
        });

        hoistNonReactStatics(Wrapper, Component);
        expect(Wrapper[0]).to.equal(undefined); // if hoisting it would equal 'i'
    });

    it('should hoist symbols', function() {
        var foo = Symbol('foo');

        var Component = createReactClass({
            render: function() {
                return null;
            }
        });

        // Manually set static property using Symbol
        // since createReactClass doesn't handle symbols passed to static
        Component[foo] = 'bar';

        var Wrapper = createReactClass({
            render: function() {
                return <Component />;
            }
        });

        hoistNonReactStatics(Wrapper, Component);

        expect(Wrapper[foo]).to.equal('bar');
    });

    it('should hoist class statics', function() {
        class Component extends React.Component {
            static foo = 'bar';
            static test() {

            }
        }

        var Wrapper = createReactClass({
            render: function() {
                return <Component />;
            }
        });

        hoistNonReactStatics(Wrapper, Component);

        expect(Wrapper.foo).to.equal(Component.foo);
        expect(Wrapper.test).to.equal(Component.test);
    });

    it('should inherit class properties', () => {
        class A extends React.Component {
            static test3 = 'A';
            static test4 = 'D';
            test5 = 'foo';
        }
        class B extends A {
            static test2 = 'B';
            static test4 = 'DD';
        }
        class C {
            static test1 = 'C';
        }
        const D = hoistNonReactStatics(C, B);


        expect(D.test1).to.equal('C');
        expect(D.test2).to.equal('B');
        expect(D.test3).to.equal('A');
        expect(D.test4).to.equal('DD');
        expect(D.test5).to.equal(undefined);
    });

});
