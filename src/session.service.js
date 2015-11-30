(function() {

	'use strict';
    
	angular
		.module('dwAuthentication')
		.service('Session', Session);
		
	function Session() {
	
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
					console.log("permanent persist");
				else 
					console.log("local persist");
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