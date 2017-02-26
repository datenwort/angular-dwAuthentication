/*! Sebastian <github@datenwort.com> - v2.0.0 - 26-02-2017 */
(function() {

    'use strict';

    angular
        .module('dwAuthentication',[]);

})();
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

		

		








})();
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
            roles: {},
            authStructure: {}
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
                    roles: values.roles,
                    authStructure: values.authStructure
                };
            },
            roles: function () {
                return values.roles;
            },

            authStructure: function() {
                return values.authStructure;
            }
        };
		
        return config;
    }
	
})();
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
(function() {

    'use strict';
    
    angular
		.module('dwAuthentication')
		.factory('dwAuthService', AuthService);

    AuthService.$inject = ['$http', 'Session', 'dwAuthConfig', 'AUTH_EVENTS', '$rootScope'];
		
    function AuthService($http, Session, dwAuthConfig, AUTH_EVENTS, $rootScope) {
        var authService = {
			
            login : function (data, headers) {
                return $http
                    .post(dwAuthConfig.loginUrl, data, headers)
                    .then(function (res) {
                        if (res.data[dwAuthConfig.authStructure.error] === false) {
                            Session.create(res.data[dwAuthConfig.authStructure.data].user.id, res.data[dwAuthConfig.authStructure.data].user.role);
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                            $rootScope.$broadcast('dw:userChanged', res.data[dwAuthConfig.authStructure.data].user);
                        }
                        return res.data;
                    }, function () {
                        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    });
                    

            
            },
            verify: function(data, headers) {
                return $http
                    .post(dwAuthConfig.verificationUrl, data, headers)
                    .then(function(res) {


                        return res.data;
                    });
            },
            logout: function(data, headers) {
                return $http
                    .post(dwAuthConfig.logoutUrl, data, headers)
                    .then(function () {
                        Session.destroy();
                        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                        $rootScope.$broadcast('dw:userChanged', null);
                        return true;
                    })
                    .catch(function () {
                        return false;
                    });
            },
            isAuthenticated : function () {
                return !!Session.userId;
            },
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
(function() {

    'use strict';
    
    angular
        .module('dwAuthentication')
        .service('Session', Session);
        
    function Session() {
    
        var service = {
            create : function (userId, userRole) {
                this.id = generateUUID();
                this.userId = userId;
                this.userRole = userRole;
            },
            destroy : function () {
                this.id = null;
                this.userId = null;
                this.userRole = null;
            },
            persist: function(durable) {
                if (durable)
                    console.debug('permanent persist');
                else 
                    console.debug('local persist');
            },
            load: function() {


            },
            check: function() {
            }
        };
        
        function generateUUID() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        }
        
        return service;
    }
})();