app.controller('PortmasterCtrl',function($scope, $http,$rootScope, toaster,Connectivity, $filter, $window, $location, $timeout ){
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
	 
	 $scope.$on('$viewContentLoaded', function() {
		 $scope.dialog.close();
			
		});
	 
	 $scope.startsWith = function (actual, expected) {
	        var lowerStr = (actual + "").toLowerCase();
	        return lowerStr.indexOf(expected.toLowerCase()) === 0;
	 }
	 
	 $scope.actions = [
         { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
     ];
	 
	 var i =0;
	 $scope.finishLoading = function() {
		   	var head = document.getElementsByTagName('head').item(0);
		   	var script = document.createElement('script');
		 	script.src = 'scripts/colors.js';
		    head.appendChild(script);
		    $timeout(function(){
			 if (i==1){
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
			 i++;
	    }, 0);
	 }
	 
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
	
	
	
	$scope.errorFlag = true;
	$scope.datastatus = true;
	$scope.shouldShow1 = true;
	$scope.ports=[];
	$scope.pageSize = 25;
	 
    $scope.saveForm = function(){
    	
		   $scope.validation();	    	 
		   if($scope.errorFlag == true){
				 form_data = {
						 	 'portcode': $scope.portcode,
							'portname': $scope.portname,
							'countrycode': $scope.countrycode,
							'countryname': $scope.countryname,
						
							
							
					};			 
				$http({
				    url: "/save_port_master/",			    
				    dataType: 'json',
				    method: 'POST',
				    data: form_data,
				    headers: {
				        "Content-Type": "application/json"
				    }

				}).then(function successCallback(response){
					console.log("Sent and save ed >>>>>>>>>>>");
					$http({
				        method: 'GET',
				        url: "/get-portmaster-values/?countrycode="+$scope.countrycode,
					}).then(function successCallback(response){					
						var temp = response.data;
			             temp = $filter('orderBy')(temp, 'portcode', false)
			            $scope.ports = temp;
						 $scope.datastatus=false;
						 $scope.informationMessage = 'Successfully Saved!'; 
					     $timeout(function () { $scope.datastatus = true; }, 3000);
						 $scope.portcode = "";
						 $scope.portname = "";
						 $scope.countrycode = "";
						 $scope.countryname = "";
						 $scope.shouldShow1 = true;
						 $scope.shouldShow = false;
						});
				});
			}
		
		} 
    
   $scope.validation = function(){
		 $scope.errorFlag = true;
		 
	 if(document.getElementById('Portcode').value==''){
		 $scope.datastatus=false;
	     $scope.Portcode_error = 'Please enter the Port Code';
	     $timeout(function () { $scope.datastatus = true; }, 3000);
	     $scope.errorFlag = false;
		    }
	    else{
	     $scope.Portcode_error = '';
	    }
		 
	 if(document.getElementById('Portname').value==''){
		 $scope.datastatus=false;
	     $scope.Portname_error = 'Please enter the Port Name';
	     $timeout(function () { $scope.datastatus = true; }, 3000);
	     $scope.errorFlag = false;
		    }
	    else{
	     $scope.Portname_error = '';
	    }
	
	 if(document.getElementById('Countrycode').value==''){
		 $scope.datastatus=false;
	     $scope.Countrycode_error = 'Please enter the Country Code';
	     $timeout(function () { $scope.datastatus = true; }, 3000);
	     $scope.errorFlag = false;
		    }
	    else{
	     $scope.Countrycode_error = '';
	    }
	 }
    
	$scope.sort = function(predicate) {
	       $scope.predicate = predicate;
	     }	     
	     $scope.isSorted = function(predicate) {
	       return ($scope.predicate == predicate)
	     }
    $scope.portMasterEdit = function(ports){	
		 if (ports.active_status == 'V') {
			 $scope.datastatus=false;
			 $scope.informationMessage = 'Deleted record cannot be Edited';
			 $timeout(function () { $scope.datastatus = true; }, 3000);
			  }
		 else{
			 console.log(ports.portcode);
			 $scope.shouldShow = true;
			 $scope.shouldShow1 = false;
			 $scope.id = ports.id,
			 $scope.portcode = ports.portcode,
			 $scope.portname = ports.portname,
			 $scope.countrycode = ports.countrycode,
			 $scope.countryname = ports.countryname,
			 $scope.cruser = ports.cruser;
			 $scope.crdate = ports.crdate;
			 $scope.upduser = ports.upduser;
			 $scope.upddate = ports.upddate;
			 console.log($scope.portcode);	
		 }
		 	 
	 }
    
    $scope.updateForm = function(){
	$scope.validation();	    	 
		if($scope.errorFlag == true){							
			 form_data = {
						'id':$scope.id,
					 	'portcode': $scope.portcode,
					 	'portname': $scope.portname,
						'countrycode': $scope.countrycode,	
						'countryname': $scope.countryname,
						'cruser': $scope.cruser,	
						'crdate': $scope.crdate,	
						'active_status': $scope.active_status,	
						
				}			 
			$http({
			    url: "/update_port_master/",
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }

			}).then(function successCallback(response){
				console.log("Sent and save ed >>>>>>>>>>>");
				$http({
				        method: 'GET',
				        url: "/get-portmaster-values/?countrycode="+$scope.countrycode,
				}).then(function successCallback(response){					
					var temp = response.data;
		             temp = $filter('orderBy')(temp, 'portcode', false)
		          $scope.ports = temp;
					 $scope.datastatus=false;
					 $scope.informationMessage = 'Successfully Updated!'; 
					 $timeout(function () { $scope.datastatus = true; }, 3000);
					 $scope.portcode = "";
					 $scope.portname = "";
					 $scope.countrycode="";
					 $scope.countryname="";
					 $scope.shouldShow1 = true;
					 $scope.shouldShow = false;
					});
			});
	}
	
	} 
    
    $scope.deleteForm = function(ports){
		 var result = confirm("Want to delete?");
		 if (result) {
		 form_data = {
				 	'id':ports.id,	
				 	'portcode': ports.portcode,
					'portname': ports.portname,	
					'countrycode': ports.countrycode,
					'countryname': ports.countryname,
					'cruser' : ports.cruser,
					'crdate' : ports.crdate,
					}
		 $http({
			    url: "/delete_port_master/",
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }
			}).then(function successCallback(response){
				console.log("Sent and save ed >>>>>>>>>>>");
				$http({
			        method: 'GET',
			        url: "/get-portmaster-values/?countrycode="+$scope.countrycode,
				}).then(function successCallback(response){					
					var temp = response.data;
		             temp = $filter('orderBy')(temp, 'portcode', false)
		          $scope.ports = temp;
					 $scope.datastatus=false;
					 $scope.informationMessage = 'Port Master Removed!';
					 $timeout(function () { $scope.datastatus = true; }, 3000); 
					 $scope.portcode = "";
					 $scope.portname = "";
					 $scope.countrycode = "";
					 $scope.countryname = "";
					 $scope.shouldShow1 = true;
					 $scope.shouldShow = false;
					});
			});
		 
	 }
}

    $scope.set_color = function (ports) {
    	if (ports.active_status=='V') {
		    return { color: "red" }
		  }
		}
    
         $scope.cancel = function(){
		 $scope.shouldShow1 = true; 
		 $scope.shouldShow = false; 
		 $scope.portcode = "";
		 $scope.portname = "";
		 $scope.countrycode = "";
		 $scope.countryname = "";
	
	 };
	 

    
  //get module modal for Two Columns starts
	$scope.showModal = false;			
	$scope.modulesListData=[];
	 $http({
         method: 'GET',
         url: "/get-countrymaster-valuesforport/",
     }).then(function successCallback(responses) {  
    	 console.log(responses.data,"rsponse")
          $scope.mdlcrtn = responses.data; 		         
          angular.forEach($scope.mdlcrtn, function(value, key) {
           var countrycode = value.countrycode;
           var countryname = value.countryname;  
           console.log("getting... country code");
              $scope.modulesListData.push({"key":countrycode, "value":countryname});
          });
         });
	    
	    $scope.hide = function(){
	        $scope.showModal = false;
	    }
	    
	    
	    $scope.setValue = function(arg1,arg2) {
	       console.log('TEST------->>>>',arg1,arg2)
	       $scope.countrycode = arg1;
	       $scope.countryname = arg2;
	       $scope.hide();
	       
	       Connectivity.IsOk().then(function(response){
	       $http({
		        method: 'GET',
		        url: "/get-portmaster-values/?countrycode="+$scope.countrycode,
		    }).then(function successCallback(response){
		    	$scope.ports = [];
		    	$scope.geterrormessages=response.data.message;	
	            $scope.geterrorstatus=response.data.errorstatus;
	            $scope.geterrorstatuscode=response.data.status;                
	            $scope.dataerror =response.data.message;
	            if(response.data.status==0 && response.data.length!=0 ){
		    	    console.log(response.data);
		        	$scope.ports = response.data.data;   
		        	console.log($scope.ports);
		        }else{
		        	console.log('ELSE------->>>>',arg1,arg2)
		        	
	    			$scope.errordetails=response.data.exceptionDetail;
	               	$scope.showexception=response.data.showerrormessage
	               	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
	    			$scope.dataerror = [response.data.message[0]];	    			
	    		}
		        });
	       },function(error){		 
	 		  $scope.dataerror = "Server not reached";
	 	   });
	    }
    
   
//	  //get module modal for Two Columns starts
//		$scope.showModal = false;			
//		$scope.modulesListData=[];
//		 $http({
//	         method: 'GET',
//	         url: "/get-countrymaster-active-values/",
//	     }).then(
//	         function successCallback(responses) {
//	          $scope.mdlcrtn = responses.data; 		         
//	          angular.forEach($scope.mdlcrtn, function(value, key) {
//	           var countrycode = value.countrycode;
//	           var countryname = value.countryname;
//	          
//	              $scope.modulesListData.push({"key":countrycode, "value":countryname});
//	          });
//	         });
//		    
//		    $scope.hide = function(){
//		        $scope.showModal = false;
//		    }
//		    
//		    $scope.setValue = function(arg1,arg2) {
//		       console.log(arg1)
//		       $scope.countrycode = arg1;
//		       $scope.countryname = arg2;
//		       $scope.hide();
//		       console.log("jhfjhj---"+$scope.countrycode)
//		       
//		       Connectivity.IsOk().then(function(response){
//		       $http({
//			        method: 'GET',
//			        url: "/get-portmaster-values/?countrycode="+$scope.countrycode,
//			    }).then(function successCallback(response){	
//			    	console.log('response=========',response);
//			    	$scope.geterrormessages=response.data.message; 
//			        $scope.geterrorstatus=response.data.errorstatus;
//			        $scope.geterrorstatuscode=response.data.status;                
//			        $scope.dataerror =response.data.message;
//			    	if(response.data.status === 0){
//			    	var temp = response.data.data;
////		             temp = $filter('orderBy')(temp, 'portcode', false)
//		          $scope.ports = response.data.data;
//			    	}
//					else{
//						console.log("tttttttttttttttttt");
//						/*$scope.dialog.open();							
//						$scope.dataerror = response.data.message;*/ 
//						 $scope.errordetails=response.data.exceptionDetail;
//			             $scope.showexception=response.data.showerrormessage
//			             $scope.detailerrormessages=response.data.exceptionDetail.exStackTrace; 
//			             $scope.dataerror = [response.data.message[0]];
//					}
//			        });
//		       },function(error){		 
//					  $scope.dataerror = "Server not reached";
//				  });
//		    }
		    
	});

app.controller('ModalController', function($scope){
$scope.showModal = false;
$scope.country = [{"value": "INDIA", "key": "PND"}, {"value": "SINGAPORE", "key": "GS"}, {"value": "CHINA", "key": "HC"}];
$scope.hide = function(){
    $scope.showModal = false;

}
$scope.setValue = function(arg1) {
	console.log(arg1)
//   $scope.m1 = code;
//   $scope.m2 = country;
   $scope.hide();
}
});