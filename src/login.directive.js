(function() {
    
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
			// DUMMY
			Session.create(1, 1, 4);
			$rootScope.$broadcast('dw:userChanged', {name: 'john', email: 'demo@demo.de', role: 'editor'});
			
			AuthService.login(vm.credentials).then(function (user) {
				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
				$rootScope.$broadcast('dw:userChanged', user);
			}, function () {
				$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
			});
		};
	}
})();
