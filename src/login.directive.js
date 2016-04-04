// (function() {
    
//     'use strict';
    
//     angular
//         .module('dwAuthentication')
//         .directive('dwLoginDialog', LoginDialog);
		
// 	LoginDialog.$inject = ['$compile'];
        
//     function LoginDialog($compile) {
//         var directive = {
//             restrict: 'EA',
//             link: link,
//             scope: {
//                 /* */
//             },
//             controller: LoginController,
//             controllerAs: 'vm',
//             bindToController: true,  // because the scope is isolated
//             // templateUrl : './login.html',
// 			// template: "<div ng-if='visible'><ng-transclude></ng-transclude></div>",
//             template: "<ng-transclude></ng-transclude>",
//             transclude: true,
// 			replace: false
//         };
        
//         return directive;
    
//         function link(scope, iElement, iAttrs, controller, transcludeFn) {
// 			transcludeFn( scope.$parent.$new(), function(clone, innerScope){ // necessary to get/set transclude objects $scope.$parent.$new == necessary otherwise methods will be called twice
// 				var compiled = $compile(clone)(scope);
// 				iElement.replaceWith(compiled);
// 			});
// 		}
        
//         /* 
//             var showDialog = function () {
//                 scope.visible = true;
//             };
            
//             scope.visible = false;
//             scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
//             scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);
//         */
        
//     }
    
// 	LoginController.$inject = ['$scope', '$rootScope', 'AUTH_EVENTS', 'dwAuthService', 'Session'];

//     function LoginController($scope ,$rootScope, AUTH_EVENTS, AuthService, Session) {
		
//         /*
// 		var vm = this;

// 		vm.credentials = {};

//         activate();
        
//         function activate() {
// 			// tbd
//         }
// 		vm.login = function () {
			
// 			AuthService.login(vm.credentials).then(function (user) {
// 				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
// 				$rootScope.$broadcast('dw:userChanged', user);
// 			}, function () {
// 				$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
// 			});
// 		};
//         */
        
// 	}
// })();

