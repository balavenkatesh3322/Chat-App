app.controller('terminalCtrl', function($scope, $http,toaster,Connectivity, $window, $location, $filter,$timeout){
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
	 
	 $scope.actions = [
         { text: 'Okay', action: function(){ $scope.geterrorstatuscode ="0"; }}
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
	
	
	$scope.pageSize=10;
	$scope.terminals=[];
	 $scope.errorFlag = true;
	 $scope.shouldShow1 = true;
	 $scope.datastatus = true;
	 $scope.pageTermSize = 15;
	$scope.portListData = [];
	$scope.termListData = [];
	
	Connectivity.IsOk().then(function(response){
	$http({
	    url: "/retrieve_terminal_master/",
	    method: 'GET',
	    
	}).then(function successCallback(response){
		  $scope.geterrormessages=response.data.message;	
          $scope.geterrorstatus=response.data.errorstatus;
          $scope.geterrorstatuscode=response.data.status;                
          $scope.dataerror =response.data.message;
       if(response.data.status==0 && response.data.length!=0 ){
//		var temp = response.data.data;
//        temp = $filter('orderBy')(temp, 'terminalcode', false)
//        $scope.terminals = temp;
        $scope.terminals = response.data.data;
       }else{
			
			$scope.errordetails=response.data.exceptionDetail;
          	$scope.showexception=response.data.showerrormessage
          	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
			$scope.dataerror = [response.data.message[0]]; 
		}
       

       $scope.startsWith = function (actual, expected) {
       		        var lowerStr = (actual + "").toLowerCase();
       		        return lowerStr.indexOf(expected.toLowerCase()) === 0;
       }
	
		});	
	 },function(error){		 
		  $scope.dataerror = "Server not reached";
	   });
	
	$scope.startsWith = function (actual, expected) {
        var lowerStr = (actual + "").toLowerCase();
        return lowerStr.indexOf(expected.toLowerCase()) === 0;
	}
	
	 $http({
	        method: 'GET',
	        url: "/get_port_list/",
	    }).then(
	        function successCallback(responses) {
	        	$scope.ports = responses.data;	
	        	angular.forEach($scope.ports, function(value, key) {
	        		var portcode = value.portcode;
	        		var portname = value.portname;
	       		    $scope.portListData.push({"key":portcode, "value":portname});
	       		});
	        });	
	 
    $scope.showTermModal = false;   
    $scope.hide = function(){
        $scope.showTermModal = false;
    }
    $scope.setValue = function(arg1,arg2) {
    	$scope.portcode=arg1;
    	$scope.portname=arg2;   	
       $scope.hide();
    }
        
    //save terminal master
	$scope.addform = function(){
		$scope.validation();	    	 
		if($scope.errorFlag == true){							
			 form_data = {
					 	'terminalcode': $scope.terminalcode,
						'terminalname': $scope.terminalname,
						'portcode': $scope.portcode,
						'termguidance': $scope.termguidance,
				}			 
			$http({
			    url: "/save_Terminal_master/",
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }

			}).then(function successCallback(response){
				$http({
				    url: "/retrieve_terminal_master/",
				    method: 'GET',
				    
				}).then(function successCallback(response){					
					var temp = response.data;
			        temp = $filter('orderBy')(temp, 'terminalcode', false)
			        $scope.terminals = temp;
					$scope.datastatus=false;		
					 $scope.info_status = 'Successfully Saved!';
					 $timeout(function () { $scope.datastatus = true; }, 3000);
					 $scope.terminalcode = "";
					 $scope.terminalname = "";
					 $scope.portcode = "";
					 $scope.portname = "";
					 $scope.termguidance = "";
					});
			});
		}
	}
	
	//validation
	 $scope.validation = function(){
		 $scope.errorFlag = true;
		 if(document.getElementById('tmcode').value==''){
		     $scope.tcode_error = 'Please enter the terminal code';
	     $scope.errorFlag = false;
		    }
		 else{
			 $scope.tcode_error="";
		 }
	   if(document.getElementById('tmname').value==''){
	    	$scope.tname_error = 'Please enter the terminal name';
		     $scope.errorFlag = false;
	    }
	   else{
		   $scope.tname_error="";
		 }
	     if(document.getElementById('ptcode').value==''){
	    	$scope.ptcode_error = 'Please select port code';
		     $scope.errorFlag = false;
	    }
	    else{
	    	$scope.ptcode_error="";
		 }
	     if(document.getElementById('tmguid').value==''){
	    	$scope.tguid_error = 'Please enter the terminal guidance';
		     $scope.errorFlag = false;
	    }
	    else{
	    	$scope.tguid_error="";
		 }
	 }
	  
	 //edit
	 $scope.editform = function(x){	
		 if (x.active_status == 'V') {
			 $scope.datastatus=false;		
			 $scope.info_status = 'Deleted record cannot be Edited';
			 $timeout(function () { $scope.datastatus = true; }, 3000);
			  }
		 else{
			 console.log( x.terminalcode);
			 $scope.shouldShow = true;
			 $scope.shouldShow1 = false;
			 $scope.terminalcode = x.terminalcode
			 $scope.terminalname = x.terminalname
			 $scope.portcode = x.portcode,
			 $scope.portname = x.portname,
			 $scope.termguidance = x.termguidance,			
			 $scope.cruser = x.cruser;
			 $scope.crdate = x.crdate;
			 $scope.upduser = x.upduser;
			 $scope.upddate = x.upddate;
			 $scope.getportname();
			 
		 }
		 	 
	 }
	 
	 $scope.showTermModal = false;
	 $scope.pageSize = 25;
	 
	 $scope.btnPortActionPerformed = function(){
		 console.log("btnPortActionPerformed >>>>>>>>>>>>>>> ");
		 $scope.showTermModal = true;
		 
		 $http({
			 method : 'POST',
			 url: '/get_port_list_like/',
			 data : $scope.portcode,
		 }).then(function successCallback(responses){
				$scope.ports = responses.data;
				console.log(responses.data);
	        	angular.forEach($scope.ports, function(value, key) {
	        		var portcode = value.portcode;
	        		var portname = value.portname;
	        		$scope.portListData.push({"key":portcode, "value":portname});
//	        		if(portcode == $scope.portcode){		        			
//	        			$scope.portname=portname;
//	        		}
	        	});
		 });
		 
	 }
	 
//	 $scope.getportname=function(){
//		 $http({
//		        method: 'GET',
//		        url: "/get_port_list/",
//		    }).then(
//		        function successCallback(responses) {
//		        	$scope.ports = responses.data;	
//		        	angular.forEach($scope.ports, function(value, key) {
//		        		var portcode = value.portcode;
//		        		var portname = value.portname;
//		       		    $scope.portListData.push({"key":portcode, "value":portname});
////		        		if(portcode==$scope.portcode){		        			
////		        			$scope.portname=portname;
////		        		}
//		        	});
//		        }); 
//	 }
	 
	 $scope.saveform = function(){
			$scope.validation();	    	 
			if($scope.errorFlag == true){							
				 form_data = {
						 'terminalcode': $scope.terminalcode,
							'terminalname': $scope.terminalname,	
							'portcode': $scope.portcode,
							'termguidance': $scope.termguidance,
							'active_status': $scope.active_status,	
							'cruser' : $scope.cruser,
							'crdate' : $scope.crdate,						 
					}			 
				$http({
				    url: "/update_terminal_code/",
				    dataType: 'json',
				    method: 'POST',
				    data: form_data,
				    headers: {
				        "Content-Type": "application/json"
				    }

				}).then(function successCallback(response){
					$http({
					    url: "/retrieve_terminal_master/",
					    method: 'GET',
					    
					}).then(function successCallback(response){					
						var temp = response.data;
				        temp = $filter('orderBy')(temp, 'terminalcode', false)
				        $scope.terminals = temp;
						$scope.datastatus=false;		
						 $scope.info_status = 'Successfully Updated!';
						 $timeout(function () { $scope.datastatus = true; }, 3000);
						 $scope.terminalcode = "";
						 $scope.terminalname = "";
						 $scope.portcode = "";
						 $scope.portname ="";
						 $scope.termguidance = "";
						 $scope.shouldShow = false;
						 $scope.shouldShow1 = true;
						});
				});
			}
		
		} 
	 $scope.removeform = function(x){
		 var result = confirm("Are you sure you want to Delete?");
			if(result){
		 form_data = {
				 	'terminalcode': x.terminalcode,
					'terminalname': x.terminalname,	
					'portcode': x.portcode,
					'termguidance': x.termguidance,	
					'cruser' : x.cruser,
					'crdate' : x.crdate,
					}
		 $http({
			    url: "/delete_terminal_code/",
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }
			}).then(function successCallback(response){				
				$http({
				    url: "/retrieve_terminal_master/",
				    method: 'GET',
				    
				}).then(function successCallback(response){					
					var temp = response.data;
			        temp = $filter('orderBy')(temp, 'terminalcode', false)
			        $scope.terminals = temp;
			        
					$scope.datastatus=false;		
					 $scope.info_status = 'Terminal Master Removed!';
					 $timeout(function () { $scope.datastatus = true; }, 3000);
					 $scope.terminalcode = "";
					 $scope.terminalname = "";
					 $scope.portcode = "";
					 $scope.portname ="";
					 $scope.termguidance = "";
					 $scope.shouldShow = false;
					 $scope.shouldShow1 = true;
					});
			});
			}
	 }
	
	 
	 $scope.set_color = function(terminals) {
			if (terminals.statusDesc == 'Inactive') {
				return {
					color : "red"
				}
			}
		}
	 
	 $scope.cancel = function(){
		 $scope.shouldShow1 = true; 
		 $scope.shouldShow = false; 
		 $scope.terminalcode = "";
		 $scope.terminalname = "";
		 $scope.portcode = "";
		 $scope.portname ="";
		 $scope.termguidance = "";
	 };
});

