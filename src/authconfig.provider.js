(function() {

	'use strict';
 
	angular
		.module('dwAuthentification')
		.provider('dwAuthConfig', AuthConfig);
		
	function AuthConfig()
	{
		var values = {
			loginUrl: '',
			verificationUrl: '',
			exclusiveRoles: false,
			roles: {}
		};

		var config = {
			set: function(constants) {
				angular.extend(values, constants);
			},
			$get: function () {
				return {
					loginUrl: values.loginUrl,
					verificationUrl: values.verificationUrl,
					exclusiveRoles: values.exclusiveRoles,
					roles: values.roles,
					authStructure: values.authStructure
				};
			},
			roles: function () {
			    return values.roles;
			}
		};
		
		return config;
	}
	
})();