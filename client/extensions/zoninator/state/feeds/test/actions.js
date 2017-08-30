/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { ZONINATOR_REQUEST_FEED, ZONINATOR_SAVE_FEED, ZONINATOR_UPDATE_FEED } from '../../action-types';
import { requestFeed, saveFeed, updateFeed } from '../actions';

describe( 'actions', () => {
	const siteId = 1234;
	const zoneId = 5678;

	const feed = [ 1, 2, 3, 4 ];

	describe( 'requestFeed()', () => {
		it( 'should return an action object', () => {
			const action = requestFeed( siteId, zoneId );

			expect( action ).to.deep.equal( {
				type: ZONINATOR_REQUEST_FEED,
				siteId,
				zoneId,
			} );
		} );
	} );

	describe( 'saveFeed()', () => {
		it( 'should return an action object', () => {
			const action = saveFeed( siteId, zoneId, 'test-form', feed );

			expect( action ).to.deep.equal( {
				type: ZONINATOR_SAVE_FEED,
				form: 'test-form',
				postIds: feed,
				siteId,
				zoneId,
			} );
		} );
	} );

	describe( 'updateFeed()', () => {
		it( 'should return an action object', () => {
			const action = updateFeed( siteId, zoneId, feed );

			expect( action ).to.deep.equal( {
				type: ZONINATOR_UPDATE_FEED,
				postIds: feed,
				siteId,
				zoneId,
			} );
		} );
	} );
} );
