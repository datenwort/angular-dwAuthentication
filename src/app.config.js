(function() {

    'use strict';
	
    angular
        .module('dwAuthentication')
		.value('AUTH_EVENTS', 
        {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        });
	// 	.config(AuthInterceptorConfiguration);
		
	// AuthInterceptorConfiguration.$inject = ['$httpProvider'];
		
	// function AuthInterceptorConfiguration ($httpProvider) {
	// 	$httpProvider.interceptors.push([
	// 		'$injector',
	// 		function ($injector) {
	// 			return $injector.get('dwAuthInterceptor');
	// 		}
	// 	]);
	// }
})();