app.controller('FleetMasterCtrl',function($scope, $http,Connectivity,toaster, $window, $location, $filter, $timeout,$compile){
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
			$scope.confirmDeleteDialog.close();
	 });
	 
	 $scope.startsWith = function (actual, expected) {
	        var lowerStr = (actual + "").toLowerCase();
	        return lowerStr.indexOf(expected.toLowerCase()) === 0;
	 }
		
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
	 
	 
	 $scope.errorFlag = true;
	 $scope.shouldShow1 = true;
	 $scope.fleetdisable=true;
	$scope.fleets=[];
	$scope.datastatus = true;
	$scope.pageSize = 25;
	
	Connectivity.IsOk().then(function(response){
	$http({
	    url: "/retrieve_fleet_master/",
	    method: 'GET',
	    
	}).then(function successCallback(response){
		$scope.fleets=[];
		   $scope.geterrormessages=response.data.message; 
	         $scope.geterrorstatus=response.data.errorstatus;
	         $scope.geterrorstatuscode=response.data.status;                
	         $scope.dataerror =response.data.message;
			if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 
		       var temp = response.data.data;
//                temp = $filter('orderBy')(temp, 'fleetcode', false)
                $scope.fleets = temp;
			   }else{
					 /*  $scope.dialog.open();							
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
//	retrieve=function(){
//		FleetMasterService.retrieve();
//		console.log($scope.fleets);
//	}
	
	 $scope.sort = function(predicate) {
	       $scope.predicate = predicate;
	     }	     
	     $scope.isSorted = function(predicate) {
	       return ($scope.predicate == predicate)
	     }
	     
	  $scope.$watch('selected', function(fac) {
	       $scope.$broadcast("rowSelected", fac);
	    });
	$scope.saveFleet = function(){
		$scope.validation();	    	 
		if($scope.errorFlag == true){							
			 form_data = {
					 	'fleetcode': $scope.fleetcode,
						'fleetname': $scope.fleetname,						
				}			 
			$http({
			    url: "/save_Fleet_code/",
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }

			}).then(function successCallback(response){
				console.log("Sent and save ed >>>>>>>>>>>");
				$http({
				    url: "/retrieve_fleet_master/",
				    method: 'GET',
				    
				}).then(function successCallback(response){					
					var temp = response.data;
			        temp = $filter('orderBy')(temp, 'fleetcode', false)
			        $scope.fleets = temp;				
					$scope.datastatus = false;
					$scope.informationMessage = 'Successfully Saved!';
					$timeout(function () { $scope.datastatus = true; }, 3000);
					 $scope.fleetname = "";
					});
			});
		}
	
	}
	
	 $scope.validation = function(){
		 $scope.errorFlag = true;
		 
		 if(document.getElementById('fleetnametxtid').value==''){
		     $scope.fleetName_error = 'Please enter the Fleet Name';
		     $scope.errorFlag = false;
		    }
		    else{
		     $scope.fleetName_error = '';
		    }
		 
	 }
	 
	 $scope.fleetMasterEdit = function(fleet){	
		 if (fleet.active_status == 'V') {
			 $scope.informationMessage = 'Deleted record cannot be Edited';
			  }
		 else{
			 console.log( fleet.fleetcode);
			 $scope.shouldShow = true;
			 $scope.shouldShow1 = false;
			 $scope.id = fleet.id,
			 $scope.fleetcode = fleet.fleetcode,
			 $scope.fleetname = fleet.fleetname
			 $scope.cruser = fleet.cruser;
			 $scope.crdate = fleet.crdate;
			 $scope.upduser = fleet.upduser;
			 $scope.upddate = fleet.upddate;
			 console.log($scope.fleetcode);	
		 }
		 	 
	 }
	
	 $scope.updateFleet = function(){
			$scope.validation();	    	 
			if($scope.errorFlag == true){							
				 form_data = {
							'id':$scope.id,
						 	'fleetcode': $scope.fleetcode,
							'fleetname': $scope.fleetname,	
							'cruser': $scope.cruser,	
							'crdate': $scope.crdate,	
							'active_status': $scope.active_status,	
							
					}			 
				$http({
				    url: "/update_Fleet_code/",
				    dataType: 'json',
				    method: 'POST',
				    data: form_data,
				    headers: {
				        "Content-Type": "application/json"
				    }

				}).then(function successCallback(response){
					$http({
					    url: "/retrieve_fleet_master/",
					    method: 'GET',
					    
					}).then(function successCallback(response){					
						var temp = response.data;
				        temp = $filter('orderBy')(temp, 'fleetcode', false)
				        $scope.fleets = temp;
						$scope.datastatus = false;
						$scope.informationMessage = 'Successfully Updated!';
						$timeout(function () { $scope.datastatus = true; }, 3000);
						
						 $scope.fleetname = "";
						 $scope.shouldShow = false;
						 $scope.shouldShow1 = true;
						});
				});
			}
		
		} 
	 $scope.removeFleet = function(fleet){
		 var result = confirm("Want to delete?");
		 if (result) {
		        form_data = {
				 	'id':$scope.id,	
				 	'fleetcode': fleet.fleetcode,
					'fleetname': fleet.fleetname,	
					'cruser' : fleet.cruser,
					'crdate' : fleet.crdate,
					}
		 	$scope.fleetcode = "";
			$scope.fleetname = "";
		 $http({
			    url: "/delete_Fleet_code/",
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }
			}).then(function successCallback(response){
				console.log("Sent and save ed >>>>>>>>>>>");
				$http({
				    url: "/retrieve_fleet_master/",
				    method: 'GET',
				    
				}).then(function successCallback(response){					
					var temp = response.data;
			        temp = $filter('orderBy')(temp, 'fleetcode', false)
			        $scope.fleets = temp;	
					$scope.datastatus = false;
					$scope.informationMessage = 'Fleet Master Removed!';
					$timeout(function () { $scope.datastatus = true; }, 3000);
					 
					 $scope.fleetname = "";
					 $scope.shouldShow = false;
					 $scope.shouldShow1 = true;
					});
			});
	 }
}
	 
//	 $scope.set_color = function (fleet) {
//		  if (fleet.active_status == 'V') {
//		    return { color: "red" }
//		  }
//		}
	 
	 $scope.set_color = function(x) {
			if (x.activeStatus == 'V') {
				return {
					color : "red"
				}
			}
		}
	 
	 $scope.cancelFleet = function(){
		 $scope.shouldShow1 = true; 
		 $scope.shouldShow = false; 
		 $scope.fleetname = "";
	 };

});