app.controller('vesselMappingController', function($scope,$http,$timeout,toaster,Connectivity){
	
	$scope.$on('$viewContentLoaded', function() {
		$scope.noDialog.close();
		$scope.dialog.close();
	});
	 $scope.geterrorstatuscode ="0";	

	    $scope.actions = [
	        { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
	    ];
	 $scope.btnUserCodeActionPerformed = function(){
			$scope.showUserModal= true;
			$scope.userCodeList = [];
			$scope.usercode_error="";
						Connectivity.IsOk().then(function(response){
							$http({
								 method: 'GET',
						         url: "/get_userCode_for_vesselMapping/",
							}).then(function successCallback(response) {
									$scope.users = response.data;
									angular.forEach($scope.users, function(value, key) {
						         		var empcode = value[0];
						        		var empname = value[1];
						       		    $scope.userCodeList.push({"key":empcode, "value":empname});
						       		});
								
							});
			    		}, function(error){
							  $scope.dialog.open();
							  $scope.dataerror = "Server not reached";
			    		});
		}
	 $scope.btnCancelActionPerformed = function(){
		$scope.userDetailList=[];
    	$scope.ReportTab=false;
		$scope.userCode="";
		$scope.userName="";
	 }
		$scope.showUserModal = false; 

	    $scope.hide = function(){
	        $scope.showUserModal = false;
	    }

	    $scope.setValue = function(arg1,arg2) {
	    	$scope.userCode=arg1;
	    	$scope.userName=arg2;   	
	    	$scope.hide();
	    }
	    

		   	 
		Connectivity.IsOk().then(function(response){
		 $scope.btnShowActionPerformed = function(){
			 if($scope.userCode){
				 $scope.ReportTab=true;
					$http({
						 method: 'POST',
				            url: "/get-vessel-mapping-values/",
				            data : $scope.userCode

					}).then(function successCallback(response) {
					 	   $scope.geterrormessages=response.data.message;	
		                   $scope.geterrorstatus=response.data.errorstatus;
		                   $scope.geterrorstatuscode=response.data.status;                
		                   $scope.dataerror =response.data.message;                 
		               	if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 
		               		$scope.userDetailList=response.data.data;
		               		if($scope.userDetailList.length==0){
		               			$scope.ReportTab=false;
		               			$scope.userCode='';
		               			$scope.userName='';
		               			$scope.noDialog.open();
		               		}
		               	}else{
		               		$scope.errordetails=response.data.exceptionDetail;
		                   	$scope.showexception=response.data.showerrormessage
		                   	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
		   					$scope.dataerror = [response.data.message[0]]; 	
		   				}
					});
			 }else{
				 $scope.ReportTab=false;
				 $scope.usercode_error="This field is required."
			 }
		 }
		}, function(error){		 
	   		  $scope.dataerror = "Server not reached";
	   	  })
});





