app.controller('notificationHistoryCtrl', function($q, $http, $filter,$timeout, $scope, notificationHistoryServcie,$rootScope){
	$scope.hidebody = true;
	 $scope.haspermission = false;
	 $scope.unauthorize = function(arg1){
	  if (arg1){
	   $scope.haspermission = true;
	  }
	  $scope.hidebody = false;
	 }
	 $scope.geterrorstatuscode ="0";	
//	$scope.notificationHistoryList= [];
	 
//	 $http({
//			method : 'GET',
//			url: "/get-vessel-task-manager-data/",
//		}).then(function(response){
//	 $scope.vesselDetailList = response.data;
//	 console.log($scope.vesselDetailList.length , '$scope.vesselDetailList.length >>>>>>>>>>>>>>>>>>>>>> ')
//	 $scope.taskCount = $scope.vesselDetailList.length;
//});
	 
	 
	 $scope.actions = [
	                   { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
	               ];
	 
	 
	 
	 $scope.path = '';
		$scope.referenceClicked = function(modulecode,formid){
			if(modulecode.length >0){
				$http({
					method : 'GET',
					url : '/get-task-manager-url/',
					params : {
						modulecode : modulecode,
						pagetype:"M"
					}
				}).then(function successCallBack(response){
					$scope.taskurl = response.data;
					$scope.path = $scope.taskurl[0].url;
					window.location = $scope.path+"/"+formid
					$scope.updatenotificationcount(formid);
				});
			}
			
		}
		
	
	$scope.sort = function(predicate) {
	       $scope.predicate = predicate;
	     }	     
	     $scope.isSorted = function(predicate) {
	       return ($scope.predicate == predicate)
	     }
	
	
	
	 $scope.hideError = function(fromDateRequiredError) {
	    	var not = fromDateRequiredError
	    	$scope[not] = "";
	    }
	 
	$scope.fromDateRequiredError = false;
	$scope.toDateRequiredError = false;
	$scope.pageSize = 25;
	
	$rootScope.showScreenOverlay = true;
	notificationHistoryServcie.ShowNotificationHistory().then(function(response){
		var temp = response.data;
        temp = $filter('orderBy')(temp, 'notifyid', true)
		$scope.notificationHistoryList = temp;
		
	})
	$rootScope.showScreenOverlay = false;
	
	
	$scope.btnShowActionPerformed = function(){	
		if($scope.notificationValidation() === true){
			$rootScope.showScreenOverlay = true;
			notificationHistoryServcie.btnShowActionPerformed($scope.fromDate,$scope.toDate).then(function(response){
				$scope.geterrormessages=response.data.message;	
                $scope.geterrorstatus=response.data.errorstatus;
                $scope.geterrorstatuscode=response.data.status;                
                $scope.dataerror =response.data.message;  
            	if((response.data.status==0 )||(response.data.errorstatus=="SV")){
    				$scope.notificationHistoryList = response.data.data;
    				$rootScope.showScreenOverlay = false;
            	}else{
            		$rootScope.showScreenOverlay = false;
            		$scope.errordetails=response.data.exceptionDetail;
                	$scope.showexception=response.data.showerrormessage
                	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
					$scope.dataerror = [response.data.message[0]]; 	
				}  
				
			});
		}
	}
	
	$scope.btnResetActionPerformed = function(){
		var date = new Date();
		$scope.fromDate = "";
		$scope.toDate = "";
		$scope.notificationHistoryList = {};
		$rootScope.showScreenOverlay = true;
		notificationHistoryServcie.ShowNotificationHistory().then(function(response){
			var temp = response.data;
	        temp = $filter('orderBy')(temp, 'notifyid', true)
			$scope.notificationHistoryList = temp;
		})
		$scope.fromDateRequiredError = false;
		$scope.toDateRequiredError = false;
		$rootScope.showScreenOverlay = false;
	}
	
	$scope.notificationValidation = function(){
		var errorFlag = true;
		if($scope.fromDate == undefined  || $scope.fromDate == ""){
			$scope.fromDateRequiredError = true;	
			errorFlag = false;
		}else{
			$scope.fromDateRequiredError = false;		
			errorFlag = true;
		}
		
		if($scope.toDate == undefined  || $scope.toDate == ""){			
			$scope.toDateRequiredError = true;
			errorFlag = false;
		}else{			
			$scope.toDateRequiredError = false;
			errorFlag = true;
		}
		
		
		 if(errorFlag === true){
			 return true
		 }else{
			 return false
		 }
		
	}
	
	
});