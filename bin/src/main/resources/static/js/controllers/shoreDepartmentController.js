//var app = angular.module('ShoreRoleMasterApp', ['angularUtils.directives.dirPagination']);
	app.controller('ShoreDepartmentMasterCtrl', function($scope, Connectivity,$http, $rootScope, $window, $location, $filter,$timeout){			
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
	 $scope.datastatus = true;
	 $scope.shouldShow1 = true;
	 $scope.deptdisable = true;
//	 $scope.pageSize = 25;
	 $scope.pageSize = $rootScope.defaultPageSize;
	 $scope.deps=[];	 	
	 
	 $scope.set_color = function(deps) {
			if (deps.activeStatus == 'V') {
				return {
					color : "red"
				}
			}
	}
	 
	 Connectivity.IsOk().then(function(response){ 
	$http({
	    url: "/retrieve_shore_department_master/",
	    method: 'GET',
	    
	}).then(function successCallback(response){
		$scope.geterrormessages=response.data.message; 
        $scope.geterrorstatus=response.data.errorstatus;
        $scope.geterrorstatuscode=response.data.status;                
        $scope.dataerror =response.data.message;
        if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 
	
		$scope.deps = response.data.data;
		console.log("xxxx=> "+$scope.deps);
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
			    url: "/save_shore_department_code/",			    
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }

			}).then(function successCallback(response){
				console.log("Sent and save ed >>>>>>>>>>>");
				$http({
				    url: "/retrieve_shore_department_master/",
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
				    url: "/update_shore_Department_code/",
				    dataType: 'json',
				    method: 'POST',
				    data: form_data,
				    headers: {
				        "Content-Type": "application/json"
				    }

				}).then(function successCallback(response){
					$http({
					    url: "/retrieve_shore_department_master/",
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
	 $scope.removeDepartment = function(deps){
		 var result = confirm("Want to delete?");
		 if (result) {
		             form_data = {
				 	'id': deps.id,	
				 	'depcode': deps.depcode,
					'depname': deps.depname,	
					'cruser' : deps.cruser,
					'crdate' : deps.crdate,
					}
		 
		 $http({
			    url: "/delete_shore_Department_code/",
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }
			}).then(function successCallback(response){
				console.log("Sent and save ed >>>>>>>>>>>");
				$http({
				    url: "/retrieve_shore_department_master/",
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
//	 $scope.set_color = function (deps) {
//		  if (deps.active_status == 'V') {
//		    return { color: "red" }
//		  }
//		}
	 
	 
	 $scope.set_color = function(deps) {
			if (deps.activeStatus == 'V') {
					return {
								color : "red"
							}
			 }
		}
	 
	 $scope.cancelDepartment = function(){
		 $scope.shouldShow1 = true; 
		 $scope.shouldShow = false; 
		 $scope.depname = "";
	 };
	 
	 $scope.bindPagination = function(){
			var parent = $('#nav-tabs-0-1').find('.text-center'); // DOM element where the compiled template can be appended
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
