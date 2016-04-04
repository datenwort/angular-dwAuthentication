(function() {

	'use strict';
 
	angular
		.module('dwAuthentication')
		.provider('dwAuthConfig', AuthConfig);
		
	function AuthConfig()
	{
		var values = {
			loginUrl: '',
			verificationUrl: '',
            logoutUrl: '',
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
                    logoutUrl: values.logoutUrl,
					exclusiveRoles: values.exclusiveRoles,
					roles: values.roles
				};
			},
			roles: function () {
			    return values.roles;
			}
		};
		
		return config;
	}
	
})();