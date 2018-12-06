/** @format */
const path = require( 'path' );

module.exports = {
	rootDir: './../../packages',
	setupTestFrameworkScriptFile: path.resolve( __dirname, 'setup-test-framework.js' ),
	testEnvironment: 'node',
	testMatch: [ '<rootDir>/**/test/*.js?(x)' ],
	transform: { '^.+\\.jsx?$': 'babel-jest' },
	verbose: false,
};
