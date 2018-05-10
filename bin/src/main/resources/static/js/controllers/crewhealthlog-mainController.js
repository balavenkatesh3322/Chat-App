app.controller('CrewHealthMainController', function($rootScope, $scope, $http, $timeout) {
    $scope.hidebody = true;
    $scope.haspermission = false;
    $scope.search = [];
    $scope.$on('$viewContentLoaded', function() {
        $scope.dialog.close();
        $scope.layoutdialog.close();
    });
    

	$scope.layoutactions = [
	                   { text: 'Set Default', action: function(){$scope.saveGrids()}}
	               ];
	$scope.openLayoutDialog = function(){
		$scope.layoutdialog.open();
	}

    $scope.actions = [{
        text: 'Ok',
        action: function() {
            $scope.isuploading = false;
            $scope.geterrorstatuscode = 0;
        }
    }];
    
    /****************** DYNAMIC GRID ********************/
    
    $scope.fieldNames = [];
	$http({
		method : 'GET',
		url: "/user-grid-details/?mdlcode=CHL&gridid=G1",
	}).then(function(response){
		response =response.data;
		for(var i=0; i<response.length; i++) {
			var checkedVal = false;
			if (response[i].isSelected=='Y'){
				checkedVal = true;
			}
			$scope.fieldNames.push({"title":response[i].columnName,"key": response[i].mappedName, "checked": checkedVal});
		}
	});
	
	$scope.saveGrids = function(){
		$rootScope.showScreenOverlay = true;
			var userGridDetails = [];
			for (var i=0; i<$scope.fieldNames.length; i++){
				var checkedVal = 'N';
				if ($scope.fieldNames[i].checked){
					checkedVal = 'Y';
				}
				userGridDetails.push({"columnName": $scope.fieldNames[i].title, "mappedName":$scope.fieldNames[i].key, "isSelected": checkedVal, "moduleCode": "CHL", "detailGridId":"G1"});
			}
			$http({
			    url: "/save-user-grid-details/",
			    dataType: 'json',
			    method: 'POST',
			    data: userGridDetails,
			    headers: {
			        "Content-Type": "application/json"
			    }
			});
			$rootScope.showScreenOverlay = false;
			angular.element($('#gridmodal').modal('hide'));
			$rootScope.showScreenOverlay = false;
	}
	$scope.$watch('fieldNames', function() {
		update_columns();
	  }, true);
	var update_columns = function() {
		$scope.ordered_columns = [];
		for (var i = 0; i < $scope.fieldNames.length; i++) {
		  var column = $scope.fieldNames[i];
		  if (column.checked) {
			  $scope.ordered_columns.push(column);
		  }
		}
	};
    
    /****************************************************/

    $scope.unauthorize = function(arg1) {
        if (arg1) {
            $scope.haspermission = true;
        }
        $scope.hidebody = false;
    }
    $scope.VesselCode = "ELSA",
        $scope.year = new Date().getFullYear()
    $rootScope.showScreenOverlay = true;
    // Form Retrival 
    $http({
        url: "/retrieve_crewhealthlogMain/",
        method: 'GET',
    }).then(function successCallback(response) {
    	$rootScope.showScreenOverlay = false;
    	$scope.geterrormessages = response.data.message;
        $scope.geterrorstatus = response.data.errorstatus;
        $scope.geterrorstatuscode = response.data.status;
        $scope.dataerror = response.data.message;
    	 if (response.data.status == 0 && response.data.length != 0) {
    		 $scope.chlid = response.data.data[0].chlid;
    	        $scope.crdate = response.data.data[0].crdate;
    	        $scope.vesselcode = response.data.data[0].vesselcode;
    	        $scope.activeStatus = response.data.data[0].active_status;
    	        $scope.reportdata = response.data.data[0];
    	        $scope.newButton = response.data.data[1];
    	    	console.log("$scope.reportdata", $scope.reportdata);
         } else {
         	$rootScope.showScreenOverlay = false;
             $scope.errordetails = response.data.exceptionDetail;
             $scope.showexception = response.data.showerrormessage
             $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
             $scope.dataerror = [response.data.message[0]];
             $scope.isuploading = false;

         }
    	 
    	
       
    	
    	$rootScope.showScreenOverlay = false;

    });
    $scope.pageSize = 25;
    $scope.sort = function(predicate) {
        $scope.predicate = predicate;
    }
    $scope.isSorted = function(predicate) {
        return ($scope.predicate == predicate)
    }
    
    $scope.getformvalidation = function() {
    	$rootScope.showScreenOverlay = true;
        $scope.isuploading = true;
        $http({
            method: 'GET',
            url: "/validate-crew-health-log-form-no/",
        }).then(
            function(response) {
            	$rootScope.showScreenOverlay = false;
                $scope.geterrormessages = response.data.message;
                $scope.geterrorstatus = response.data.errorstatus;
                $scope.geterrorstatuscode = response.data.status;
                $scope.dataerror = response.data.message;
                if (response.data.status == 0 && response.data.length != 0) {
                    $scope.isuploading = false;
                    window.location.href = "#/CrewHealthReport/" + response.data.data[0];
                    $rootScope.showScreenOverlay = false;
                } else {
                	$rootScope.showScreenOverlay = false;
                    $scope.errordetails = response.data.exceptionDetail;
                    $scope.showexception = response.data.showerrormessage
                    $scope.detailerrormessages = response.data.exceptionDetail.exStackTrace;
                    $scope.dataerror = [response.data.message[0]];
                    $scope.isuploading = false;

                }
                
            });
    }
});