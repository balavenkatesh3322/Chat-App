//var app = angular.module('permissionsApp');
app.service('permissionsService', function($http) {
	
    this.getAllModules = function() {
        return $http({
            method: 'GET',
            url: "/get-all-modules/",
        })
    } 
    
    this.getParentNodes = function() {
        return $http({
            method: 'GET',
            url: "/get-parent-nodes/",
        })
    }
    
    /****************************************/
    this.getEmployeeRank = function(code) {
    	console.log("INSIEDE SERVICE", code);
        return $http({
            method: 'POST',
            url: "/get-employee-rank/",
            data: code
        });
    }
    
    this.getEmployeeRole = function(code) {
        return $http({
            method: 'POST',
            url: "/get-employee-role/",
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
    
    this.saveRoleMasterCompositeForm = function(formData) {
        return $http({
            method: 'POST',
            url: "/save-composite-role-master-data/",
            data: formData
        });
    }
    
    this.getRoleBasedPermitsData = function(rolecode) {
        return $http({
            method: 'POST',
            url: "/get-role-based-permits/",
            data: rolecode
        });
    }
    
    this.getRankBasedPermitsData = function(rankcode) {
        return $http({
            method: 'POST',
            url: "/get-rank-based-permits/",
            data: rankcode
        });
    }
    
    this.getUserBasedPermitsData = function(usercode) {
        return $http({
            method: 'POST',
            url: "/get-user-based-permits/",
            data: usercode
        });
    }
    
    this.deleteRankCode = function(rankcode) {
        return $http({
            method: 'POST',
            url: "/delete-rankcode/",
            data: rankcode
        });
    }
    
    this.deleteRoleCode = function(rolecode) {
        return $http({
            method: 'POST',
            url: "/delete-rolecode/",
            data: rolecode
        });
    }
    this.getShipAccessData = function(key, value) {
        return $http({
            method: 'POST',
            url: "/get-all-ship-access-data/",
            data: {"key": key, "value": value}
        });
    }

});
