/** @format */

/**
 * Internal dependencies
 */

import { combineReducers, withStorageKey } from 'state/utils';
import settings from './settings/reducer';
import setup from './setup/reducer';

export default withStorageKey(
	'wp-job-manager',
	combineReducers( {
		settings,
		setup,
	} )
);
