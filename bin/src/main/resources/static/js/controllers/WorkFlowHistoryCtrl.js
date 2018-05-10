app.controller("workFlowHistoryCtrl",function($http,$filter, $rootScope, $scope, workFlowHistoryService,Connectivity){	
	 $scope.geterrorstatuscode ="0";	

	    $scope.actions = [
	        { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
	    ];
	    
	    $scope.roleClear =function(){
			 if($scope.searchRole.length==0){
				 delete $scope.searchRole;
			 }
		 }
	$scope.sort = function(predicate) {
	       $scope.predicate = predicate;
	     }	     
	     $scope.isSorted = function(predicate) {
	       return ($scope.predicate == predicate)
	     }
	
	$scope.btnModuleCodeActionPerformed = function(){
		$scope.showModuleModal= true;
		$scope.moduleCodeList = [];
		workFlowHistoryService.btnModuleCodeActionPerformed().then(function(response){
			$scope.modules = response.data;
			angular.forEach($scope.modules, function(value, key) {
         		var mdlcode = value.mdlcode;
        		var mdlname = value.mdlname;
       		    $scope.moduleCodeList.push({"key":mdlcode, "value":mdlname});
       		});
		});
	}
	
	
	$scope.showModuleModal = false; 
	$scope.pageSize = $rootScope.defaultPageSize;
    $scope.hide = function(){
        $scope.showModuleModal = false;
    }

    Connectivity.IsOk().then(function(response){
        $scope.setValue = function(arg1,arg2) {
        	$scope.moduleCode=arg1;
        	$scope.moduleName=arg2;   		
        	$scope.hide();
        	workFlowHistoryService.getWorkFlowHistoryDetails($scope.moduleCode).then(function(response) {
        		$scope.geterrormessages=response.data.message; 
                $scope.geterrorstatus=response.data.errorstatus;
                $scope.geterrorstatuscode=response.data.status;                
                $scope.dataerror =response.data.message;
        		if(response.data.status==0){
                $scope.workFlowHistoryDetailsList = response.data.data;
                $scope.workFlowHistoryDetailsList= $filter('orderBy')($scope.workFlowHistoryDetailsList, 'stage');
    	        $scope.accessActionList = response.data;
        		}else{
      	        $scope.errordetails=response.data.exceptionDetail;
                $scope.showexception=response.data.showerrormessage
                $scope.detailerrormessages=response.data.exceptionDetail.exStackTrace; 
                $scope.dataerror = [response.data.message[0]];
      	         }
    	        workFlowHistoryService.getWorkFlowActionDetails($scope.moduleCode).then(function(response) {
    	        	if(response.data.status==0){
    	        
    	        	$scope.defaultActionList = response.data.data;
    	        	}else{
    	    	          $scope.errordetails=response.data.exceptionDetail;
    	    	             $scope.showexception=response.data.showerrormessage
    	    	             $scope.detailerrormessages=response.data.exceptionDetail.exStackTrace; 
    	    	             $scope.dataerror = [response.data.message[0]];
    	    	         }
    	        });
    	     });
        }
       
    });
    }, function(error){
        $scope.dataerror = ["Server not reached"];
     });	
