//angular.module('rolesApp', [])
   app.controller('rolesCtrl', function($http, $location, $window, $scope, $timeout, rolesService) {    	
   	 
    	
    	/***********SESSION DATA*******************/
    	
    	rolesService.getSessionData().then(function(response) {
    		$scope.companyName = response.data.companyName;
    	});

        $scope.rolesRanksList = [];
        $scope.rolesRanksList1 = [];
        $scope.roles = [];
        $scope.crews = [];
        rolesService.getRolesRanks().then(function(response) {
        	
        	$scope.permissionsGrantedToUsersList = [];
        	rolesService.getRolemasterAllUsers().then(function(response) {
        		console.log("GETTING THE USERS--------->", response.data);
        		for(i = 0; i < response.data.length ; i++ ) {
        			if(response.data[i][0] != null && response.data[i][0] != "") {
        				$scope.permissionsGrantedToUsersList.push(response.data[i][0]);
        			} else if (response.data[i][1] != null && response.data[i][1] != "") {
        				$scope.permissionsGrantedToUsersList.push(response.data[i][1]);
        			} else if (response.data[i][2] != null && response.data[i][2] != "") {
        				$scope.permissionsGrantedToUsersList.push(response.data[i][2]);
        			}
        		}  
        	}).then(function(){
        	
        		angular.element(document).ready(function () {
    			for(i = 0 ; i < $scope.permissionsGrantedToUsersList.length ; i++) {
    				console.log($scope.permissionsGrantedToUsersList[i]);
    				var ele = document.getElementsByClassName($scope.permissionsGrantedToUsersList[i])[0];
    				if (ele !=undefined){
        				ele.style.color = "#e50000";
    				}
    			}
        	});	});
        	
        	console.log(response, "sdsdsd");
            $scope.rolesRanksList = response.data;
            
            console.log("2nd level", $scope.rolesRanksList);

            function checkduplicate(value) {
                for (k = 0; k < $scope.roles.length; k++) {
                    if ($scope.roles[k][3] === value) {
                        return true;
                    }
                }
                return false;
            }
            
            function checkduplicatecrew(value) {
                for (k = 0; k < $scope.crews.length; k++) {
                    if ($scope.crews[k][5] === value) {
                        return true;
                    }
                }
                return false;
            }
            
            function checkduplicaterank(value) {
                for (k = 0; k < $scope.rolesRanksList1.length; k++) {
                    if ($scope.rolesRanksList1[k][1] === value) {
                        return true;
                    }
                }
                return false;
            }

            for (i = 0; i < $scope.rolesRanksList.length; i++) {
                if (checkduplicate($scope.rolesRanksList[i][3]) === false) {
                    $scope.roles.push($scope.rolesRanksList[i]);
                }
            }
            
            for (i = 0; i < $scope.rolesRanksList.length; i++) {
                if (checkduplicatecrew($scope.rolesRanksList[i][5]) === false) {
                    $scope.crews.push($scope.rolesRanksList[i]);
                }
            }
            
            for (i = 0; i < $scope.rolesRanksList.length; i++) {
                if (checkduplicaterank($scope.rolesRanksList[i][1]) === false) {
                    $scope.rolesRanksList1.push($scope.rolesRanksList[i]);
                }
            }
        });

        $scope.toggleChilds = function(roleCode) {
            var elem = document.getElementsByClassName(roleCode);
            var n = elem.length;
            if (elem[0].style.display === 'flex') {
                for (var i = 0; i < n; i++) {
                    elem[i].style.display = 'none';
                }

            } else {
                for (var i = 0; i < n; i++) {
                    elem[i].style.display = 'flex';
                }
            }
        }
        
        $scope.toggleLowerChilds = function(rankCode) {
            var elem = document.getElementsByClassName(rankCode);
            var n = elem.length;
            if (elem[0].style.display === 'flex') {
                for (var i = 0; i < n; i++) {
                    elem[i].style.display = 'none';
                }

            } else {
                for (var i = 0; i < n; i++) {
                    elem[i].style.display = 'flex';
                }
            }
        }


    });