/*var app = angular.module('systemconfigApp', ['angularUtils.directives.dirPagination']);*/
app.controller('systemconfigController', function($scope, $http,toaster,Connectivity, $rootScope, $window, $location, $filter,$timeout){	
	$scope.currentPage = 1;
	$scope.hidebody = true;
	 $scope.haspermission = false;
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
	
	$scope.errorFlag = false;
	$scope.shouldShow1 = true;
	$scope.shouldShow = false;
	$scope.disabled = false;
	$scope.msgclear = true;
//	$scope.pageSize = 25;
	$scope.pageSize = $rootScope.defaultPageSize;
	$scope.Sysconfig=[];

	 var setSessionValues = function(){             
    }
	 setSessionValues();
	 
	 
		// Form Retrival system Config
	 /* $http({
		   url: "/retrieve_system-config/",
		    method: 'GET',		    	
		   }).then(function successCallback(response){
			$scope.Sysconfig = response.data;
			console.log("Retrival===========> "+$scope.Sysconfig);
	  });*/

	  Connectivity.IsOk().then(function(response){
		  $http({
			   url: "/retrieve_system-config/",
			    method: 'GET',		    	
			   }).then(function successCallback(response){
				   $scope.Sysconfig=[];
				   $scope.geterrormessages=response.data.message;	
			        $scope.geterrorstatus=response.data.errorstatus;
			        $scope.geterrorstatuscode=response.data.status;                
			        $scope.dataerror =response.data.message;
				   if(response.data.status==0){
				$scope.Sysconfig = response.data.data;
				console.log("Retrival===========> "+$scope.Sysconfig);
				   }else{
					  /* $scope.dialog.open();							
						$scope.dataerror = response.data.message;*/
						$scope.errordetails=response.data.exceptionDetail;
			           	$scope.showexception=response.data.showerrormessage
			           	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
							$scope.dataerror = [response.data.message[0]]; 
				   }
		  });

		 }, function(error){		 
	 		  $scope.dataerror = "Server not reached";
	 	  }) 
	  
	 // save Form to System Config
	    $scope.saveForm = function(){
	    	$scope.validation();
	    	if($scope.errorFlag == true){
				form_data = {
						 'sysparam': $scope.sysparam,
						 'sysvalue':$scope.sysvalue,
				};
				 console.log(form_data);
				 $http({					    
					 	url: "/save-system-config/",
					    dataType: 'json',
					    method: 'POST',
					    data: form_data,
					    headers: {
					        "Content-Type": "application/json"
					    }
				
				 }).then(function successCallback(response){
						$http({
						    url: "/retrieve_system-config/",
						    method: 'GET',					    
						}).then(function successCallback(response){					
							 $scope.Sysconfig = response.data;							
							 $scope.msgclear = false;
							 $scope.informationMessage = 'Successfully Saved!';
							 $timeout( function() { $scope.msgclear = true; }, 3000);
							 $scope.sysparam = "";
							 $scope.sysvalue = "";
							 scope.shouldShow = false;
							 $scope.shouldShow1 = true;
						});
					});				 
	    	};
			
	    };
	    
	    
	    // Edit System Config
	    $scope.SystemConfigEdit = function(Sysconfig){
				 $scope.saveasdisabled = true;
				 $scope.informationMessage = '';				 
				 $scope.shouldShow = true;
				 $scope.shouldShow1 = false;
//				 $scope.id = Mdlidx.id,
				 $scope.sysparam = Sysconfig.sysparam,
				 $scope.sysvalue = Sysconfig.sysvalue,				 
				 console.log($scope.Sysconfig);
				 $http({
					    url: "/retrieve_system-config/",		    
					    method: 'GET',		    
				 }).then(function successCallback(response){
						$scope.Sysconfig = response.data;
						console.log("System Config =======> "+$scope.Sysconfig);
			     });			 
		   //}
			 
	    }
	 
	    
	 // update System Config
	    $scope.updateForm = function(){
	    	console.log("called update form=======>>>>")
			//$scope.validation();	    	 
//			if($scope.errorFlag == true){							
				 form_data = {												 
//						 'id':$scope.id,
				    	  'sysparam': $scope.sysparam,
						  'sysvalue':$scope.sysvalue,
					}			 
				$http({
				    url: "/update_system-config/",
				    dataType: 'json',
				    method: 'POST',
				    data: form_data,
				    headers: {
				        "Content-Type": "application/json"
				    }

				}).then(function successCallback(response){
					$http({
					    url: "/retrieve_system-config/",
					    method: 'GET',					    
					}).then(function successCallback(response){					
						$scope.Sysconfig = response.data;
						console.log("Sysconfig =======> "+$scope.Sysconfig);
						 $scope.msgclear = false;
						 $scope.informationMessage = 'Successfully Updated!';
						 console.log("Update Information Log =============> "+$scope.informationMessage);
						 $timeout( function() { $scope.msgclear = true; }, 3000);
						 $scope.sysparam = "";
						 $scope.sysvalue = "";
						 $scope.shouldShow = false;
						 $scope.shouldShow1 = true;
					});
				});
//			}
		
		}
	    
	    
//	    $scope.deleteForm = function(Mdlidx){
//	    	var result = confirm("Are you sure to delete ? ");
//	    	if (result) {
//			 form_data = {
//					 	'id': Mdlidx.id,	
//					 	'mdlcode': Mdlidx.mdlcode,
//						 'idxvalue': Mdlidx.idxvalue,
//						 'idxprefix': Mdlidx.idxprefix,
//						 'idxpatern': Mdlidx.idxpatern,
//						 'isyearbased': Mdlidx.isyearbased,
//						 'fnyear': Mdlidx.fnyear,
//						 'cruser': Mdlidx.cruser,	
//						 'crdate': Mdlidx.crdate,
//						}
//			 $http({
//				    url: "/delete_ModuleIndex/",
//				    dataType: 'json',
//				    method: 'POST',
//				    data: form_data,
//				    headers: {
//				        "Content-Type": "application/json"
//				    }
//				}).then(function successCallback(response){
//					console.log("Sent and save ed >>>>>>>>>>>");
//					$http({
//					    url: "/zzzzzzzzz/",
//					    method: 'GET',
//					    
//					}).then(function successCallback(response){					
//						$scope.Mdlidx = response.data;
//						console.log("Mdlx =======> "+$scope.Mdlidx);
//						 $scope.msgclear = false;
//						 $scope.informationMessage = 'Module Index Removed!';						 
//						 console.log("Information Log =============> "+$scope.informationMessage);	
//						 $timeout( function() { $scope.msgclear = true; }, 3000);
//						 $scope.sysparam = "";
//						 $scope.sysvalue = "";		
//						 $scope.shouldShow = false;
//						 $scope.shouldShow1 = true;
//						});
//				});
//	    	}	
//			 
//		 }  
	    
	    $scope.cancelForm = function(){
	    	 $scope.saveasdisabled = false;
			 $scope.shouldShow1 = true; 
			 $scope.shouldShow = false; 
			 $scope.sysparam = "";
			 $scope.sysvalue = "";			
		 };
		 
		 
		    $scope.validation = function(){
				 $scope.errorFlag = true;			 
				 if(document.getElementById('sysparam').value==''){
				     $scope.IndexDesc_error = 'Please enter the Description';
				     $scope.errorFlag = false;
				 }else{
				     $scope.IndexDesc_error = '';
				 }
				 if(document.getElementById('sysvalue').value==''){
				     $scope.IndexVal_error = 'Please enter the Value';
				     $scope.errorFlag = false;
				 }else{
				     $scope.IndexVal_error = '';
				 }				 
				 
				// Desc validate Already exist 
				 var Values=$scope.Sysconfig;
				 console.log('Already Exist ----->>',Values);
				 for(var i = 0; i < Values.length; i++) {
					 var data= Values[i];
					 if($scope.sysparam===data.sysparam){
						console.log('Exist ----->>',data.sysvalue);
					    $scope.msgclear = false;
					    $scope.informationMessage = 'Description Already Exists for this '+data.sysvalue+' value';					 
					    $timeout( function() { $scope.msgclear = true; }, 3000);
					    $scope.errorFlag = false;
					 }
				}
			 }
		    
		    
		 
//			 $scope.SaveasForm = function(){
//				 $scope.saveasdisabled = false;
//				 $scope.shouldShow1 = true; 
//				 $scope.shouldShow = false; 
//				 $scope.disabled = false;			 
//				 $scope.IndexValue=0;
//				 console.log($scope.MdlId);
//			 };
//
//			 			
//			$scope.set_color = function (Mdlidx) {
//				  if (Mdlidx.activeStatus == 'V') {
//				    return { color: "red" }
//				  }
//		     }
//			 		 		   
//			    
//			    $scope.hide = function(){
//			        $scope.showModal = false;
//			    }
//			    
//			    $scope.setValue = function(arg1,arg2) {
////			       console.log(arg2)
//			       $scope.ModuleId = arg1;
//			       $scope.ModuleName = arg2;
//			       $scope.hide();
//			    }
			    
			    $scope.bindPagination = function(elm){
					var parent = $(elm).find('div.pull-right'); // DOM element where the compiled template can be appended
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

