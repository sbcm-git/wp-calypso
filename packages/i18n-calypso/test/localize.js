/** @format */

/**
 * External dependencies
 *
 */
import React from 'react';
import { shallow } from 'enzyme';

/**
 * Internal dependencies
 */
import i18n, { localize } from '../src';

const emptyRender = function() {
	return null;
};

describe( 'localize()', function() {
	it( 'should be named using the variable name of the composed component', function() {
		class MyComponent extends React.Component {
			render() {
				return emptyRender();
			}
		}

		const LocalizedComponent = localize( MyComponent );

		expect( LocalizedComponent.displayName ).toBe( 'Localized(MyComponent)' );
	} );

	it( 'should be named using the displayName of the composed component', function() {
		const MyComponent = () => emptyRender();
		MyComponent.displayName = 'MyComponent';

		const LocalizedComponent = localize( MyComponent );

		expect( LocalizedComponent.displayName ).toBe( 'Localized(MyComponent)' );
	} );

	it( 'should be named using the name of the composed function component', function() {
		function MyComponent() {}

		const LocalizedComponent = localize( MyComponent );

		expect( LocalizedComponent.displayName ).toBe( 'Localized(MyComponent)' );
	} );

	it( 'should provide translate, moment, locale and numberFormat props to rendered child', function() {
		const MyComponent = () => emptyRender();
		const LocalizedComponent = localize( MyComponent );

		const mounted = shallow( React.createElement( LocalizedComponent ) );
		const props = mounted.find( MyComponent ).props();

		expect( props.translate ).toBeInstanceOf( Function );
		expect( props.moment ).toBeInstanceOf( Function );
		expect( props.numberFormat ).toBeInstanceOf( Function );
		expect( props.locale ).toBe( i18n.getLocaleSlug() );
	} );
} );
