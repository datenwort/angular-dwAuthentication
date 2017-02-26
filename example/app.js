(function () {

    'use strict';

    angular
		.module('authExp', ['ui.router', 'dwAuthentication', 'ngMockE2E'])
		.config(
            function(dwAuthConfigProvider) {
                dwAuthConfigProvider.set({
                    loginUrl: '/api/v1/login',
                    verificationUrl: '/api/v1/verify',
                    exclusiveRoles: false,
                    authStructure: { error: 'error', data: 'data'},
                    roles: { admin: 8, editor: 4, user: 2, guest: 1 } // exclusiveRoles = false
                    //roles: { admin: 'admin', editor: 'editor', user: 'user', all: '*'} // exclusiveRoles = true
                });
            }
        )
		.config(
            function ($stateProvider, dwAuthConfigProvider) {
                $stateProvider.state('dashboard', {
                    url: '/dashboard',
                    views: {
                        'viewA': {
                            template: '<div style="background-color: red; width:100px; height:100px;"></div>',
                            data: {
                                authorizedRoles: dwAuthConfigProvider.roles().editor // exclusiveRoles = false
                                //authorizedRoles: [dwAuthConfigProvider.roles().admin, dwAuthConfigProvider.roles().editor] // exclusiveRoles = true
                            }
                        },
                        'viewB': {
                            template: '<div style="background-color: black; width:100px; height:100px;"></div>',
                            data: {
                                // authorizedRoles: [dwAuthConfigProvider.roles().all] // exclusiveRoles = true
                                authorizedRoles: dwAuthConfigProvider.roles().editor // exclusiveRoles = false
                            }
                        }
                    }
                });
            }
        )
		.controller('IndexController', IndexController)
		.run(
            function ($rootScope, AUTH_EVENTS, dwAuthService, $httpBackend) {

                $httpBackend.whenPOST(location.href + 'api/v1/login').respond(function() {
                    return [200, { error: false, data: { user: {id:'1', name: 'foobar', role: 2}, cookies: '123456'}}, {}];
                });

                $httpBackend.whenPOST('/api/v1/login').respond(function() {
                    return [200, { error: false, data: { user: {id:'1', name: 'foobar', role: 2}, cookies: '123456'}}, {}];
                });

                $httpBackend.whenGET(/[\s\S]*/).passThrough();
                $httpBackend.whenPOST(/[\s\S]*/).passThrough();

                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    angular.forEach(toState.views, function (viewName, view) {
                
                        var authorizedRoles = view.data.authorizedRoles; // by flags use function here
                    
                        if (!dwAuthService.isAuthorized(authorizedRoles)) {
                            event.preventDefault();
                            if (dwAuthService.isAuthenticated()) {
                                // user is not allowed
                                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                            } else {
                                // user is not logged in
                                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                            }
                        }
                    });
                });
            }
        );
		
    IndexController.$inject = ['$scope', '$rootScope', 'dwAuthConfig', 'dwAuthService'];
        
    function IndexController($scope, $rootScope, AuthConfig, dwAuthService) {
            
        var vm = this;
        
        vm.credentials = { username: '', password: '' };
        vm.currentUser = { name: '', email: '', role: AuthConfig.roles.admin };
        vm.userRoles = AuthConfig.roles;
        vm.isAuthorized = dwAuthService.isAuthorized;

        vm.login = function () {
            dwAuthService.login(vm.credentials).then(function (user) {
                console.debug(user);
                //$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                //$rootScope.$broadcast('dw:userChanged', user);
            }, function (err) {
                console.error(err);
                //$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
        };

        $rootScope.$on('dw:userChanged', function (event, data) {
            vm.currentUser = data;
            console.debug(data);
            console.debug(dwAuthService.isAuthenticated());
            console.debug(vm.isAuthorized(data.role));
        });
    }
})();
