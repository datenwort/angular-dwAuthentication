(function () {

    'use strict';

    angular
		.module('dit', ['ui.router', 'dwAuthentification'])
		.config(function(dwAuthConfigProvider) {
		    dwAuthConfigProvider.set({
                loginUrl: '/api/v1/login',
				verificationUrl: 'api/v1/verify',
                exclusiveRoles: false,
				authStructure: {id:'', name: ''},
		        roles: { admin: 8, editor: 4, user: 2, guest: 1 } // exclusiveRoles = false
		        //roles: { admin: 'admin', editor: 'editor', user: 'user', all: '*'} // exclusiveRoles = true
		    });
		})
		.controller('IndexController', IndexController)
		.config(function ($stateProvider, dwAuthConfigProvider) {
			$stateProvider.state('dashboard', {
				url: '/dashboard',
				views: {
					"viewA": {
					    template: '<div style="background-color: red; width:100px; height:100px;"></div>',
						data: {
						    authorizedRoles: dwAuthConfigProvider.roles().editor // exclusiveRoles = false
						    //authorizedRoles: [dwAuthConfigProvider.roles().admin, dwAuthConfigProvider.roles().editor] // exclusiveRoles = true
						}
					},
					"viewB": {
					    template: '<div style="background-color: black; width:100px; height:100px;"></div>',
					    data: {
					        // authorizedRoles: [dwAuthConfigProvider.roles().all] // exclusiveRoles = true
					        authorizedRoles: dwAuthConfigProvider.roles().editor // exclusiveRoles = false
						}
					}
				}
			});
		})
		.run(function ($rootScope, AUTH_EVENTS, dwAuthService) {
		    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		        $.each(toState.views, function (viewName, view) {
               
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
		});
		
		IndexController.$inject = ['$scope', '$rootScope', 'dwAuthConfig', 'dwAuthService'];
		
		function IndexController($scope, $rootScope, AuthConfig, dwAuthService) {
			
			var vm = this;
			
			vm.currentUser = { name: 'Karl', email: '', role: AuthConfig.roles.guest};
			vm.userRoles = AuthConfig.roles;
			vm.isAuthorized = dwAuthService.isAuthorized;
 
			$rootScope.$on('dw:userChanged', function (event, data) {
				vm.currentUser = data;
				console.log(data);
				console.log(dwAuthService.isAuthenticated());
				console.log(vm.isAuthorized(data.role));
			});
		}
})();
