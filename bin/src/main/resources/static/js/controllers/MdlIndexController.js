//var app = angular.module('MdlIndexApp', ['angularUtils.directives.dirPagination']);
app.controller('MdlIndexController', function($scope, $rootScope, $http,toaster,Connectivity,$window, $location, $filter, $timeout,$compile){	
	
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
	 
	 $scope.actions = [
         { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
     ];
	 
	/* $http({
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
	});*/
	 
	 
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
	$scope.Mdlidx=[];

	 var setSessionValues = function(){             
    }
	 setSessionValues();
	  
	// Form Retrival Module index
	 
	 Connectivity.IsOk().then(function(response){
	  $http({
		    url: "/retrieve_ModuleIndex/",
		    method: 'GET',		    	
		   }).then(function successCallback(response){
			   $scope.geterrormessages=response.data.message;	
	            $scope.geterrorstatus=response.data.errorstatus;
	            $scope.geterrorstatuscode=response.data.status;                
	            $scope.dataerror =response.data.message;
	         if(response.data.status==0){
			$scope.Mdlidx = response.data.data;
			console.log($scope.Mdlidx);
             }else{            	    
            	    $scope.dataerror = response.data.message; 
	    			$scope.errordetails=response.data.exceptionDetail;
	               	$scope.showexception=response.data.showerrormessage
	               	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
//	    			$scope.dataerror = [response.data.message[0]]; 
	    		}
			});
	 },function(error){		 
		  $scope.dataerror = "Server not reached";
	   });
	 
	 // save Form to Module Index
	    $scope.saveForm = function(){
	    	console.log("enter in save"+$scope.FinYear);
	    	$scope.validation();
	    	if($scope.errorFlag == true){
				form_data = {
						 'mdlcode': $scope.ModuleId,
						 'idxvalue':$scope.IndexValue,
						 'idxprefix':$scope.IndexPrefix,
						 'idxpatern': $scope.IndexPattern,
						 'isyearbased': $scope.yearbased,
						 'fnyear': $scope.FinYear,
						 'cruser': $scope.cruser,	
						 'crdate': $scope.crdate,
				};
				 console.log(form_data);
				 $http({					    
					 	url: "/MdlIndex-form-submission/",
					    dataType: 'json',
					    method: 'POST',
					    data: form_data,
					    headers: {
					        "Content-Type": "application/json"
					    }
				
				 }).then(function successCallback(response){
						$http({
						    url: "/retrieve_ModuleIndex/",
						    method: 'GET',					    
						}).then(function successCallback(response){					
							$scope.Mdlidx = response.data;
							console.log("xxxx=> "+$scope.Mdlidx);
							 $scope.msgclear = false;
							 $scope.informationMessage = 'Successfully Saved!';
							 $timeout( function() { $scope.msgclear = true; }, 3000);
							 	$scope.ModuleId = "";
							    $scope.ModuleName = "";
								$scope.IndexValue = "";
								$scope.IndexPrefix = "";
								$scope.IndexPattern = "";
								$scope.yearbased = "";
								$scope.FinYear = "";
							 $scope.shouldShow = false;
							 $scope.shouldShow1 = true;
						});
					});				 
	    	};
			
	    };
	    
	    
	    // Edit Module Index
	    $scope.MdlIndexEdit = function(Mdlidx){
			 if (Mdlidx.activeStatus == 'V') {
				    $scope.ModuleId = "";
				    $scope.ModuleName = "";
					$scope.IndexValue = "";
					$scope.IndexPrefix = "";
					$scope.IndexPattern = "";
//					$scope.yearbased = "";
					$scope.FinYear = "";
					$scope.msgclear = false;
				    $scope.informationMessage = 'Deleted record cannot be Edited';
				    $timeout( function() { $scope.msgclear = true; }, 3000);
				    $scope.shouldShow1 = true;
					$scope.shouldShow = false;
				    if($scope.yearbased=='N'){
						 $scope.yearbased='Y'
					 }else{
						 $scope.yearbased='Y'
					}
				  }
			 else if(Mdlidx.activeStatus == 'A'){
				 $scope.saveasdisabled = true;
				 $scope.informationMessage = '';				 
				 console.log( Mdlidx.mdlcode);
				 $scope.shouldShow = true;
				 $scope.shouldShow1 = false;
				 $scope.id = Mdlidx.id,
				 $scope.ModuleId = Mdlidx.mdlcode,
				 $scope.IndexPrefix = Mdlidx.idxprefix,
				 $scope.IndexPattern = Mdlidx.idxpatern,
				 $scope.IndexValue = Mdlidx.idxvalue,
				 $scope.yearbased = Mdlidx.isyearbased,
				 $scope.FinYear = Mdlidx.fnyear,
				 $scope.cruser = Mdlidx.cruser;
				 $scope.crdate = Mdlidx.crdate;
				 $scope.upduser = Mdlidx.upduser;
				 $scope.upddate = Mdlidx.upddate;
				 console.log($scope.mdlcode);
				 
				 
				 $http({
			         method: 'GET',
			         url: "/retrieve_ModuleCreation/",
			     }).then(
			         function successCallback(responses) {			         
			         $scope.mdlcrtn = responses.data; 		         
			         angular.forEach($scope.mdlcrtn, function(value, key) {
			          var mdlcode = value.mdlcode;
			          var mdlname = value.mdlname;
			          console.log(mdlname);
			          console.log(mdlcode);
			          if($scope.ModuleId==mdlcode){
			        	   $scope.ModuleName=value.mdlname;
			           }
			          });
			    });				 
		        }
			 
	    }
	 
	    
	 // update Form to Module Index
	    $scope.updateForm = function(){
	    	console.log("called update form=======>>>>")
			//$scope.validation();	    	 
//			if($scope.errorFlag == true){							
				 form_data = {												 
						 'id':$scope.id,
						 'mdlcode': $scope.ModuleId,
						 'idxvalue':$scope.IndexValue,
						 'idxprefix':$scope.IndexPrefix,
						 'idxpatern': $scope.IndexPattern,
						 'isyearbased': $scope.yearbased,
						 'fnyear': $scope.FinYear,
						 'cruser': $scope.cruser,	
						 'crdate': $scope.crdate,
					}			 
				$http({
				    url: "/update_ModuleIndex/",
				    dataType: 'json',
				    method: 'POST',
				    data: form_data,
				    headers: {
				        "Content-Type": "application/json"
				    }

				}).then(function successCallback(response){
					$http({
					    url: "/retrieve_ModuleIndex/",
					    method: 'GET',					    
					}).then(function successCallback(response){					
						$scope.Mdlidx = response.data;
						console.log("Mdl =======> "+$scope.Mdlidx);
						 $scope.msgclear = false;
						 $scope.informationMessage = 'Successfully Updated!';
						 console.log("Update Information Log =============> "+$scope.informationMessage);
						 $timeout( function() { $scope.msgclear = true; }, 3000);
						 $scope.ModuleId = "";
						    $scope.ModuleName = "";
							$scope.IndexValue = "";
							$scope.IndexPrefix = "";
							$scope.IndexPattern = "";
							$scope.yearbased = "";
							$scope.FinYear = "";
						 $scope.shouldShow = false;
						 $scope.shouldShow1 = true;
					});
				});
//			}
		
		}
	    
	    
	    $scope.deleteForm = function(Mdlidx){
	    	var result = confirm("Are you sure to delete ? ");
	    	if (result) {
			 form_data = {
					 	'id': Mdlidx.id,	
					 	'mdlcode': Mdlidx.mdlcode,
						 'idxvalue': Mdlidx.idxvalue,
						 'idxprefix': Mdlidx.idxprefix,
						 'idxpatern': Mdlidx.idxpatern,
						 'isyearbased': Mdlidx.isyearbased,
						 'fnyear': Mdlidx.fnyear,
						 'cruser': Mdlidx.cruser,	
						 'crdate': Mdlidx.crdate,
						}
			 $http({
				    url: "/delete_ModuleIndex/",
				    dataType: 'json',
				    method: 'POST',
				    data: form_data,
				    headers: {
				        "Content-Type": "application/json"
				    }
				}).then(function successCallback(response){
					console.log("Sent and save ed >>>>>>>>>>>");
					$http({
					    url: "/retrieve_ModuleIndex/",
					    method: 'GET',
					    
					}).then(function successCallback(response){					
						$scope.Mdlidx = response.data;
						console.log("Mdlx =======> "+$scope.Mdlidx);
						 $scope.msgclear = false;
						 $scope.informationMessage = 'Module Index Removed!';						 
						 console.log("Information Log =============> "+$scope.informationMessage);	
						 $timeout( function() { $scope.msgclear = true; }, 3000);
						    $scope.ModuleId = "";
						    $scope.ModuleName = "";
							$scope.IndexValue = "";
							$scope.IndexPrefix = "";
							$scope.IndexPattern = "";
							$scope.yearbased = "";
							$scope.FinYear = "";
						 $scope.shouldShow = false;
						 $scope.shouldShow1 = true;
						});
				});
	    	}	
			 
		 }  
	    
	    $scope.cancelForm = function(){
			 $scope.shouldShow1 = true; 
			 $scope.shouldShow = false; 
			 $scope.ModuleId = "";
			 $scope.ModuleName = "";
			 $scope.IndexValue = "";
			 $scope.IndexPrefix = "";
			 $scope.IndexPattern = "";
//			 $scope.yearbased = "";
			 $scope.FinYear = "";
			 console.log($scope.yearbased);
			 if($scope.yearbased=='N'){
				 $scope.yearbased='Y'
			 }else{
				 $scope.yearbased='Y'
			 }
		 };
		 
		 
		    $scope.validation = function(){
				 $scope.errorFlag = true;			 
//				 if(document.getElementById('mdlname3').value==''){
//				     $scope.MdlName_error = 'Please enter the Module Name';
//				     $scope.errorFlag = false;
//				 }else{
//				     $scope.MdlName_error = '';
//				 }
//				 if(document.getElementById('mdlid3').value==''){
//				     $scope.MdlCode_error = 'Please enter the Module Code';
//				     $scope.errorFlag = false;
//				 }else{
//				     $scope.MdlCode_error = '';
//				 }
				 if(document.getElementById('idxval3').value==''){
				     $scope.IndexVal_error = 'Please enter the Index Value';
				     $scope.errorFlag = false;
				 }else{
				     $scope.IndexVal_error = '';
				 }
				 if(document.getElementById('idxpre3').value==''){
				     $scope.IndexPre_error = 'Please enter the Index Prefix';
				     $scope.errorFlag = false;
				 }else{
				     $scope.IndexPre_error = '';
				 }
				 if(document.getElementById('idxptn3').value==''){
				     $scope.IndexPtn_error = 'Please enter the Index Pattern';
				     $scope.errorFlag = false;
				 }
				 else{
				     $scope.IndexPtn_error = '';
				 }
				 
				 
				 // To validate Already exist 
				 var Values=$scope.Mdlidx;
				 console.log(Values);
//				 console.log(Values);
				 for(var i = 0; i < Values.length; i++) {
					    var data= Values[i];
					    if($scope.ModuleId===data.mdlcode
					    		&& data.activeStatus.toUpperCase() == 'A' 
					    			&& data.isyearbased  == $scope.yearbased
					    			&& data.fnyear  == $scope.FinYear){
//					    	console.log(document.getElementById('mdlid3').value);
//			    			 console.log(data.mdlcode);
					    	   $scope.msgclear = false;
					    	   $scope.informationMessage = 'Module Code Already Exists';
					    	   $timeout( function() { $scope.msgclear = true; }, 3000);
					    	 $scope.errorFlag = false;
					    }
					}
//				 console.log($scope.errorFlag);
			 }
		 
});


app.controller('ModuleCreationController', function($scope, $rootScope, $http,toaster,Connectivity,$window, $location, $filter, $timeout,$compile){
		 
	
	
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
	 
	 $scope.actions = [
        { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
    ];
	 
	/* $http({
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
	});*/
	 
	 
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
	$scope.Mdlidx=[];

	 var setSessionValues = function(){             
   }
	 setSessionValues();
	 
		 // FOR MODULE CREATION STARTS
		 
		 
		// Form Retrival Module creation
//		    Connectivity.IsOk().then(function(response){
//		  $http({
//			    url: "/retrieve_ModuleCreation/",		    
//			    method: 'GET',		    
//			   }).then(function successCallback(response){
//					$scope.geterrormessages=response.data.message;	
//	                $scope.geterrorstatus=response.data.errorstatus;
//	                $scope.geterrorstatuscode=response.data.status;                
//	                $scope.dataerror =response.data.message;
//				   if(response.data.status==0 && response.data.length!=0 ){
//				   console.log(response.data);
//				$scope.Mdlcrn = response.data.data;
//					}else{
//						
//						$scope.errordetails=response.data.exceptionDetail;
//	                   	$scope.showexception=response.data.showerrormessage
//	                   	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
//	   					$scope.dataerror = [response.data.message[0]]; 
//					}
//	      });
//		  
//		    },function(error){		 
//				  $scope.dataerror = "Server not reached";
//			  });
		    
		    
		    Connectivity.IsOk().then(function(response){
				  $http({
					    url: "/retrieve_ModuleCreation/",		    
					    method: 'GET',		    
					   }).then(function successCallback(response){
							$scope.geterrormessages=response.data.message;	
			                $scope.geterrorstatus=response.data.errorstatus;
			                $scope.geterrorstatuscode=response.data.status;                
			                $scope.dataerror =response.data.message;
						   if(response.data.status==0){
//						   console.log(response.data);
						$scope.Mdlcrn = response.data.data;
							}else{
								$scope.dataerror1 = [response.data.message[0]]; 
								$scope.errordetails=response.data.exceptionDetail;
			                   	$scope.showexception=response.data.showerrormessage
			                   	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
							}
			      });
				  
				    },function(error){		 
						  $scope.dataerror = "Server not reached";
				}); 
		    
		// Form Retrival Module creation URL
//		  $http({
//			    url: "/retrieve_ModuleCreationURL/",		    
//			    method: 'GET',		    
//			   }).then(function successCallback(response){
//				$scope.Mdlcrn = response.data;
//				console.log("=============>>>>>>");
//				console.log(response.data);
//	      });



	// save Form to Module Creation
		    $scope.saveModuleCreation = function(){
		    	console.log("enter into module creation save========>>>");
		    	$scope.mdlcrtnvalidation();
		    //	if($scope.errorFlag == true){
					form_data = {
							 'mdlcode': $scope.MdlId,
							 'mdlname':$scope.mdlname,
							 'parentcode':$scope.prntcode,
							 'menutype': $scope.menutype,
							 'url': $scope.url,
							 'autosaveEnb': $scope.autosave,
					};
					 
					 $http({
						 	url: "/Save-modulecreation/",
						    dataType: 'json',
						    method: 'POST',
						    data: form_data,
						    headers: {
						        "Content-Type": "application/json"
						    }
					
					 }).then(function successCallback(response){
							$http({
							    url: "/retrieve_ModuleCreation/",
							    method: 'GET',					    
							}).then(function successCallback(response){					
								$scope.Mdlcrn = response.data;
								console.log("xxxx=> "+$scope.Mdlcrn);
								 $scope.msgclear = false;
								 $scope.informationMessage = 'Successfully Saved!';
								 $timeout( function() { $scope.msgclear = true; }, 3000);
								 $scope.MdlId = "";
								 $scope.mdlname = "";
								 $scope.prntcode = "";
								 $scope.url = "";
								 $scope.shouldShow = false;
								 $scope.shouldShow1 = true;
							});
						});				 
		    	//};
				
		    };
		    

	// Edit Module Creation
		    $scope.MdlCreationEdit = function(Mdlcrn){
		    	console.log( Mdlcrn.activeStatus);
				 if (Mdlcrn.activeStatus == 'V') {
					    console.log( Mdlcrn.activeStatus);
					    $scope.MdlId = "";
						$scope.mdlname = "";
						$scope.prntcode = "";
						$scope.menutype = "";
						$scope.url = "";
						$scope.autosave = "";
						$scope.msgclear = false;
					    $scope.informationMessage = 'Deleted record cannot be Edited';
					    $scope.shouldShow1 = true;
						$scope.shouldShow = false;
					    $timeout( function() { $scope.msgclear = true; }, 3000);
					    if($scope.menutype=='M'){
							 $scope.menutype='H'
						 }else{
							 $scope.menutype='H'
						 }
						 if($scope.autosave=='N'){
							 $scope.autosave='Y'
						 }else{
							 $scope.autosave='Y'
						 }
				 }
				 else if(Mdlcrn.activeStatus == 'A'){
					 $scope.informationMessage = '';
					 console.log( Mdlcrn.mdlcode);
					 console.log( Mdlcrn.activeStatus);
					 $scope.shouldShow = true;
					 $scope.shouldShow1 = false;
					 $scope.disabled = true;
					 $scope.id = Mdlcrn.id,
					 $scope.MdlId = Mdlcrn.mdlcode,
					 $scope.mdlname = Mdlcrn.mdlname,					 
					 $scope.prntcode = Mdlcrn.parentcode,
					 $scope.menutype = Mdlcrn.menutype,
					 $scope.url = Mdlcrn.url,
					 $scope.autosave = Mdlcrn.autosaveEnb,					 
					 $scope.cruser = Mdlcrn.cruser;
					 $scope.crdate = Mdlcrn.crdate;
					 $scope.upduser = Mdlcrn.upduser;
					 $scope.upddate = Mdlcrn.upddate;
					 console.log($scope.mdlcode);	
				 }
				 	 
			 }

	// update Form to Module Creation
		    $scope.updateModuleCreation = function(){
			//	$scope.mdlcrtnvalidation();	    	 
			//	if($scope.errorFlag == true){							
					 form_data = {							
//							 'id':$scope.id,
							 'mdlcode': $scope.MdlId,
							 'mdlname':$scope.mdlname,
							 'parentcode':$scope.prntcode,
							 'menutype': $scope.menutype,
							 'url': $scope.url,
							 'autosaveEnb': $scope.autosave,
							 'cruser': $scope.cruser,	
							 'crdate': $scope.crdate,
						}			 
					$http({
					    url: "/update_moduleCreation/",
					    dataType: 'json',
					    method: 'POST',
					    data: form_data,
					    headers: {
					        "Content-Type": "application/json"
					    }

					}).then(function successCallback(response){
						$http({
						    url: "/retrieve_ModuleCreation/",
						    method: 'GET',					    
						}).then(function successCallback(response){					
							$scope.Mdlcrn = response.data;
							console.log("Mdl CRN =======> "+$scope.Mdlcrn);	
							 $scope.msgclear = false;
							 $scope.informationMessage = 'Successfully Updated!';
							 $scope.disabled = false;
							 console.log("Update Module Creation =============> "+$scope.informationMessage);
							 $timeout( function() { $scope.msgclear = true; }, 3000);
							 $scope.MdlId = "";
							 $scope.mdlname = "";
							 $scope.prntcode = "";							 
							 $scope.url = "";
							 $scope.menutype = "";
							 $scope.autosave = "";							 
							 $scope.shouldShow = false;
							 $scope.shouldShow1 = true;							 
						});
					});
				//}
			
			}



	// Delete Form Moduele Creation
		    $scope.deleteModuleCreation = function(Mdlcrn){
		    	var result = confirm("Are you sure to delete ? ");
		    	console.log(result);
		    	if (result) {
				 form_data = {
						 	 'mdlcode': Mdlcrn.mdlcode,
							 'mdlname': Mdlcrn.mdlname,
							 'parentcode': Mdlcrn.parentcode,
							 'menutype': Mdlcrn.menutype,
							 'url': Mdlcrn.url,
							 'autosaveEnb': Mdlcrn.autosaveEnb,
							 'cruser': Mdlcrn.cruser,	
							 'crdate': Mdlcrn.crdate,
							
							}
		/*		 	$scope.MdlId = "";
					$scope.mdlname = "";
					$scope.prntcode = "";
					$scope.menutype = "";
					$scope.url = "";
					$scope.autosave = "";*/
				 $http({
					    url : "/delete_ModuleCreation/",
					    dataType : 'json',
					    method : 'POST',
					    data : form_data,
					    headers: {
					        "Content-Type": "application/json"
					    }
					}).then(function successCallback(response){
						console.log("Delete Mdl creation  >>>>>>>>>>>");
						$http({
						    url: "/retrieve_ModuleCreation/",
						    method: 'GET',
						    
						}).then(function successCallback(response){					
							$scope.Mdlcrn = response.data;
							console.log("Mdlx =======> "+$scope.Mdlcrn);
							$scope.msgclear = false;
							 $scope.informationMessage = 'Module Creation Removed!';	
							 $timeout( function() { $scope.msgclear = true; }, 3000);
							 console.log("Information Log =============> "+$scope.informationMessage);	
							 $scope.MdlId = "";
							 $scope.mdlname = "";
							 $scope.prntcode = "";
							 $scope.menutype = "";
							 $scope.url = "";
							 $scope.autosave = "";
							 $scope.shouldShow = false;
							 $scope.shouldShow1 = true;
							});
					});
		    	}	
				 
			 }		    		   
		    
		    // For Module Creation Validation
		    $scope.mdlcrtnvalidation = function(){
				 $scope.errorFlag = true;
//				 $scope.msgclear = false;
//				 if(document.getElementById('mdlname3').value==''){
//				     $scope.MdlName_error = 'Please enter the Module Name';
//				     $timeout( function() { $scope.msgclear = true; }, 3000);
//				     $scope.errorFlag = false;
//				 }else{
//				     $scope.MdlName_error = '';
//				 }
//				 if(document.getElementById('mdlid3').value==''){
//				     $scope.msgclear = false;
//				     $scope.MdlCode_error = 'Please enter the Module Code';
//				     $timeout( function() { $scope.msgclear = true; }, 3000);
//				     $scope.errorFlag = false;
//				 }else{
//				     $scope.MdlCode_error = '';
//				 }
				 if(document.getElementById('parenttext').value==''){					 
				     $scope.PrntCode_error = 'Please enter the Parent Code';
//				     $scope.errorFlag = false;
				 }else{
				     $scope.PrntCode_error = '';
				 }
				 if(document.getElementById('url').value==''){
				     $scope.Url_error = 'Please enter the URL';
				     $scope.errorFlag = false;
				 }else{
				     $scope.Url_error = '';
				 }			 
				 
				 
				 // To validate Already exist for Module Creation
				 var Values=$scope.Mdlcrn;
//				 console.log(Values);
				 for(var i = 0; i < Values.length; i++) {
					    var data= Values[i];
					    if($scope.MdlId.toUpperCase()===data.mdlcode.toUpperCase() && data.activeStatus.toUpperCase() == 'A'){
//					    	console.log(document.getElementById('mdlid3').value);
//			    			 console.log(data.mdlcode);
					    	   $scope.msgclear = false;
					    	   $scope.informationMessage = 'Module Code Already Exists';
					    	   $timeout( function() { $scope.msgclear = true; }, 3000);
//					    	 $scope.errorFlag = false;
					    }
					}
//				 console.log($scope.errorFlag);
			 }


			$scope.cancelModuleCreation = function(){
				 $scope.shouldShow1 = true; 
				 $scope.shouldShow = false; 
				 $scope.disabled = false;
				 $scope.MdlId = "";
				 $scope.mdlname = "";
				 $scope.prntcode = "";
				 $scope.menutype = "";
				 $scope.url = "";
				 $scope.autosave = "";
				 if($scope.menutype=='M'){
					 $scope.menutype='H'
				 }else{
					 $scope.menutype='H'
				 }
				 if($scope.autosave=='N'){
					 $scope.autosave='Y'
				 }else{
					 $scope.autosave='Y'
				 }
			 };
			 
			 
			 $scope.SaveasForm = function(){
				 $scope.saveasdisabled = false;
				 $scope.shouldShow1 = true; 
				 $scope.shouldShow = false; 
				 $scope.disabled = false;
//				 $scope.MdlId = "";
//				 $scope.mdlname = "";
//				 $scope.prntcode = "";
//				 $scope.menutype = "";
//				 $scope.url = "";
//				 $scope.autosave = "";				 
				 $scope.IndexValue=0;
//				 if($scope.menutype=='M'){
//					 $scope.menutype='H'
//				 }else{
//					 $scope.menutype='H'
//				 }
//				 if($scope.autosave=='N'){
//					 $scope.autosave='Y'
//				 }else{
//					 $scope.autosave='Y'
//				 }
				 console.log($scope.MdlId);
			 };
			 
			// FOR MODULE CREATION ENDS
			 			
			$scope.set_color = function (Mdlidx) {
				  if (Mdlidx.activeStatus == 'V') {
				    return { color: "red" }
				  }
		     }
			 
});
