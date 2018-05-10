var app = angular.module('MdlCreationApp', []);
app.controller('MdlCreationController', function($scope, $http,toaster,Connectivity){
	$scope.errorFlag = false;
	$scope.shouldShow1 = true;
	$scope.shouldShow = false;
	$scope.Mdlcrn=[];
	$scope.geterrorstatuscode ="0";
	 var setSessionValues = function(){              
    }
	 setSessionValues();
	 
	// Form Retrival
	/*  $http({
		    url: "/retrieve_ModuleCreation/",		    
		    method: 'GET',		    
		   }).then(function successCallback(response){
			$scope.Mdlcrn = response.data;
			console.log("Mdl Creation =======> "+$scope.Mdlcrn);
      });*/
	 
	 $scope.$on('$viewContentLoaded', function() {
		 $scope.dialog.close();
			
		});
	 $scope.actions = [
         { text: 'Okay', action: function(){ $scope.geterrorstatuscode ="0"; }}
     ];
	// Form Retrival
	 
	 Connectivity.IsOk().then(function(response){
	  $http({
		    url: "/retrieve_ModuleCreation/",		    
		    method: 'GET',		    
		   }).then(function successCallback(response){
			  				$scope.geterrormessages=response.data.message;	
                $scope.geterrorstatus=response.data.errorstatus;
                $scope.geterrorstatuscode=response.data.status;                
                $scope.dataerror =response.data.message;
			   if(response.data.status==0 && response.data.length!=0 ){
			$scope.Mdlcrn = response.data.data;
			console.log("Mdl Creation =======> "+$scope.Mdlcrn);
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
	 
	 
	 
	 
});