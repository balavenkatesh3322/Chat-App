//var app = angular.module('rolesApp');
app.service('rolesService', function($http) {
	
    this.getRolesRanks = function() {
        return $http({
            method: 'GET',
            url: "/get-roles-rank/",
        })
    }
    
    this.getRolemasterAllUsers = function() {
        return $http({
            method: 'GET',
            url: "/get-rolemaster-all-users/",
        })
    }
    
    this.getSessionData = function() {
        return $http({
            method: 'GET',
            url: "/get-session-data/"
        })
    }
	
});