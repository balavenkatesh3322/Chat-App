//var app = angular.module('permissionsApp');
app.service('shorePermissionsService', function($http) {
	
    this.getAllModules = function() {
        return $http({
            method: 'GET',
            url: "/shore-get-all-modules/",
        })
    }
    
    this.getParentNodes = function() {
        return $http({
            method: 'GET',
            url: "/shore-get-parent-nodes/",
        })
    }
    
    this.saveRoleMasterCompositeForm = function(formData) {
        return $http({
            method: 'POST',
            url: "/shore-save-composite-role-master-data/",
            data: formData
        });
    }
    
    this.getRoleBasedPermitsData = function(rolecode) {
        return $http({
            method: 'POST',
            url: "/shore-get-role-based-permits/",
            data: rolecode
        });
    }
    this.getPermitsData = function(key, value) {
        return $http({
            method: 'POST',
            url: "/get-all-shore-access-data/",
            data: {"key": key, "value": value}
        });
    }
    
    this.getRankBasedPermitsData = function(rankcode) {
        return $http({
            method: 'POST',
            url: "/shore-get-rank-based-permits/",
            data: rankcode
        });
    }
    
    this.getUserBasedPermitsData = function(usercode) {
    	console.log("into emp id >>>>>>>>>>>>>>>>>>>>>>>> ");
        return $http({
            method: 'POST',
            url: "/shore-get-user-based-permits/",
            data: usercode
        });
    }
    
    this.deleteRankCode = function(rankcode) {
        return $http({
            method: 'POST',
            url: "/shore-delete-rankcode/",
            data: rankcode
        });
    }
    
    this.deleteRoleCode = function(rolecode) {
        return $http({
            method: 'POST',
            url: "/shore-delete-rolecode/",
            data: rolecode
        });
    }
    
    this.deleteUserCode = function(rolecode) {
        return $http({
            method: 'POST',
            url: "/shore-delete-usercode/",
            data: rolecode
        });
    }
    
    /****************************************/
    this.getEmployeeRank = function(code) {
        return $http({
            method: 'POST',
            url: "/get-shoreemployee-rank/",
            data: code
        });
    }
    
    this.getEmployeeRole = function(code) {
    	console.log("service", code);
        return $http({
            method: 'POST',
            url: "/get-shoreemployee-role/",
            data: code
        });
    }
    
    this.getEmployeeName = function(code) {
        return $http({
            method: 'POST',
            url: "/get-employee-name/",
            data: code
        });
    }
    
    /*****************************************/
      
  
});
