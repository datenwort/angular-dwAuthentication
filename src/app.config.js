(function() {

	'use strict';
	
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
		
	function AuthInterceptorConfiguration ($httpProvider) {
		$httpProvider.interceptors.push([
			'$injector',
			function ($injector) {
				return $injector.get('AuthInterceptor');
			}
		]);
	}

})();