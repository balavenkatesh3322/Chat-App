//angular.module('rolesApp', [])
    app.controller('shoreRolesCtrl', function($http, $location, $window, $scope, shoreRolesService, $timeout) {
    	
      	 var rolesCtrlIterator = 0;
    	 $scope.finishLoading = function() {
    		   	var head = document.getElementsByTagName('head').item(0);
    		   	var script = document.createElement('script');
    		 	script.src = 'scripts/colors.js';
    		    head.appendChild(script);    		    
    		    $timeout(function(){
    		    	
    			 if (rolesCtrlIterator==0){
    				 $timeout(function(){
    					 load();
    					 
    				 },0).then(function(){
    						document.getElementById("header").style.visibility = "visible";
    						document.getElementById("navbar").style.visibility = "visible";
    						
    				 }).then(function(){
    					 	document.getElementById("container").style.visibility = "visible";
    					 	var loader = document.getElementById("loader");
    					 	loader.style.opacity= 0;
    					 	loader.style.transition = "opacity 1s ease-in-out";
    					 	loader.addEventListener( 
    					 		     'webkitTransitionEnd', 
    					 		     function( event ) { 
    					 		        loader.style.display = "none";
    					 		     }, false );
    					 	
    				 });
    			 }
    			 rolesCtrlIterator++;
    	    }, 0);
    	 }
    	 
    	 $http({
 			method : 'GET',
 			url: "/get-vessel-task-manager-data/",
 		}).then(function(response){
  	 $scope.vesselDetailList = response.data;
  	 console.log($scope.vesselDetailList.length , '$scope.vesselDetailList.length >>>>>>>>>>>>>>>>>>>>>> ')
  	 $scope.taskCount = $scope.vesselDetailList.length;
   });
    	 
    	$http({
    		method : 'GET',
    		url: "/get-notification-history-for-last-three-days-ship-date/",
    	}).then(function successCallBack(response){
    		 $scope.notificationList = response.data;
        	 $scope.notificationCount = $scope.notificationList.length;
    	});
    	
    	
    	$http({
    		method : 'GET',
    		url: "/get-user-detail-datas-ship-date/",
    	}).then(function successCallBack(response){
    		$scope.userDetailList = response.data;
       	 $scope.userrank = $scope.userDetailList[0].rankName;
       	 $scope.userrole = $scope.userDetailList[0].rolename;
       	 $scope.username = $scope.userDetailList[0].empName;
       	 $scope.usercode = $scope.userDetailList[0].userCode;
       	$scope.vesselname = $scope.userDetailList[0].shipname;
       	 console.log($scope.userDetailList,'$scope.userDetailList >>>>>>>>>>>');
    	});
    	
    	/***********SESSION DATA*******************/
    	
    	shoreRolesService.getSessionData().then(function(response) {
    		$scope.companyName = response.data.companyName;
    	});
    	
    	
        $scope.rolesRanksList = [];
        $scope.rolesRanksList1 = [];
        $scope.roles = [];
        $scope.crews = [];
        shoreRolesService.getRolesRanks().then(function(response) {
        	console.log(response, "sdsdsd");
            $scope.rolesRanksList = response.data;

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
                if (checkduplicaterank($scope.rolesRanksList[i][1]) === false) {
                    $scope.rolesRanksList1.push($scope.rolesRanksList[i]);
                }
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
            
        	$scope.permissionsGrantedToUsersList = [];
        	shoreRolesService.getRolemasterAllUsers().then(function(response) {
        		for(i = 0; i < response.data.length ; i++ ) {
        			if(response.data[i][0] != null && response.data[i][0] != "") {
        				$scope.permissionsGrantedToUsersList.push(response.data[i][0]);
        			} else if (response.data[i][1] != null && response.data[i][1] != "") {
        				$scope.permissionsGrantedToUsersList.push(response.data[i][1]);
        			} else if (response.data[i][2] != null && response.data[i][2] != "") {
        				$scope.permissionsGrantedToUsersList.push(response.data[i][2]);
        			}
        		}  
        	}).then( function() {
        		console.log("wtfffffffff", $scope.permissionsGrantedToUsersList);
        		angular.element(document).ready(function () {	
        		for(i = 0 ; i < $scope.permissionsGrantedToUsersList.length ; i++) {
        				var ele = document.getElementsByClassName($scope.permissionsGrantedToUsersList[i])[0];
        				console.log(" ele",  ele);
        				ele.style.color = "#e50000";
        			}		
        		});	
        	});
        });

        $scope.toggleChilds = function(roleCode) {
            var elem = document.getElementsByClassName(roleCode);
            console.log(elem, 'elem >>>>>>>>>>>>>>>>>>>>>> ');
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
                    elem[i].style.transition = "all 10s";
                }

            } else {
                for (var i = 0; i < n; i++) {
                    elem[i].style.display = 'flex';
                }
            }
        }



    });