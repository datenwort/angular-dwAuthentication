# dwAuthentication #

## Version ##

2.0.0

<!--## Installation ##

### bower ###

`bower install angular-dwAuthentication --save`

### npm ###

`npm install angular-dwAuthentication --save`

## Dependecies ##-->

## Example ##

**app.js**

```javascript

(function () {

    'use strict';

    angular
        .module('dwExample', ['ui.router', 'dwAuthentification'])
        .config(function(dwAuthConfigProvider) {
            dwAuthConfigProvider.set({
                loginUrl: '/api/v1/login',
                verificationUrl: '/api/v1/verifiy',
                logoutUrl: '/api/v1/logout'
                exclusiveRoles: false,
                roles: { admin: 8, editor: 4, user: 2, guest: 1 },
                authStructure: { error: 'error', data: 'data' }
            });
        })
        .config(function ($stateProvider, dwAuthConfigProvider) {
            $stateProvider.state('dashboard', {
                url: '/dashboard',
                views: {
                    "viewA": {
                        template: '<div style="background-color: red; width:100px; height:100px;"></div>',
                        data: {
                            authorizedRoles: dwAuthConfigProvider.roles().guest
                        }
                    },
                    "viewB": {
                        template: '<div style="background-color: black; width:100px; height:100px;"></div>',
                        data: {
                            authorizedRoles: [dwAuthConfigProvider.roles().admin, dwAuthConfigProvider.roles().editor]
                        }
                    }
                }
            });
        })
        .run(function ($rootScope, AUTH_EVENTS, dwAuthService) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                angular.each(toState.views, function (viewName, view) {
                
                    var authorizedRoles = view.data.authorizedRoles;
                
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
        })
        .controller('IndexController', IndexController);
```

**Controller**
		
```javascript

    IndexController.$inject = ['$scope', '$rootScope', 'dwAuthConfig', 'dwAuthService'];

    function IndexController($scope, $rootScope, AuthConfig, dwAuthService) {
        
        var vm = this;
        
        vm.currentUser = { name: '', email: '', role: AuthConfig.roles.guest};
        vm.credentials = { username: '', password: '' };
        vm.userRoles = AuthConfig.roles;
        vm.isAuthorized = dwAuthService.isAuthorized;

        vm.login = function() {
            dwAuthService.login(vm.credentials).then(function () {
                console.debug('done');
            }, function (err) {
                console.error(err);
            });
        }

        $rootScope.$on('dw:userChanged', function (event, data) {
            vm.currentUser = data;
        });
    }
})();
```

**index.html**

```html

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Example dwAuthentication</title>

    <script type="text/javascript" src="node_modules/angular/angular.min.js"></script>
	<script type="text/javascript" src="node_modules/ui-router/angular-ui-router.js"></script>
	<script type="text/javascript" src="bower_components/dwAuthentification/dist/dwAuthentication-2.0.0.min.js"></script>
    <script type="text/javascript" src="app.js"></script>

</head>
<body ng-app="dwExample">
    <form name="loginForm" ng-submit="vm.login()" novalidate>
        <label for="username">Username:</label>
        <input type="text" id="username" ng-model="vm.credentials.username">
        <label for="password">Password:</label>
        <input type="password" id="password" ng-model="vm.credentials.password">
        <label for="remember">Remember me</label>
        <input type="checkbox" id="remember" ng-model="vm.credentials.store">
        <button type="submit" ng-click="vm.login()">Login</button>
    </form>
	<div ng-controller="IndexController as vm">
		<div ng-if="vm.currentUser">Welcome, {{ vm.currentUser.name }}</div>
		<div ng-if="vm.isAuthorized(vm.userRoles.admin)">You're admin.</div>
		{{ vm.currentUser.role }} {{ vm.currentUser.role == vm.userRoles.editor}}
		<div ng-switch on="vm.currentUser.role">
			<div ng-switch-when="8">You're admin.</div>
			<div ng-switch-when="4">You're editor.</div>
			<div ng-switch-default>You're something else.</div>
		</div>
	</div>
	<a ui-sref="dashboard">Link</a>
</body>
</html>
```

## Configuration ##

```javascript
angular
	.config(function(dwAuthConfigProvider) {
	    dwAuthConfigProvider.set({
            loginUrl: '/api/v1/login',
            verificationUrl: '/api/v1/verify',
            logoutUrl: '/api/v1/logout',
            exclusiveRoles: false,
	        roles: { admin: 8, editor: 4, user: 2, guest: 1 },
            authStructure: { error: 'error', data: 'data' }
	    });
	})
```

### loginURL ###

Set the URL where to check the login credentials.
The standard is ``.

