app.controller('USDControllerMain',function($scope, $http,$rootScope,$window, $location, $filter, $timeout,$compile,Connectivity){
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
	 $scope.pageSize = $rootScope.defaultPageSize;
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
		
	 $scope.actions = [
         { text: 'Ok', action: function(){ $scope.geterrorstatuscode ="0"; }}
     ];
	 
	$scope.sort = function(predicate) {
	       $scope.predicate = predicate;
	     }	     
	     $scope.isSorted = function(predicate) {
	       return ($scope.predicate == predicate)
	     }
	
	$scope.userDetailList1=[];
	
	Connectivity.IsOk().then(function(response){
		$rootScope.showScreenOverlay = true;
		$http({
			method : 'GET',
			url : '/get-user-detail-list-main/'
		}).then(function successCallBack(response){
			console.log(response,'response <<<<<<<<<<$$$$$$$$$$$$$$$$$$$$$$ ')
			 	$scope.geterrormessages=response.data.message;	
	            $scope.geterrorstatus=response.data.errorstatus;
	            $scope.geterrorstatuscode=response.data.status;                
	            $scope.dataerror =response.data.message;
	            if(response.data.status==0 && response.data.length!=0 ){
				var temp = response.data.data;
		        temp = $filter('orderBy')(temp, 'empName', false)
		        $scope.userDetailList1 = temp;
			}else{
//				$scope.dialog.open();
				/*$scope.dataerror = response.data.message;*/
				$scope.geterrorstatuscode =response.data.status;
				$scope.errordetails=response.data.exceptionDetail;
               	$scope.showexception=response.data.showerrormessage
               	$scope.detailerrormessages=response.data.exceptionDetail.exStackTrace;	
    			$scope.dataerror = [response.data.message[0]];
			}
			
			$rootScope.showScreenOverlay = false;
		});
	}, function(error){
		  $scope.dialog.open();
		  $scope.dataerror = "Server not reached";
	});
	
  
	
});