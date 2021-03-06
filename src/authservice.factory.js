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
                    
            /*
                return $http.post('http://sven.afvh.de/menue.php',
                            { uid: credentials.username, pwd: credentials.password },
                            { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*' }, transformRequest: $rootScope.transform }
                ).then(function(response) {
                    return { responseStatus: response.status, data: response.data.substring(response.data.indexOf('rss.php'), response.data.indexOf('"', response.data.indexOf('rss.php'))) }; 
                });
            */
            
            },
            verify: function(data, headers) {
                return $http
                    .post(dwAuthConfig.verificationUrl, data, headers)
                    .then(function(res) {
                        // Session.create(res.data.id, res.data.user.id, res.data.user.role);
                        // $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
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