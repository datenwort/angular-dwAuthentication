(function() {

	'use strict';
	
	/**
	* @module dwAuthentification
	* @submodule dwAuthInterceptorConfiguration
	*/
	angular
        .module('dwAuthentification')
		.constant('AUTH_EVENTS', {
			loginSuccess: 'auth-login-success',
			loginFailed: 'auth-login-failed',
			logoutSuccess: 'auth-logout-success',
			sessionTimeout: 'auth-session-timeout',
			notAuthenticated: 'auth-not-authenticated',
			notAuthorized: 'auth-not-authorized'
		})
		.config('dwAuthInterceptorConfiguration', AuthInterceptorConfiguration);
		
	AuthInterceptorConfiguration.$inject = ['$httpProvider'];
		
	/**
	* Handles the configuration for page forwarding of HTML error codes
	*
	* @class AuthInterceptorConfiguration
	* @param $httpProvider {Service} Injects $http service
	* @static
	*/
	function AuthInterceptorConfiguration ($httpProvider) {
		$httpProvider.interceptors.push([
			'$injector',
			function ($injector) {
				return $injector.get('AuthInterceptor');
			}
		]);
	}

})();