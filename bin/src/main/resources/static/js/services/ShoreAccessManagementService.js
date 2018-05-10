app.service('shoreRolesService', function($http) {
	
    this.getRolesRanks = function() {
        return $http({
            method: 'GET',
            url: "/shore-get-roles-rank/",
        })
    }
    
    this.getRolemasterAllUsers = function() {
        return $http({
            method: 'GET',
            url: "/get-shorerolemaster-all-users/",
        })
    }
    
    this.getSessionData = function() {
        return $http({
            method: 'GET',
            url: "/get-session-data/"
        })
    }
	
	
});