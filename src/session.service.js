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