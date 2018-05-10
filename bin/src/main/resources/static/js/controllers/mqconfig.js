app.controller('mqconfigController', function($scope, $rootScope, $http,Connectivity,toaster,$window, $location, $filter, $timeout,$compile){	
	 $scope.saveasdisabled = false;
	$scope.cancelDisabled = false;
	$scope.updateDisabled = true;
	
	$scope.geterrorstatuscode ="0";
	$scope.hidebody = true;
	$scope.haspermission = false;
	$scope.unauthorize = function(arg1) {
		if (arg1) {
			$scope.haspermission = true;
		}
		$scope.hidebody = false;
	}
	
	 $scope.$on('$viewContentLoaded', function() {
			$scope.dialog.close();
			$scope.confirmDeleteDialog.close();
	 });
		
	 $scope.actions = [
      { text: 'Okay', action: function(){ $scope.geterrorstatuscode ="0"; }}
  ];
		

	$scope.sort = function(predicate) {
	       $scope.predicate = predicate;
	}	     
	$scope.isSorted = function(predicate) {
	       return ($scope.predicate == predicate)
	} 
	
	$scope.hideError = function(IndexDesc) {
    	var sys = IndexDesc + "_error";
    	$scope[sys] = "";
    }
	
	$scope.errorFlag = false;
	$scope.shouldShow1 = true;
	$scope.shouldShow = false;
	$scope.disabled = false;
	$scope.msgclear = true;
//	$scope.pageSize = 25;
	$scope.pageSize = $rootScope.defaultPageSize;
	$scope.MQconfig=[];

	 var setSessionValues = function(){             
    }
	 setSessionValues();
	 
	 
		// Form Retrival MQ Config
	 Connectivity.IsOk().then(function(response){
	  $http({
		   url: "/retrieve_mqsetting_shore/",
		    method: 'GET',		    	
		   }).then(function successCallback(response){
			   $scope.geterrormessages=response.data.message; 
		         $scope.geterrorstatus=response.data.errorstatus;
		         $scope.geterrorstatuscode=response.data.status;                
		         $scope.dataerror =response.data.message;
				if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 
			$scope.MQconfig = response.data.data;
			console.log($scope.MQconfig);
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

	    
	    
	    // Edit System Config
	    $scope.SystemConfigEdit = function(MQconfig){
				 $scope.saveasdisabled = true;
				 $scope.updateDisabled = false;
				 $scope.informationMessage = '';				 
				 $scope.shouldShow = true;
				 $scope.shouldShow1 = false;
				 $scope.id = MQconfig.id,
				 $scope.attribute = MQconfig.attribute,
				 $scope.description = MQconfig.description,
				 $scope.value = MQconfig.value,				 
				 console.log($scope.MQconfig);
	    }
	 
	    
	 // update MQ Config
	    $scope.updateForm = function(){
	    
	    	//$scope.cancelDisabled = true;
	    	console.log("called update form=======>>>>")
			$scope.validation();	    	 
			if($scope.errorFlag == true){							
				 form_data = {												 
						 'id':$scope.id,
				    	  'attribute': $scope.attribute,
						  'value':$scope.value,
						  'description':$scope.description,
					}	
	    	Connectivity.IsOk().then(function(response){
				$http({
				    url: "/update_mqsetting-shore/",
				    dataType: 'json',
				    method: 'POST',
				    data: form_data,
				    headers: {
				        "Content-Type": "application/json"
				    }

				}).then(function successCallback(response){
					if(response.data.status==0){					 						 						 
						 $scope.MQconfig = response.data.data;
						// console.log("MQconfig =======> "+$scope.MQconfig);
						 $scope.msgclear = false;
						 $scope.saveasdisabled = false;
//						 $scope.informationMessage = 'Successfully Updated!';
						 toaster.success({title: "Information", body:"Data has been successfully Updated"});
						 console.log("Update Information Log =============> "+$scope.informationMessage);
						 $timeout( function() { $scope.msgclear = true; }, 3000);
						 $scope.updateDisabled = true;
						 $scope.cancelDisabled = true;
						 $scope.attribute = "";
						 $scope.value = "";
						 $scope.shouldShow = false;
						 $scope.shouldShow1 = true;							
					}else{
						$scope.dialog.open();							
						$scope.dataerror = response.data.message; 						
					}					

					
				});
	    	 }, function(error){		 
	    		  $scope.dataerror = "Server not reached";
	    	  }) 
		
		}
	    }/*else{
    		toaster.error({title: "Information", body: "Some fields are missing"});
    		$rootScope.showScreenOverlay = false;
    	}*/
	    
	    

	    
	    $scope.cancelForm = function(){
	    	 $scope.saveasdisabled = false;
	    	 $scope.updateDisabled = true;
			 $scope.shouldShow1 = true; 
			 $scope.shouldShow = false; 
			 $scope.attribute = "";
			 $scope.value = "";
		 };
		 
		 
		    $scope.validation = function(){
				 $scope.errorFlag = true;			 
				 if(document.getElementById('attribute').value==''){
				     $scope.IndexDesc_error = 'Please enter the Atrribute';
				     $scope.errorFlag = false;
				 }else{
				     $scope.IndexDesc_error = '';
				 }
				 if(document.getElementById('value').value==''){
				     $scope.IndexVal_error = 'Please enter the Value';
				     $scope.errorFlag = false;
				 }else{
				     $scope.IndexVal_error = '';
				 }				 
				 

			 }
		 
		 /*   $scope.errorFlag = false;
		    
		    //validation form 
		    $scope.validation = function() {
		    	 var raiseErrorFlag = false;
		         var firstErrorProneField;
		        $scope.errorFlag = false;
		        $scope.errormessage = "This field is required"
		        if (!$scope.TimeofDrills) {
		            $scope.TimeofDrill_error = $scope.errormessage;
		            $scope.errorFlag = true;
		            if(raiseErrorFlag === false) {
		        		firstErrorProneField = "dateTime";
		        	}
		            raiseErrorFlag = true;
		        } else {
		            $scope.TimeofDrill_error = '';
		        }*/
		    
		
			    
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





