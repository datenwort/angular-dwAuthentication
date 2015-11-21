(function() {

	'use strict';
    
	/**
	* @module dwAuthentification
	* @submodule dwAuthService
	*/
	angular
		.module('dwAuthentification')
		.factory('dwAuthService', AuthService);

	AuthService.$inject = ['$http', 'Session', 'dwAuthConfig'];
		
	/**
	* Handles configuration items for the module
	*
	* @class AuthConfig
	* @param $http {Service} Injects $http service
	* @param Session {Service} Injects Session storage
	* @param dwAuthConfig {Provider} Injects the configuration 
	* @static
	*/
	function AuthService($http, Session, dwAuthConfig) {
		var authService = {
			
			/**
			 * Send credentials to login api and return result
			 * 
			 * @method login
			 * @param credentials {JSON} ...
			 * @return {Promise}
			 */
			login : function (credentials) {
				return $http
					.post(dwAuthConfig.loginUrl, credentials)
					.then(function (res) {
						Session.create(res.data.id, res.data.user.id, res.data.user.role);
						return res.data.user;
					});
			},
			/**
			 * Verify a user by sending a stored key to a verifcation api and return result
			 * 
			 * @method verify
			 * @param key {JSON} ...
			 * @return {Promise}
			 */
			verfiy: function(key) {
				return $http
					.post(dwAuthConfig.verificationUrl, key)
					.then(function(res) {
						Session.create(res.data.id, res.data.user.id, res.data.user.role);
						return res.data.user;
					});
			},
			/**
			 * Check, if an user is already logged in
			 * 
			 * @method isAuthenticated
			 * @return {Boolean} true|false
			 */
			isAuthenticated : function () {
				return !!Session.userId;
			},
			/**
			 * Check user roles against a given role set
			 * 
			 * @method isAuthorized
			 * @param authorizedRoles {Array}
			 * @return {Boolean} true|falsey
			 */
			isAuthorized : function (authorizedRoles) {

			    if (dwAuthConfig.exclusiveRoles) {

			        if (!angular.isArray(authorizedRoles)) {
			            authorizedRoles = [authorizedRoles];
			        }

			        return (authorizedRoles.indexOf(dwAuthConfig.roles.all) !== -1 || (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1));
			    } else {
			        return (authorizedRoles === dwAuthConfig.roles.all || (authService.isAuthenticated() && (Session.userRole >= authorizedRoles)));
			    }
			},
		};

		return authService;
	}
	
})();