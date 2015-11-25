(function() {

	'use strict';
    
	/**
	* @module dwAuthentification
	* @submodule dwAuthInterceptor
	*/
	angular
		.module('dwAuthentification')
		.factory('dwAuthInterceptor', AuthInterceptor);

	AuthInterceptor.$inject = ['$rootScope', '$q', 'AUTH_EVENTS'];
		
	/**
	* Handles configuration items for the module
	*
	* @class AuthConfig
	* @param $http {Service} Injects $http service
	* @param Session {Service} Injects Session storage
	* @param dwAuthConfig {Provider} Injects the configuration 
	* @static
	*/
	function AuthInterceptor($rootScope, $q, AUTH_EVENTS) {
		var authInterceptor = {
			responseError: function (response) { 
				$rootScope.$broadcast({
					401: AUTH_EVENTS.notAuthenticated,
					403: AUTH_EVENTS.notAuthorized,
					419: AUTH_EVENTS.sessionTimeout,
					440: AUTH_EVENTS.sessionTimeout
      			}[response.status], response);
      			return $q.reject(response);
    		}
		};

		return authInterceptor;
	}
	
})();