```javascript
angular
	.config(function(dwAuthConfigProvider) {
	    dwAuthConfigProvider.set({ loginUrl: '/api/v1/login' })
	});
```

### verificationURL ###

Set the URL where to verify the current login status.
The standard is ``.

```javascript
angular
	.config(function(dwAuthConfigProvider) {
	    dwAuthConfigProvider.set({ verificationUrl: '/api/v1/verify' })
	});
```

### logoutURL ###

Set the URL where to logout the user.
The standard is ``.

```javascript
angular
	.config(function(dwAuthConfigProvider) {
	    dwAuthConfigProvider.set({ logoutUrl: '/api/v1/logout' })
	});
```

### exclusiveRoles ###

Two types of user checks are possible: exclusive roles or cascading roles.

if `exclusiveRoles` is set the must have exactly the provided role. Without `exclusiveRoles` all user with a role greater equal the provided one.
The standard is `false`.

```javascript
angular
	.config(function(dwAuthConfigProvider) {
	    dwAuthConfigProvider.set({ exclusiveRoles: false })
	});
```
### roles ###

Set available user roles. The definition of the roles depends on the `exclusiveRole` parameter.
Internally, groups will be checked for roles.all to allow access without restrictions.

**`exclusiveRole = true`**  

```javascript
angular
	.config(function(dwAuthConfigProvider) {
	    dwAuthConfigProvider.set({
            loginUrl: '/api/v1/login',
            verificationUrl: '/api/v1/verifiy',
            logoutUrl: '/api/v1/logout',
            exclusiveRoles: true,
            roles: { admin: 'admin', editor: 'editor', user: 'user', all: '*' },
            authStructure: { error: 'error', data: 'data' }
	    });
	});
```

If you want to grant access to more than one user group in an exclusive role set, arrays can be used to allow more than one user group access to the page.
the **roles.all** item is necessary than. 

```javascript
angular
	.config(function ($stateProvider, dwAuthConfigProvider) {
		$stateProvider.state('dashboard', {
			url: '/dashboard',
			views: {
				"viewA": {
				    template: '<div style="background-color: red; width:100px; height:100px;"></div>',
					data: {
					    authorizedRoles: dwAuthConfigProvider.roles().all
					}
				},
				"viewB": {
				    template: '<div style="background-color: black; width:100px; height:100px;"></div>',
				    data: {
				        authorizedRoles: [dwAuthConfigProvider.roles().admin, dwAuthConfigProvider.roles().editor]
					}
				}
			}
		});
	})
```

**`exclusiveRole = false`**  

```javascript
angular
	.config(function(dwAuthConfigProvider) {
	    dwAuthConfigProvider.set({
            loginUrl: '/api/v1/login',
            verificationUrl: '/api/v1/verifiy',
            logoutUrl: '/api/v1/logout',
            exclusiveRoles: false,
            roles: { admin: 8, editor: 4, user: 2, guest: 1 },
            authStructure: { error: 'error', data: 'data' }
	    });
	});
```

In a non-exclusive set the minimum user group has to be given in the routing

```javascript
angular
	.config(function ($stateProvider, dwAuthConfigProvider) {
		$stateProvider.state('dashboard', {
			url: '/dashboard',
			views: {
				"viewA": {
				    template: '<div style="background-color: red; width:100px; height:100px;"></div>',
					data: {
					    authorizedRoles: dwAuthConfigProvider.roles().all
					}
				},
				"adminView": {
				    template: '<div style="background-color: black; width:100px; height:100px;"></div>',
				    data: {
				        authorizedRoles: dwAuthConfigProvider.roles().admin
					}
				}
			}
		});
	})
```
### authStructure ###

Set basic schema information of the response of the API call.

```javascript
angular
	.config(function(dwAuthConfigProvider) {
	    dwAuthConfigProvider.set({ authStructure: { error: 'error', data: 'data' });
	});
```

The response object of an [angularjs $http](https://docs.angularjs.org/api/ng/service/$http) has these properties:

* data – {string|Object} – The response body transformed with the transform functions.
* status – {number} – HTTP status code of the response.
* headers – {function([headerName])} – Header getter function.
* config – {Object} – The configuration object that was used to generate the request.
* statusText – {string} – HTTP status text of the response.

The data property must contain at least an error object and a part where the necessary user data is transferred, e.g. ```data: { error: false, data: { user: { name: 'JSmith', id: 1, role: 2 }}}```.
To identify how the data is structured, authStructure defines the basic values.

Here some examples: 
- ```data: { error: false, data: { user: { name: 'JSmith', id: 1, role: 2 }}}``` leads to ```{ error: 'error', data: 'data' }```
- ```data: { exception: { code: 404, message: '404 }, user: {}}``` leads to ```{ error: 'exception', data: 'user' }```