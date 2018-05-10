app.controller('shorePermissionsCtrl', function($http, $location, $window, $scope, shorePermissionsService, $timeout,$routeParams) {    	
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
    	
    	

        $scope.modulesList = [];
        $scope.permit = [];
        $scope.showAccessId = false;
        $scope.datastatus = true;

        var id=$routeParams.id;
        angular.element(document).ready(function() {

//            urlParams = $location.absUrl().split("?");
//            urlParams = urlParams[1].split("=");
        	urlParams = id.split("=");
            $scope.initialLoad = [];
            shorePermissionsService.getPermitsData(urlParams[0], urlParams[1]).then(function(response){
            	console.log("dataaaaaaaaaaaa",response)
            	$scope.modulesList = response.data.data[0].allModules;
                for (p = 0; p < $scope.modulesList.length; p++) {
                    $scope.permit[$scope.modulesList[p][1]] = [false, false, false, false, false];
                }
                
                
                $scope.parentNodesList = response.data.data[0].parentModules;
                for (i = 0; i < $scope.parentNodesList.length; i++) {
                    for (j = 0; j < $scope.modulesList.length; j++) {
                        if (checkDuplicate($scope.parentNodesList[i][0]) === false &&
                            $scope.parentNodesList[i][0] === $scope.modulesList[j][0]) {
                            $scope.parentToModules.push($scope.parentNodesList[i]);
                        }
                    }
                }

                for (p = 0; p < $scope.parentToModules.length; p++) {
                    $scope.permit[$scope.parentToModules[p][0]] = [false, false, false, false, false];
                }
                if (urlParams[0] === 'rankcode') {
                        $scope.initialLoad = response.data.data[0].permitData;
                        var objList = response.data.data[0].permitData;
                        $scope.accessID;
                        if (response.data.data[0].permitData.length != 0) {
                            $scope.showAccessId = true;
                            $scope.accessID = objList[0][0].accessid;
                            for (i = 0; i < objList.length; i++) {
                            	if(!$scope.permit[objList[i][0].mdlcode]){
                            		$scope.permit[objList[i][0].mdlcode] = [];
                            	}
                                $scope.permit[objList[i][0].mdlcode][0] = (objList[i][0].readAccess === 'Y' ? true : false);
                                $scope.permit[objList[i][0].mdlcode][1] = (objList[i][0].createAccess === 'Y' ? true : false);
                                $scope.permit[objList[i][0].mdlcode][2] = (objList[i][0].editAccess === 'Y' ? true : false);
                                $scope.permit[objList[i][0].mdlcode][3] = (objList[i][0].deleteAccess === 'Y' ? true : false);

                            }
                        }
                        
                        	$scope.employee = response.data.data[0].codeDesc[0];
                }else if (urlParams[0] === 'rolecode') {
                        $scope.initialLoad = response.data.data[0].permitData;
                        var objList = response.data.data[0].permitData;
                        $scope.accessID;
                        if (response.data.data[0].permitData.length != 0) {
                            $scope.showAccessId = true;
                            $scope.accessID = objList[0][0].accessid;
                            for (i = 0; i < objList.length; i++) {
                            	if(!$scope.permit[objList[i][0].mdlcode]){
                            		$scope.permit[objList[i][0].mdlcode] = [];
                            	}
                                $scope.permit[objList[i][0].mdlcode][0] = (objList[i][0].readAccess === 'Y' ? true : false);
                                $scope.permit[objList[i][0].mdlcode][1] = (objList[i][0].createAccess === 'Y' ? true : false);
                                $scope.permit[objList[i][0].mdlcode][2] = (objList[i][0].editAccess === 'Y' ? true : false);
                                $scope.permit[objList[i][0].mdlcode][3] = (objList[i][0].deleteAccess === 'Y' ? true : false);
                            }
                        }
                    	$scope.employee = response.data.data[0].codeDesc[0];
                }else if (urlParams[0] === 'empid') {
                	console.log("into emp id >>>>>>>>>>>>>>>>>>>>>>>> ");
                        $scope.initialLoad = response.data.data[0].permitData;
                        console.log(response.data , 'in Emp id >>>>>>>>>>>>> ')
                        var objList = response.data.data[0].permitData;
                        $scope.accessID;
                        if (response.data.data[0].permitData.length != 0) {
                            $scope.showAccessId = true;
                            $scope.accessID = objList[0][0].accessid;
                            for (i = 0; i < objList.length; i++) {
                            	if(!$scope.permit[objList[i][0].mdlcode]){
                            		$scope.permit[objList[i][0].mdlcode] = [];
                            	}
                                $scope.permit[objList[i][0].mdlcode][0] = (objList[i][0].readAccess === 'Y' ? true : false);
                                $scope.permit[objList[i][0].mdlcode][1] = (objList[i][0].createAccess === 'Y' ? true : false);
                                $scope.permit[objList[i][0].mdlcode][2] = (objList[i][0].editAccess === 'Y' ? true : false);
                                $scope.permit[objList[i][0].mdlcode][3] = (objList[i][0].deleteAccess === 'Y' ? true : false);
                            }
                        }
                    	$scope.employee = response.data.data[0].codeDesc[0];                    
                }
                
            });
        });


        $scope.deleteUser = function() {
//            urlParams = $location.absUrl().split("?");
//            urlParams = urlParams[1].split("=");
        	urlParams = id.split("=");
            if (urlParams[0] === 'rankcode') {
                shorePermissionsService.deleteRankCode(urlParams[1]).then(function(response) {
                	$scope.datastatus = false;
    				$scope.informationMessage = "Access Management deleted successfully";
    				$timeout(function () { $scope.datastatus = true; }, 3000);
                    console.log('Deleted Rankcode');
                });

            } else if (urlParams[0] === 'rolecode') {
                shorePermissionsService.deleteRoleCode(urlParams[1]).then(function(response) {
                	$scope.datastatus = false;
    				$scope.informationMessage = "Access Management deleted successfully";
    				$timeout(function () { $scope.datastatus = true; }, 3000);
                    console.log('Deleted Rolecode');
                });
            }  else if (urlParams[0] === 'empid') {
                shorePermissionsService.deleteUserCode(urlParams[1]).then(function(response) {
                	$scope.datastatus = false;
    				$scope.informationMessage = "Access Management deleted successfully";
    				$timeout(function () { $scope.datastatus = true; }, 3000);
                    console.log('Deleted User Code ');
                });
            }

        }


        shorePermissionsService.getAllModules().then(function(response) {
            
            
            shorePermissionsService.getParentNodes().then(function(response) {
                

            });
        });

        function checkDuplicate(value) {

            for (k = 0; k < $scope.parentToModules.length; k++) {
                if ($scope.parentToModules[k][0] === value) {
                    return true
                }
            }

            return false;

        };

        $scope.parentNodesList = [];
        $scope.parentToModules = [];

      

        $scope.toggle = function(code, permit) {

            if (permit === 'V') {
                $scope.permit[code][0] = !$scope.permit[code][0];
                
                if(!$scope.permit[code][0]) {
	               	 $scope.permit[code][1] = $scope.permit[code][0];
	               	 $scope.permit[code][3] = $scope.permit[code][0];
               }

            } else if (permit === 'C') {
                $scope.permit[code][1] = !$scope.permit[code][1];

            } else if (permit === 'E') {
                $scope.permit[code][2] = !$scope.permit[code][2];

            } else {
                $scope.permit[code][3] = !$scope.permit[code][3];

            }
        }

        $scope.showpermitsParent = true;
        $scope.showHide = function(code) {
            var elem = document.getElementsByClassName(code)[0];
            $scope.permit[code][4] = !$scope.permit[code][4];
            if (elem.children[0].style.display === 'block') {
                elem.children[0].style.display = 'none';
            } else {
                elem.children[0].style.display = 'block';
            }

            for (p = 0; p < $scope.modulesList.length; p++) {
                if ($scope.modulesList[p][0] === code) {
                    $scope.permit[$scope.modulesList[p][1]][4] = $scope.permit[code][4];
                    var childElem = document.getElementsByClassName($scope.modulesList[p][1])[0];
                    childElem.children[0].style.display = elem.children[0].style.display;
                    
                    
                    for (j = 0; j < $scope.modulesList.length; j++) {
                        if ($scope.modulesList[j][0] === code) {
                        	$scope.permit[code][0] = false;
                            $scope.permit[code][1] = false;
                            $scope.permit[code][2] = false;
                            $scope.permit[code][3] = false;
                            $scope.permit[$scope.modulesList[j][1]][0] = false;
                            $scope.permit[$scope.modulesList[j][1]][1] = false;
                            $scope.permit[$scope.modulesList[j][1]][2] = false;
                            $scope.permit[$scope.modulesList[j][1]][3] = false;
                        }
                    }

                }
            }




        }

        $scope.childShowHide = function(code) {
            var elem = document.getElementsByClassName(code)[0];
            $scope.permit[code][3] = !$scope.permit[code][4];

            if (elem.children[0].style.display === 'block') {
                elem.children[0].style.display = 'none';
            } else {
                elem.children[0].style.display = 'block';

            }

        }



        $scope.roleAccessMasterDict = {};
        $scope.roleAccessDetailsList = [];

        $scope.parentNodeChecked = function(code, permit) {

            if (permit === 'V') {
                $scope.permit[code][0] = !$scope.permit[code][0];
                for (j = 0; j < $scope.modulesList.length; j++) {
                    if ($scope.modulesList[j][0] === code) {
                        $scope.permit[$scope.modulesList[j][1]][0] = $scope.permit[code][0];
                        
                        if(!$scope.permit[code][0]) {
                        	$scope.permit[$scope.modulesList[j][1]][1] = $scope.permit[code][0];
                        	$scope.permit[$scope.modulesList[j][1]][2] = $scope.permit[code][0];
                        	$scope.permit[$scope.modulesList[j][1]][3] = $scope.permit[code][0];
                        	$scope.permit[code][1] = $scope.permit[code][0];
                        	$scope.permit[code][2] = $scope.permit[code][0];
                        	$scope.permit[code][3] = $scope.permit[code][0];
                        }
                    }
                }

            } else if (permit === 'C') {
                $scope.permit[code][1] = !$scope.permit[code][1];

                for (j = 0; j < $scope.modulesList.length; j++) {
                    if ($scope.modulesList[j][0] === code) {
                        $scope.permit[$scope.modulesList[j][1]][1] = $scope.permit[code][1];
                    }
                }

            } else if (permit === 'E') {
                $scope.permit[code][2] = !$scope.permit[code][2];

                for (j = 0; j < $scope.modulesList.length; j++) {
                    if ($scope.modulesList[j][0] === code) {
                        $scope.permit[$scope.modulesList[j][1]][2] = $scope.permit[code][2];
                    }
                }

            } else {
                $scope.permit[code][3] = !$scope.permit[code][3];

                for (j = 0; j < $scope.modulesList.length; j++) {
                    if ($scope.modulesList[j][0] === code) {
                        $scope.permit[$scope.modulesList[j][1]][3] = $scope.permit[code][3];
                    }
                }

            }

        }


        $scope.storeDesgPermissions = function() {

            // Sub menu entries	   
            for (l = 0; l < $scope.modulesList.length; l++) {
                var d = new Date();
                var n = d.getTime();
                var roleAccessDetailsObj = {
                    accessdetid: $scope.modulesList[l][1] + n,
                    mdlcode: $scope.modulesList[l][1],
                    readAccess: ($scope.permit[$scope.modulesList[l][1]][0] == true ? 'Y' : 'N'),
                    createAccess: ($scope.permit[$scope.modulesList[l][1]][1] == true ? 'Y' : 'N'),
                    editAccess: ($scope.permit[$scope.modulesList[l][1]][2] == true ? 'Y' : 'N'),
                    deleteAccess: ($scope.permit[$scope.modulesList[l][1]][3] == true ? 'Y' : 'N')
                }

                $scope.roleAccessDetailsList.push(roleAccessDetailsObj);
            }


            // Parent node entries	
            for (l = 0; l < $scope.parentToModules.length; l++) {
                var d = new Date();
                var n = d.getTime();
                var roleAccessDetailsObj = {
                    accessdetid: $scope.parentToModules[l][0] + n,
                    mdlcode: $scope.parentToModules[l][0],
                    readAccess: ($scope.permit[$scope.parentToModules[l][0]][0] == true ? 'Y' : 'N'),
                    createAccess: ($scope.permit[$scope.parentToModules[l][0]][1] == true ? 'Y' : 'N'),
                    editAccess: ($scope.permit[$scope.parentToModules[l][0]][2] == true ? 'Y' : 'N'),
                    deleteAccess: ($scope.permit[$scope.parentToModules[l][0]][3] == true ? 'Y' : 'N')
                }

                $scope.roleAccessDetailsList.push(roleAccessDetailsObj);
            }

            // Creating role master object
//            urlParams = $location.absUrl().split("?");
//            urlParams = urlParams[1].split("=");

            urlParams = id.split("=");
            $scope.roleAccessMasterDict = {
                rolecode: (urlParams[0] === 'rolecode' ? urlParams[1] : null),
                rankcode: (urlParams[0] === 'rankcode' ? urlParams[1] : null),
                usercode: (urlParams[0] === 'empid' ? urlParams[1] : null),
                activeStatus: 'A',
                cruser: '',
                crdate: '',
                upduser: '',
                upddate: '',
            }

            var roleAccessMasterDictData = $scope.roleAccessMasterDict;
            var roleAccessDetailsListData = $scope.roleAccessDetailsList;

            var compositeJson = {
                roleAccessMasterData: roleAccessMasterDictData,
                roleAccessDetailsData: roleAccessDetailsListData
            }

            shorePermissionsService.saveRoleMasterCompositeForm(compositeJson).then(function() {
            	$scope.datastatus = false;
				$scope.informationMessage = "Access Management saved successfully";
				$timeout(function () { $scope.datastatus = true; }, 3000);
                console.log("Success");
            });


        }

    });