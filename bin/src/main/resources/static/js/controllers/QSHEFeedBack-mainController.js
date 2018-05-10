app.controller('QSHEFeedBackMainCtrl', function ($scope, $http, $window,$timeout, $location, $filter, Connectivity) {
	$scope.newDisabled = false;
	$scope.geterrorstatuscode ="0";	
    $scope.sort = function(predicate) {
        $scope.predicate = predicate;
      }
    $scope.search = {};
    $scope.hidebody = true;
	$scope.haspermission = false;
	$scope.unauthorize = function(arg1){
		if (arg1){
			$scope.haspermission = true;
		}
		$scope.hidebody = false;
	}
    $scope.pageSize = 25;
    $scope.openLayoutDialog = function(){
		$scope.layoutdialog.open();
	}
    $scope.layoutactions = [
     	                   { text: 'Set Default', action: function(){$scope.saveGrids()}}
     	               ];
      $scope.isSorted = function(predicate) {
        return ($scope.predicate == predicate)
      }
      $scope.actions = [
	                    { text: 'Okay', action: function(){$scope.newDisabled= false;}}
	                ];
	 
      $scope.$on('$viewContentLoaded', function() {
			$scope.dialog.close();
			$scope.layoutdialog.close();
		});
      

  	$scope.fieldNames = [];
  	$http({
  		method : 'GET',
  		url: "/user-grid-details/?mdlcode=QSE&gridid=G1",
  	}).then(function(response){
  		response =response.data;
  		for(var i=0; i<response.length; i++){
  			var checkedVal = false;
  			if (response[i].isSelected=='Y'){
  				checkedVal = true;
  			}
  			$scope.fieldNames.push({"title":response[i].columnName,"key": response[i].mappedName, "checked": checkedVal})
  		}
  	});
  	
  $scope.saveGrids = function(){
  		var userGridDetails = [];
  		for (var i=0; i<$scope.fieldNames.length; i++){
  			var checkedVal = 'N';
  			if ($scope.fieldNames[i].checked){
  				checkedVal = 'Y';
  			}
  			userGridDetails.push({"columnName": $scope.fieldNames[i].title, "mappedName":$scope.fieldNames[i].key, "isSelected": checkedVal, "moduleCode": "QSE","detailGridId":"G1"});
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
  		angular.element($('#gridmodal').modal('hide'));
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
	    
	
      Connectivity.IsOk().then(function(response){
    	  $http({
    			method:'GET',
    			url:"/get-qshe-feedbackmaster-list/"
    		}).then(function(response){
    			 $scope.geterrormessages=response.data.message;	
	                $scope.geterrorstatus=response.data.errorstatus;
	                $scope.geterrorstatuscode=response.data.status;                
	                $scope.dataerror =response.data.message;  
    			if(response.data.status === 0){   				                  
    				var temp = response.data.data[0];
    				 $scope.newButton = response.data.data[1];
			        temp = $filter('orderBy')(temp, 'qsheid', true);
					$scope.qshefeedback=temp
    			}else{		    		  
						$scope.errordetails=response.data.exceptionDetail;
	                	$scope.showexception=response.data.showerrormessage
	                	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
						$scope.dataerror = [response.data.message[0]];		
		    	   }   			        
    		})
		}, function(error){
			  $scope.dialog.open();
			  $scope.dataerror = "Server not reached";
		});
		
//	$http({
//	       method: 'GET',
//	       url:"/vessel-details/",
//	   }).then(
//	       function(response) {
//	    	   $scope.vesselDetails = response.data;
//	       });
	
	$scope.getformvalidation = function () {	
		$scope.newDisabled = true;
		
		Connectivity.IsOk().then(function(response){
			 $http({
				    method: 'GET',
				    url: "/validate-qshe-feedback-form-no/",
				}).then(
					       function(response) {		
					    	   $scope.geterrormessages=response.data.message;	
				                $scope.geterrorstatus=response.data.errorstatus;
				                $scope.geterrorstatuscode=response.data.status;                
				                $scope.dataerror =response.data.message;  
					    	   if(response.data.status==0 && response.data.length!=0 ){
					    		   window.location.href = "#/QSHEFeedBackMain/"+response.data.data[0];
					    	   }else{
					    		   $scope.newDisabled = false;
									$scope.errordetails=response.data.exceptionDetail;
				                	$scope.showexception=response.data.showerrormessage
				                	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
									$scope.dataerror = [response.data.message[0]];		
					    	   }
					    	  
					});
		}, function(error){
			  $scope.dialog.open();
			  $scope.dataerror = "Server not reached";
		});
		
		
		  
		}	
	
});
