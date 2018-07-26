/*globals describe,it,beforeEach */
"use strict";

var expect = require('chai').expect;
var React = require('react');
var createReactClass = require('create-react-class');
var hoistNonReactStatics = require('../..');

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

    it('should hoist properties with accessor methods', function() {
        var Component = createReactClass({
            render: function() {
                return null;
            }
        });

        // Manually set static complex property
        // since createReactClass doesn't handle properties passed to static
        var counter = 0;
        Object.defineProperty(Component, 'foo', {
            enumerable: true,
            configurable: true,
            get: function() {
                return counter++;
            }
        });

        var Wrapper = createReactClass({
            render: function() {
                return <Component />;
            }
        });

        hoistNonReactStatics(Wrapper, Component);

        // Each access of Wrapper.foo should increment counter.
        expect(Wrapper.foo).to.equal(0);
        expect(Wrapper.foo).to.equal(1);
        expect(Wrapper.foo).to.equal(2);
    });

    it('should inherit static class properties', () => {
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

    it('should inherit static class methods', () => {
        class A extends React.Component {
            static test3 = 'A';
            static test4 = 'D';
            static getMeta() { return {}; };
            test5 = 'foo';
        }
        class B extends A {
            static test2 = 'B';
            static test4 = 'DD';
            static getMeta2() { return {}; };
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
        expect(D.getMeta).to.be.a('function');
        expect(D.getMeta2).to.be.a('function');
        expect(D.getMeta()).to.deep.equal({});
    });

    it('should not inherit ForwardRef render', () => {
        class FancyButton extends React.Component {

        }
        function logProps(Component) {
            class LogProps extends React.Component {
                static foo = 'foo';
                static render = 'bar';
                render() {
                    const {forwardedRef, ...rest} = this.props;
                    return <Component ref={forwardedRef} {...rest} foo='foo' bar='bar' />;
                }
            }
            const ForwardedComponent = React.forwardRef((props, ref) => {
                return <LogProps {...props} forwardedRef={ref} />;
            });

            hoistNonReactStatics(ForwardedComponent, LogProps);

            return ForwardedComponent;
        }

        const WrappedFancyButton = logProps(FancyButton);

        expect(WrappedFancyButton.foo).to.equal('foo');
        expect(WrappedFancyButton.render).to.not.equal('bar');
    });

});
