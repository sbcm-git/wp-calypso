/** @format */
/* eslint-disable wpcalypso/jsx-classname-namespace */
/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import { findLast } from 'lodash';

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { withViewportMatch } from '@wordpress/viewport';
import { IconButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	Inserter,
	BlockToolbar,
	TableOfContents,
	EditorHistoryRedo,
	EditorHistoryUndo,
	NavigableToolbar,
	BlockNavigationDropdown,
} from '@wordpress/editor';

/**
 * Internal dependencies
 */
import Site from 'blocks/site';
import { addSiteFragment } from 'lib/route';
import { recordTracksEvent, withAnalytics } from 'state/analytics/actions';
import { navigate } from 'state/ui/actions';
import { getSelectedSite } from 'state/ui/selectors';
import { getRouteHistory } from 'state/ui/action-log/selectors';

function HeaderToolbar( {
	hasFixedToolbar,
	isLargeViewport,
	showInserter,
	// GUTENLYPSO START
	closeEditor,
	notices,
	recordSiteButtonClick,
	removeNotice,
	site,
	translate,
	// GUTENLYPSO END
} ) {
	const onCloseButtonClick = () => {
		notices.forEach( ( { id } ) => removeNotice( id ) );
		closeEditor();
	};

	const toolbarAriaLabel = hasFixedToolbar
		? /* translators: accessibility text for the editor toolbar when Top Toolbar is on */
		  __( 'Document and block tools' )
		: /* translators: accessibility text for the editor toolbar when Top Toolbar is off */
		  __( 'Document tools' );

	return (
		<NavigableToolbar className="edit-post-header-toolbar" aria-label={ toolbarAriaLabel }>
			{ /* GUTENLYPSO START */ }
			<div className="edit-post-header-toolbar__back">
				<IconButton
					icon="exit"
					onClick={ onCloseButtonClick }
					aria-label={ translate( 'Close' ) }
				/>
			</div>
			<Site compact site={ site } indicator={ false } onSelect={ recordSiteButtonClick } />
			{ /* GUTENLYPSO END */ }
			<div>
				<Inserter disabled={ ! showInserter } position="bottom right" />
			</div>
			<EditorHistoryUndo />
			<EditorHistoryRedo />
			<TableOfContents />
			<BlockNavigationDropdown />
			{ hasFixedToolbar &&
				isLargeViewport && (
					<div className="edit-post-header-toolbar__block-toolbar">
						<BlockToolbar />
					</div>
				) }
		</NavigableToolbar>
	);
}

// GUTENLYPSO START
function getCloseButtonPath( routeHistory, site ) {
	const editorPathRegex = /^(\/block-editor)?\/(post|page|(edit\/[^\/]+))(\/|$)/i;
	const lastEditorPath = routeHistory[ routeHistory.length - 1 ].path;

	// @see post-editor/editor-ground-control/index.jsx
	const lastNonEditorPath = findLast(
		routeHistory,
		( { path } ) => '/block-editor' !== path && ! path.match( editorPathRegex )
	);
	if ( lastNonEditorPath ) {
		return lastNonEditorPath.path;
	}

	const editorPostType = lastEditorPath.match( editorPathRegex )[ 2 ];
	let path;

	// @see post-editor/post-editor.jsx
	if ( 'post' === editorPostType ) {
		path = '/posts';
	} else if ( 'page' === editorPostType ) {
		path = '/pages';
	} else {
		path = `/types/${ editorPostType.split( '/' )[ 1 ] }`;
	}
	if ( 'post' === editorPostType && site && ! site.jetpack && ! site.single_user_site ) {
		path += '/my';
	}
	if ( site ) {
		path = addSiteFragment( path, site.slug );
	}
	return path;
}

const mapStateToProps = state => ( {
	routeHistory: getRouteHistory( state ),
	site: getSelectedSite( state ),
} );

const mapDispatchToProps = dispatch => {
	return {
		closeEditor: ( { routeHistory, site } ) =>
			dispatch(
				withAnalytics(
					recordTracksEvent( 'calypso_gutenberg_editor_close_button_click' ),
					navigate( getCloseButtonPath( routeHistory, site ) )
				)
			),
		recordSiteButtonClick: () =>
			dispatch( recordTracksEvent( 'calypso_gutenberg_editor_site_button_click' ) ),
	};
};

const mergeProps = ( stateProps, dispatchProps, ownProps ) => {
	return {
		...ownProps,
		...stateProps,
		...dispatchProps,
		closeEditor: () => dispatchProps.closeEditor( stateProps ),
	};
};
// GUTENLYPSO END

export default compose( [
	withSelect( select => ( {
		hasFixedToolbar: select( 'core/edit-post' ).isFeatureActive( 'fixedToolbar' ),
		notices: select( 'core/notices' ).getNotices(), // GUTENLYPSO
		showInserter:
			select( 'core/edit-post' ).getEditorMode() === 'visual' &&
			select( 'core/editor' ).getEditorSettings().richEditingEnabled,
	} ) ),
	// GUTENLYPSO START
	withDispatch( dispatch => ( {
		removeNotice: dispatch( 'core/notices' ).removeNotice,
	} ) ),
	// GUTENLYPSO END
	withViewportMatch( { isLargeViewport: 'medium' } ),
] )(
	// GUTENLYPSO START
	connect(
		mapStateToProps,
		mapDispatchToProps,
		mergeProps
	)( localize( HeaderToolbar ) )
	// GUTENLYPSO END
);
