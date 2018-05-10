app.controller('TaskSettingsCtrl', function($scope,$anchorScroll,$http, $window,
		$location, $filter, $timeout,Connectivity,$rootScope) {
	$scope.geterrorstatuscode ="0";	

	    $scope.actions = [
	        { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
	    ];
	$scope.startsWith = function (actual, expected) {
	        var lowerStr = (actual + "").toLowerCase();
	        return lowerStr.indexOf(expected.toLowerCase()) === 0;
	}
	$scope.pageSize = $rootScope.defaultPageSize;
	$scope.sort = function(predicate) {
		$scope.predicate = predicate;
	}
	$scope.isSorted = function(predicate) {
		return ($scope.predicate == predicate)
	}

	Connectivity.IsOk().then(function(response){
	$http({
		url : "/retrive_task_settings/",
		method : 'GET',

	}).then(function successCallback(response) {
		$scope.targetDtList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
		 $scope.geterrormessages=response.data.message;	
         $scope.geterrorstatus=response.data.errorstatus;
         $scope.geterrorstatuscode=response.data.status;                
         $scope.dataerror =response.data.message;        
         if((response.data.status==0 )||(response.data.errorstatus=="SV")){ 
        	 $scope.taskSettings = response.data.data[0].tasksettingList;
        	 $scope.statusdetails = response.data.data[0].formStatusList;
             $scope.prioritys = response.data.data[0].prioritydetails;
         }else{
        	 $scope.errordetails=response.data.exceptionDetail;
             $scope.showexception=response.data.showerrormessage
             $scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
			 $scope.dataerror = [response.data.message[0]]; 	
         }
	});
	
	}, function(error){		 
 		  $scope.dataerror = "Server not reached";
 	})
	
 	  $scope.editTaskSettings = function(taskSettings) {
        var raiseErrorFlag = false;
        var firstErrorProneField;
        	$scope.shouldShow = true;
            $scope.taskid = taskSettings.taskid;
            $scope.taskname = taskSettings.taskname;
            $scope.taskdesc = taskSettings.taskdesc;
            $scope.ModuleId = taskSettings.mdlcode;
            $scope.ModuleName = taskSettings.mdlname;
            $scope.PriorCode = taskSettings.priority;
            $scope.targetdate = (taskSettings.targetdate).toString();
            $scope.cruser = taskSettings.cruser;
            $scope.crdate = taskSettings.crdate;
            $scope.upduser = taskSettings.upddate;
            $scope.actioncode = taskSettings.actioncode;
            $scope.taskfromcode = taskSettings.cnttypecode;
            $scope.showCancel = true;
            if (raiseErrorFlag === false) {
                firstErrorProneField = "moduleLbl";
            }
            raiseErrorFlag = true;
        if (raiseErrorFlag === true) {
            var old = $location.hash();
            $anchorScroll.yOffset = 150;
            $location.hash(firstErrorProneField);
            $anchorScroll();
            $location.hash(old);
            return true
        } else {
            return false;
        }
    }
	
	$scope.cancelTaskSetting = function() {
   	 var raiseErrorFlag = false;
        var firstErrorProneField;
       $rootScope.showScreenOverlay = true;
       $scope.taskid = "";
       $scope.taskname = "";
       $scope.taskdesc = "";
       $scope.ModuleId = "";
       $scope.ModuleName = "";
       $scope.PriorCode = "";
       $scope.targetdate = "";
       $scope.taskfromcode = "";
       $scope.actioncode = "";
       $rootScope.showScreenOverlay = false;
       if (raiseErrorFlag === false) {
           firstErrorProneField = "moduleLbl";
       }
       raiseErrorFlag = true;
   if (raiseErrorFlag === true) {
       var old = $location.hash();
       $anchorScroll.yOffset = 150;
       $location.hash(firstErrorProneField);
       $anchorScroll();
       $location.hash(old);
       return true
   } else {
       return false;
   }
   };

});
