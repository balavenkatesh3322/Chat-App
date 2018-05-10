app.controller('VslTypeCtrl', function($scope, $rootScope,toaster,Connectivity, $location,$http, $filter,  $timeout,$compile){
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
	
	
	
	 $scope.errorFlag = true;
	 $scope.cruser = "";
	 $scope.crdate = "";
	 $scope.upduser = "";
	 $scope.upddate = "";
	 $scope.code = "";
	 $scope.flag = "save";
	 $scope.buttonlabel = "Add";
	 $scope.disEditButton = "false";
	 $scope.informationMessage = "";
	 $scope.searchVessel   = ''; 
	 $scope.divVesselCode = false;
	 $scope.datastatus = true;
	 $scope.pageSize = 25;
	 
	 $scope.sort = function(predicate) {
	       $scope.predicate = predicate;
	     }	     
	     $scope.isSorted = function(predicate) {
	       return ($scope.predicate == predicate)
	     }
	     
	 Connectivity.IsOk().then(function(response){
  $http({
        method: 'GET',
        url: "/load-From-Vessel-Type/",
    }).then(function successCallback(response) {
    	$scope.vesseltypes=[];
    	$scope.geterrormessages=response.data.message;	
        $scope.geterrorstatus=response.data.errorstatus;
        $scope.geterrorstatuscode=response.data.status;                
        $scope.dataerror =response.data.message;
        if(response.data.status==0 && response.data.length!=0 ){
    	var temp = response.data.data;
//        temp = $filter('orderBy')(temp, 'vesseltypecode', false)
        $scope.vesseltypes = temp;
        }else{

			/*$scope.dialog.open();							
			$scope.dataerror = response.data.message;*/
			
			$scope.errordetails=response.data.exceptionDetail;
           	$scope.showexception=response.data.showerrormessage
           	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
				$scope.dataerror = [response.data.message[0]]; 
		} 
    });
	
	 },function(error){		 
		  $scope.dataerror = "Server not reached";
	  });
	 
	$scope.saveVesselType = function(a,b){
		$scope.validation();
		if($scope.errorFlag == true && $scope.flag == "save"){			
			$http({
		        method: 'GET',
		        url: "/vessel-type-code-no/",
		    }).then(function successCallback(response) {
		        	$scope.vesseltypecode = response.data.vesseltypecode;
	                $scope.code = response.data.vsltypecode;
	                $scope.vesseltypecode = $scope.code;
	                form_data = {
	    					'vesseltypecode': $scope.code,
	    					'vesseltypedesc': b,
	    					}
	    		 $http({
	    			    url: "/save-From-Vessel-Type/",
	    			    dataType: 'json',
	    			    method: 'POST',
	    			    data: form_data,
	    			    headers: {
	    			        "Content-Type": "application/json"
	    			    }
	    			}).then(function successCallback(response){
	    				console.log("Sent and saved >>>>>>>>>>>");
	    				$scope.vesseltypecode = "";
						$scope.vesseltypedesc = "";
						$scope.datastatus = false;
						$scope.informationMessage = "Vessel Type has been saved successfully";
						$timeout(function () { $scope.datastatus = true; }, 3000);
	    				
	    				$http({
	    			        method: 'GET',
	    			        url: "/load-From-Vessel-Type/",
	    			    }).then(function successCallback(response) {
	    			    	var temp = response.data;
	    			        temp = $filter('orderBy')(temp, 'vesseltypecode', false)
	    			        $scope.vesseltypes = temp;
	    			        	$scope.vesseltypecode = "";
	    						$scope.vesseltypedesc = "";
	    						document.getElementById('vesseltypedesc').value="";
	    			    });
	    		 });
	    			
		       });	
			
			$scope.vesseltypedesc = "";
			document.getElementById('vesseltypedesc').value="";
				
		} else {
			console.log("BBBBBBBBBB " + b)
			console.log("$scope.vesseltypedesc >>>>>>>>>>> "+$scope.vesseltypedesc)
			form_data = {
					'vesseltypecode': a,
					'vesseltypedesc': b,
					'cruser' : $scope.cruser,
					'crdate' : $scope.crdate,
					}
		 $http({
			    url: "/update-From-Vessel-Type/",
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }
			}).then(function successCallback(response){
				console.log("Sent and Updated >>>>>>>>>>>");
				$scope.vesseltypecode = "";
				$scope.vesseltypedesc = "";
				$scope.datastatus = false;
				$scope.informationMessage = "Vessel Type has been updated successfully";
				$timeout(function () { $scope.datastatus = true; }, 3000);
				
				 $scope.flag = "save";
				 $scope.buttonlabel = "Add";
				 $scope.divVesselCode = false;
				$http({
			        method: 'GET',
			        url: "/load-From-Vessel-Type/",
			    }).then(function successCallback(response) {
			    	var temp = response.data;
			        temp = $filter('orderBy')(temp, 'vesseltypecode', false)
			        $scope.vesseltypes = temp;
			        	$scope.vesseltypecode = "";
						$scope.vesseltypedesc = "";
						document.getElementById('vesseltypedesc').value="";
			    });
		   });
			console.log($scope.vesseltypedesc);
		}	
		 document.getElementById('VesselTypeNameerror').value="";
		 $scope.cruser = "";
		 $scope.crdate = "";
		 $scope.upduser = "";
		 $scope.upddate = "";
		 $scope.code = "";
		 $scope.ShipsPosition_error = '';
	}
	
	 $scope.validation = function(){
		 $scope.errorFlag = true;
		 if(document.getElementById('vesseltypedesc').value==''){
		     $scope.VesselTypeName_error = 'Please enter the Vessel Type Name';
		     $scope.errorFlag = false;
		    }else{
		    	$scope.VesselTypeName_error = "";
		    }
	 }
	 
	 
	 $scope.vslTypeEdit = function(vessel){
		 if(vessel.activeStatus == 'A'){
		 $scope.flag = "update";
		 $scope.buttonlabel = "Save";
		 $scope.vesseltypecode = vessel.vesseltypecode;
		 document.getElementById('vesseltypedesc').value = vessel.vesseltypedesc;
		 $scope.vesseltypedesc = vessel.vesseltypedesc;
		 $scope.cruser = vessel.cruser;
		 $scope.crdate = vessel.crdate;
		 $scope.upduser = vessel.upduser;
		 $scope.upddate = vessel.upddate;
		 $scope.informationMessage = "";
		 $scope.divVesselCode = true;
		 }else{
			 $scope.flag = "save";
			 $scope.buttonlabel = "Add";
			 $scope.datastatus = false;
			 $scope.informationMessage = "In Active Records can't be edited";
			 $timeout(function () { $scope.datastatus = true; }, 3000);
			 
			 $scope.vesseltypecode = "";
			 $scope.vesseltypedesc = "";
		 }
		 $scope.VesselTypeName_error = "";
	 }
	
	 
	 $scope.removeVesselType = function(vessel){
		 var result = confirm("Are you sure you want to Delete?");
			if(result){
				
		 console.log($scope.vesseltypecode +" >>>>>>>> "+a)
		 if(document.getElementById('vesseltypecode').value !=''){
		 $scope.flag = "";
		 form_data = {
					'vesseltypecode': vessel.vesseltypecode,
					'vesseltypedesc': vessel.vesseltypedesc,
					'cruser' : vessel.cruser,
					'crdate' : vessel.crdate,
					}
		 $http({
			    url: "/remove-From-Vessel-Type/",
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }
			}).then(function successCallback(response){
				console.log("Sent and remove ed >>>>>>>>>>>");
				$scope.datastatus = false;
				$scope.informationMessage = "Vessel Type has been removed successfully";
				$timeout(function () { $scope.datastatus = true; }, 3000);
				
				$http({
			        method: 'GET',
			        url: "/load-From-Vessel-Type/",
			    }).then(function successCallback(response) {
			    	var temp = response.data;
			        temp = $filter('orderBy')(temp, 'vesseltypecode', false)
			        $scope.vesseltypes = temp;
			            console.log(response.data);
			            $scope.vesseltypecode = "";
						$scope.vesseltypedesc = "";
						document.getElementById('vesseltypedesc').value="";
						$scope.flag = "save";
						$scope.buttonlabel = "Add";
						$scope.divVesselCode = false;
			    });
		 });
		 
		 $scope.cruser = "";
		 $scope.crdate = "";
		 $scope.upduser = "";
		 $scope.upddate = "";
		 $scope.code = "";
		 $scope.informationMessage = "";
		 }else{
			 $scope.informationMessage = "Select a row from table to Remove";
		 }
		 	
	 }
	 
}
	 $scope.cancelVesselType = function(){
		 	$scope.flag = "save";
			$scope.buttonlabel = "Add";
		 	$scope.vesseltypecode = "";
			$scope.vesseltypedesc = "";
			document.getElementById('vesseltypedesc').value="";
			$scope.divVesselCode = false;
	 }
	
	 
	 $scope.set_color = function (payment) {
		  if (payment.activeStatus == 'V') {
			  payment.activeStatus == 'In Active';
			  $scope.disEditButton = "true";
		    return { color: "red" }
		  }
		}
	 
	 
	 
	 
	 //// Delete 
	 $scope.removeVesselType = function(vessel){
		 var result = confirm("Are you sure you want to Delete?");
			if(result){
				
		 form_data = {
					'vesseltypecode': vessel.vesseltypecode,
					'vesseltypedesc': vessel.vesseltypedesc,
					'cruser' : vessel.cruser,
					'crdate' : vessel.crdate,
					}
		 $http({
			    url: "/remove-From-Vessel-Type/",
			    dataType: 'json',
			    method: 'POST',
			    data: form_data,
			    headers: {
			        "Content-Type": "application/json"
			    }
			}).then(function successCallback(response){
				console.log("Sent and remove ed >>>>>>>>>>>");
				$scope.datastatus = false;
				$scope.informationMessage = "Vessel Type has been removed successfully";
				$timeout(function () { $scope.datastatus = true; }, 3000);
				
				$http({
			        method: 'GET',
			        url: "/load-From-Vessel-Type/",
			    }).then(function successCallback(response) {
			    	var temp = response.data;
			        temp = $filter('orderBy')(temp, 'vesseltypecode', false)
			        $scope.vesseltypes = temp;
			            console.log(response.data);
			            $scope.vesseltypecode = "";
						$scope.vesseltypedesc = "";
						document.getElementById('vesseltypedesc').value="";
						$scope.flag = "save";
						$scope.buttonlabel = "Add";
						$scope.divVesselCode = false;
			    });
		 });
	 }
	 
}
	 
	 $scope.bindPagination = function(elm){
			var parent = $(elm).find('.text-center'); // DOM element where the compiled template can be appended
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