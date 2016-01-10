(function() {

	'use strict';
    
	angular
		.module('dwAuthentication')
		.service('Session', Session);
		
	function Session() {
	
		var service = {
			create : function (sessionId, userId, userRole) {
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