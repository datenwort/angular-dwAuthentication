(function() {

    'use strict';
    
    angular
		.module('dwAuthentication')
		.factory('dwAuthInterceptor', AuthInterceptor);

    AuthInterceptor.$inject = ['$rootScope', '$q', 'AUTH_EVENTS'];
		
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