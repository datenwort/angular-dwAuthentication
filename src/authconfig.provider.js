(function() {

	'use strict';
 
	/**
	* @module dwAuthentification
	* @submodule dwAuthConfig
	*/
	angular
		.module('dwAuthentification')
		.provider('dwAuthConfig', AuthConfig);
		
	/**
	* Handles configuration items for the module
	*
	* @class AuthConfig
	* @static
	*/
	function AuthConfig()
	{
		var values = {
			loginUrl: '',
			verificationUrl: '',
			exclusiveRoles: false,
			roles: {},
			authStructure: {}
		};
	    /**
 * This is the __module__ description for the `YUIDoc` module.
 *
 *     var options = {
 *         paths: [ './lib' ],
 *         outdir: './out'
 *     };
 *
 *     var Y = require('yuidoc');
 *     var json = (new Y.YUIDoc(options)).run();
 *
 * @class YUIDoc
 * @main yuidoc
 */
		var config = {
			/**
			* My method description.  Like other pieces of your comment blocks, 
			* this can span multiple lines.
            *     AuthConfig.set({ loginUrl: '/api/vi/login', 
			*	  exclusiveRoles: false, 
			*	    roles: { admin: 2, guest: 1, all: 0 }});
			*
			* @method set
			* @param constants {Object} Json object with
			* @example 
            *     
            *     AuthConfig.set(
            *     { loginUrl: '/api/vi/login', 
			*       exclusiveRoles: false, 
			*       roles: { admin: 2, guest: 1, all: 0 }
            *     });
			*/
			set: function(constants) {
				angular.extend(values, constants);
			},
		    /**
			* Get all configuration items
			*
			* @method $get
			* @return {Object} Json-object with configuration items
			*/
			$get: function () {
				return {
					loginUrl: values.loginUrl,
					verificationUrl: values.verificationUrl,
					exclusiveRoles: values.exclusiveRoles,
					roles: values.roles,
					authStructure: values.authStructure
				};
			},
			/**
			* Get the roles defined for role authorization
			*
			* @method roles
			* @return {Object} Json-object with defined roles
			*/
			roles: function () {
			    return values.roles;
			},
			/**
			* Get the structure of the user identification
			*
			* @method authStructure
			* @return {Object} Json-object with user data
			*/
			authStructure: function() {
				return values.authStructure;
			}
		};
		
		return config;
	}
	
})();