var app=angular.module("DepartmentMasterApp",['angularUtils.directives.dirPagination']);
app.controller('DepartmentMasterCtrl',function($scope, $http, $filter, $window, $location, $timeout){
	console.log("Tetsing========== 4444>>>");
	 $scope.errorFlag = true;
	 $scope.datastatus = true;
	 $scope.shouldShow1 = true;
	 $scope.deptdisable=true;
	 $scope.pageSize = 5;
	 $scope.deps=[];

	$http({
	    url: "/retrieve_department_master/",
	    method: 'GET',
	    
	}).then(function successCallback(response){
		$scope.deps = response.data;
		console.log("xxxx=> "+$scope.deps);
		});
//	retrieve=function(){
//		DepartmentMasterService.retrieve();
//		console.log($scope.deps);
//	}
//	  $scope.$watch('selected', function(fac) {
//	       $scope.$broadcast("rowSelected", fac);
//	    });
	
	
	$scope.saveDepartment = function(){
		console.log("Tetsing 111==========>>>");
		$scope.validation();	    	 
		if($scope.errorFlag == true){							
			 form_data = {
					 	 'depcode': $scope.depcode,
						'depname': $scope.depname,						
				}			 
			$http({
			    url: "/save_department_code/",			    
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }

			}).then(function successCallback(response){
				console.log("Sent and save ed >>>>>>>>>>>");
				$http({
				    url: "/retrieve_department_master/",
				    method: 'GET',
				    
				}).then(function successCallback(response){					
					$scope.deps = response.data;
					console.log("xxxx=> "+$scope.deps);	
					 $scope.datastatus=false;
					 $scope.informationMessage = 'Successfully Saved!'; 
					 $timeout(function () { $scope.datastatus = true; }, 3000);
					 $scope.depname = "";
					});
			});
		}
	
	}
	
	 $scope.validation = function(){
		 $scope.errorFlag = true;
		 
		 if(document.getElementById('departmentnametxtid').value==''){
			 $scope.datastatus=false;
		     $scope.departmentName_error = 'Please enter the Department Name';
		     $timeout(function () { $scope.datastatus = true; }, 3000);
		     $scope.errorFlag = false;
		    }
		    else{
		     $scope.departmentName_error = '';
		    }
		 
	 }
	 
	 $scope.departmentMasterEdit = function(deps){	
		 if (deps.active_status == 'V') {
			 $scope.datastatus=false;
			 $scope.informationMessage = 'Deleted record cannot be Edited';
			 $timeout(function () { $scope.datastatus = true; }, 3000);
			  }
		 else{
			 console.log( deps.departmentcode);
			 $scope.shouldShow = true;
			 $scope.shouldShow1 = false;
			 $scope.id = deps.id,
			 $scope.depcode = deps.depcode,
			 $scope.depname = deps.depname,
			 $scope.cruser = deps.cruser;
			 $scope.crdate = deps.crdate;
			 $scope.upduser = deps.upduser;
			 $scope.upddate = deps.upddate;
			 console.log($scope.departmentcode);	
		 }
		 	 
	 }
	
	 $scope.updateDepartment = function(){
			$scope.validation();	    	 
			if($scope.errorFlag == true){							
				 form_data = {
							'id':$scope.id,
						 	'depcode': $scope.depcode,
							'depname': $scope.depname,	
							'cruser': $scope.cruser,	
							'crdate': $scope.crdate,	
							'active_status': $scope.active_status,	
							
					}			 
				$http({
				    url: "/update_Department_code/",
				    dataType: 'json',
				    method: 'POST',
				    data: form_data,
				    headers: {
				        "Content-Type": "application/json"
				    }

				}).then(function successCallback(response){
					$http({
					    url: "/retrieve_department_master/",
					    method: 'GET',
					    
					}).then(function successCallback(response){					
						$scope.deps = response.data;
						console.log("xxxx=> "+$scope.deps);
						$scope.datastatus=false;
						 $scope.informationMessage = 'Successfully Updated!';
						 $timeout(function () { $scope.datastatus = true; }, 3000);
						 $scope.depname = "";
						 $scope.shouldShow = false;
						 $scope.shouldShow1 = true;
						});
				});
			}
		
		} 
	 $scope.removeDepartment = function(){
		 var result = confirm("Want to delete?");
		 if (result) {
		 form_data = {
				 	'id':$scope.id,	
				 	'depcode': $scope.depcode,
					'depname': $scope.depname,	
					'cruser' : $scope.cruser,
					'crdate' : $scope.crdate,
					}
		 	$scope.depcode = "";
			$scope.depname = "";
		 $http({
			    url: "/delete_Department_code/",
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }
			}).then(function successCallback(response){
				console.log("Sent and save ed >>>>>>>>>>>");
				$http({
				    url: "/retrieve_department_master/",
				    method: 'GET',
				    
				}).then(function successCallback(response){					
					$scope.deps = response.data;
					console.log("xxxx=> "+$scope.deps);	
					 $scope.datastatus=false;
					 $scope.informationMessage = 'Department Master Removed!';
					 $timeout(function () { $scope.datastatus = true; }, 3000);
					 $scope.depname = "";
					 $scope.shouldShow = false;
					 $scope.shouldShow1 = true;
					});
			});
		 
	 }
}
	 
	 $scope.set_color = function (deps) {
		  if (deps.active_status == 'V') {
		    return { color: "red" }
		  }
		}
	 
	 $scope.cancelDepartment = function(){
		 $scope.shouldShow1 = true; 
		 $scope.shouldShow = false; 
		 $scope.depname = "";
	 };

	 

		
		$scope.errorFlag = true;
		$scope.roles = [];
		$scope.shouldShow1 = true;
		$scope.roledisable = true;
		$scope.datastatus = true;
		var setSessionValues = function() {
		}
		setSessionValues();
		
		$http({
		    url: "/retrieve_role_master/",
		    method: 'GET',
		    
		}).then(function successCallback(response){
			$scope.roles = response.data;
			console.log("xxxx=> "+$scope.roles);
			});
		
		$scope.$watch('selected', function(fac) {
			$scope.$broadcast("rowSelected", fac);
		});

		$scope.saveRoleDetail = function() {
			$scope.validation();
			if ($scope.errorFlag == true) {
			 console.log("vaaaaaaaaaaaaa");
				form_data = {
					'rolecode' : $scope.rolecode,
					'rolename' : $scope.rolename,
				};
				$http({
					url : "/save_role_master/",
					dataType : 'json',
					method : 'POST',
					data : form_data,
					headers : {
						"Content-Type" : "application/json"
					}
				})
				.then(
						function successCallback(response) {
							console
									.log("save details");
							$http(
									{
										url : "/retrieve_role_master/",
										method : 'GET',

									})
									.then(
											function successCallback(
													response) {
												$scope.roles = response.data;
												console.log("Roles --------------- " + $scope.roles);
												$scope.datastatus=false;
												$scope.informationMessage = 'Successfully Saved!';
												$timeout(function () { $scope.datastatus = true; }, 3000);
												$scope.rolename = "";
												$scope.shouldShow = false;
												$scope.shouldShow1 = true;
											});
						});
		};
		}
		
		$scope.roleMasterEdit = function(role) {
			if (role.active_status == 'V') {
				 $scope.datastatus=false;
				$scope.informationMessage = 'Deleted record cannot be Edited';
				$timeout(function () { $scope.datastatus = true; }, 3000);
			} else {
				console.log(role.rolecode);
				$scope.shouldShow = true;
				$scope.shouldShow1 = false;
				$scope.id = role.id,
						$scope.rolecode = role.rolecode,
						$scope.rolename = role.rolename
				$scope.cruser = role.cruser;
				$scope.crdate = role.crdate;
				$scope.upduser = role.upddate;
				console.log($scope.rolecode);
			}
		}

		$scope.updateRole = function() {
			$scope.validation();
			if ($scope.errorFlag == true) {
				form_data = {
					'id' : $scope.id,
					'rolecode' : $scope.rolecode,
					'rolename' : $scope.rolename,
					'cruser' : $scope.cruser,
					'crdate' : $scope.crdate,
					'active_status' : $scope.active_status,
				}
				$http({
					url : "/update_role_master/",
					dataType : 'json',
					method : 'POST',
					data : form_data,
					headers : {
						"Content-Type" : "application/json"
					}
				})
						.then(
								function successCallback(response) {
									$http(
											{
												url : "/retrieve_role_master/",
												method : 'GET',
											})
											.then(
													function successCallback(
															response) {
														$scope.roles = response.data;
														console.log("Roles --------------- " + $scope.roles);
														$scope.informationMessage = 'Successfully Updated!';
														 $timeout(function () { $scope.datastatus = true; }, 3000);
														$scope.rolename = "";
														$scope.shouldShow = false;
														$scope.shouldShow1 = true;
													});
								});
			}
		}

		$scope.removeRoleDetail = function() {
			
			var result = confirm("Are you sure you want to Delete?");
			if(result){
				form_data = {
						'id' : $scope.id,
						'rolecode' : $scope.rolecode,
						'rolename' : $scope.rolename,
						'cruser' : $scope.cruser,
						'crdate' : $scope.crdate,
					}
					$scope.rolecode = "";
					$scope.rolename = "";
					$http({
						url : "/delete_role_master/",
						dataType : 'json',
						method : 'POST',
						data : form_data,
						headers : {
							"Content-Type" : "application/json"
						}
					})
							.then(
									function successCallback(response) {
										console.log("saved details....");
										$http({
											url : "/retrieve_role_master/",
											method : 'GET',

										})
												.then(
														function successCallback(
																response) {
															$scope.roles = response.data;
															console.log("Roles --------------- " + $scope.roles);
															$scope.informationMessage = 'Roles Master Removed!';
															$timeout(function () { $scope.datastatus = true; }, 3000);
															$scope.rolename = "";
															$scope.shouldShow = false;
															$scope.shouldShow1 = true;
														});
									});
			}
		
		}

//		$scope.set_color = function(role) {
//			if (role.active_status == 'V') {
//				return {
//					color : "red"
//				}
//			}
//		}

		
		$scope.set_color = function(deps) {
			if (deps.activeStatus == 'V') {
//				console.log('ACTIVE STATUS==========',deps.activeStatus);
				return {
					color : "red"
				}
			}
		}
		
		$scope.cancelRole = function() {
			$scope.shouldShow1 = true;
			$scope.shouldShow = false;
			$scope.rolename = "";
		};
		
		$scope.validation = function() {
			$scope.errorFlag = true;

			if (document.getElementById('rolename').value == '') {
				$scope.roleName_error = 'Please enter the Role Name';
				$scope.errorFlag = false;
			} else {
				$scope.roleName_error = '';
			}
			if ($scope.rolename == "" || $scope.rolename == undefined) {
					$scope.datastatus = false;
					$scope.roleName_error = 'Please enter the Role Name';
					$timeout(function() {
						$scope.datastatus = true; }, 3000);
					$scope.errorFlag = false;
			} else {
				$scope.roleName_error = '';
			}
		}
	 
	 
});