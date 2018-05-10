//var app = angular.module('RoleMasterApp', ['angularUtils.directives.dirPagination']);
		app.controller('RoleMasterCtrl', function($scope, Connectivity,$http, $rootScope, $window, $location, $filter,$timeout){			
			$scope.currentPage = 1;
			$scope.hidebody = true;
					 $scope.haspermission = false;
					 $scope.geterrorstatuscode ="0";
					 $scope.unauthorize = function(arg1){
					  if (arg1){
					   $scope.haspermission = true;
					  }
					  $scope.hidebody = false;
					 }					 
					 
					 $scope.startsWith = function (actual, expected) {
					        var lowerStr = (actual + "").toLowerCase();
					        return lowerStr.indexOf(expected.toLowerCase()) === 0;
					 }
					 
					 $scope.$on('$viewContentLoaded', function() {
							$scope.dialog.close();
						
						});
						
						$scope.actions = [
					        { text: 'Okay', action: function(){ $scope.geterrorstatuscode ="0"; }}
					    ];
					 
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
					
	$scope.sort = function(predicate) {
	       $scope.predicate = predicate;
	}	     
	$scope.isSorted = function(predicate) {
	       return ($scope.predicate == predicate)
	}		
					$scope.errorFlag = true;
					$scope.roles = [];
					$scope.shouldShow1 = true;
					$scope.roledisable = true;
//					$scope.pageSize = 25;
					$scope.pageSize = $rootScope.defaultPageSize;
					$scope.datastatus = true;
					var setSessionValues = function() {
					}
					setSessionValues();
					
					
					
					 Connectivity.IsOk().then(function(response){
					$http({
					    url: "/retrieve_role_master/",
					    method: 'GET',
					    
					}).then(function successCallback(response){
						
						$scope.geterrormessages=response.data.message; 
				         $scope.geterrorstatus=response.data.errorstatus;
				         $scope.geterrorstatuscode=response.data.status;                
				         $scope.dataerror =response.data.message;
				         if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 
						$scope.roles = response.data.data;
						console.log("xxxx=> "+$scope.roles);
						
				         }else
							{
							 /*$scope.newdialog.open();
							 $Scope.dataerror = response.data.message;*/	
							
							 $scope.errordetails=response.data.exceptionDetail;
				             $scope.showexception=response.data.showerrormessage
				             $scope.detailerrormessages=response.data.exceptionDetail.exStackTrace; 
				             $scope.dataerror = [response.data.message[0]];
							
							}
						});
					
					 } , function(error){		 
						  $scope.dataerror = "Server not reached";
					  })
					
					
					
					
					
					
					
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
							}).then(
									function successCallback(response) {
										console
												.log("save details");
										$http(
												{
													url : "/retrieve_role_master/",
													method : 'GET',

												})
												.then(
														function successCallback(response) {
															$scope.roles = response.data;
															console.log("Roles --------------- " + $scope.roles);
															$scope.datastatus = false;
															$scope.informationMessage = 'Successfully Saved!';
															$timeout(function () { $scope.datastatus = true; }, 3000);
															$scope.rolename = "";
															$scope.shouldShow = false;
															$scope.shouldShow1 = true;
														});
									});
					}
					}
					
					$scope.roleMasterEdit = function(role) {
						if (role.active_status == 'V') {
							 $scope.datastatus = false;
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
																	$scope.datastatus = false;
																	$scope.informationMessage = 'Successfully Updated!';
																	$timeout(function () { $scope.datastatus = true; }, 3000);
																	$scope.rolename = "";
																	$scope.shouldShow = false;
																	$scope.shouldShow1 = true;
																});
											});
						}
					}

					$scope.removeRoleDetail = function(role) {
						
						var result = confirm("Are you sure you want to Delete?");
						if(result){
							form_data = {
									'id' : role.id,
									'rolecode' : role.rolecode,
									'rolename' : role.rolename,
									'cruser' : role.cruser,
									'crdate' : role.crdate,
									
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
																		$scope.datastatus = false;
																		$scope.informationMessage = 'Role Master Removed!';
																		$timeout(function () { $scope.datastatus = true; }, 3000);
																		$scope.rolename = "";
																		$scope.shouldShow = false;
																		$scope.shouldShow1 = true;
																	});
												});
						}
					
					}

					$scope.set_colorrole = function(role) {						
						if (role.activeStatus == 'V') {
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
								
								$scope.roleName_error = 'Please enter the Role Name';
								$timeout(function() {
									$scope.datastatus = true; }, 3000);
								$scope.errorFlag = false;
						} else {
							$scope.roleName_error = '';
						}
					}
					
					$scope.bindPagination = function(){
						var parent = $('#nav-tabs-0-2').find('.text-center');  // DOM element where the compiled template can be appended
						var html = '<dir-pagination-controls max-size="10" direction-links="true" boundary-links="true" default-page-number="1"> </dir-pagination-controls>';

						// Step 1: parse HTML into DOM element
						var template = angular.element(html);

						// Step 2: compile the template
						var linkFn = $compile(template);

						// Step 3: link the compiled template with the scope.
						var element = linkFn($scope);

						// Step 4: Append to DOM (optional)
						parent.empty();
						parent.append(element);
					}
				});
