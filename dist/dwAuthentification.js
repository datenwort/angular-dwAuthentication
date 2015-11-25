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

})();(function() {

	'use strict';

	/**
	* Angularjs module to capsule login techniques 
    * Contains
    * - login directive as login window
    * - persistence layer
    * - configuration items
	*
	* @module dwAuthentification
	* @constructor
	*/
	angular
        .module('dwAuthentification', ['ngStorage']);

})();(function() {

	'use strict';
 
	/**
	* @module dwAuthentification
	* @submodule dwAuthConfig
	*/
	angular
		.module('dwAuthentification')
		.provider('dwAuthConfig', AuthConfig);
		
	/**
	* Handles configuration items for the module
	*
	* @class AuthConfig
	* @static
	*/
	function AuthConfig()
	{
		var values = {
			loginUrl: '',
			verificationUrl: '',
			exclusiveRoles: false,
			roles: {},
			authStructure: {}
		};
	    /**
 * This is the __module__ description for the `YUIDoc` module.
 *
 *     var options = {
 *         paths: [ './lib' ],
 *         outdir: './out'
 *     };
 *
 *     var Y = require('yuidoc');
 *     var json = (new Y.YUIDoc(options)).run();
 *
 * @class YUIDoc
 * @main yuidoc
 */
		var config = {
			/**
			* My method description.  Like other pieces of your comment blocks, 
			* this can span multiple lines.
            *     AuthConfig.set({ loginUrl: '/api/vi/login', 
			*	  exclusiveRoles: false, 
			*	    roles: { admin: 2, guest: 1, all: 0 }});
			*
			* @method set
			* @param constants {Object} Json object with
			* @example 
            *     
            *     AuthConfig.set(
            *     { loginUrl: '/api/vi/login', 
			*       exclusiveRoles: false, 
			*       roles: { admin: 2, guest: 1, all: 0 }
            *     });
			*/
			set: function(constants) {
				angular.extend(values, constants);
			},
		    /**
			* Get all configuration items
			*
			* @method $get
			* @return {Object} Json-object with configuration items
			*/
			$get: function () {
				return {
					loginUrl: values.loginUrl,
					verificationUrl: values.verificationUrl,
					exclusiveRoles: values.exclusiveRoles,
					roles: values.roles,
					authStructure: values.authStructure
				};
			},
			/**
			* Get the roles defined for role authorization
			*
			* @method roles
			* @return {Object} Json-object with defined roles
			*/
			roles: function () {
			    return values.roles;
			},
			/**
			* Get the structure of the user identification
			*
			* @method authStructure
			* @return {Object} Json-object with user data
			*/
			authStructure: function() {
				return values.authStructure;
			}
		};
		
		return config;
	}
	
})();(function() {

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
	
})();(function() {

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
	
})();(function() {
    
    'use strict';
    
    angular
        .module('dwAuthentification')
        .directive('dwLoginDialog', LoginDialog);
		
	LoginDialog.$inject = ['$compile'];
        
    function LoginDialog($compile) {
        var directive = {
            restrict: 'EA',
            link: link,
            scope: {
                /* */
            },
            controller: LoginController,
            controllerAs: 'vm',
            bindToController: true,  // because the scope is isolated
            // templateUrl : './login.html',
			template: "<ng-transclude></ng-transclude>",
            transclude: true,
			replace: false
        };
        
        return directive;
    
        function link(scope, iElement, iAttrs, controller, transcludeFn) {
			transcludeFn( scope.$parent.$new(), function(clone, innerScope){ // necessary to get/set transclude objects $scope.$parent.$new == necessary otherwise methods will be called twice
				var compiled = $compile(clone)(scope);
				iElement.replaceWith(compiled);
			});
		}
    }
    
	LoginController.$inject = ['$scope', '$rootScope', 'AUTH_EVENTS', 'dwAuthService', 'Session'];

    function LoginController($scope ,$rootScope, AUTH_EVENTS, AuthService, Session) {
		
		var vm = this;

		vm.credentials = {};

        activate();
        
        function activate() {
			/* */
        }
        
		vm.login = function () {
			
			AuthService.login(vm.credentials).then(function (user) {
				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
				$rootScope.$broadcast('dw:userChanged', user);
			}, function () {
				$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
			});
		};
	}
})();

(function() {

	'use strict';
    
	angular
		.module('dwAuthentification')
		.service('Session', Session);
		
	Session.$inject = ['$localStorage', '$sessionStorage'];
	
	function Session($localStorage, $sessionStorage) {
	
		var service = {
			create : function (sessionId, userId, userRole) {
				this.id = sessionId;
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
					$sessionStorage.key = this.id;
				else 
					$localStorage.key = this.id;
			},
			load: function() {
				//if ($localStorage.key != null)
					//else if 
			},
			check: function() {
			}
		};
		
		return service;
	}
})();